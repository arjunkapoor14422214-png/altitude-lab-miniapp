import type { LanguageSource, RangeKey, SupportedLanguage } from './i18n';

export type CompanyId = 'luckypari';

export type AppStage =
  | 'onboarding'
  | 'company_selection'
  | 'verification'
  | 'connecting'
  | 'ready';

export type RoundStage = 'round_idle' | 'round_running' | 'round_finished';

export type RoundStatus = 'completed';

export type DistributionCurve = 'low' | 'balanced' | 'high' | 'surge';

export interface ProbabilityBand {
  min: number;
  max: number;
  weight: number;
  curve?: DistributionCurve;
}

export interface ProbabilityRange {
  id: Exclude<RangeKey, 'custom'>;
  min: number;
  max: number;
  probability: number;
  curve?: DistributionCurve;
  bands?: ProbabilityBand[];
}

export interface GameConfig {
  minMultiplier: number;
  maxMultiplier: number;
  probabilityRanges: ProbabilityRange[];
  distributionModel: {
    lookbackRounds: number;
    repeatedRangePenalty: number;
    lowStreakThreshold: number;
    lowStreakBoost: number;
    rareCooldownRounds: number;
    rareCooldownPenalty: number;
    highMomentumThreshold: number;
    highMomentumBoost: number;
  };
  animationSpeed: {
    minDurationMs: number;
    maxDurationMs: number;
    exponentialRatePerSecond: number;
  };
  verificationDelayMin: number;
  verificationDelayMax: number;
  historyLimit: number;
}

export interface PreparedRound {
  roundNumber: number;
  targetMultiplier: number;
  rangeKey: RangeKey;
  durationMs: number;
  createdAt: string;
}

export interface RoundRecord {
  roundNumber: number;
  targetMultiplier: number;
  time: string;
  rangeKey: RangeKey;
  status: RoundStatus;
  createdAt: string;
}

export interface StoredSession {
  onboardingSeen: boolean;
  selectedCompany: CompanyId | null;
  verifiedId: string;
  history: RoundRecord[];
  roundCounter: number;
  language: SupportedLanguage | null;
  languageSource: LanguageSource;
  hideLanguagePrompt: boolean;
}
