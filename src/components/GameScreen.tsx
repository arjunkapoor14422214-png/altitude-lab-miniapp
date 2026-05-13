import { Button } from './Button';
import { PlaneAnimation } from './PlaneAnimation';
import type { RoundStage } from '../types/game';

interface GameCopy {
  topline: string;
  start: string;
  running: string;
  reload: string;
  waitingStatus: string;
  flyingStatus: string;
  explodedStatus: string;
  exactPoint: string;
  flightPoint: string;
  hidden: string;
}

interface GameScreenProps {
  copy: GameCopy;
  targetMultiplier: number | null;
  currentMultiplier: number;
  roundStage: RoundStage;
  flightProgress: number;
  onStartRound: () => void;
}

export function GameScreen({
  copy,
  targetMultiplier,
  currentMultiplier,
  roundStage,
  flightProgress,
  onStartRound,
}: GameScreenProps) {
  const startButtonLabel =
    roundStage === 'round_idle'
      ? copy.start
      : roundStage === 'round_running'
        ? copy.running
        : copy.reload;

  return (
    <section className="game-shell game-shell--arcade">
      <div className="arcade-topline">{copy.topline}</div>

      <PlaneAnimation
        copy={copy}
        progress={flightProgress}
        running={roundStage === 'round_running'}
        finished={roundStage === 'round_finished'}
        currentMultiplier={currentMultiplier}
        targetMultiplier={targetMultiplier}
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
