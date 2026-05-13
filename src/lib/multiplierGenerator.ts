import { gameConfig } from '../config/gameConfig';
import type { PreparedRound, ProbabilityRange } from '../types/game';

const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function pickRange(randomValue = Math.random()): ProbabilityRange {
  const totalProbability = gameConfig.probabilityRanges.reduce(
    (sum, range) => sum + range.probability,
    0,
  );

  let cursor = 0;

  for (const range of gameConfig.probabilityRanges) {
    cursor += range.probability / totalProbability;

    if (randomValue <= cursor) {
      return range;
    }
  }

  return gameConfig.probabilityRanges[gameConfig.probabilityRanges.length - 1];
}

export function formatMultiplier(value: number) {
  return `x${value.toFixed(2)}`;
}

export function getRangeLabel(multiplier: number) {
  const matchedRange = gameConfig.probabilityRanges.find(
    (range) => multiplier >= range.min && multiplier <= range.max,
  );

  return matchedRange?.label ?? 'Кастомный диапазон';
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
  const lowerBound = clamp(
    Math.max(range.min, gameConfig.minMultiplier),
    gameConfig.minMultiplier,
    gameConfig.maxMultiplier,
  );
  const upperBound = clamp(
    Math.min(range.max, gameConfig.maxMultiplier),
    gameConfig.minMultiplier,
    gameConfig.maxMultiplier,
  );

  // Bias toward the lower part of a range so high multipliers stay rare but possible.
  const spread = Math.pow(Math.random(), 1.15);
  const rawMultiplier = lowerBound + (upperBound - lowerBound) * spread;

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
    rangeLabel: range.label,
    durationMs: calculateRoundDuration(multiplier),
    createdAt: new Date().toISOString(),
  };
}

