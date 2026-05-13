interface PlaneAnimationProps {
  progress: number;
  running: boolean;
  finished: boolean;
  currentMultiplier: number;
  targetMultiplier: number | null;
}

function getFlightPosition(progress: number) {
  const x = 10 + progress * 78;
  const y = 80 - Math.pow(progress, 0.58) * 60;

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

        <svg
          className="arcade-stage__path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="flightCurveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,245,220,0.18)" />
              <stop offset="46%" stopColor="#ff8a67" />
              <stop offset="100%" stopColor="#ffe08a" />
            </linearGradient>
          </defs>
          <path
            d="M 10 80 C 21 75, 32 67, 45 52 S 72 21, 88 11"
            pathLength="100"
            className="arcade-stage__path-base"
          />
          <path
            d="M 10 80 C 21 75, 32 67, 45 52 S 72 21, 88 11"
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
          <svg viewBox="0 0 280 150" className="arcade-plane__svg" aria-hidden="true">
            <defs>
              <linearGradient id="planeMainBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8664" />
                <stop offset="55%" stopColor="#da2a1d" />
                <stop offset="100%" stopColor="#9f1018" />
              </linearGradient>
              <linearGradient id="planeWingMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd667" />
                <stop offset="18%" stopColor="#ffbe28" />
                <stop offset="22%" stopColor="#f46a32" />
                <stop offset="100%" stopColor="#b4151e" />
              </linearGradient>
              <linearGradient id="planeGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c4f3ff" />
                <stop offset="100%" stopColor="#5caee8" />
              </linearGradient>
            </defs>

            <ellipse cx="124" cy="126" rx="84" ry="10" fill="rgba(0,0,0,0.15)" />

            <path
              d="M58 82 L186 80 C197 80 206 76 214 69 L230 54 L235 45 L229 38 L211 31 C201 27 193 26 182 26 L88 28 C70 28 56 34 44 46 L30 60 L24 72 L24 80 L35 84 Z"
              fill="url(#planeMainBody)"
            />
            <path
              d="M85 33 L178 33 C192 33 202 36 211 40"
              stroke="rgba(255,224,188,0.34)"
              strokeWidth="4"
              fill="none"
            />

            <path
              d="M78 13 L222 19 C228 20 232 23 232 28 C232 32 228 35 221 36 L81 36 C75 36 70 33 70 26 C70 19 74 14 78 13 Z"
              fill="url(#planeWingMetal)"
            />
            <path
              d="M60 95 L194 94 C200 94 205 97 205 101 C205 106 200 109 194 109 L62 109 C57 109 53 106 53 101 C53 97 56 95 60 95 Z"
              fill="url(#planeWingMetal)"
            />

            <path d="M96 35 L89 94" stroke="#a8631d" strokeWidth="6" />
            <path d="M126 36 L119 95" stroke="#a8631d" strokeWidth="6" />

            <path d="M48 27 L77 42 L77 86 L41 72 Z" fill="#c3161e" />
            <path d="M35 77 L74 80 L64 91 L33 88 Z" fill="#ac1119" />

            <rect x="100" y="38" width="16" height="17" rx="4" fill="url(#planeGlass)" />
            <rect x="120" y="38" width="16" height="17" rx="4" fill="url(#planeGlass)" />
            <rect x="140" y="38" width="16" height="17" rx="4" fill="url(#planeGlass)" />

            <circle cx="226" cy="53" r="29" fill="#efb61f" />
            <circle cx="226" cy="53" r="22" fill="#202020" />
            <circle cx="226" cy="53" r="7" fill="#ffcb54" />

            <g className="arcade-plane__propeller-group">
              <ellipse cx="226" cy="53" rx="10" ry="40" fill="rgba(28,28,28,0.44)" />
              <ellipse cx="226" cy="53" rx="40" ry="10" fill="rgba(28,28,28,0.22)" />
            </g>
          </svg>
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
      </div>
    </div>
  );
}
