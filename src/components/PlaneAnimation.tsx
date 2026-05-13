interface PlaneAnimationProps {
  progress: number;
  running: boolean;
  finished: boolean;
  currentMultiplier: number;
  targetMultiplier: number | null;
}

function getFlightPosition(progress: number) {
  const x = 8 + progress * 82;
  const y =
    81 -
    Math.pow(progress, 0.72) * 58 -
    Math.sin(progress * Math.PI) * 6;

  return { x, y };
}

export function PlaneAnimation({
  progress,
  running,
  finished,
  currentMultiplier,
  targetMultiplier,
}: PlaneAnimationProps) {
  const { x, y } = getFlightPosition(progress);
  const statusLabel = running
    ? 'Самолет в полете'
    : finished
      ? 'Самолет взорвался'
      : 'Ожидает генерацию';

  return (
    <div className="arcade-stage arcade-stage--premium">
      <div className="arcade-stage__chrome">
        <div className="arcade-stage__status">
          <span className="arcade-stage__status-dot" />
          <span>{statusLabel}</span>
        </div>

        <div className="arcade-stage__target">
          <span>{targetMultiplier ? 'Точная точка' : 'Точка полета'}</span>
          <strong>
            {targetMultiplier ? `x${targetMultiplier.toFixed(2)}` : 'скрыта'}
          </strong>
        </div>
      </div>

      <div className="arcade-stage__arena">
        <div className="arcade-stage__glow arcade-stage__glow--gold" />
        <div className="arcade-stage__glow arcade-stage__glow--red" />
        <div className="arcade-stage__cloud arcade-stage__cloud--one" />
        <div className="arcade-stage__cloud arcade-stage__cloud--two" />
        <div className="arcade-stage__cloud arcade-stage__cloud--three" />
        <div className="arcade-stage__runway" />

        <svg
          className="arcade-stage__path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M 8 82 C 22 72, 34 58, 50 42 C 62 31, 76 20, 90 12"
            pathLength="100"
            className="arcade-stage__path-base"
          />
          <path
            d="M 8 82 C 22 72, 34 58, 50 42 C 62 31, 76 20, 90 12"
            pathLength="100"
            className="arcade-stage__path-active"
            style={{
              strokeDasharray: `${Math.max(progress * 100, running || finished ? 1 : 0)} 100`,
            }}
          />
        </svg>

        <div className="arcade-multiplier">
          <span className="arcade-multiplier__label">{statusLabel}</span>
          <strong>x{currentMultiplier.toFixed(2)}</strong>
        </div>

        <div
          className={`arcade-plane ${running ? 'arcade-plane--flying' : ''} ${
            finished ? 'arcade-plane--finished' : ''
          }`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
          }}
        >
          <span className="arcade-plane__shadow" />
          <span className="arcade-plane__tail-fin" />
          <span className="arcade-plane__tail-wing" />
          <span className="arcade-plane__body" />
          <span className="arcade-plane__stripe" />
          <span className="arcade-plane__cockpit cockpit-one" />
          <span className="arcade-plane__cockpit cockpit-two" />
          <span className="arcade-plane__cockpit cockpit-three" />
          <span className="arcade-plane__wing arcade-plane__wing--top" />
          <span className="arcade-plane__wing arcade-plane__wing--bottom" />
          <span className="arcade-plane__strut arcade-plane__strut--front" />
          <span className="arcade-plane__strut arcade-plane__strut--rear" />
          <span className="arcade-plane__engine" />
          <span className="arcade-plane__engine-ring" />
          <span className="arcade-plane__hub" />
          <span className="arcade-plane__propeller" />
        </div>

        {targetMultiplier ? (
          <div className="arcade-stage__target-beacon">
            <span>Фикс</span>
            <strong>x{targetMultiplier.toFixed(2)}</strong>
          </div>
        ) : null}

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
      </div>
    </div>
  );
}
