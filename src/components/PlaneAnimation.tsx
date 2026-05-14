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

type Point = {
  x: number;
  y: number;
};

type FlightState = Point & {
  angle: number;
};

function cubicBezierPoint(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  return {
    x:
      mt2 * mt * p0.x +
      3 * mt2 * t * p1.x +
      3 * mt * t2 * p2.x +
      t2 * t * p3.x,
    y:
      mt2 * mt * p0.y +
      3 * mt2 * t * p1.y +
      3 * mt * t2 * p2.y +
      t2 * t * p3.y,
  };
}

function cubicBezierTangent(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  const mt = 1 - t;

  return {
    x:
      3 * mt * mt * (p1.x - p0.x) +
      6 * mt * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x),
    y:
      3 * mt * mt * (p1.y - p0.y) +
      6 * mt * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y),
  };
}

function angleFromTangent(tangent: Point) {
  return (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
}

const firstCurve = {
  p0: { x: 10, y: 80 },
  p1: { x: 21, y: 75 },
  p2: { x: 32, y: 67 },
  p3: { x: 45, y: 52 },
};

const secondCurve = {
  p0: { x: 45, y: 52 },
  p1: { x: 58, y: 37 },
  p2: { x: 72, y: 21 },
  p3: { x: 88, y: 11 },
};

function buildFlightPath() {
  const points: Array<FlightState & { length: number }> = [];
  let totalLength = 0;
  let previousPoint: Point | null = null;

  const appendCurve = (
    curve: typeof firstCurve,
    sampleCount: number,
    includeFirstPoint: boolean,
  ) => {
    for (let index = includeFirstPoint ? 0 : 1; index <= sampleCount; index += 1) {
      const t = index / sampleCount;
      const point = cubicBezierPoint(t, curve.p0, curve.p1, curve.p2, curve.p3);
      const tangent = cubicBezierTangent(t, curve.p0, curve.p1, curve.p2, curve.p3);

      if (previousPoint) {
        totalLength += Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
      }

      points.push({
        ...point,
        angle: angleFromTangent(tangent),
        length: totalLength,
      });

      previousPoint = point;
    }
  };

  appendCurve(firstCurve, 48, true);
  appendCurve(secondCurve, 64, false);

  return {
    totalLength,
    points,
  };
}

const flightPath = buildFlightPath();

function getFlightState(progress: number): FlightState {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const targetLength = flightPath.totalLength * clampedProgress;
  const points = flightPath.points;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];

    if (targetLength <= current.length) {
      const segmentLength = current.length - previous.length || 1;
      const localProgress = (targetLength - previous.length) / segmentLength;

      return {
        x: previous.x + (current.x - previous.x) * localProgress,
        y: previous.y + (current.y - previous.y) * localProgress,
        angle: previous.angle + (current.angle - previous.angle) * localProgress,
      };
    }
  }

  const lastPoint = points[points.length - 1];

  return {
    x: lastPoint.x,
    y: lastPoint.y,
    angle: lastPoint.angle,
  };
}

export function PlaneAnimation({
  copy,
  progress,
  running,
  finished,
  currentMultiplier,
  targetMultiplier,
}: PlaneAnimationProps) {
  const flightState = getFlightState(progress);
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
            left: `${flightState.x}%`,
            top: `${flightState.y}%`,
            transform: `translate(-50%, -50%) rotate(${flightState.angle}deg) ${
              finished ? 'scale(0.96)' : ''
            }`,
          }}
        >
          <svg viewBox="0 0 420 240" className="arcade-plane__svg" aria-hidden="true">
            <defs>
              <linearGradient id="planeYellowPaint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff39d" />
                <stop offset="18%" stopColor="#ffd94f" />
                <stop offset="58%" stopColor="#ffc107" />
                <stop offset="100%" stopColor="#d98f00" />
              </linearGradient>
              <linearGradient id="planeDarkPaint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#45474d" />
                <stop offset="40%" stopColor="#17181b" />
                <stop offset="100%" stopColor="#050506" />
              </linearGradient>
              <linearGradient id="planeGlassPaint" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f7fcff" />
                <stop offset="24%" stopColor="#a8c8ea" />
                <stop offset="100%" stopColor="#1f3147" />
              </linearGradient>
            </defs>

            <ellipse cx="188" cy="204" rx="126" ry="12" fill="rgba(0,0,0,0.18)" />

            <path
              d="M64 173 C84 159 116 147 165 128 C219 108 263 89 301 70 C327 56 351 40 372 24 L386 25 L388 35 L377 52 C360 77 338 98 307 117 C277 136 236 153 182 171 L123 191 C100 199 81 202 68 198 C59 195 57 185 64 173 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M184 133 C231 113 272 93 303 70 C329 52 353 37 374 24 L384 25 L383 34 C377 49 365 64 347 79 C324 99 293 118 254 135 C228 146 197 155 161 162 Z"
              fill="url(#planeDarkPaint)"
            />

            <path
              d="M82 187 C122 174 177 161 248 149 L257 170 C194 180 137 193 86 208 C77 211 69 208 67 201 C65 194 70 191 82 187 Z"
              fill="url(#planeDarkPaint)"
            />

            <path
              d="M128 109 C170 90 210 76 252 66 C269 62 284 63 295 71 C303 76 303 84 296 88 C287 93 275 99 259 105 C218 119 178 136 137 157 C128 161 117 157 113 147 C109 137 114 125 128 109 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M123 169 C166 155 212 145 262 140 C273 139 282 144 282 151 C282 159 274 164 261 167 C215 177 169 192 123 213 C111 219 100 215 96 205 C91 193 100 179 123 169 Z"
              fill="url(#planeYellowPaint)"
            />

            <path
              d="M170 114 C190 90 213 74 240 67 C262 61 278 65 291 79 C301 90 298 101 283 107 L230 118 Z"
              fill="url(#planeGlassPaint)"
            />
            <path
              d="M206 83 C211 99 219 109 229 117"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M244 72 C247 86 253 96 262 104"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M70 170 C47 159 35 145 35 126 C35 111 44 98 63 86 L91 70 L99 74 L91 98 C84 121 84 145 95 166 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M33 197 C20 191 16 180 22 170 C29 160 41 154 60 152 L98 149 L95 165 C92 180 82 193 65 199 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M82 157 C71 147 65 132 66 113"
              stroke="rgba(18,18,18,0.68)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            <path
              d="M268 95 C286 94 302 97 318 105 C324 108 324 114 315 117 C303 121 290 124 278 125 C268 126 262 122 260 115 C258 107 260 99 268 95 Z"
              fill="rgba(0,0,0,0.18)"
            />

            <circle cx="382" cy="33" r="28" fill="#0f1012" />
            <circle cx="382" cy="33" r="20" fill="url(#planeDarkPaint)" />
            <circle cx="382" cy="33" r="34" fill="none" stroke="url(#planeYellowPaint)" strokeWidth="11" />
            <circle cx="382" cy="33" r="8" fill="#111214" />

            <g className="arcade-plane__propeller-group">
              <ellipse cx="382" cy="33" rx="11" ry="62" fill="rgba(42,42,42,0.44)" />
              <ellipse cx="382" cy="33" rx="62" ry="11" fill="rgba(42,42,42,0.18)" />
            </g>
          </svg>
        </div>

        {finished ? (
          <div
            className="arcade-burst"
            style={{
              left: `${flightState.x}%`,
              top: `${flightState.y}%`,
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
