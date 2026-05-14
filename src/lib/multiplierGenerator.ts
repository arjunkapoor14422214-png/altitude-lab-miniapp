import { gameConfig } from '../config/gameConfig';
import type {
  DistributionCurve,
  PreparedRound,
  ProbabilityBand,
  ProbabilityRange,
} from '../types/game';
import type { RangeKey } from '../types/i18n';

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const recentRangeIds: Array<ProbabilityRange['id']> = [];

function sampleCurve(curve: DistributionCurve, randomValue = Math.random()) {
  switch (curve) {
    case 'low':
      return Math.pow(randomValue, 1.7);
    case 'high':
      return 1 - Math.pow(1 - randomValue, 1.7);
    case 'surge':
      return 1 - Math.pow(1 - randomValue, 2.35);
    case 'balanced':
    default:
      return randomValue;
  }
}

function normalizeWeights<T extends { weight: number }>(items: T[]) {
  const totalWeight = items.reduce(
    (sum, item) => sum + Math.max(item.weight, 0),
    0,
  );

  return items.map((item) => ({
    ...item,
    normalizedWeight: totalWeight > 0 ? Math.max(item.weight, 0) / totalWeight : 0,
  }));
}

function getAdjustedRangeWeights() {
  const lookback = recentRangeIds.slice(-gameConfig.distributionModel.lookbackRounds);
  const consecutiveBaseCount = lookback.filter((rangeId) => rangeId === 'base').length;
  const recentRareCount = lookback
    .slice(-gameConfig.distributionModel.rareCooldownRounds)
    .filter((rangeId) => rangeId === 'rare').length;
  const recentHighCount = lookback.filter(
    (rangeId) => rangeId === 'advanced' || rangeId === 'rare',
  ).length;
  const lastRange = lookback.length > 0 ? lookback[lookback.length - 1] : null;

  return normalizeWeights(
    gameConfig.probabilityRanges.map((range) => {
      let weight = range.probability;

      if (lastRange === range.id) {
        weight *= gameConfig.distributionModel.repeatedRangePenalty;
      }

      if (
        consecutiveBaseCount >= gameConfig.distributionModel.lowStreakThreshold &&
        (range.id === 'boosted' || range.id === 'advanced')
      ) {
        weight += gameConfig.distributionModel.lowStreakBoost;
      }

      if (range.id === 'rare' && recentRareCount > 0) {
        weight *= gameConfig.distributionModel.rareCooldownPenalty;
      }

      if (
        recentHighCount >= gameConfig.distributionModel.highMomentumThreshold &&
        (range.id === 'advanced' || range.id === 'rare')
      ) {
        weight += gameConfig.distributionModel.highMomentumBoost;
      }

      return {
        range,
        weight,
      };
    }),
  );
}

function pickWeightedItem<T extends { normalizedWeight: number }>(
  items: T[],
  randomValue = Math.random(),
) {
  let cursor = 0;

  for (const item of items) {
    cursor += item.normalizedWeight;

    if (randomValue <= cursor) {
      return item;
    }
  }

  return items[items.length - 1];
}

function pickRange(randomValue = Math.random()): ProbabilityRange {
  const weightedRanges = getAdjustedRangeWeights();
  return pickWeightedItem(weightedRanges, randomValue).range;
}

function pickBand(range: ProbabilityRange, randomValue = Math.random()) {
  const bands = range.bands?.length
    ? range.bands
    : [
        {
          min: range.min,
          max: range.max,
          weight: 1,
          curve: range.curve ?? 'balanced',
        } satisfies ProbabilityBand,
      ];

  return pickWeightedItem(normalizeWeights(bands), randomValue);
}

export function formatMultiplier(value: number) {
  return `x${value.toFixed(2)}`;
}

export function getRangeKey(multiplier: number): RangeKey {
  const matchedRange = gameConfig.probabilityRanges.find(
    (range) => multiplier >= range.min && multiplier <= range.max,
  );

  return matchedRange?.id ?? 'custom';
}

export function calculateRoundDuration(targetMultiplier: number) {
  const { minDurationMs, maxDurationMs, durationFactor } =
    gameConfig.animationSpeed;
  const duration =
    minDurationMs + Math.sqrt(Math.max(targetMultiplier, 1)) * durationFactor;

  return Math.round(clamp(duration, minDurationMs, maxDurationMs));
}

export function generateTargetMultiplier() {
  const range = pickRange();
  const selectedBand = pickBand(range);
  const lowerBound = clamp(
    Math.max(selectedBand.min, gameConfig.minMultiplier),
    gameConfig.minMultiplier,
    gameConfig.maxMultiplier,
  );
  const upperBound = clamp(
    Math.min(selectedBand.max, gameConfig.maxMultiplier),
    gameConfig.minMultiplier,
    gameConfig.maxMultiplier,
  );

  const curve = selectedBand.curve ?? range.curve ?? 'balanced';
  const spread = sampleCurve(curve);
  const rawMultiplier = lowerBound + (upperBound - lowerBound) * spread;
  recentRangeIds.push(range.id);

  if (recentRangeIds.length > gameConfig.distributionModel.lookbackRounds) {
    recentRangeIds.splice(
      0,
      recentRangeIds.length - gameConfig.distributionModel.lookbackRounds,
    );
  }

  return {
    multiplier: roundToTwoDecimals(rawMultiplier),
    range,
  };
}

export function createPreparedRound(roundNumber: number): PreparedRound {
  const { multiplier, range } = generateTargetMultiplier();

  return {
    roundNumber,
    targetMultiplier: multiplier,
    rangeKey: range.id,
    durationMs: calculateRoundDuration(multiplier),
    createdAt: new Date().toISOString(),
  };
}
