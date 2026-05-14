import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.env.PORT || 3000);
const distDir = resolve(process.cwd(), 'dist');
const indexFile = join(distDir, 'index.html');
const publicDir = resolve(process.cwd(), 'public');
const welcomePosterFile = join(publicDir, 'bot-welcome-poster.jpg');
const promoRegistrationUrl = 'https://lckypr.com/G4DtDxQ';
const promoCode = 'NILE';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function getBaseUrl(request) {
  if (process.env.PUBLIC_BASE_URL?.trim()) {
    return process.env.PUBLIC_BASE_URL.trim().replace(/\/+$/, '');
  }

  const host = request.headers.host;
  const protocolHeader = request.headers['x-forwarded-proto'];
  const protocol = Array.isArray(protocolHeader)
    ? protocolHeader[0]
    : protocolHeader || 'https';

  return `${protocol}://${host}`;
}

function getMiniAppUrl(request) {
  return (
    process.env.MINI_APP_URL?.trim().replace(/\/+$/, '') || getBaseUrl(request)
  );
}

function getBotToken(requestUrl) {
  return (
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    requestUrl.searchParams.get('token')?.trim() ||
    ''
  );
}

async function callTelegram(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
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

async function callTelegramMultipart(token, method, formData) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error on ${method}`);
  }

  return data.result;
}

function buildStartCaption() {
  return [
    '<b>Welcome to Aviator Signal</b>',
    '',
    '1. Register through the link below.',
    promoRegistrationUrl,
    `2. Enter promo code <b>${promoCode}</b> during registration.`,
    '3. Make a deposit on the site.',
    '4. Open Signal and launch the round together with your live bet on the website.',
  ].join('\n');
}

async function sendStartMessage(token, chatId, request) {
  const miniAppUrl = getMiniAppUrl(request);
  const caption = buildStartCaption();
  const replyMarkup = {
    inline_keyboard: [
      [{ text: 'Register now', url: promoRegistrationUrl }],
      [{ text: 'Open Signal', web_app: { url: miniAppUrl } }],
    ],
  };

  try {
    const posterBytes = await readFile(welcomePosterFile);
    const formData = new FormData();
    const blob = new Blob([posterBytes], { type: 'image/jpeg' });

    formData.set('chat_id', String(chatId));
    formData.set('caption', caption);
    formData.set('parse_mode', 'HTML');
    formData.set('reply_markup', JSON.stringify(replyMarkup));
    formData.set('photo', blob, 'bot-welcome-poster.jpg');

    await callTelegramMultipart(token, 'sendPhoto', formData);
    return;
  } catch {
    await callTelegram(token, 'sendMessage', {
      chat_id: chatId,
      text: caption.replace(/<[^>]+>/g, ''),
      reply_markup: replyMarkup,
    });
  }
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function isSafeAssetPath(pathname) {
  const resolvedPath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  return !resolvedPath.includes('..');
}

async function serveStatic(request, response, requestUrl) {
  const pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;

  if (!isSafeAssetPath(pathname)) {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Invalid path');
    return;
  }

  const filePath = join(distDir, pathname);
  const extension = extname(filePath).toLowerCase();

  if (existsSync(filePath)) {
    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    createReadStream(filePath).pipe(response);
    return;
  }

  const indexHtml = await readFile(indexFile);
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(indexHtml);
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://localhost');

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === 'POST' && requestUrl.pathname === '/telegram/webhook') {
    try {
      const token = getBotToken(requestUrl);

      if (!token) {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Missing bot token');
        return;
      }

      const update = await readJsonBody(request);
      const message = update.message ?? update.edited_message;
      const text = message?.text?.trim() || '';
      const chatId = message?.chat?.id;

      if (chatId && (text === '/start' || text.startsWith('/start '))) {
        await sendStartMessage(token, chatId, request);
      }

      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ ok: true }));
      return;
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : 'Webhook error');
      return;
    }
  }

  if (request.method === 'GET' || request.method === 'HEAD') {
    try {
      await serveStatic(request, response, requestUrl);
    } catch {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Failed to serve app');
    }
    return;
  }

  response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Method not allowed');
});

server.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
