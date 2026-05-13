import { formatMultiplier } from '../lib/multiplierGenerator';
import type { RoundStage } from '../types/game';

interface MultiplierDisplayProps {
  currentMultiplier: number;
  targetMultiplier: number;
  roundStage: RoundStage;
}

const stageLabels: Record<RoundStage, string> = {
  round_idle: 'Раунд готов',
  round_running: 'Рост множителя',
  round_finished: 'Цель достигнута',
};

export function MultiplierDisplay({
  currentMultiplier,
  targetMultiplier,
  roundStage,
}: MultiplierDisplayProps) {
  return (
    <div className="multiplier-card">
      <div className="multiplier-meta">
        <span className="eyebrow">Текущий множитель</span>
        <span className={`status-pill status-pill--${roundStage}`}>
          {stageLabels[roundStage]}
        </span>
      </div>

      <div className="multiplier-value">{formatMultiplier(currentMultiplier)}</div>

      <div className="target-row">
        <span>Цель известна заранее</span>
        <strong>{formatMultiplier(targetMultiplier)}</strong>
      </div>
    </div>
  );
}

