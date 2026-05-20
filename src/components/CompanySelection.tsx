import { Button } from './Button';
import { appConfig } from '../config/appConfig';
import type { CompanyId } from '../types/game';

interface CompanySelectionCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  companyBadge: string;
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
                  <svg
                    className="company-option__logo-mark"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8H31.5C34.1 8 36.2 10.1 36.2 12.7V17.4H41.3C43.9 17.4 46 19.5 46 22.1V36.6C46 39.2 43.9 41.3 41.3 41.3H26.8C24.2 41.3 22.1 39.2 22.1 36.6V31.9H17C14.4 31.9 12.3 29.8 12.3 27.2V12.7C12.3 10.1 14.4 8 17 8Z"
                      stroke="#241300"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 11H34.5C37.1 11 39.2 13.1 39.2 15.7V20.4H44.3C46.9 20.4 49 22.5 49 25.1V39.6C49 42.2 46.9 44.3 44.3 44.3H29.8C27.2 44.3 25.1 42.2 25.1 39.6V34.9H20C17.4 34.9 15.3 32.8 15.3 30.2V15.7C15.3 13.1 17.4 11 20 11Z"
                      stroke="#ffd134"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="company-option__meta">
                  <strong>{company.name}</strong>
                  <span>{copy.companyBadge}</span>
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
