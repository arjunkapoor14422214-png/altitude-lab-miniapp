import { Button } from './Button';
import { appConfig } from '../config/appConfig';
import ultrapariBrand from '../assets/ultrapari-brand.png';
import type { CompanyId } from '../types/game';

interface CompanySelectionCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  continue: string;
}

interface CompanySelectionProps {
  copy: CompanySelectionCopy;
  selectedCompany: CompanyId | null;
  onSelect: (companyId: CompanyId) => void;
  onContinue: () => void;
}

export function CompanySelection({
  copy,
  selectedCompany,
  onSelect,
  onContinue,
}: CompanySelectionProps) {
  return (
    <section className="auth-shell">
      <div className="auth-card auth-card--promo">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p className="auth-copy auth-copy--bright auth-copy--compact">{copy.subtitle}</p>

        <div className="company-grid">
          {appConfig.companies.map((company) => {
            const isSelected = selectedCompany === company.id;

            return (
              <button
                key={company.id}
                type="button"
                className={[
                  'company-option',
                  isSelected ? 'company-option--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelect(company.id)}
              >
                <span className="company-option__logo" aria-hidden="true">
                  <img className="company-option__logo-mark" src={ultrapariBrand} alt="" />
                </span>
                <span className="company-option__meta">
                  <strong>{company.name}</strong>
                </span>
                <span className="company-option__check" aria-hidden="true">
                  {isSelected ? '●' : '○'}
                </span>
              </button>
            );
          })}
        </div>

        <Button fullWidth onClick={onContinue} disabled={!selectedCompany}>
          {copy.continue}
        </Button>
      </div>
    </section>
  );
}
