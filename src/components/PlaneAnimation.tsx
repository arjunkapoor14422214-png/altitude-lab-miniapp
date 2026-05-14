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
          <svg viewBox="0 0 360 210" className="arcade-plane__svg" aria-hidden="true">
            <defs>
              <linearGradient id="planeYellowPaint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff08b" />
                <stop offset="22%" stopColor="#ffd53f" />
                <stop offset="65%" stopColor="#ffc400" />
                <stop offset="100%" stopColor="#de9600" />
              </linearGradient>
              <linearGradient id="planeDarkPaint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b3b3f" />
                <stop offset="40%" stopColor="#111214" />
                <stop offset="100%" stopColor="#050506" />
              </linearGradient>
              <linearGradient id="planeGlassPaint" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f7fcff" />
                <stop offset="35%" stopColor="#93b6db" />
                <stop offset="100%" stopColor="#223752" />
              </linearGradient>
            </defs>

            <ellipse cx="156" cy="178" rx="98" ry="12" fill="rgba(0,0,0,0.16)" />

            <path
              d="M38 145 C66 134 102 122 154 106 C188 95 218 86 245 74 C270 63 296 48 324 30 L332 32 L332 42 L323 54 C305 77 284 95 258 107 C234 118 201 128 155 139 L102 151 C75 157 55 160 42 158 C35 157 32 151 38 145 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M146 109 C188 97 226 87 249 76 C274 64 301 48 322 32 L328 33 L326 40 C322 51 311 63 295 76 C277 90 255 102 228 112 C202 121 170 129 132 137 Z"
              fill="url(#planeDarkPaint)"
            />

            <path
              d="M68 146 C102 136 146 124 203 112 L211 129 C161 138 114 149 72 162 C64 164 58 162 56 156 C54 151 58 148 68 146 Z"
              fill="url(#planeDarkPaint)"
            />

            <path
              d="M111 86 C144 74 182 62 224 54 C241 51 260 50 274 52 C281 53 285 58 284 64 C283 70 276 74 267 76 C228 84 191 95 153 110 C145 113 136 111 130 106 C123 100 123 91 111 86 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M101 138 C140 126 185 116 229 110 C238 109 245 114 245 120 C245 126 239 131 230 133 C190 142 149 154 110 169 C101 173 91 169 88 162 C84 154 90 145 101 138 Z"
              fill="url(#planeYellowPaint)"
            />

            <path
              d="M130 108 C150 90 170 78 194 72 C212 68 225 71 234 82 C239 88 238 93 231 96 L184 106 Z"
              fill="url(#planeGlassPaint)"
            />
            <path
              d="M156 85 C162 97 169 104 178 108"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M188 75 C193 88 198 95 205 101"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M44 136 C31 129 25 118 28 106 C31 94 42 85 59 78 L73 72 L79 75 L73 87 C66 101 64 115 68 130 Z"
              fill="url(#planeYellowPaint)"
            />
            <path
              d="M22 155 C15 149 13 141 18 133 C23 126 31 122 45 121 L74 118 L73 130 C72 141 64 149 50 153 Z"
              fill="url(#planeYellowPaint)"
            />

            <path
              d="M232 98 C244 95 254 95 262 99 C267 102 266 107 259 111 C252 115 243 118 233 119 C229 120 227 118 226 114 C225 109 227 102 232 98 Z"
              fill="url(#planeYellowPaint)"
            />

            <circle cx="323" cy="39" r="25" fill="#0f1012" />
            <circle cx="323" cy="39" r="18" fill="url(#planeDarkPaint)" />
            <circle cx="323" cy="39" r="30" fill="none" stroke="url(#planeYellowPaint)" strokeWidth="10" />
            <circle cx="323" cy="39" r="7" fill="#111214" />

            <g className="arcade-plane__propeller-group">
              <ellipse cx="323" cy="39" rx="11" ry="56" fill="rgba(42,42,42,0.44)" />
              <ellipse cx="323" cy="39" rx="56" ry="11" fill="rgba(42,42,42,0.18)" />
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
