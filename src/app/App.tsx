import { useEffect, useEffectEvent, useReducer, useState } from 'react';
import { Onboarding } from '../components/Onboarding';
import { Verification } from '../components/Verification';
import { GameScreen } from '../components/GameScreen';
import { gameConfig } from '../config/gameConfig';
import {
  createPreparedRound,
  formatMultiplier,
} from '../lib/multiplierGenerator';
import { loadSession, saveSession } from '../lib/storage';
import {
  getTelegramDisplayName,
  initTelegramApp,
  setTelegramInteractionGuards,
  subscribeTelegramContext,
  syncTelegramBackButton,
  syncTelegramMainButton,
  triggerTelegramHaptic,
  type TelegramContext,
} from '../lib/telegram';
import type {
  AppStage,
  PreparedRound,
  RoundRecord,
  RoundStage,
  StoredSession,
} from '../types/game';

interface AppState {
  appStage: AppStage;
  roundStage: RoundStage;
  onboardingSeen: boolean;
  verificationId: string;
  pendingVerificationId: string | null;
  preparedRound: PreparedRound | null;
  currentMultiplier: number;
  flightProgress: number;
  history: RoundRecord[];
  roundCounter: number;
  activationMessage: string;
}

type AppAction =
  | { type: 'completeOnboarding' }
  | { type: 'revisitOnboarding' }
  | { type: 'openVerification' }
  | { type: 'startConnecting'; verificationId: string }
  | { type: 'finishConnecting'; message: string }
  | { type: 'prepareRound'; round: PreparedRound }
  | { type: 'startRound' }
  | {
      type: 'animateRound';
      currentMultiplier: number;
      flightProgress: number;
    }
  | { type: 'finishRound'; record: RoundRecord };

const initialSession = loadSession();

function createInitialState(session: StoredSession): AppState {
  return {
    appStage: session.onboardingSeen
      ? session.verifiedId
        ? 'ready'
        : 'verification'
      : 'onboarding',
    roundStage: 'round_idle',
    onboardingSeen: session.onboardingSeen,
    verificationId: session.verifiedId,
    pendingVerificationId: null,
    preparedRound: null,
    currentMultiplier: 1,
    flightProgress: 0,
    history: session.history,
    roundCounter: session.roundCounter,
    activationMessage: session.verifiedId
      ? 'Тренировочный режим уже активирован. Можно запускать следующий раунд.'
      : 'Подготовьте профиль для запуска тренировочных раундов.',
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'completeOnboarding':
      return {
        ...state,
        onboardingSeen: true,
        appStage: 'verification',
      };

    case 'revisitOnboarding':
      return {
        ...state,
        appStage: 'onboarding',
        pendingVerificationId: null,
      };

    case 'openVerification':
      return {
        ...state,
        appStage: 'verification',
        roundStage: 'round_idle',
        pendingVerificationId: null,
        preparedRound: null,
        currentMultiplier: 1,
        flightProgress: 0,
        activationMessage: 'Можно обновить тренировочный ID и заново активировать профиль.',
      };

    case 'startConnecting':
      return {
        ...state,
        appStage: 'connecting',
        pendingVerificationId: action.verificationId,
        activationMessage: 'Запускаем локальную активацию тренировочного режима...',
      };

    case 'finishConnecting':
      return {
        ...state,
        appStage: 'ready',
        roundStage: 'round_idle',
        verificationId: state.pendingVerificationId ?? state.verificationId,
        pendingVerificationId: null,
        activationMessage: action.message,
      };

    case 'prepareRound':
      return {
        ...state,
        roundStage: 'round_idle',
        preparedRound: action.round,
        currentMultiplier: 1,
        flightProgress: 0,
      };

    case 'startRound':
      if (!state.preparedRound) {
        return state;
      }

      return {
        ...state,
        roundStage: 'round_running',
        currentMultiplier: 1,
        flightProgress: 0,
        activationMessage: `Раунд #${state.preparedRound.roundNumber} выполняется. Цель ${formatMultiplier(state.preparedRound.targetMultiplier)}.`,
      };

    case 'animateRound':
      if (state.roundStage !== 'round_running') {
        return state;
      }

      return {
        ...state,
        currentMultiplier: action.currentMultiplier,
        flightProgress: action.flightProgress,
      };

    case 'finishRound':
      return {
        ...state,
        roundStage: 'round_finished',
        currentMultiplier: action.record.targetMultiplier,
        flightProgress: 1,
        history: [action.record, ...state.history].slice(0, gameConfig.historyLimit),
        roundCounter: action.record.roundNumber,
        activationMessage: `Раунд #${action.record.roundNumber} завершен на ${formatMultiplier(action.record.targetMultiplier)}.`,
      };

    default:
      return state;
  }
}

function formatRoundTime(date: Date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animateMultiplier(progress: number, targetMultiplier: number) {
  const value = Math.exp(Math.log(targetMultiplier) * progress);
  return Math.min(targetMultiplier, Math.round(value * 100) / 100);
}

const defaultTelegramContext: TelegramContext = {
  isTelegram: false,
  user: null,
  colorScheme: 'dark',
  platform: 'browser',
  version: 'dev',
};

export default function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    initialSession,
    createInitialState,
  );
  const [telegramContext, setTelegramContext] =
    useState<TelegramContext>(defaultTelegramContext);

  useEffect(() => {
    const context = initTelegramApp();
    setTelegramContext(context);
    document.documentElement.dataset.theme = context.colorScheme;

    return subscribeTelegramContext((nextContext) => {
      setTelegramContext(nextContext);
      document.documentElement.dataset.theme = nextContext.colorScheme;
    });
  }, []);

  useEffect(() => {
    saveSession({
      onboardingSeen: state.onboardingSeen,
      verifiedId: state.verificationId,
      history: state.history,
      roundCounter: state.roundCounter,
    });
  }, [
    state.history,
    state.onboardingSeen,
    state.roundCounter,
    state.verificationId,
  ]);

  useEffect(() => {
    if (state.appStage !== 'connecting' || !state.pendingVerificationId) {
      return;
    }

    const delay = randomInteger(
      gameConfig.verificationDelayMin,
      gameConfig.verificationDelayMax,
    );

    const timeoutId = window.setTimeout(() => {
      dispatch({
        type: 'finishConnecting',
        message: 'ID принят. Можно начинать тренировку.',
      });
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [state.appStage, state.pendingVerificationId]);

  useEffect(() => {
    if (state.appStage !== 'ready' || state.preparedRound) {
      return;
    }

    dispatch({
      type: 'prepareRound',
      round: createPreparedRound(state.roundCounter + 1),
    });
  }, [state.appStage, state.preparedRound, state.roundCounter]);

  useEffect(() => {
    if (state.roundStage !== 'round_running' || !state.preparedRound) {
      return;
    }

    let animationFrameId = 0;
    let startTime: number | null = null;

    const playFrame = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / state.preparedRound!.durationMs, 1);
      const nextValue = animateMultiplier(
        progress,
        state.preparedRound!.targetMultiplier,
      );

      dispatch({
        type: 'animateRound',
        currentMultiplier: nextValue,
        flightProgress: progress,
      });

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(playFrame);
        return;
      }

      const completedAt = new Date();

      dispatch({
        type: 'finishRound',
        record: {
          roundNumber: state.preparedRound!.roundNumber,
          targetMultiplier: state.preparedRound!.targetMultiplier,
          time: formatRoundTime(completedAt),
          rangeLabel: state.preparedRound!.rangeLabel,
          status: 'completed',
          createdAt: completedAt.toISOString(),
        },
      });
    };

    animationFrameId = window.requestAnimationFrame(playFrame);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [state.preparedRound, state.roundStage]);

  useEffect(() => {
    const shouldGuardClose =
      state.appStage === 'connecting' || state.roundStage === 'round_running';

    setTelegramInteractionGuards({
      confirmOnClose: shouldGuardClose,
      disableVerticalSwipes: shouldGuardClose,
    });
  }, [state.appStage, state.roundStage]);

  useEffect(() => {
    if (state.roundStage === 'round_finished') {
      triggerTelegramHaptic('success');
    }
  }, [state.roundStage]);

  const handleTelegramMainAction = useEffectEvent(() => {
    if (state.appStage === 'onboarding') {
      triggerTelegramHaptic('selection');
      dispatch({ type: 'completeOnboarding' });
      return;
    }

    if (state.appStage !== 'ready') {
      return;
    }

    if (state.roundStage === 'round_idle') {
      triggerTelegramHaptic('selection');
      dispatch({ type: 'startRound' });
      return;
    }

    if (state.roundStage === 'round_finished') {
      triggerTelegramHaptic('selection');
      dispatch({
        type: 'prepareRound',
        round: createPreparedRound(state.roundCounter + 1),
      });
    }
  });

  const handleTelegramBackAction = useEffectEvent(() => {
    if (state.roundStage === 'round_running') {
      return;
    }

    if (state.appStage === 'verification') {
      dispatch({ type: 'revisitOnboarding' });
      return;
    }

    if (state.appStage === 'connecting' || state.appStage === 'ready') {
      dispatch({ type: 'openVerification' });
    }
  });

  useEffect(() => {
    if (state.appStage === 'onboarding') {
      return syncTelegramMainButton({
        text: 'Продолжить',
        visible: true,
        enabled: true,
        onClick: handleTelegramMainAction,
      });
    }

    if (state.appStage === 'connecting') {
      return syncTelegramMainButton({
        text: 'Активация...',
        visible: true,
        enabled: false,
        loading: true,
      });
    }

    if (state.appStage === 'ready' && state.roundStage === 'round_idle') {
      return syncTelegramMainButton({
        text: 'Начать раунд',
        visible: true,
        enabled: true,
        onClick: handleTelegramMainAction,
      });
    }

    if (state.appStage === 'ready' && state.roundStage === 'round_running') {
      return syncTelegramMainButton({
        text: 'Раунд идет',
        visible: true,
        enabled: false,
        loading: true,
      });
    }

    if (state.appStage === 'ready' && state.roundStage === 'round_finished') {
      return syncTelegramMainButton({
        text: 'Следующий раунд',
        visible: true,
        enabled: true,
        onClick: handleTelegramMainAction,
      });
    }

    return syncTelegramMainButton(null);
  }, [state.appStage, state.roundStage, handleTelegramMainAction]);

  useEffect(() => {
    const isVisible =
      state.appStage === 'verification' ||
      state.appStage === 'connecting' ||
      (state.appStage === 'ready' && state.roundStage !== 'round_running');

    return syncTelegramBackButton(isVisible, handleTelegramBackAction);
  }, [state.appStage, state.roundStage, handleTelegramBackAction]);

  const handleContinueFromOnboarding = () => {
    triggerTelegramHaptic('selection');
    dispatch({ type: 'completeOnboarding' });
  };

  const handleVerificationSubmit = (verificationId: string) => {
    triggerTelegramHaptic('selection');
    dispatch({ type: 'startConnecting', verificationId });
  };

  const handleStartRound = () => {
    triggerTelegramHaptic('selection');
    dispatch({ type: 'startRound' });
  };

  const handleNextRound = () => {
    triggerTelegramHaptic('selection');
    dispatch({
      type: 'prepareRound',
      round: createPreparedRound(state.roundCounter + 1),
    });
  };

  const handleResetProfile = () => {
    triggerTelegramHaptic('warning');
    dispatch({ type: 'openVerification' });
  };

  const pilotName = getTelegramDisplayName(telegramContext.user);

  return (
    <main className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      {state.appStage === 'onboarding' ? (
        <Onboarding onContinue={handleContinueFromOnboarding} />
      ) : null}

      {state.appStage === 'verification' ? (
        <Verification
          mode="form"
          defaultValue={state.verificationId}
          onSubmit={handleVerificationSubmit}
        />
      ) : null}

      {state.appStage === 'connecting' ? (
        <Verification
          mode="connecting"
          pendingId={state.pendingVerificationId ?? ''}
          onSubmit={handleVerificationSubmit}
        />
      ) : null}

      {state.appStage === 'ready' && state.preparedRound ? (
        <GameScreen
          preparedRound={state.preparedRound}
          currentMultiplier={state.currentMultiplier}
          roundStage={state.roundStage}
          flightProgress={state.flightProgress}
          history={state.history}
          activationMessage={state.activationMessage}
          verificationId={state.verificationId}
          pilotName={pilotName}
          telegramUsername={telegramContext.user?.username}
          isTelegram={telegramContext.isTelegram}
          onStartRound={handleStartRound}
          onNextRound={handleNextRound}
          onResetProfile={handleResetProfile}
        />
      ) : null}
    </main>
  );
}
