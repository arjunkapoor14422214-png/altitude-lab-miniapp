import { formatMultiplier } from '../lib/multiplierGenerator';
import type { RoundRecord } from '../types/game';

interface RoundHistoryProps {
  history: RoundRecord[];
}

export function RoundHistory({ history }: RoundHistoryProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Журнал раундов</span>
          <h3>Последние результаты</h3>
        </div>
        <span className="panel-caption">{history.length} записей</span>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          История появится после завершения первого тренировочного раунда.
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <article key={entry.createdAt} className="history-card">
              <div className="history-primary">
                <span className="history-index">Раунд #{entry.roundNumber}</span>
                <strong>{formatMultiplier(entry.targetMultiplier)}</strong>
              </div>
              <div className="history-meta">
                <span>{entry.rangeLabel}</span>
                <span>{entry.time}</span>
                <span>{entry.status === 'completed' ? 'Завершен' : entry.status}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
