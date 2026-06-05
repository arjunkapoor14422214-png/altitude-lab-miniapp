import type { CompanyId } from '../types/game';

const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME?.trim() ?? '';
const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim() ?? '';

function normalizeBotUsername(value: string) {
  return value.replace(/^@+/, '');
}

const normalizedBotUsername = normalizeBotUsername(botUsername);

export const appConfig = {
  botUsername: normalizedBotUsername,
  publicAppUrl,
  companies: [
    {
      id: 'luckypari' as CompanyId,
      name: 'UltraPari',
      accent: 'UP',
      status: 'deposit',
    },
  ],
  promoRegistrationUrl: 'https://slim.link/BONUSNILE',
  promoRegistrationLabel: 'SLIM.LINK/BONUSNILE',
  promoApkUrl: 'https://slim.link/NILEAPK',
  promoApkLabel: 'SLIM.LINK/NILEAPK',
  promoCode: 'NILE',
  telegramBotProfileUrl: normalizedBotUsername
    ? `https://t.me/${normalizedBotUsername}`
    : '',
};
