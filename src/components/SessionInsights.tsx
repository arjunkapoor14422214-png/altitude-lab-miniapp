import { formatMultiplier } from '../lib/multiplierGenerator';
import { getTranslations } from '../lib/i18n';
import type { PreparedRound, RoundRecord } from '../types/game';
import type { RangeKey, SupportedLanguage } from '../types/i18n';

interface SessionInsightsProps {
  language: SupportedLanguage;
  preparedRound: PreparedRound;
  history: RoundRecord[];
}

function getTrainingCue(multiplier: number): Exclude<RangeKey, 'custom'> {
  if (multiplier < 2) {
    return 'base';
  }

  if (multiplier < 5) {
    return 'boosted';
  }

  if (multiplier < 20) {
    return 'advanced';
  }

  return 'rare';
}

export function SessionInsights({
  language,
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
  const copy = getTranslations(language).insights;
  const cue = copy.cues[getTrainingCue(preparedRound.targetMultiplier)];

  return (
    <section className="panel insights-panel">
      <div className="panel-header">
        <div>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3>{copy.title}</h3>
        </div>
        <span className="panel-caption">{copy.caption}</span>
      </div>

      <div className="insights-grid">
        <div className="metric-card">
          <span>{copy.completedRounds}</span>
          <strong>{history.length}</strong>
        </div>
        <div className="metric-card">
          <span>{copy.averageMultiplier}</span>
          <strong>{formatMultiplier(averageTarget)}</strong>
        </div>
        <div className="metric-card">
          <span>{copy.expectedLength}</span>
          <strong>{(preparedRound.durationMs / 1000).toFixed(1)}s</strong>
        </div>
      </div>

      <div className="distribution-row">
        <div className="distribution-pill">
          <span>x1.00-x1.99</span>
          <strong>{baseCount}</strong>
        </div>
        <div className="distribution-pill">
          <span>x2.00-x4.99</span>
          <strong>{midCount}</strong>
        </div>
        <div className="distribution-pill">
          <span>x5.00+</span>
          <strong>{highCount}</strong>
        </div>
      </div>

      <div className="cue-card">
        <span className="eyebrow">{copy.focusEyebrow}</span>
        <h4>{cue.title}</h4>
        <p>{cue.description}</p>
      </div>
    </section>
  );
}
