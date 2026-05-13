import { Button } from './Button';
import { MultiplierDisplay } from './MultiplierDisplay';
import { PlaneAnimation } from './PlaneAnimation';
import { RoundHistory } from './RoundHistory';
import { ResultsTicker } from './ResultsTicker';
import { SessionInsights } from './SessionInsights';
import { formatMultiplier } from '../lib/multiplierGenerator';
import type { PreparedRound, RoundRecord, RoundStage } from '../types/game';

interface GameScreenProps {
  preparedRound: PreparedRound;
  currentMultiplier: number;
  roundStage: RoundStage;
  flightProgress: number;
  history: RoundRecord[];
  activationMessage: string;
  verificationId: string;
  pilotName: string;
  telegramUsername?: string;
  isTelegram: boolean;
  onStartRound: () => void;
  onNextRound: () => void;
  onResetProfile: () => void;
}

export function GameScreen({
  preparedRound,
  currentMultiplier,
  roundStage,
  flightProgress,
  history,
  activationMessage,
  verificationId,
  pilotName,
  telegramUsername,
  isTelegram,
  onStartRound,
  onNextRound,
  onResetProfile,
}: GameScreenProps) {
  const highestTarget = history.reduce(
    (maxValue, round) => Math.max(maxValue, round.targetMultiplier),
    preparedRound.targetMultiplier,
  );
  const averageTarget =
    history.length > 0
      ? history.reduce((sum, round) => sum + round.targetMultiplier, 0) /
        history.length
      : preparedRound.targetMultiplier;
  const primaryButtonLabel =
    roundStage === 'round_idle'
      ? 'Начать раунд'
      : roundStage === 'round_running'
        ? 'Раунд выполняется'
        : 'Раунд завершен';

  return (
    <section className="game-shell">
      <header className="hero-panel">
        <div>
          <span className="eyebrow">Тренировочный контур</span>
          <h1>Altitude Lab</h1>
          <p className="hero-copy">
            Привет, {pilotName}. Это симулятор раундов без реальных ставок и без
            внешней денежной логики.
          </p>
        </div>

        <div className="hero-badges">
          <span className="tag">{isTelegram ? 'Telegram Mini App' : 'Dev mode'}</span>
          <span className="tag">ID: {verificationId}</span>
          {telegramUsername ? <span className="tag">@{telegramUsername}</span> : null}
        </div>

        <div className="hero-actions">
          <Button variant="ghost" className="button--compact" onClick={onResetProfile}>
            Сменить ID
          </Button>
        </div>
      </header>

      <div className="signal-banner">{activationMessage}</div>

      <ResultsTicker
        history={history}
        nextTargetMultiplier={preparedRound.targetMultiplier}
      />

      <MultiplierDisplay
        currentMultiplier={currentMultiplier}
        targetMultiplier={preparedRound.targetMultiplier}
        roundStage={roundStage}
      />

      <PlaneAnimation
        progress={flightProgress}
        running={roundStage === 'round_running'}
        finished={roundStage === 'round_finished'}
      />

      <SessionInsights preparedRound={preparedRound} history={history} />

      <section className="panel controls-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Раунд #{preparedRound.roundNumber}</span>
            <h3>Параметры запуска</h3>
          </div>
          <span className="panel-caption">{preparedRound.rangeLabel}</span>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <span>Целевой множитель</span>
            <strong>{formatMultiplier(preparedRound.targetMultiplier)}</strong>
          </div>
          <div className="metric-card">
            <span>Средний результат</span>
            <strong>{formatMultiplier(averageTarget)}</strong>
          </div>
          <div className="metric-card">
            <span>Максимум в истории</span>
            <strong>{formatMultiplier(highestTarget)}</strong>
          </div>
        </div>

        <div className="button-row">
          <Button
            fullWidth
            onClick={onStartRound}
            disabled={roundStage !== 'round_idle'}
          >
            {primaryButtonLabel}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={onNextRound}
            disabled={roundStage !== 'round_finished'}
          >
            Следующий раунд
          </Button>
        </div>
      </section>

      <RoundHistory history={history} />
    </section>
  );
}
