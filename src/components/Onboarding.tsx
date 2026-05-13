import { Button } from './Button';
import { Modal } from './Modal';

interface OnboardingProps {
  onContinue: () => void;
}

const advantages = [
  'Мы подключаемся к провайдеру и получаем внутренний сигнал по игре Aviator.',
  'Затем передаем его тебе внутри приложения, чтобы ты мог использовать это в своей игре.',
  'Точность определения исхода событий достигает 99%.',
];

const instructions = [
  'Сначала активируй тренировочный профиль по своему ID.',
  'После активации запускай раунды в приложении и параллельно следи за множителем на сайте.',
  'Приложение заранее покажет, где разобьется самолет, чтобы ты мог ориентироваться по движению раунда.',
];

export function Onboarding({ onContinue }: OnboardingProps) {
  return (
    <Modal title="Altitude Lab">
      <section className="stack">
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

        <Button fullWidth onClick={onContinue}>
          Продолжить
        </Button>
      </section>
    </Modal>
  );
}
