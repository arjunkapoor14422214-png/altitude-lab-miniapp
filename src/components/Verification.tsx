import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';

interface VerificationProps {
  mode: 'form' | 'connecting';
  defaultValue?: string;
  pendingId?: string;
  onSubmit: (value: string) => void;
}

const statusSteps = [
  'Проверяем ID и доступ',
  'Подключаем профиль к системе',
  'Открываем доступ к следующим раундам',
];

export function Verification({
  mode,
  defaultValue = '',
  pendingId,
  onSubmit,
}: VerificationProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

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
        <div className="auth-card">
          <span className="eyebrow">Проверка доступа</span>
          <h1>Подключаем проверочный режим</h1>
          <p className="auth-copy">
            ID <strong>{pendingId}</strong> принят. Идет проверка и активация
            доступа для следующих раундов.
          </p>

          <div className="spinner" aria-hidden="true" />

          <div className="status-list">
            {statusSteps.map((step, index) => (
              <div
                key={step}
                className="status-item"
                style={{ animationDelay: `${index * 0.25}s` }}
              >
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
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Шаг 2</span>
        <h1>Получение доступа</h1>
        <div className="notice-card">
          <span className="eyebrow">Важно</span>
          <p>
            Помни: чтобы получить доступ, обязательно зарегистрируйся по ссылке{' '}
            <a href="https://lckypr.com/G4DtDxQ" target="_blank" rel="noreferrer">
              lckypr.com/G4DtDxQ
            </a>
            .
          </p>
          <p>
            При регистрации используй промокод <strong>NILE</strong>. Тогда ты
            получишь доступ и дополнительно до 150 Free Spins.
          </p>
        </div>

        <div className="notice-card">
          <span className="eyebrow">Шаг 3</span>
          <p>
            <strong>Твой ID на сайте LuckyPari</strong>
          </p>
          <p>
            Например: <strong>123456789</strong>
          </p>
          <p>Ты найдешь его на сайте в своем личном профиле.</p>
        </div>

        <p className="auth-copy">
          Введи свой ID ниже, чтобы активировать доступ внутри приложения.
        </p>

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

        <div className="inline-note">
          После отправки ID начнется проверка. Обычно она занимает от 5 до 10 секунд.
        </div>

        <Button type="submit" fullWidth>
          Активировать доступ
        </Button>
      </form>
    </section>
  );
}
