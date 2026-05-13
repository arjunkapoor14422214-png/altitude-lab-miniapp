import { Button } from './Button';
import { Modal } from './Modal';

interface OnboardingProps {
  onContinue: () => void;
}

const advantages = [
  'Мы открываем доступ к сигнальному режиму, который заранее показывает предполагаемую точку завершения раунда внутри приложения.',
  'Ты видишь движение множителя заранее и можешь быстрее ориентироваться в динамике перед финальной точкой.',
  'Сценарий внутри приложения собран так, чтобы давать максимально близкий и быстрый ориентир по ходу раунда.',
];

const instructions = [
  'Сначала открой доступ по своему ID.',
  'После активации запускай раунды в приложении и параллельно следи за множителем на сайте.',
  'Приложение заранее покажет точку завершения раунда, чтобы ты мог быстрее принимать решение по движению самолета.',
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
          Получить доступ
        </Button>
      </section>
    </Modal>
  );
}
