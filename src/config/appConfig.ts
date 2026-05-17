const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME?.trim() ?? '';
const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim() ?? '';

function normalizeBotUsername(value: string) {
  return value.replace(/^@+/, '');
}

const normalizedBotUsername = normalizeBotUsername(botUsername);

export const appConfig = {
  botUsername: normalizedBotUsername,
  publicAppUrl,
  promoRegistrationUrl: 'https://lckypr.com/PASINDUBONUS',
  promoRegistrationLabel: 'lckypr.com/PASINDUBONUS',
  promoCode: 'PASINDU',
  telegramBotProfileUrl: normalizedBotUsername
    ? `https://t.me/${normalizedBotUsername}`
    : '',
};
