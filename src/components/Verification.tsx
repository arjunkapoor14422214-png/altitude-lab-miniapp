import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';
import { appConfig } from '../config/appConfig';

interface VerificationCopy {
  eyebrow: string;
  title: string;
  stepLabel: string;
  step1Text: string;
  promoCodeLabel: string;
  promoHint: string;
  step2Title: string;
  step2Example: string;
  step2Hint: string;
  step3Text: string;
  inputLabel: string;
  inputPlaceholder: string;
  note: string;
  submit: string;
  connectingEyebrow: string;
  connectingTitle: string;
  connectingBody: (pendingId: string) => string;
  connectingSteps: string[];
}

interface VerificationProps {
  mode: 'form' | 'connecting';
  copy: VerificationCopy;
  defaultValue?: string;
  pendingId?: string;
  onSubmit: (value: string) => void;
}

export function Verification({
  mode,
  copy,
  defaultValue = '',
  pendingId,
  onSubmit,
}: VerificationProps) {
  const [value, setValue] = useState(defaultValue.replace(/\D+/g, ''));
  const [completedSteps, setCompletedSteps] = useState(0);
  const sanitizedValue = value.replace(/\D+/g, '');
  const canSubmit = sanitizedValue.length > 0;

  useEffect(() => {
    setValue(defaultValue.replace(/\D+/g, ''));
  }, [defaultValue]);

  useEffect(() => {
    if (mode !== 'connecting') {
      setCompletedSteps(0);
      return;
    }

    setCompletedSteps(0);

    const timeoutIds = copy.connectingSteps.map((_, index) =>
      window.setTimeout(() => {
        setCompletedSteps(index + 1);
      }, (index + 1) * 3000),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [copy.connectingSteps, mode]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(sanitizedValue);
  };

  if (mode === 'connecting') {
    return (
      <section className="auth-shell">
        <div className="auth-card auth-card--promo">
          <span className="eyebrow">{copy.connectingEyebrow}</span>
          <h1>{copy.connectingTitle}</h1>
          <p className="auth-copy auth-copy--bright">
            {copy.connectingBody(pendingId ?? '')}
          </p>

          <div className="spinner" aria-hidden="true" />

          <div className="status-list">
            {copy.connectingSteps.map((step, index) => (
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
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>

        <div className="notice-card notice-card--highlight notice-card--offer">
          <span className="eyebrow">{`${copy.stepLabel} 1`}</span>
          <p className="promo-copy">{copy.step1Text}</p>
          <a
            className="promo-link promo-link--offer"
            href={appConfig.promoRegistrationUrl}
            target="_blank"
            rel="noreferrer"
          >
            {appConfig.promoRegistrationLabel}
          </a>

          <div className="promo-code-card promo-code-card--offer">
            <span>{copy.promoCodeLabel}</span>
            <strong>{appConfig.promoCode}</strong>
          </div>

          <p className="promo-copy promo-copy--accent promo-copy--offer">
            {copy.promoHint}
          </p>
        </div>

        <div className="notice-card">
          <span className="eyebrow">{`${copy.stepLabel} 2`}</span>
          <p className="promo-copy">
            <strong>{copy.step2Title}</strong>
          </p>
          <p className="promo-copy promo-copy--accent">
            <strong>{copy.step2Example}</strong>
          </p>
          <p className="promo-copy">{copy.step2Hint}</p>
        </div>

        <div className="step-block">
          <span className="eyebrow">{`${copy.stepLabel} 3`}</span>
          <p className="auth-copy auth-copy--bright">{copy.step3Text}</p>
        </div>

        <label className="field">
          <span>{copy.inputLabel}</span>
          <input
            className="input"
            placeholder={copy.inputPlaceholder}
            value={value}
            onChange={(event) =>
              setValue(event.target.value.replace(/\D+/g, ''))
            }
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
            enterKeyHint="done"
          />
        </label>

        <div className="inline-note inline-note--bright">{copy.note}</div>

        <Button type="submit" fullWidth disabled={!canSubmit}>
          {copy.submit}
        </Button>
      </form>
    </section>
  );
}
