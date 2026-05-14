import { Button } from './Button';
import { Modal } from './Modal';
import { languageLabels, supportedLanguages } from '../lib/i18n';
import type { SupportedLanguage } from '../types/i18n';

interface PromptCopy {
  title: string;
  subtitle: string;
  checkbox: string;
  button: string;
}

interface LanguagePromptProps {
  language: SupportedLanguage;
  selectedLanguage: SupportedLanguage;
  dontShowAgain: boolean;
  onSelectLanguage: (language: SupportedLanguage) => void;
  onToggleDontShowAgain: (checked: boolean) => void;
  onContinue: () => void;
}

const promptCopy: Record<SupportedLanguage, PromptCopy> = {
  en: {
    title: 'Welcome',
    subtitle: 'Choose your language to continue.',
    checkbox: 'Do not show again',
    button: 'Continue',
  },
  ar: {
    title: 'مرحباً',
    subtitle: 'اختر لغتك للمتابعة.',
    checkbox: 'عدم الإظهار مرة أخرى',
    button: 'متابعة',
  },
  si: {
    title: 'ආයුබෝවන්',
    subtitle: 'ඉදිරියට යාමට ඔබගේ භාෂාව තෝරන්න.',
    checkbox: 'නැවත නොපෙන්වන්න',
    button: 'ඉදිරියට',
  },
  fr: {
    title: 'Bienvenue',
    subtitle: 'Choisissez votre langue pour continuer.',
    checkbox: 'Ne plus afficher',
    button: 'Continuer',
  },
  ru: {
    title: 'Добро пожаловать',
    subtitle: 'Выберите язык, чтобы продолжить.',
    checkbox: 'Больше не показывать',
    button: 'Продолжить',
  },
};

export function LanguagePrompt({
  language,
  selectedLanguage,
  dontShowAgain,
  onSelectLanguage,
  onToggleDontShowAgain,
  onContinue,
}: LanguagePromptProps) {
  const copy = promptCopy[language];

  return (
    <div className="language-prompt-layer">
      <Modal>
        <section className="stack stack--tight language-prompt">
          <div className="language-prompt__intro">
            <h2 className="language-prompt__title">{copy.title}</h2>
            <p className="language-prompt__subtitle">{copy.subtitle}</p>
          </div>

          <div className="language-switcher language-switcher--grid">
            {supportedLanguages.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'language-chip',
                  'language-chip--large',
                  selectedLanguage === item ? 'language-chip--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelectLanguage(item)}
              >
                {languageLabels[item]}
              </button>
            ))}
          </div>

          <label className="checkbox-row">
            <input
              className="checkbox-row__input"
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => onToggleDontShowAgain(event.target.checked)}
            />
            <span className="checkbox-row__mark" aria-hidden="true" />
            <span className="checkbox-row__label">{copy.checkbox}</span>
          </label>

          <Button fullWidth onClick={onContinue}>
            {copy.button}
          </Button>
        </section>
      </Modal>
    </div>
  );
}
