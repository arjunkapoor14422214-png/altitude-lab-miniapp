import { gameConfig } from '../config/gameConfig';
import type { RoundRecord, StoredSession } from '../types/game';

const STORAGE_KEY = 'altitude-lab-session';

const defaultSession: StoredSession = {
  onboardingSeen: false,
  verifiedId: '',
  history: [],
  roundCounter: 0,
};

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
        typeof item.rangeLabel === 'string' &&
        typeof item.status === 'string' &&
        typeof item.createdAt === 'string'
      );
    })
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
      verifiedId: typeof parsed.verifiedId === 'string' ? parsed.verifiedId : '',
      history,
      roundCounter: Math.max(
        typeof parsed.roundCounter === 'number' ? parsed.roundCounter : 0,
        latestRoundNumber,
      ),
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

