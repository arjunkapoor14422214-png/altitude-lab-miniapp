import { Button } from './Button';
import { PlaneAnimation } from './PlaneAnimation';
import type { PreparedRound, RoundStage } from '../types/game';

interface GameScreenProps {
  preparedRound: PreparedRound;
  currentMultiplier: number;
  roundStage: RoundStage;
  flightProgress: number;
  onStartRound: () => void;
}

export function GameScreen({
  preparedRound,
  currentMultiplier,
  roundStage,
  flightProgress,
  onStartRound,
}: GameScreenProps) {
  const startButtonLabel =
    roundStage === 'round_idle'
      ? 'СТАРТ'
      : roundStage === 'round_running'
        ? 'ПОЛЕТ...'
        : 'ПЕРЕЗАГРУЗКА';

  return (
    <section className="game-shell game-shell--arcade">
      <div className="arcade-topline">
        Нажми старт одновременно со ставкой на сайте и получи точный расчет,
        когда взорвется самолет.
      </div>

      <PlaneAnimation
        progress={flightProgress}
        running={roundStage === 'round_running'}
        finished={roundStage === 'round_finished'}
        currentMultiplier={currentMultiplier}
        targetMultiplier={preparedRound.targetMultiplier}
      />

      <Button
        fullWidth
        className="arcade-start-button"
        onClick={onStartRound}
        disabled={roundStage !== 'round_idle'}
      >
        {startButtonLabel}
      </Button>
    </section>
  );
}
