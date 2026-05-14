import planeSignalSprite from '../assets/plane-signal.png';

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
  const assetPitchDegrees = -11;
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
              <stop offset="0%" stopColor="#f8a61b" />
              <stop offset="36%" stopColor="#ffc92f" />
              <stop offset="72%" stopColor="#ffe17b" />
              <stop offset="100%" stopColor="#fff2bf" />
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
            transform: `translate(-50%, -50%) rotate(${flightState.angle - assetPitchDegrees}deg) ${
              finished ? 'scale(0.96)' : ''
            }`,
          }}
        >
          <span className="arcade-plane__glow" aria-hidden="true" />
          <img
            src={planeSignalSprite}
            alt=""
            aria-hidden="true"
            className="arcade-plane__image"
            draggable={false}
          />
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
