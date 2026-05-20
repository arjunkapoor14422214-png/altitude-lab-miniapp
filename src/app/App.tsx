import { useEffect, useEffectEvent, useReducer, useState } from 'react';
import { CompanySelection } from '../components/CompanySelection';
import { GameScreen } from '../components/GameScreen';
import { LanguagePrompt } from '../components/LanguagePrompt';
import { Onboarding } from '../components/Onboarding';
import { Verification } from '../components/Verification';
import { gameConfig } from '../config/gameConfig';
import { getTranslations } from '../lib/i18n';
import { trackCompleteRegistration } from '../lib/meta';
import { createPreparedRound } from '../lib/multiplierGenerator';
import { loadSession, saveSession } from '../lib/storage';
import {
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
  CompanyId,
  PreparedRound,
  RoundRecord,
  RoundStage,
  StoredSession,
} from '../types/game';
import type { LanguageSource, SupportedLanguage } from '../types/i18n';

interface AppState {
  appStage: AppStage;
  roundStage: RoundStage;
  onboardingSeen: boolean;
  language: SupportedLanguage;
  languageSource: LanguageSource;
  selectedCompany: CompanyId | null;
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
  | { type: 'setLanguage'; language: SupportedLanguage; source: LanguageSource }
  | { type: 'revisitOnboarding' }
  | { type: 'selectCompany'; companyId: CompanyId }
  | { type: 'openCompanySelection' }
  | { type: 'openVerification' }
  | { type: 'startConnecting'; verificationId: string }
  | { type: 'finishConnecting'; message: string }
  | { type: 'startRound'; round: PreparedRound }
  | { type: 'animateRound'; currentMultiplier: number; flightProgress: number }
  | { type: 'finishRound'; record: RoundRecord }
  | { type: 'resetRound' };

const initialSession = loadSession();

function getPersistentMessage(state: AppState, language: SupportedLanguage) {
  const copy = getTranslations(language).app;

  if (state.appStage === 'connecting') {
    return copy.startConnecting;
  }

  if (state.appStage === 'ready' && state.roundStage === 'round_idle') {
    return state.verificationId ? copy.readyActivated : copy.prepareProfile;
  }

  return state.activationMessage;
}

function createInitialState(session: StoredSession): AppState {
  const language = session.language ?? 'en';
  const copy = getTranslations(language).app;
  const verificationId = session.verifiedId;
  const selectedCompany = session.selectedCompany;

  return {
    appStage: session.onboardingSeen
      ? verificationId
        ? 'ready'
        : selectedCompany
          ? 'verification'
          : 'company_selection'
      : 'onboarding',
    roundStage: 'round_idle',
    onboardingSeen: session.onboardingSeen,
    language,
    languageSource: session.language ? session.languageSource : 'manual',
    selectedCompany,
    verificationId,
    pendingVerificationId: null,
    preparedRound: null,
    currentMultiplier: 1,
    flightProgress: 0,
    history: session.history,
    roundCounter: session.roundCounter,
    activationMessage: verificationId ? copy.readyActivated : copy.prepareProfile,
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  const copy = getTranslations(state.language).app;

  switch (action.type) {
    case 'completeOnboarding':
      return {
        ...state,
        onboardingSeen: true,
        appStage: 'company_selection',
      };

    case 'setLanguage': {
      const nextState = {
        ...state,
        language: action.language,
        languageSource: action.source,
      };

      return {
        ...nextState,
        activationMessage: getPersistentMessage(nextState, action.language),
      };
    }

    case 'revisitOnboarding':
      return {
        ...state,
        appStage: 'onboarding',
        pendingVerificationId: null,
      };

    case 'selectCompany':
      return {
        ...state,
        selectedCompany: action.companyId,
        appStage: 'verification',
        activationMessage: copy.prepareProfile,
      };

    case 'openCompanySelection':
      return {
        ...state,
        appStage: 'company_selection',
        pendingVerificationId: null,
        activationMessage: copy.prepareProfile,
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
        activationMessage: copy.updateProfile,
      };

    case 'startConnecting':
      return {
        ...state,
        appStage: 'connecting',
        pendingVerificationId: action.verificationId,
        activationMessage: copy.startConnecting,
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

    case 'startRound':
      return {
        ...state,
        preparedRound: action.round,
        roundStage: 'round_running',
        currentMultiplier: action.round.targetMultiplier,
        flightProgress: 0,
        activationMessage: copy.roundStarted(action.round.roundNumber),
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
        activationMessage: copy.roundFinished(action.record.roundNumber),
      };

    case 'resetRound':
      return {
        ...state,
        roundStage: 'round_idle',
        preparedRound: null,
        currentMultiplier: 1,
        flightProgress: 0,
        activationMessage: copy.idlePrompt,
      };

    default:
      return state;
  }
}

function formatRoundTime(date: Date, locale: string) {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const defaultTelegramContext: TelegramContext = {
  isTelegram: false,
  user: null,
  colorScheme: 'dark',
  platform: 'browser',
  version: 'dev',
  locale: null,
};

export default function App() {
  const [state, dispatch] = useReducer(
    appReducer,
    initialSession,
    createInitialState,
  );
  const [telegramContext, setTelegramContext] =
    useState<TelegramContext>(defaultTelegramContext);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(
    !initialSession.hideLanguagePrompt,
  );
  const [hideLanguagePrompt, setHideLanguagePrompt] = useState(
    initialSession.hideLanguagePrompt,
  );
  const [languagePromptOptOut, setLanguagePromptOptOut] = useState(
    initialSession.hideLanguagePrompt,
  );
  const [promptLanguage, setPromptLanguage] = useState<SupportedLanguage>('en');
  const copy = getTranslations(state.language);

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
    document.documentElement.lang = copy.locale;
    document.documentElement.dir = copy.direction;
  }, [copy.direction, copy.locale]);

  useEffect(() => {
    saveSession({
      onboardingSeen: state.onboardingSeen,
      selectedCompany: state.selectedCompany,
      verifiedId: state.verificationId,
      history: state.history,
      roundCounter: state.roundCounter,
      language: state.language,
      languageSource: state.languageSource,
      hideLanguagePrompt,
    });
  }, [
    hideLanguagePrompt,
    state.history,
    state.language,
    state.languageSource,
    state.onboardingSeen,
    state.roundCounter,
    state.selectedCompany,
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
        message: copy.app.connectSuccess,
      });
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [copy.app.connectSuccess, state.appStage, state.pendingVerificationId]);

  useEffect(() => {
    if (state.roundStage !== 'round_running' || !state.preparedRound) {
      return;
    }

    const round = state.preparedRound;
    let animationFrameId = 0;
    let startTime: number | null = null;

    const playFrame = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / round.durationMs, 1);

      dispatch({
        type: 'animateRound',
        currentMultiplier: round.targetMultiplier,
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
          roundNumber: round.roundNumber,
          targetMultiplier: round.targetMultiplier,
          time: formatRoundTime(completedAt, copy.locale),
          rangeKey: round.rangeKey,
          status: 'completed',
          createdAt: completedAt.toISOString(),
        },
      });
    };

    animationFrameId = window.requestAnimationFrame(playFrame);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [copy.locale, state.preparedRound, state.roundStage]);

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

  useEffect(() => {
    if (state.appStage !== 'ready' || state.roundStage !== 'round_finished') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'resetRound' });
    }, 1100);

    return () => window.clearTimeout(timeoutId);
  }, [state.appStage, state.roundStage]);

  const handleTelegramMainAction = useEffectEvent(() => {
    if (state.appStage === 'onboarding') {
      triggerTelegramHaptic('selection');
      dispatch({ type: 'completeOnboarding' });
      return;
    }

    if (state.appStage !== 'ready' || state.roundStage !== 'round_idle') {
      return;
    }

    triggerTelegramHaptic('selection');
    dispatch({
      type: 'startRound',
      round: createPreparedRound(state.roundCounter + 1),
    });
  });

  const handleTelegramBackAction = useEffectEvent(() => {
    if (state.roundStage === 'round_running') {
      return;
    }

    if (state.appStage === 'verification') {
      dispatch({ type: 'openCompanySelection' });
      return;
    }

    if (state.appStage === 'company_selection') {
      dispatch({ type: 'revisitOnboarding' });
      return;
    }

    if (state.appStage === 'connecting' || state.appStage === 'ready') {
      dispatch({ type: 'openVerification' });
    }
  });

  useEffect(() => {
    if (showLanguagePrompt) {
      return syncTelegramMainButton(null);
    }

    if (state.appStage === 'onboarding') {
      return syncTelegramMainButton({
        text: copy.app.telegramContinue,
        visible: true,
        enabled: true,
        onClick: handleTelegramMainAction,
      });
    }

    if (state.appStage === 'connecting') {
      return syncTelegramMainButton({
        text: copy.app.telegramActivating,
        visible: true,
        enabled: false,
        loading: true,
      });
    }

    return syncTelegramMainButton(null);
  }, [
    copy.app.telegramActivating,
    copy.app.telegramContinue,
    handleTelegramMainAction,
    showLanguagePrompt,
    state.appStage,
  ]);

  useEffect(() => {
    if (showLanguagePrompt) {
      return syncTelegramBackButton(false);
    }

    const isVisible =
      state.appStage === 'company_selection' ||
      state.appStage === 'verification' ||
      state.appStage === 'connecting' ||
      (state.appStage === 'ready' && state.roundStage !== 'round_running');

    return syncTelegramBackButton(isVisible, handleTelegramBackAction);
  }, [
    handleTelegramBackAction,
    showLanguagePrompt,
    state.appStage,
    state.roundStage,
  ]);

  const handleContinueFromOnboarding = () => {
    triggerTelegramHaptic('selection');
    dispatch({ type: 'completeOnboarding' });
  };

  const handleSelectCompany = (companyId: CompanyId) => {
    triggerTelegramHaptic('selection');
    dispatch({ type: 'selectCompany', companyId });
  };

  const handleContinueFromCompanySelection = () => {
    if (!state.selectedCompany) {
      return;
    }

    triggerTelegramHaptic('selection');
    dispatch({ type: 'openVerification' });
  };

  const handleVerificationSubmit = (verificationId: string) => {
    triggerTelegramHaptic('selection');
    trackCompleteRegistration({
      eventId: crypto.randomUUID(),
      verificationId,
      language: state.language,
      telegramUserId: telegramContext.user?.id ?? null,
    });
    dispatch({ type: 'startConnecting', verificationId });
  };

  const handlePromptLanguageChange = (language: SupportedLanguage) => {
    if (language === promptLanguage) {
      return;
    }

    triggerTelegramHaptic('selection');
    setPromptLanguage(language);
  };

  const handleStartRound = () => {
    if (state.roundStage !== 'round_idle') {
      return;
    }

    triggerTelegramHaptic('selection');
    dispatch({
      type: 'startRound',
      round: createPreparedRound(state.roundCounter + 1),
    });
  };

  const handleCloseLanguagePrompt = () => {
    triggerTelegramHaptic('selection');
    dispatch({
      type: 'setLanguage',
      language: promptLanguage,
      source: 'manual',
    });
    setHideLanguagePrompt(languagePromptOptOut);
    setShowLanguagePrompt(false);
  };

  return (
    <main className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      {showLanguagePrompt ? (
        <LanguagePrompt
          selectedLanguage={promptLanguage}
          dontShowAgain={languagePromptOptOut}
          onSelectLanguage={handlePromptLanguageChange}
          onToggleDontShowAgain={setLanguagePromptOptOut}
          onContinue={handleCloseLanguagePrompt}
        />
      ) : null}

      {state.appStage === 'onboarding' ? (
        <Onboarding
          copy={copy.onboarding}
          onContinue={handleContinueFromOnboarding}
        />
      ) : null}

      {state.appStage === 'company_selection' ? (
        <CompanySelection
          copy={copy.companySelection}
          selectedCompany={state.selectedCompany}
          onSelect={handleSelectCompany}
          onContinue={handleContinueFromCompanySelection}
        />
      ) : null}

      {state.appStage === 'verification' ? (
        <Verification
          mode="form"
          copy={copy.verification}
          defaultValue={state.verificationId}
          onSubmit={handleVerificationSubmit}
        />
      ) : null}

      {state.appStage === 'connecting' ? (
        <Verification
          mode="connecting"
          copy={copy.verification}
          pendingId={state.pendingVerificationId ?? ''}
          onSubmit={handleVerificationSubmit}
        />
      ) : null}

      {state.appStage === 'ready' ? (
        <GameScreen
          copy={copy.game}
          targetMultiplier={state.preparedRound?.targetMultiplier ?? null}
          roundStage={state.roundStage}
          flightProgress={state.flightProgress}
          onStartRound={handleStartRound}
        />
      ) : null}
    </main>
  );
}
