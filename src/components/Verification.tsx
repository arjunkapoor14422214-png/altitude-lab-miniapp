import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';

interface VerificationProps {
  mode: 'form' | 'connecting';
  defaultValue?: string;
  pendingId?: string;
  onSubmit: (value: string) => void;
}

const statusSteps = [
  'Проверяем ID и доступ к сигнальному режиму',
  'Подключаем профиль к внутреннему сценарию',
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
          <h1>Подключаем сигнальный режим</h1>
          <p className="auth-copy">
            ID <strong>{pendingId}</strong> принят. Идет проверка доступа и
            активация внутреннего режима для следующих раундов.
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
        <h1>Твой ID на сайте LuckyPari</h1>
        <div className="notice-card">
          <span className="eyebrow">Важно</span>
          <p>
            Чтобы открыть доступ, сначала зарегистрируйся по ссылке{' '}
            <a href="https://lckypr.com/G4DtDxQ" target="_blank" rel="noreferrer">
              lckypr.com/G4DtDxQ
            </a>
            .
          </p>
          <p>
            При регистрации используй промокод <strong>NILE</strong>. По нему
            открывается доступ, и если акция на стороне LuckyPari активна, ты
            дополнительно получаешь до 150 Free Spins.
          </p>
        </div>
        <p className="auth-copy">
          Найди свой ID в личном профиле на сайте LuckyPari и введи его сюда,
          чтобы активировать доступ внутри приложения.
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
          После отправки ID мы проверим доступ и подключим профиль. Обычно это
          занимает от 5 до 10 секунд.
        </div>

        <Button type="submit" fullWidth>
          Открыть доступ
        </Button>
      </form>
    </section>
  );
}
