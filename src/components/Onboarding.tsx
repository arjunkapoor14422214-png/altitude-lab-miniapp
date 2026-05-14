import { Button } from './Button';
import { Modal } from './Modal';

interface OnboardingProps {
  copy: {
    title: string;
    heroEyebrow: string;
    heroCopy: string;
    insideTitle: string;
    insideItems: string[];
    startTitle: string;
    startItems: string[];
    continue: string;
  };
  onContinue: () => void;
}

export function Onboarding({
  copy,
  onContinue,
}: OnboardingProps) {
  return (
    <Modal title={copy.title}>
      <section className="stack stack--tight">
        <div className="promo-hero">
          <span className="eyebrow">{copy.heroEyebrow}</span>
          <p className="promo-hero__copy">{copy.heroCopy}</p>
        </div>

        <div className="content-block content-block--glow">
          <h3>{copy.insideTitle}</h3>
          <ul className="feature-list feature-list--bright">
            {copy.insideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content-block content-block--glow">
          <h3>{copy.startTitle}</h3>
          <ul className="feature-list feature-list--bright">
            {copy.startItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <Button fullWidth onClick={onContinue}>
          {copy.continue}
        </Button>
      </section>
    </Modal>
  );
}
