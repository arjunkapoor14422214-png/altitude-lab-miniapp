import { formatMultiplier } from '../lib/multiplierGenerator';
import type { PreparedRound, RoundRecord } from '../types/game';

interface SessionInsightsProps {
  preparedRound: PreparedRound;
  history: RoundRecord[];
}

function getTrainingCue(multiplier: number) {
  if (multiplier < 2) {
    return {
      title: 'Короткий спринт',
      description:
        'Следующий раунд завершится быстро. Хороший момент, чтобы привыкнуть к стартовой фазе и темпу роста.',
    };
  }

  if (multiplier < 5) {
    return {
      title: 'Средняя дистанция',
      description:
        'Раунд продлится дольше базового диапазона. Можно лучше прочувствовать ускорение и визуальный ритм.',
    };
  }

  if (multiplier < 20) {
    return {
      title: 'Дальний полет',
      description:
        'Редкий более высокий диапазон. Удобно изучать поведение множителя на длинной траектории.',
    };
  }

  return {
    title: 'Редкий высокий пик',
    description:
      'Это редкий сценарий с длинным разгонным участком. Его полезно сохранять в памяти как эталон длинного раунда.',
  };
}

export function SessionInsights({
  preparedRound,
  history,
}: SessionInsightsProps) {
  const baseCount = history.filter((entry) => entry.targetMultiplier < 2).length;
  const midCount = history.filter(
    (entry) => entry.targetMultiplier >= 2 && entry.targetMultiplier < 5,
  ).length;
  const highCount = history.filter((entry) => entry.targetMultiplier >= 5).length;
  const averageTarget =
    history.length > 0
      ? history.reduce((sum, entry) => sum + entry.targetMultiplier, 0) /
        history.length
      : preparedRound.targetMultiplier;
  const cue = getTrainingCue(preparedRound.targetMultiplier);

  return (
    <section className="panel insights-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Тренировочная аналитика</span>
          <h3>Срез по текущей сессии</h3>
        </div>
        <span className="panel-caption">Без реальных ставок</span>
      </div>

      <div className="insights-grid">
        <div className="metric-card">
          <span>Завершено раундов</span>
          <strong>{history.length}</strong>
        </div>
        <div className="metric-card">
          <span>Средний множитель</span>
          <strong>{formatMultiplier(averageTarget)}</strong>
        </div>
        <div className="metric-card">
          <span>Ожидаемая длина</span>
          <strong>{(preparedRound.durationMs / 1000).toFixed(1)}s</strong>
        </div>
      </div>

      <div className="distribution-row">
        <div className="distribution-pill">
          <span>x1.00–x1.99</span>
          <strong>{baseCount}</strong>
        </div>
        <div className="distribution-pill">
          <span>x2.00–x4.99</span>
          <strong>{midCount}</strong>
        </div>
        <div className="distribution-pill">
          <span>x5.00+</span>
          <strong>{highCount}</strong>
        </div>
      </div>

      <div className="cue-card">
        <span className="eyebrow">Фокус раунда</span>
        <h4>{cue.title}</h4>
        <p>{cue.description}</p>
      </div>
    </section>
  );
}

