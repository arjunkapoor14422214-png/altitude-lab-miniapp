import { formatMultiplier } from '../lib/multiplierGenerator';
import { getTranslations } from '../lib/i18n';
import type { RoundStage } from '../types/game';
import type { SupportedLanguage } from '../types/i18n';

interface MultiplierDisplayProps {
  language: SupportedLanguage;
  currentMultiplier: number;
  targetMultiplier: number;
  roundStage: RoundStage;
}

export function MultiplierDisplay({
  language,
  currentMultiplier,
  targetMultiplier,
  roundStage,
}: MultiplierDisplayProps) {
  const copy = getTranslations(language).multiplier;

  return (
    <div className="multiplier-card">
      <div className="multiplier-meta">
        <span className="eyebrow">{copy.current}</span>
        <span className={`status-pill status-pill--${roundStage}`}>
          {copy.stages[roundStage]}
        </span>
      </div>

      <div className="multiplier-value">{formatMultiplier(currentMultiplier)}</div>

      <div className="target-row">
        <span>{copy.targetKnown}</span>
        <strong>{formatMultiplier(targetMultiplier)}</strong>
      </div>
    </div>
  );
}
