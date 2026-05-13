import { formatMultiplier } from '../lib/multiplierGenerator';
import { getRangeLabel, getTranslations } from '../lib/i18n';
import type { RoundRecord } from '../types/game';
import type { SupportedLanguage } from '../types/i18n';

interface RoundHistoryProps {
  language: SupportedLanguage;
  history: RoundRecord[];
}

export function RoundHistory({ language, history }: RoundHistoryProps) {
  const copy = getTranslations(language).history;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
        </div>
        <span className="panel-caption">{copy.records(history.length)}</span>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">{copy.empty}</div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <article key={entry.createdAt} className="history-card">
              <div className="history-primary">
                <span className="history-index">{copy.round(entry.roundNumber)}</span>
                <strong>{formatMultiplier(entry.targetMultiplier)}</strong>
              </div>
              <div className="history-meta">
                <span>{getRangeLabel(language, entry.rangeKey)}</span>
                <span>{entry.time}</span>
                <span>{entry.status === 'completed' ? copy.completed : entry.status}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
