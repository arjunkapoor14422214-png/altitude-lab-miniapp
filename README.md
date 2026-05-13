# Altitude Lab

Тренировочный Telegram Mini App для изучения crash-style механики без реальных ставок, без приема денег и без чужого брендинга.

## Что уже готово

- onboarding и ввод тренировочного ID;
- локальная имитация активации профиля;
- основной тренировочный экран с заранее известным target multiplier;
- анимация раунда и история результатов в `localStorage`;
- базовая Telegram WebApp интеграция;
- поддержка Telegram `MainButton`, `BackButton`, safe area и theme updates;
- подготовка под деплой как static site.

## Локальный запуск

```bash
npm install
npm run dev
```

## Переменные окружения

Скопируй `.env.example` в `.env.local` для локальной разработки.

- `VITE_TELEGRAM_BOT_USERNAME` — username бота без обязательного `@`.
- `VITE_PUBLIC_APP_URL` — будущий публичный HTTPS URL mini app.
- `TELEGRAM_BOT_TOKEN` — используется только серверным setup-скриптом, не клиентом.
- `MINI_APP_URL` — URL, который будет записан в Telegram menu button.

## Production build

```bash
npm run build
```

## Привязка к Telegram после деплоя

Когда появится публичный `HTTPS` URL:

```bash
npm run telegram:setup
```

Перед этим выставь:

```bash
TELEGRAM_BOT_TOKEN=...
MINI_APP_URL=https://your-public-miniapp-url.example.com
```

## Публикация в GitHub

После авторизации `gh auth login -h github.com` можно опубликовать проект так:

```bash
npm run github:publish
```

Опционально можно задать:

```bash
GITHUB_REPO_OWNER=arjunkapoor14422214-png
GITHUB_REPO_NAME=altitude-lab-miniapp
GITHUB_REPO_VISIBILITY=public
```

## Файлы, которые важнее всего

- `src/app/App.tsx` — основной state flow и Telegram-логика.
- `src/lib/telegram.ts` — интеграция с Telegram WebApp API.
- `src/config/gameConfig.ts` — вероятности, задержки и лимиты.
- `src/lib/multiplierGenerator.ts` — генерация множителей.
- `src/components/` — экраны и UI-блоки.
- `render.yaml` — базовая конфигурация под Render.

## Дальше для реального запуска

Смотри чеклист: [TELEGRAM_ACCESS_CHECKLIST.md](./TELEGRAM_ACCESS_CHECKLIST.md)
