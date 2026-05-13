import { formatMultiplier } from '../lib/multiplierGenerator';
import { getTranslations } from '../lib/i18n';
import type { RoundRecord } from '../types/game';
import type { SupportedLanguage } from '../types/i18n';

interface ResultsTickerProps {
  language: SupportedLanguage;
  history: RoundRecord[];
  nextTargetMultiplier: number;
}

function getTone(multiplier: number) {
  if (multiplier >= 20) {
    return 'rare';
  }

  if (multiplier >= 5) {
    return 'high';
  }

  if (multiplier >= 2) {
    return 'mid';
  }

  return 'base';
}

export function ResultsTicker({
  language,
  history,
  nextTargetMultiplier,
}: ResultsTickerProps) {
  const copy = getTranslations(language).ticker;

  return (
    <section className="panel ticker-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
        </div>
        <span className="panel-caption">{copy.caption}</span>
      </div>

      <div className="ticker-row">
        <article className="ticker-pill ticker-pill--next">
          <span>{copy.next}</span>
          <strong>{formatMultiplier(nextTargetMultiplier)}</strong>
        </article>

        {history.length === 0 ? (
          <article className="ticker-pill ticker-pill--empty">
            <span>{copy.emptyLabel}</span>
            <strong>{copy.emptyValue}</strong>
          </article>
        ) : (
          history.slice(0, 8).map((entry) => (
            <article
              key={entry.createdAt}
              className={`ticker-pill ticker-pill--${getTone(
                entry.targetMultiplier,
              )}`}
            >
              <span>#{entry.roundNumber}</span>
              <strong>{formatMultiplier(entry.targetMultiplier)}</strong>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
