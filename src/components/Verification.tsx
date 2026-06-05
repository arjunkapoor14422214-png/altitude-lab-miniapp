import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './Button';
import { appConfig } from '../config/appConfig';

interface VerificationCopy {
  eyebrow: string;
  title: string;
  stepLabel: string;
  step1Text: string;
  promoCodeLabel: string;
  copyLabel: string;
  copiedLabel: string;
  promoHint: string;
  step2Title: string;
  step2Example: string;
  step2Hint: string;
  step3Text: string;
  inputLabel: string;
  inputPlaceholder: string;
  invalidId: string;
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
  const [promoCopied, setPromoCopied] = useState(false);
  const sanitizedValue = value.replace(/\D+/g, '');
  const isInvalidId = sanitizedValue.length > 0 && sanitizedValue.length !== 10;
  const canSubmit = sanitizedValue.length === 10;

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

  const handleCopyPromo = async () => {
    const promoValue = appConfig.promoCode;

    try {
      await navigator.clipboard.writeText(promoValue);
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 1800);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = promoValue;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setPromoCopied(true);
      window.setTimeout(() => setPromoCopied(false), 1800);
    }
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

        <div className="verification-step">
          <div className="verification-step__head">
            <span className="eyebrow">{`${copy.stepLabel} 1`}</span>
            <p className="promo-copy promo-copy--compact">{copy.step1Text}</p>
          </div>

          <div className="verification-offer-grid">
            <a
              className="promo-link promo-link--offer promo-link--plain promo-link--centered"
              href={appConfig.promoRegistrationUrl}
              target="_blank"
              rel="noreferrer"
            >
              <strong className="promo-link__value">
                {appConfig.promoRegistrationLabel}
              </strong>
            </a>

            <a
              className="promo-link promo-link--offer promo-link--plain promo-link--centered"
              href={appConfig.promoApkUrl}
              target="_blank"
              rel="noreferrer"
            >
              <strong className="promo-link__value">
                {appConfig.promoApkLabel}
              </strong>
            </a>

            <button
              type="button"
              className={[
                'promo-code-card',
                'promo-code-card--offer',
                'promo-code-card--interactive',
                'promo-code-card--centered',
                promoCopied ? 'promo-code-card--copied' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={handleCopyPromo}
            >
              <span>{promoCopied ? copy.copiedLabel : copy.promoCodeLabel}</span>
              <strong>{appConfig.promoCode}</strong>
            </button>
          </div>

          <p className="promo-copy promo-copy--accent promo-copy--offer promo-copy--mini">
            {copy.promoHint}
          </p>
        </div>

        <div className="verification-step verification-step--compact">
          <div className="verification-step__head">
            <span className="eyebrow">{`${copy.stepLabel} 2`}</span>
          </div>
          <p className="promo-copy promo-copy--compact verification-id-title">
            <strong>{copy.step2Title}</strong>
          </p>
          <p className="promo-copy promo-copy--accent promo-copy--compact verification-id-example">
            <strong>{copy.step2Example}</strong>
          </p>
          <p className="promo-copy promo-copy--mini">{copy.step2Hint}</p>
        </div>

        <div className="verification-step verification-step--compact verification-step--input">
          <span className="eyebrow">{`${copy.stepLabel} 3`}</span>
          <p className="auth-copy auth-copy--bright auth-copy--compact">{copy.step3Text}</p>
          <label className="field field--embedded">
            <span>{copy.inputLabel}</span>
            <input
              className="input"
              placeholder={copy.inputPlaceholder}
              value={value}
              onChange={(event) =>
                setValue(event.target.value.replace(/\D+/g, '').slice(0, 10))
              }
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              enterKeyHint="done"
            />
          </label>
          {isInvalidId ? (
            <div className="inline-note inline-note--error inline-note--compact">
              {copy.invalidId}
            </div>
          ) : null}
          <div className="inline-note inline-note--bright inline-note--compact">{copy.note}</div>
        </div>

        <Button type="submit" fullWidth disabled={!canSubmit}>
          {copy.submit}
        </Button>
      </form>
    </section>
  );
}
