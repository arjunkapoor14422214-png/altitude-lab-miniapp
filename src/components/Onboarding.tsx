import { Button } from './Button';
import { Modal } from './Modal';
import { languageLabels } from '../lib/i18n';
import type { SupportedLanguage } from '../types/i18n';

interface OnboardingProps {
  language: SupportedLanguage;
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
  onLanguageChange: (language: SupportedLanguage) => void;
  onContinue: () => void;
}

export function Onboarding({
  language,
  copy,
  onLanguageChange,
  onContinue,
}: OnboardingProps) {
  return (
    <Modal
      title={copy.title}
      headerAddon={
        <div className="language-switcher" aria-label="Language switcher">
          {(['en', 'ar', 'si', 'fr'] as SupportedLanguage[]).map((item) => (
            <button
              key={item}
              type="button"
              className={[
                'language-chip',
                language === item ? 'language-chip--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onLanguageChange(item)}
            >
              {languageLabels[item]}
            </button>
          ))}
        </div>
      }
    >
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
