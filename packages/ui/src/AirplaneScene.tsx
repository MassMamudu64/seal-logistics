'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from './cn';

/**
 * AirplaneScene — atmospheric hero backdrop. NOT a cartoon airplane.
 *
 * The composition is layered like real cinematography:
 *   1. Deep navy gradient floor (sky depth)
 *   2. Horizon haze — soft orange→navy band suggesting dawn at altitude
 *   3. Light streaks — long thin beams angling up-right, mimicking jet glare
 *   4. Coordinate grid — faint isobar lines, suggesting flight planning charts
 *   5. Mid-distance city lights, pulsing
 *   6. Foreground vignette
 *
 * No literal airplane illustration — production logistics sites communicate
 * "we move cargo by air" through restraint, not cartoons. If you later drop in
 * licensed photography, set <AirplaneScene image="/hero/cargo-night.avif"/>
 * and the SVG layers will composite over it.
 */

type Props = {
  className?: string;
  /** Optional licensed photo URL — composites under the SVG layers. */
  image?: string | undefined;
};

export function AirplaneScene({ className, image }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax (bounded to a few dozen px — never enough to leave the frame).
  const hazeY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const streaksY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Optional photo backdrop */}
      {image && (
        // Plain <img> on purpose — Next/Image inside a workspace UI package adds
        // friction; the host site can wrap this with <Image fill> if desired.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          loading="eager"
        />
      )}

      {/* Layer 1 — deep navy floor with subtle radial */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="sky-deep" cx="50%" cy="100%" r="120%">
            <stop offset="0%" stopColor="#1a5d97" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#003B73" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000f24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="haze" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.22" />
            <stop offset="35%" stopColor="#0090c8" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#003B73" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="streak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2bbcec" stopOpacity="0" />
            <stop offset="50%" stopColor="#bfeafa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2bbcec" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#sky-deep)" />
      </svg>

      {/* Layer 2 — horizon haze */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={reduce ? {} : { y: hazeY }}
      >
        <rect y="500" width="1440" height="400" fill="url(#haze)" />
      </motion.svg>

      {/* Layer 3 — light streaks (long, thin, angled — like jet glare or flight paths) */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={reduce ? {} : { y: streaksY }}
      >
        <g>
          {STREAKS.map((s, i) => (
            <motion.line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="url(#streak)"
              strokeWidth={s.w}
              strokeLinecap="round"
              initial={reduce ? { opacity: s.o } : { opacity: 0, pathLength: 0 }}
              animate={{ opacity: s.o, pathLength: 1 }}
              transition={{
                duration: 1.8,
                delay: 0.3 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </g>
      </motion.svg>

      {/* Layer 4 — coordinate / latitude grid */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={reduce ? {} : { y: gridY }}
      >
        <g stroke="#2bbcec" strokeOpacity="0.10" fill="none">
          {[120, 240, 360, 480, 600, 720].map((y) => (
            <path key={y} d={`M 0 ${y} Q 720 ${y - 30} 1440 ${y}`} />
          ))}
        </g>
      </motion.svg>

      {/* Layer 5 — distant pulsing lights */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <CityLights />
      </svg>

      {/* Layer 6 — vignette */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="1440" height="900" fill="url(#vignette)" />
      </svg>
    </div>
  );
}

// Streak coordinates — long diagonals from lower-left toward upper-right,
// staggered so they read as multiple aircraft glares / contrails at altitude.
const STREAKS: { x1: number; y1: number; x2: number; y2: number; w: number; o: number }[] = [
  { x1: -100, y1: 720, x2: 900, y2: 80, w: 1.4, o: 0.55 },
  { x1: 200, y1: 780, x2: 1200, y2: 200, w: 1.0, o: 0.42 },
  { x1: 400, y1: 820, x2: 1400, y2: 320, w: 0.8, o: 0.35 },
  { x1: -200, y1: 620, x2: 700, y2: 40, w: 0.6, o: 0.25 },
  { x1: 600, y1: 880, x2: 1500, y2: 460, w: 0.8, o: 0.3 },
];

function CityLights() {
  const lights = [
    [120, 760],
    [240, 740],
    [340, 770],
    [460, 745],
    [560, 760],
    [680, 750],
    [820, 745],
    [940, 760],
    [1080, 750],
    [1220, 765],
    [1340, 745],
    [180, 260],
    [420, 180],
    [780, 120],
    [1120, 220],
    [1340, 160],
  ] as const;
  return (
    <g>
      {lights.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 4 === 0 ? 1.8 : 1.2}
          fill={i % 5 === 0 ? '#00A8E8' : '#bfeafa'}
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.85, 0.35] }}
          transition={{
            duration: 2.6 + (i % 4) * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i % 5) * 0.5,
          }}
        />
      ))}
    </g>
  );
}
