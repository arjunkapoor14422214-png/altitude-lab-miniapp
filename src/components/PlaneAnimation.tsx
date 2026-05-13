interface PlaneAnimationProps {
  copy: {
    waitingStatus: string;
    flyingStatus: string;
    explodedStatus: string;
    exactPoint: string;
    flightPoint: string;
    hidden: string;
  };
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
  copy,
  progress,
  running,
  finished,
  currentMultiplier,
  targetMultiplier,
}: PlaneAnimationProps) {
  const { x, y } = getFlightPosition(progress);
  const statusLabel = running
    ? copy.flyingStatus
    : finished
      ? copy.explodedStatus
      : copy.waitingStatus;

  return (
    <div className="arcade-stage arcade-stage--premium">
      <div className="arcade-stage__chrome">
        <div className="arcade-stage__status">
          <span className="arcade-stage__status-dot" />
          <span>{statusLabel}</span>
        </div>

        <div className="arcade-stage__target">
          <span>{targetMultiplier ? copy.exactPoint : copy.flightPoint}</span>
          <strong>{targetMultiplier ? `x${targetMultiplier.toFixed(2)}` : copy.hidden}</strong>
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
          <svg viewBox="0 0 320 180" className="arcade-plane__svg" aria-hidden="true">
            <defs>
              <linearGradient id="planeBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8f6e" />
                <stop offset="42%" stopColor="#e13a24" />
                <stop offset="100%" stopColor="#93101c" />
              </linearGradient>
              <linearGradient id="planeWingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd873" />
                <stop offset="14%" stopColor="#ffc52d" />
                <stop offset="28%" stopColor="#f77a2f" />
                <stop offset="100%" stopColor="#bc181d" />
              </linearGradient>
              <linearGradient id="planeCanopyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d8f6ff" />
                <stop offset="100%" stopColor="#5ca8eb" />
              </linearGradient>
              <linearGradient id="planeWheelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#0d0d0d" />
              </linearGradient>
            </defs>

            <ellipse cx="150" cy="152" rx="88" ry="11" fill="rgba(0,0,0,0.18)" />

            <path
              d="M66 102 C80 92 102 83 133 80 L194 74 C222 71 246 70 260 64 C274 58 284 51 292 42 L300 36 L308 40 L306 49 L297 61 C290 70 282 78 270 84 C252 92 224 96 194 99 L135 105 C109 108 87 111 69 118 L58 122 L50 118 L54 109 Z"
              fill="url(#planeBodyGradient)"
            />
            <path
              d="M95 86 C118 80 150 75 199 70"
              stroke="rgba(255,236,204,0.34)"
              strokeWidth="5"
              fill="none"
            />

            <path
              d="M102 46 C138 36 184 30 242 29 C252 29 258 33 258 38 C258 44 250 48 238 49 C184 53 139 59 104 71 C96 73 88 69 86 63 C84 56 90 49 102 46 Z"
              fill="url(#planeWingGradient)"
            />
            <path
              d="M108 106 C147 100 187 97 232 96 C241 96 246 100 246 105 C246 110 240 114 229 115 C192 118 154 124 116 132 C107 134 99 130 96 124 C93 117 98 110 108 106 Z"
              fill="url(#planeWingGradient)"
            />

            <path d="M128 60 L122 111" stroke="#9c5c16" strokeWidth="7" strokeLinecap="round" />
            <path d="M165 55 L156 116" stroke="#9c5c16" strokeWidth="7" strokeLinecap="round" />
            <path d="M136 60 L165 55" stroke="#8f4b13" strokeWidth="5" strokeLinecap="round" />
            <path d="M122 111 L156 116" stroke="#8f4b13" strokeWidth="5" strokeLinecap="round" />

            <path
              d="M62 80 C52 68 50 55 57 46 L68 35 L80 38 L76 52 C74 61 75 72 81 83 Z"
              fill="#bd171c"
            />
            <path
              d="M58 110 C46 110 39 104 38 96 C37 88 44 82 57 80 L86 77 L87 89 C88 98 79 107 67 109 Z"
              fill="#9d1119"
            />

            <path
              d="M142 72 C149 60 161 55 177 54 C190 53 201 58 208 67 L184 74 L152 78 Z"
              fill="url(#planeCanopyGradient)"
            />
            <path d="M164 56 L168 76" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
            <path d="M184 55 L188 72" stroke="rgba(255,255,255,0.26)" strokeWidth="2.5" />

            <path
              d="M81 119 L110 118 L102 139 L78 139 Z"
              fill="#c01a21"
            />
            <path
              d="M88 138 L83 150"
              stroke="#8e5312"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M108 137 L104 150"
              stroke="#8e5312"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="82" cy="152" r="8" fill="url(#planeWheelGradient)" />
            <circle cx="104" cy="152" r="8" fill="url(#planeWheelGradient)" />

            <circle cx="290" cy="50" r="24" fill="#efb61f" />
            <circle cx="290" cy="50" r="18" fill="#202020" />
            <circle cx="290" cy="50" r="6" fill="#ffcb54" />

            <g className="arcade-plane__propeller-group">
              <ellipse cx="290" cy="50" rx="9" ry="44" fill="rgba(28,28,28,0.42)" />
              <ellipse cx="290" cy="50" rx="44" ry="9" fill="rgba(28,28,28,0.22)" />
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
