import type { GameConfig } from '../types/game';

export const gameConfig: GameConfig = {
  minMultiplier: 1,
  maxMultiplier: 100,
  probabilityRanges: [
    { min: 1, max: 2, probability: 0.9, label: 'Базовый диапазон' },
    { min: 2, max: 5, probability: 0.07, label: 'Ускоренный диапазон' },
    { min: 5, max: 20, probability: 0.02, label: 'Продвинутый диапазон' },
    { min: 20, max: 100, probability: 0.01, label: 'Редкий высокий диапазон' },
  ],
  animationSpeed: {
    minDurationMs: 3200,
    maxDurationMs: 7800,
    durationFactor: 420,
  },
  verificationDelayMin: 9000,
  verificationDelayMax: 11000,
  historyLimit: 10,
};
