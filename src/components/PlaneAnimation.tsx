interface PlaneAnimationProps {
  progress: number;
  running: boolean;
  finished: boolean;
  currentMultiplier: number;
  targetMultiplier: number;
}

export function PlaneAnimation({
  progress,
  running,
  finished,
  currentMultiplier,
  targetMultiplier,
}: PlaneAnimationProps) {
  const x = 9 + progress * 79;
  const y = 78 - Math.sin(progress * Math.PI * 0.9) * 16 - progress * 38;
  const trailWidth = Math.max(10, x - 2);
  const statusLabel = running
    ? 'Самолет в полете'
    : finished
      ? 'Самолет взорвался'
      : 'Ожидает запуск';

  return (
    <div className="arcade-stage">
      <div className="arcade-stage__chrome">
        <div className="arcade-stage__status">
          <span className="arcade-stage__status-dot" />
          <span>{statusLabel}</span>
        </div>
        <div className="arcade-stage__target">
          <span>Точная точка</span>
          <strong>x{targetMultiplier.toFixed(2)}</strong>
        </div>
      </div>

      <div className="arcade-stage__arena">
        <div className="arcade-stage__sun" />
        <div className="arcade-stage__grid" />
        <div className="arcade-stage__curve" />
        <div className="arcade-stage__horizon" />

        <div className="arcade-multiplier">
          <span className="arcade-multiplier__label">{statusLabel}</span>
          <strong>x{currentMultiplier.toFixed(2)}</strong>
        </div>

        <div
          className={`arcade-stage__trail ${running ? 'arcade-stage__trail--running' : ''}`}
          style={{ width: `${trailWidth}%` }}
        />

        <div
          className={`arcade-plane ${finished ? 'arcade-plane--finished' : ''}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
        >
          <span className="arcade-plane__body" />
          <span className="arcade-plane__nose" />
          <span className="arcade-plane__cockpit" />
          <span className="arcade-plane__wing arcade-plane__wing--left" />
          <span className="arcade-plane__wing arcade-plane__wing--right" />
          <span className="arcade-plane__wing arcade-plane__wing--center" />
          <span className="arcade-plane__tail" />
          <span className="arcade-plane__fire" />
        </div>

        {finished ? (
          <div
            className="arcade-burst"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <span className="arcade-burst__core" />
            <span className="arcade-burst__ring arcade-burst__ring--one" />
            <span className="arcade-burst__ring arcade-burst__ring--two" />
          </div>
        ) : null}

        <div className="arcade-stage__target-line" style={{ left: `${x}%` }}>
          <span>x{targetMultiplier.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
