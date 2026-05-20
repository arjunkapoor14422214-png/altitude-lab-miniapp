import type { GameConfig } from '../types/game';

export const gameConfig: GameConfig = {
  minMultiplier: 1,
  maxMultiplier: 100,
  probabilityRanges: [
    {
      id: 'base',
      min: 1,
      max: 2,
      probability: 0.68,
      curve: 'low',
      bands: [
        { min: 1, max: 1.14, weight: 0.2, curve: 'low' },
        { min: 1.14, max: 1.38, weight: 0.34, curve: 'balanced' },
        { min: 1.38, max: 2, weight: 0.46, curve: 'high' },
      ],
    },
    {
      id: 'boosted',
      min: 2,
      max: 5,
      probability: 0.2,
      curve: 'balanced',
      bands: [
        { min: 2, max: 2.4, weight: 0.28, curve: 'low' },
        { min: 2.4, max: 3.3, weight: 0.4, curve: 'balanced' },
        { min: 3.3, max: 5, weight: 0.32, curve: 'high' },
      ],
    },
    {
      id: 'advanced',
      min: 5,
      max: 20,
      probability: 0.09,
      curve: 'balanced',
      bands: [
        { min: 5, max: 7.5, weight: 0.34, curve: 'low' },
        { min: 7.5, max: 12, weight: 0.38, curve: 'balanced' },
        { min: 12, max: 20, weight: 0.28, curve: 'high' },
      ],
    },
    {
      id: 'rare',
      min: 20,
      max: 100,
      probability: 0.03,
      curve: 'high',
      bands: [
        { min: 20, max: 32, weight: 0.4, curve: 'low' },
        { min: 32, max: 58, weight: 0.36, curve: 'balanced' },
        { min: 58, max: 100, weight: 0.24, curve: 'surge' },
      ],
    },
  ],
  distributionModel: {
    lookbackRounds: 6,
    repeatedRangePenalty: 0.8,
    lowStreakThreshold: 3,
    lowStreakBoost: 0.22,
    rareCooldownRounds: 2,
    rareCooldownPenalty: 0.45,
    highMomentumThreshold: 2,
    highMomentumBoost: 0.14,
  },
  animationSpeed: {
    minDurationMs: 5000,
    maxDurationMs: 30000,
    exponentialRatePerSecond: 0.0768,
  },
  verificationDelayMin: 9000,
  verificationDelayMax: 11000,
  historyLimit: 10,
};
