import { gameConfig } from '../config/gameConfig';
import type { RoundRecord, StoredSession } from '../types/game';
import type { LanguageSource, RangeKey, SupportedLanguage } from '../types/i18n';

const STORAGE_KEY = 'altitude-lab-session';

const defaultSession: StoredSession = {
  onboardingSeen: false,
  verifiedId: '',
  history: [],
  roundCounter: 0,
  language: null,
  languageSource: 'auto',
  hideLanguagePrompt: false,
};

function sanitizeLanguage(value: unknown): SupportedLanguage | null {
  if (
    value === 'en' ||
    value === 'ar' ||
    value === 'si' ||
    value === 'fr' ||
    value === 'ru'
  ) {
    return value;
  }

  return null;
}

function sanitizeLanguageSource(value: unknown): LanguageSource {
  return value === 'manual' ? 'manual' : 'auto';
}

function sanitizeVerificationId(value: unknown) {
  return typeof value === 'string' ? value.replace(/\D+/g, '') : '';
}

function migrateLegacyRangeKey(value: unknown): RangeKey {
  if (
    value === 'base' ||
    value === 'boosted' ||
    value === 'advanced' ||
    value === 'rare' ||
    value === 'custom'
  ) {
    return value;
  }

  if (typeof value !== 'string') {
    return 'custom';
  }

  const normalized = value.trim().toLowerCase();

  if (normalized.includes('base') || normalized.includes('баз')) {
    return 'base';
  }

  if (normalized.includes('boost') || normalized.includes('ускор')) {
    return 'boosted';
  }

  if (normalized.includes('advanced') || normalized.includes('продвин')) {
    return 'advanced';
  }

  if (normalized.includes('rare') || normalized.includes('редк')) {
    return 'rare';
  }

  return 'custom';
}

function sanitizeHistory(history: unknown): RoundRecord[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item): item is RoundRecord => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.roundNumber === 'number' &&
        typeof item.targetMultiplier === 'number' &&
        typeof item.time === 'string' &&
        typeof item.status === 'string' &&
        typeof item.createdAt === 'string'
      );
    })
    .map((item) => ({
      ...item,
      rangeKey: migrateLegacyRangeKey(
        (item as { rangeKey?: unknown; rangeLabel?: unknown }).rangeKey ??
          (item as { rangeLabel?: unknown }).rangeLabel,
      ),
    }))
    .slice(0, gameConfig.historyLimit);
}

export function loadSession(): StoredSession {
  if (typeof window === 'undefined') {
    return defaultSession;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return defaultSession;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredSession>;
    const history = sanitizeHistory(parsed.history);
    const latestRoundNumber = history[0]?.roundNumber ?? 0;

    return {
      onboardingSeen: Boolean(parsed.onboardingSeen),
      verifiedId: sanitizeVerificationId(parsed.verifiedId),
      history,
      roundCounter: Math.max(
        typeof parsed.roundCounter === 'number' ? parsed.roundCounter : 0,
        latestRoundNumber,
      ),
      language: sanitizeLanguage(parsed.language),
      languageSource: sanitizeLanguageSource(parsed.languageSource),
      hideLanguagePrompt: Boolean(parsed.hideLanguagePrompt),
    };
  } catch {
    return defaultSession;
  }
}

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
