import { formatMultiplier } from '../lib/multiplierGenerator';
import type { RoundRecord } from '../types/game';

interface ResultsTickerProps {
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
  history,
  nextTargetMultiplier,
}: ResultsTickerProps) {
  return (
    <section className="panel ticker-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Лента результатов</span>
          <h3>Текущий ритм сессии</h3>
        </div>
        <span className="panel-caption">Последние и ближайший раунд</span>
      </div>

      <div className="ticker-row">
        <article className="ticker-pill ticker-pill--next">
          <span>Next</span>
          <strong>{formatMultiplier(nextTargetMultiplier)}</strong>
        </article>

        {history.length === 0 ? (
          <article className="ticker-pill ticker-pill--empty">
            <span>Пока пусто</span>
            <strong>Ждем первый финиш</strong>
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

