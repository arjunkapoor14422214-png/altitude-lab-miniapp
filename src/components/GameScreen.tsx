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
  signalDurationMs: number;
  onStartRound: () => void;
}

export function GameScreen({
  copy,
  targetMultiplier,
  roundStage,
  flightProgress,
  signalDurationMs,
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
      <div className="signal-topline">{copy.topline}</div>

      <div className="signal-stage">
        <div className="signal-stage__status">
          <span className="signal-stage__dot" aria-hidden="true" />
          {statusLabel}
        </div>

        <div
          className={[
            'signal-token-shell',
            isOpen ? 'signal-token-shell--open' : '',
            isResetting ? 'signal-token-shell--reset' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ '--signal-progress': progressDeg } as CSSProperties}
        >
          <div className="signal-token">
            <div className="signal-face signal-face--front">
              <div className="signal-face__halo" aria-hidden="true" />
              <div className="signal-face__brand">
                <span className="signal-face__brand-code" aria-hidden="true">
                  <svg
                    className="signal-face__brand-mark"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 8H31.5C34.1 8 36.2 10.1 36.2 12.7V17.4H41.3C43.9 17.4 46 19.5 46 22.1V36.6C46 39.2 43.9 41.3 41.3 41.3H26.8C24.2 41.3 22.1 39.2 22.1 36.6V31.9H17C14.4 31.9 12.3 29.8 12.3 27.2V12.7C12.3 10.1 14.4 8 17 8Z"
                      stroke="#241300"
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 11H34.5C37.1 11 39.2 13.1 39.2 15.7V20.4H44.3C46.9 20.4 49 22.5 49 25.1V39.6C49 42.2 46.9 44.3 44.3 44.3H29.8C27.2 44.3 25.1 42.2 25.1 39.6V34.9H20C17.4 34.9 15.3 32.8 15.3 30.2V15.7C15.3 13.1 17.4 11 20 11Z"
                      stroke="#ffd134"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{copy.brand}</span>
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
