import type { CSSProperties } from 'react';
import planeSignalSprite from '../assets/plane-signal.png';
import { Button } from './Button';
import { formatMultiplier } from '../lib/multiplierGenerator';
import type { RoundStage } from '../types/game';

interface GameCopy {
  topline: string;
  start: string;
  running: string;
  reload: string;
  closedTitle: string;
  closedHint: string;
  signalLabel: string;
  signalHint: string;
  readyStatus: string;
  liveStatus: string;
  resetStatus: string;
  brand: string;
}

interface GameScreenProps {
  copy: GameCopy;
  targetMultiplier: number | null;
  roundStage: RoundStage;
  flightProgress: number;
  onStartRound: () => void;
}

export function GameScreen({
  copy,
  targetMultiplier,
  roundStage,
  flightProgress,
  onStartRound,
}: GameScreenProps) {
  const buttonLabel =
    roundStage === 'round_idle'
      ? copy.start
      : roundStage === 'round_running'
        ? copy.running
        : copy.reload;

  const isOpen = roundStage === 'round_running';
  const isResetting = roundStage === 'round_finished';
  const progressDeg = `${Math.max(0, Math.min(1, flightProgress)) * 360}deg`;
  const statusLabel =
    roundStage === 'round_running'
      ? copy.liveStatus
      : roundStage === 'round_finished'
        ? copy.resetStatus
        : copy.readyStatus;

  return (
    <section className="game-shell game-shell--signal">
      <div className="signal-heading">
        <strong>AVIATOR SIGNAL</strong>
        <span>{copy.topline}</span>
      </div>

      <div className="signal-stage">
        <div className="signal-stage__status">
          <span className="signal-stage__dot" aria-hidden="true" />
          {statusLabel}
        </div>

        <div className="signal-stage__body">
          <button
            type="button"
            className={[
              'signal-token-shell',
              isOpen ? 'signal-token-shell--open' : '',
              isResetting ? 'signal-token-shell--reset' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--signal-progress': progressDeg } as CSSProperties}
            onClick={roundStage === 'round_idle' ? onStartRound : undefined}
            disabled={roundStage !== 'round_idle'}
            aria-label={copy.start}
          >
            <div className="signal-token">
              <div className="signal-face signal-face--front">
                <div className="signal-face__halo" aria-hidden="true" />
                <div className="signal-face__brand">
                  <span className="signal-face__brand-text" aria-hidden="true">
                    ultrapari
                  </span>
                </div>
                <img
                  className="signal-face__plane"
                  src={planeSignalSprite}
                  alt=""
                  aria-hidden="true"
                />
                <div className="signal-face__copy">
                  <strong>{copy.closedTitle}</strong>
                  <span>{copy.closedHint}</span>
                </div>
              </div>

              <div className="signal-face signal-face--back">
                <div className="signal-face__back-ring" aria-hidden="true" />
                <span className="signal-face__label">{copy.signalLabel}</span>
                <strong className="signal-face__value">
                  {targetMultiplier ? formatMultiplier(targetMultiplier) : 'x--'}
                </strong>
                <span className="signal-face__hint">{copy.signalHint}</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <Button
        fullWidth
        className="signal-start-button"
        onClick={onStartRound}
        disabled={roundStage !== 'round_idle'}
      >
        {buttonLabel}
      </Button>
    </section>
  );
}
