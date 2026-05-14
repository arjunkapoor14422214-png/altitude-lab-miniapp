const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const miniAppUrl = process.env.MINI_APP_URL?.trim();
const menuText = process.env.TELEGRAM_MENU_TEXT?.trim() || 'Open Signal';

if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN');
  process.exit(1);
}

if (!miniAppUrl) {
  console.error('Missing MINI_APP_URL');
  process.exit(1);
}

if (!/^https:\/\//i.test(miniAppUrl)) {
  console.error('MINI_APP_URL must start with https://');
  process.exit(1);
}

const apiBase = `https://api.telegram.org/bot${token}`;

async function callTelegram(method, body) {
  const response = await fetch(`${apiBase}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error on ${method}`);
  }

  return data.result;
}

async function main() {
  const me = await callTelegram('getMe', {});

  await callTelegram('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: menuText,
      web_app: {
        url: miniAppUrl,
      },
    },
  });

  await callTelegram('setMyCommands', {
    commands: [
      {
        command: 'start',
        description: 'Open the signal bot',
      },
      {
        command: 'app',
        description: 'Open the signal app',
      },
    ],
  });

  console.log(`Telegram bot verified: @${me.username}`);
  console.log(`Menu button updated to: ${miniAppUrl}`);
  console.log('Basic bot commands were updated successfully.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
