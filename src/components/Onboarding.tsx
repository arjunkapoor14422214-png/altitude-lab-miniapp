import { Button } from './Button';
import { Modal } from './Modal';
import { appConfig } from '../config/appConfig';

interface OnboardingProps {
  onContinue: () => void;
}

const advantages = [
  'Тренировочный режим без ставок, пополнений и реальных денег.',
  'Целевой множитель виден заранее, чтобы легче изучать динамику раунда.',
  'История последних запусков сохраняется локально на устройстве.',
];

const instructions = [
  'Сначала активируйте тренировочный профиль по своему ID.',
  'После активации запускайте раунды и наблюдайте рост множителя.',
  'Сравнивайте результаты в истории и отслеживайте свои паттерны.',
];

const resourceLinks = [
  {
    title: 'Telegram Mini Apps',
    description: 'Официальная документация Telegram WebApp.',
    href: 'https://core.telegram.org/bots/webapps',
  },
  {
    title: 'Гайд по UX для мобильных интерфейсов',
    description: 'Подборка рекомендаций по удобству интерфейса.',
    href: 'https://web.dev/learn/design/',
  },
  {
    title: 'MDN: Web Animations',
    description: 'Справочник по анимациям и плавным UI-переходам.',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations',
  },
];

export function Onboarding({ onContinue }: OnboardingProps) {
  return (
    <Modal
      title="Altitude Lab"
      subtitle="Тренировочный симулятор для изучения механики раундов и поведения множителей."
    >
      <section className="stack">
        <div className="notice-card">
          <span className="eyebrow">Важно</span>
          <p>
            Это тренировочная среда. В приложении нет реальных ставок, приема
            денег и внешней игровой интеграции.
          </p>
        </div>

        <div className="content-block">
          <h3>Что внутри</h3>
          <ul className="feature-list">
            {advantages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content-block">
          <h3>Как начать</h3>
          <ul className="feature-list">
            {instructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content-block">
          <h3>Полезные ресурсы</h3>
          <div className="resource-list">
            {appConfig.telegramBotProfileUrl ? (
              <a
                className="resource-card"
                href={appConfig.telegramBotProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>Открыть бота в Telegram</span>
                <p>@{appConfig.botUsername}</p>
              </a>
            ) : null}

            {resourceLinks.map((resource) => (
              <a
                key={resource.title}
                className="resource-card"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{resource.title}</span>
                <p>{resource.description}</p>
              </a>
            ))}
          </div>
        </div>

        <Button fullWidth onClick={onContinue}>
          Продолжить
        </Button>
      </section>
    </Modal>
  );
}
