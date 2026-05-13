export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramThemeParams {
  bg_color?: string;
  bottom_bar_bg_color?: string;
  secondary_bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
}

interface TelegramInset {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface TelegramButtonParams {
  text?: string;
  color?: string;
  text_color?: string;
  has_shine_effect?: boolean;
}

interface TelegramBottomButton {
  isVisible?: boolean;
  isActive?: boolean;
  onClick?: (callback: () => void) => TelegramBottomButton;
  offClick?: (callback: () => void) => TelegramBottomButton;
  show: () => TelegramBottomButton;
  hide: () => TelegramBottomButton;
  enable: () => TelegramBottomButton;
  disable: () => TelegramBottomButton;
  showProgress?: (leaveActive?: boolean) => TelegramBottomButton;
  hideProgress?: () => TelegramBottomButton;
  setParams?: (params: TelegramButtonParams) => TelegramBottomButton;
}

interface TelegramBackButton {
  onClick?: (callback: () => void) => TelegramBackButton;
  offClick?: (callback: () => void) => TelegramBackButton;
  show: () => TelegramBackButton;
  hide: () => TelegramBackButton;
}

interface TelegramHapticFeedback {
  impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred?: (
    type: 'error' | 'success' | 'warning',
  ) => void;
  selectionChanged?: () => void;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  colorScheme?: 'light' | 'dark';
  platform?: string;
  version?: string;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
  close?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
  disableVerticalSwipes?: () => void;
  enableVerticalSwipes?: () => void;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  themeParams?: TelegramThemeParams;
  safeAreaInset?: TelegramInset;
  contentSafeAreaInset?: TelegramInset;
  MainButton?: TelegramBottomButton;
  BackButton?: TelegramBackButton;
  HapticFeedback?: TelegramHapticFeedback;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export interface TelegramContext {
  isTelegram: boolean;
  user: TelegramWebAppUser | null;
  colorScheme: 'light' | 'dark';
  platform: string;
  version: string;
}

export interface TelegramMainButtonState {
  text: string;
  visible: boolean;
  enabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

type TelegramHapticKind = 'selection' | 'success' | 'warning';

function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

function applyInsetVariables(prefix: string, inset?: TelegramInset) {
  if (typeof document === 'undefined' || !inset) {
    return;
  }

  const root = document.documentElement;

  root.style.setProperty(`${prefix}-top`, `${inset.top ?? 0}px`);
  root.style.setProperty(`${prefix}-bottom`, `${inset.bottom ?? 0}px`);
  root.style.setProperty(`${prefix}-left`, `${inset.left ?? 0}px`);
  root.style.setProperty(`${prefix}-right`, `${inset.right ?? 0}px`);
}

function applyTelegramTheme(themeParams?: TelegramThemeParams) {
  if (typeof document === 'undefined' || !themeParams) {
    return;
  }

  const root = document.documentElement;

  if (themeParams.bg_color) {
    root.style.setProperty('--tg-bg', themeParams.bg_color);
  }

  if (themeParams.secondary_bg_color) {
    root.style.setProperty('--tg-surface', themeParams.secondary_bg_color);
  }

  if (themeParams.text_color) {
    root.style.setProperty('--tg-text', themeParams.text_color);
  }

  if (themeParams.hint_color) {
    root.style.setProperty('--tg-muted', themeParams.hint_color);
  }

  if (themeParams.button_color) {
    root.style.setProperty('--tg-accent', themeParams.button_color);
  }

  if (themeParams.button_text_color) {
    root.style.setProperty('--tg-accent-contrast', themeParams.button_text_color);
  }

  if (themeParams.bottom_bar_bg_color) {
    root.style.setProperty('--tg-bottom-bar', themeParams.bottom_bar_bg_color);
  }
}

function applyTelegramChrome(webApp?: TelegramWebApp) {
  if (!webApp) {
    return;
  }

  applyTelegramTheme(webApp.themeParams);
  applyInsetVariables('--tg-safe-area-inset', webApp.safeAreaInset);
  applyInsetVariables(
    '--tg-content-safe-area-inset',
    webApp.contentSafeAreaInset,
  );

  webApp.setBackgroundColor?.('#0b0907');
  webApp.setHeaderColor?.('#0b0907');
  webApp.setBottomBarColor?.('#191713');
}

function readTelegramContext(webApp?: TelegramWebApp): TelegramContext {
  if (!webApp) {
    return {
      isTelegram: false,
      user: null,
      colorScheme: 'dark',
      platform: 'browser',
      version: 'dev',
    };
  }

  return {
    isTelegram: true,
    user: webApp.initDataUnsafe?.user ?? null,
    colorScheme: webApp.colorScheme === 'light' ? 'light' : 'dark',
    platform: webApp.platform ?? 'telegram',
    version: webApp.version ?? 'unknown',
  };
}

export function initTelegramApp(): TelegramContext {
  if (typeof window === 'undefined') {
    return {
      isTelegram: false,
      user: null,
      colorScheme: 'dark',
      platform: 'browser',
      version: 'unknown',
    };
  }

  const webApp = getTelegramWebApp();

  if (!webApp) {
    return readTelegramContext();
  }

  try {
    webApp.ready();
    webApp.expand();
    applyTelegramChrome(webApp);
  } catch {
    // Keep the app functional even if Telegram injects a partial API.
  }

  return readTelegramContext(webApp);
}

export function subscribeTelegramContext(
  onChange: (context: TelegramContext) => void,
) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const webApp = getTelegramWebApp();

  if (!webApp?.onEvent || !webApp.offEvent) {
    return () => undefined;
  }

  const handler = () => {
    applyTelegramChrome(webApp);
    onChange(readTelegramContext(webApp));
  };

  webApp.onEvent('themeChanged', handler);
  webApp.onEvent('safeAreaChanged', handler);
  webApp.onEvent('contentSafeAreaChanged', handler);

  return () => {
    webApp.offEvent?.('themeChanged', handler);
    webApp.offEvent?.('safeAreaChanged', handler);
    webApp.offEvent?.('contentSafeAreaChanged', handler);
  };
}

export function syncTelegramMainButton(
  state: TelegramMainButtonState | null,
) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const webApp = getTelegramWebApp();
  const button = webApp?.MainButton;

  if (!button) {
    return () => undefined;
  }

  button.hideProgress?.();

  if (!state?.visible) {
    button.hide();
    return () => undefined;
  }

  button.setParams?.({
    text: state.text,
    has_shine_effect: state.enabled !== false && !state.loading,
  });

  if (state.enabled === false) {
    button.disable();
  } else {
    button.enable();
  }

  if (state.loading) {
    button.showProgress?.(state.enabled !== false);
  } else {
    button.hideProgress?.();
  }

  if (state.onClick) {
    button.onClick?.(state.onClick);
  }

  button.show();

  return () => {
    if (state.onClick) {
      button.offClick?.(state.onClick);
    }
  };
}

export function syncTelegramBackButton(
  visible: boolean,
  onClick?: () => void,
) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const button = getTelegramWebApp()?.BackButton;

  if (!button) {
    return () => undefined;
  }

  if (onClick) {
    button.onClick?.(onClick);
  }

  if (visible) {
    button.show();
  } else {
    button.hide();
  }

  return () => {
    if (onClick) {
      button.offClick?.(onClick);
    }
  };
}

export function setTelegramInteractionGuards(options: {
  confirmOnClose: boolean;
  disableVerticalSwipes: boolean;
}) {
  if (typeof window === 'undefined') {
    return;
  }

  const webApp = getTelegramWebApp();

  if (!webApp) {
    return;
  }

  if (options.confirmOnClose) {
    webApp.enableClosingConfirmation?.();
  } else {
    webApp.disableClosingConfirmation?.();
  }

  if (options.disableVerticalSwipes) {
    webApp.disableVerticalSwipes?.();
  } else {
    webApp.enableVerticalSwipes?.();
  }
}

export function triggerTelegramHaptic(kind: TelegramHapticKind) {
  if (typeof window === 'undefined') {
    return;
  }

  const haptic = getTelegramWebApp()?.HapticFeedback;

  if (!haptic) {
    return;
  }

  if (kind === 'selection') {
    haptic.selectionChanged?.();
    return;
  }

  haptic.notificationOccurred?.(kind);
}

export function getTelegramDisplayName(user: TelegramWebAppUser | null) {
  if (!user) {
    return 'Пилот';
  }

  return [user.first_name, user.last_name].filter(Boolean).join(' ');
}
