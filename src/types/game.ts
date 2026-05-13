export type AppStage = 'onboarding' | 'verification' | 'connecting' | 'ready';

export type RoundStage = 'round_idle' | 'round_running' | 'round_finished';

export type RoundStatus = 'completed';

export interface ProbabilityRange {
  min: number;
  max: number;
  probability: number;
  label: string;
}

export interface GameConfig {
  minMultiplier: number;
  maxMultiplier: number;
  probabilityRanges: ProbabilityRange[];
  animationSpeed: {
    minDurationMs: number;
    maxDurationMs: number;
    durationFactor: number;
  };
  verificationDelayMin: number;
  verificationDelayMax: number;
  historyLimit: number;
}

export interface PreparedRound {
  roundNumber: number;
  targetMultiplier: number;
  rangeLabel: string;
  durationMs: number;
  createdAt: string;
}

export interface RoundRecord {
  roundNumber: number;
  targetMultiplier: number;
  time: string;
  rangeLabel: string;
  status: RoundStatus;
  createdAt: string;
}

export interface StoredSession {
  onboardingSeen: boolean;
  verifiedId: string;
  history: RoundRecord[];
  roundCounter: number;
}

