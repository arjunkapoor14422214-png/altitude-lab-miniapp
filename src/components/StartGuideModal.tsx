import { appConfig } from '../config/appConfig';
import { Button } from './Button';
import { Modal } from './Modal';

interface StartGuideModalProps {
  onContinue: () => void;
}

export function StartGuideModal({ onContinue }: StartGuideModalProps) {
  return (
    <div className="start-guide-layer">
      <Modal
        title="How to use the signal"
        subtitle="Follow these steps once, then launch the round together with your bet on the site."
      >
        <div className="start-guide-poster" aria-hidden="true">
          <div className="start-guide-poster__brand">LuckyPari</div>
          <div className="start-guide-poster__hero-copy">
            <span>Get 130% bonus</span>
            <strong>Use promo code NILE</strong>
          </div>
          <div className="start-guide-poster__promo-chip">PROMOCODE</div>
          <div className="start-guide-poster__promo-code">{appConfig.promoCode}</div>
          <div className="start-guide-poster__phone" />
          <div className="start-guide-poster__figure" />
          <div className="start-guide-poster__plane start-guide-poster__plane--one" />
          <div className="start-guide-poster__plane start-guide-poster__plane--two" />
          <div className="start-guide-poster__plane start-guide-poster__plane--three" />
        </div>

        <div className="start-guide-steps">
          <div className="start-guide-step">
            <span>1</span>
            <p>Register through the access link below.</p>
          </div>
          <a
            className="start-guide-link"
            href={appConfig.promoRegistrationUrl}
            target="_blank"
            rel="noreferrer"
          >
            {appConfig.promoRegistrationLabel}
          </a>

          <div className="start-guide-step">
            <span>2</span>
            <p>Enter promo code {appConfig.promoCode} during registration.</p>
          </div>

          <div className="start-guide-step">
            <span>3</span>
            <p>Make a deposit on the site to unlock access.</p>
          </div>

          <div className="start-guide-step">
            <span>4</span>
            <p>
              Launch this app together with your live bet on the site, then
              press START to generate the signal for the next flight.
            </p>
          </div>
        </div>

        <div className="button-row">
          <Button fullWidth onClick={onContinue}>
            Start signal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
