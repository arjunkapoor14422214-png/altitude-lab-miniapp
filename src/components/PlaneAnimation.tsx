interface PlaneAnimationProps {
  progress: number;
  running: boolean;
  finished: boolean;
  currentMultiplier: number;
  targetMultiplier: number | null;
}

function getFlightPosition(progress: number) {
  const x = 10 + progress * 78;
  const y = 80 - Math.pow(progress, 0.62) * 57;

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
          <strong>{targetMultiplier ? `x${targetMultiplier.toFixed(2)}` : 'скрыта'}</strong>
        </div>
      </div>

      <div className="arcade-stage__arena">
        <div className="arcade-stage__glow arcade-stage__glow--gold" />
        <div className="arcade-stage__glow arcade-stage__glow--red" />
        <div className="arcade-stage__cloud arcade-stage__cloud--one" />
        <div className="arcade-stage__cloud arcade-stage__cloud--two" />
        <div className="arcade-stage__cloud arcade-stage__cloud--three" />

        <svg
          className="arcade-stage__path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flightCurveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="35%" stopColor="#ff675d" />
              <stop offset="100%" stopColor="#ffd96a" />
            </linearGradient>
          </defs>
          <path
            d="M 10 80 C 20 74, 31 64, 44 50 C 56 37, 71 22, 88 11"
            pathLength="100"
            className="arcade-stage__path-base"
          />
          <path
            d="M 10 80 C 20 74, 31 64, 44 50 C 56 37, 71 22, 88 11"
            pathLength="100"
            className="arcade-stage__path-active"
            stroke="url(#flightCurveGradient)"
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
          <svg viewBox="0 0 260 160" className="arcade-plane__svg" aria-hidden="true">
            <defs>
              <linearGradient id="planeBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7a5a" />
                <stop offset="55%" stopColor="#da2418" />
                <stop offset="100%" stopColor="#a70f17" />
              </linearGradient>
              <linearGradient id="planeWingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd85a" />
                <stop offset="22%" stopColor="#ffb21e" />
                <stop offset="24%" stopColor="#f1572f" />
                <stop offset="100%" stopColor="#b90f1c" />
              </linearGradient>
              <linearGradient id="planeWindowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b9f0ff" />
                <stop offset="100%" stopColor="#5ca9ea" />
              </linearGradient>
            </defs>

            <ellipse cx="116" cy="131" rx="76" ry="12" fill="rgba(0,0,0,0.18)" />

            <path
              d="M56 89 L180 87 C190 87 198 83 205 76 L216 66 L224 54 L226 47 L219 41 L203 34 C195 31 189 30 182 30 L80 31 C64 31 48 37 37 49 L29 57 L20 72 L20 81 L28 88 Z"
              fill="url(#planeBodyGradient)"
            />
            <path
              d="M83 37 L178 37 C185 37 194 40 201 43"
              stroke="rgba(255,230,190,0.34)"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M141 88 L165 88 C177 88 187 84 198 76"
              stroke="#ffcf52"
              strokeWidth="7"
              fill="none"
            />

            <path
              d="M76 16 L212 24 C216 25 219 27 219 31 C219 35 216 38 211 39 L80 39 C73 39 68 34 68 28 C68 21 72 17 76 16 Z"
              fill="url(#planeWingGradient)"
            />
            <path
              d="M58 103 L186 102 C192 102 196 104 196 109 C196 113 192 116 186 116 L63 116 C57 116 53 112 53 108 C53 105 55 103 58 103 Z"
              fill="url(#planeWingGradient)"
            />

            <path d="M95 40 L88 101" stroke="#b46513" strokeWidth="7" />
            <path d="M123 40 L116 101" stroke="#b46513" strokeWidth="7" />
            <path d="M146 40 L140 101" stroke="#b46513" strokeWidth="7" />

            <path d="M38 28 L66 44 L66 92 L34 75 Z" fill="#c9131d" />
            <path d="M26 83 L70 86 L57 98 L24 95 Z" fill="#b10f1a" />

            <rect x="96" y="43" width="16" height="18" rx="4" fill="url(#planeWindowGradient)" />
            <rect x="116" y="43" width="16" height="18" rx="4" fill="url(#planeWindowGradient)" />
            <rect x="136" y="43" width="16" height="18" rx="4" fill="url(#planeWindowGradient)" />

            <circle cx="216" cy="60" r="30" fill="#f1b217" />
            <circle cx="216" cy="60" r="23" fill="#212121" />
            <circle cx="216" cy="60" r="8" fill="#ffbf36" />

            <g className="arcade-plane__propeller-group">
              <ellipse cx="216" cy="60" rx="10" ry="42" fill="rgba(40,40,40,0.42)" />
              <ellipse cx="216" cy="60" rx="42" ry="10" fill="rgba(40,40,40,0.26)" />
            </g>
          </svg>
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
