import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';

interface VerificationProps {
  mode: 'form' | 'connecting';
  defaultValue?: string;
  pendingId?: string;
  onSubmit: (value: string) => void;
}

const statusSteps = [
  'Зарегистрировался по ссылке',
  'Ввел промокод',
  'Сделал депозит',
];

export function Verification({
  mode,
  defaultValue = '',
  pendingId,
  onSubmit,
}: VerificationProps) {
  const [value, setValue] = useState(defaultValue);
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (mode !== 'connecting') {
      setCompletedSteps(0);
      return;
    }

    setCompletedSteps(0);

    const timeoutIds = statusSteps.map((_, index) =>
      window.setTimeout(() => {
        setCompletedSteps(index + 1);
      }, (index + 1) * 3000),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [mode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    onSubmit(value.trim());
  };

  if (mode === 'connecting') {
    return (
      <section className="auth-shell">
        <div className="auth-card auth-card--promo">
          <span className="eyebrow">Проверка доступа</span>
          <h1>Подключаем проверочный режим</h1>
          <p className="auth-copy auth-copy--bright">
            ID <strong>{pendingId}</strong> принят. Идет проверка и активация
            доступа для следующих раундов.
          </p>

          <div className="spinner" aria-hidden="true" />

          <div className="status-list">
            {statusSteps.map((step, index) => (
              <div
                key={step}
                className={[
                  'status-item',
                  completedSteps > index ? 'status-item--completed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="status-item__dot" aria-hidden="true" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-shell">
      <form className="auth-card auth-card--promo" onSubmit={handleSubmit}>
        <span className="eyebrow">Активация</span>
        <h1>Получение доступа</h1>

        <div className="notice-card notice-card--highlight notice-card--offer">
          <span className="eyebrow">Шаг 1</span>
          <p className="promo-copy">
            Чтобы получить доступ, обязательно зарегистрируйся по ссылке:
          </p>
          <a
            className="promo-link promo-link--offer"
            href="https://lckypr.com/G4DtDxQ"
            target="_blank"
            rel="noreferrer"
          >
            lckypr.com/G4DtDxQ
          </a>

          <div className="promo-code-card promo-code-card--offer">
            <span>Промокод</span>
            <strong>NILE</strong>
          </div>

          <p className="promo-copy promo-copy--accent promo-copy--offer">
            Введи его при регистрации и получи доступ плюс до 150 Free Spins.
          </p>
        </div>

        <div className="notice-card">
          <span className="eyebrow">Шаг 2</span>
          <p className="promo-copy">
            <strong>Твой ID на сайте LuckyPari</strong>
          </p>
          <p className="promo-copy promo-copy--accent">
            Например: <strong>123456789</strong>
          </p>
          <p className="promo-copy">
            Ты найдешь его на сайте в своем личном профиле.
          </p>
        </div>

        <div className="step-block">
          <span className="eyebrow">Шаг 3</span>
          <p className="auth-copy auth-copy--bright">
            Введи свой ID ниже, чтобы активировать доступ внутри приложения.
          </p>
        </div>

        <label className="field">
          <span>ID на сайте LuckyPari</span>
          <input
            className="input"
            placeholder="Например, 123456789"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            inputMode="numeric"
          />
        </label>

        <div className="inline-note inline-note--bright">
          После отправки ID начнется проверка. Обычно она занимает от 5 до 10
          секунд.
        </div>

        <Button type="submit" fullWidth>
          Активировать доступ
        </Button>
      </form>
    </section>
  );
}
