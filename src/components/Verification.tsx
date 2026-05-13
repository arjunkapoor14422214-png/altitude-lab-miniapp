import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';

interface VerificationProps {
  mode: 'form' | 'connecting';
  defaultValue?: string;
  pendingId?: string;
  onSubmit: (value: string) => void;
}

const statusSteps = [
  'Проверяем формат тренировочного ID',
  'Подключаем локальный профиль',
  'Активируем сессию для следующих раундов',
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
          <span className="eyebrow">Активация</span>
          <h1>Подключаем тренировочный режим</h1>
          <p className="auth-copy">
            ID <strong>{pendingId}</strong> принят. Идет локальная имитация
            активации, чтобы позже этот поток можно было заменить реальным API.
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
        <h1>Активируйте тренировочный профиль</h1>
        <p className="auth-copy">
          Введите любой ID. На этом этапе он обрабатывается локально и нужен,
          чтобы подготовить архитектуру под будущий backend.
        </p>

        <label className="field">
          <span>Тренировочный ID</span>
          <input
            className="input"
            placeholder="Например, pilot-204"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoComplete="off"
            inputMode="text"
          />
        </label>

        <div className="inline-note">
          Задержка активации имитирует подключение и занимает от 5 до 10 секунд.
        </div>

        <Button type="submit" fullWidth>
          Активировать режим
        </Button>
      </form>
    </section>
  );
}
