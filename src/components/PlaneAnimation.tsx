interface PlaneAnimationProps {
  progress: number;
  running: boolean;
  finished: boolean;
}

export function PlaneAnimation({
  progress,
  running,
  finished,
}: PlaneAnimationProps) {
  const x = 10 + progress * 80;
  const y = 78 - Math.sin(progress * Math.PI * 0.92) * 24 - progress * 22;

  return (
    <div className="flight-card">
      <div className="flight-sky">
        <div
          className={`flight-trail ${running ? 'flight-trail--running' : ''}`}
          style={{ width: `${x}%` }}
        />
        <div
          className={`glider ${finished ? 'glider--finished' : ''}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
        >
          <span className="glider__core" />
          <span className="glider__wing glider__wing--left" />
          <span className="glider__wing glider__wing--right" />
        </div>
        <div className="flight-grid" />
      </div>
    </div>
  );
}

