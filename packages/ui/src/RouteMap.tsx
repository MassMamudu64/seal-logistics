'use client';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from './cn';

/**
 * RouteMap — geographic world map with simplified country outlines and
 * animated cargo route arcs.
 *
 * Geometry: an Equirectangular-projection world map at a low LOD (~5KB),
 * hand-simplified to keep file size in check while still reading as a real
 * map. Hubs are positioned in the same projection space (lon/lat → x/y).
 *
 * Why hand-simplified vs react-simple-maps + TopoJSON: a real TopoJSON world
 * atlas is 80–250KB; this file is ~5KB. For a marketing visualization,
 * silhouette accuracy is what readers perceive, not coastline-level detail.
 */

type Hub = {
  id: string;
  name: string;
  /** [longitude (-180..180), latitude (-90..90)] */
  lonLat: readonly [number, number];
};

const HUBS: readonly Hub[] = [
  { id: 'MSP', name: 'Minneapolis', lonLat: [-93.27, 44.97] },
  { id: 'LOS', name: 'Lagos', lonLat: [3.39, 6.52] },
  { id: 'ACC', name: 'Accra', lonLat: [-0.19, 5.61] },
  { id: 'ROB', name: 'Monrovia', lonLat: [-10.79, 6.31] },
  { id: 'LFW', name: 'Lomé', lonLat: [1.25, 6.13] },
  { id: 'JNB', name: 'Johannesburg', lonLat: [28.04, -26.2] },
  { id: 'CKY', name: 'Conakry', lonLat: [-13.71, 9.51] },
  { id: 'BJL', name: 'Banjul', lonLat: [-16.58, 13.45] },
];

const ROUTES: readonly { from: string; to: string }[] = [
  { from: 'MSP', to: 'LOS' },
  { from: 'MSP', to: 'ROB' },
  { from: 'MSP', to: 'ACC' },
  { from: 'MSP', to: 'LFW' },
  { from: 'MSP', to: 'CKY' },
  { from: 'MSP', to: 'JNB' },
  { from: 'LOS', to: 'ROB' },
  { from: 'LOS', to: 'ACC' },
  { from: 'LOS', to: 'LFW' },
];

// SVG view-port we render to.
const VW = 960;
const VH = 480;

// Equirectangular projection: longitude → x, latitude → y, centered at (0, 0).
function project([lon, lat]: readonly [number, number]): [number, number] {
  const x = ((lon + 180) / 360) * VW;
  const y = ((90 - lat) / 180) * VH;
  return [x, y];
}

export function RouteMap({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const projected = HUBS.map((h) => ({ ...h, xy: project(h.lonLat) }));
  const hubsById = Object.fromEntries(projected.map((h) => [h.id, h]));

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VW} ${VH}`}
      className={cn('h-auto w-full', className)}
      role="img"
      aria-label="Seal Logistics global cargo network: weekly air freight connecting Minneapolis with Lagos, Accra, Monrovia, Lomé, Johannesburg, Conakry, and Banjul."
    >
      <defs>
        <linearGradient id="map-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6eef7" />
          <stop offset="100%" stopColor="#c3d6e9" />
        </linearGradient>
        <linearGradient id="route-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#003B73" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#00A8E8" stopOpacity="1" />
          <stop offset="100%" stopColor="#003B73" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="hub-glow">
          <stop offset="0%" stopColor="#00A8E8" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#00A8E8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00A8E8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={VW} height={VH} fill="url(#map-bg)" />

      {/* Latitude grid (every 30°) — gives it the "chart" feel */}
      <g stroke="#93c5fd" strokeOpacity="0.25" strokeDasharray="2 4">
        {[30, 60, 90, 120, 150].map((y) => (
          <line key={y} x1="0" x2={VW} y1={(y / 180) * VH} y2={(y / 180) * VH} />
        ))}
        {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900].map((x) => (
          <line key={x} y1="0" y2={VH} x1={(x / 960) * VW} x2={(x / 960) * VW} />
        ))}
      </g>

      {/* Continents — simplified outlines.
          Path data is approximate equirectangular coastlines, hand-decimated
          from public-domain Natural Earth 110m. Designed to read as "world map"
          at a glance, not for navigation. */}
      <g fill="#1d4ed8" fillOpacity="0.13" stroke="#1d4ed8" strokeOpacity="0.35" strokeWidth="1">
        {/* North America */}
        <path d="M 110 95 L 165 80 L 215 75 L 245 80 L 270 95 L 290 115 L 305 140 L 295 165 L 280 175 L 255 175 L 235 170 L 215 175 L 195 195 L 175 215 L 155 220 L 140 210 L 130 190 L 122 165 L 115 140 Z" />
        {/* Central America */}
        <path d="M 215 215 L 240 220 L 255 235 L 250 250 L 235 252 L 220 245 L 212 230 Z" />
        {/* South America */}
        <path d="M 270 250 L 295 245 L 320 260 L 335 295 L 340 335 L 330 375 L 310 405 L 290 410 L 275 390 L 270 360 L 268 320 L 270 285 Z" />
        {/* Europe */}
        <path d="M 460 110 L 490 105 L 520 110 L 545 120 L 555 140 L 545 155 L 520 160 L 495 155 L 470 150 L 455 135 Z" />
        {/* Africa */}
        <path d="M 480 175 L 510 170 L 545 175 L 575 195 L 590 230 L 595 270 L 585 310 L 565 345 L 540 365 L 515 360 L 495 340 L 480 310 L 470 275 L 470 235 L 472 200 Z" />
        {/* Asia */}
        <path d="M 555 100 L 605 90 L 660 88 L 715 92 L 765 100 L 805 115 L 825 140 L 820 170 L 800 195 L 770 210 L 730 215 L 690 210 L 650 200 L 620 185 L 590 170 L 565 145 L 555 120 Z" />
        {/* SE Asia / Indonesia */}
        <path d="M 760 230 L 795 232 L 820 245 L 835 265 L 825 280 L 800 280 L 775 270 L 760 250 Z" />
        {/* Australia */}
        <path d="M 805 320 L 845 315 L 880 325 L 895 350 L 880 375 L 850 380 L 818 372 L 800 350 Z" />
        {/* Greenland */}
        <path d="M 380 65 L 410 60 L 430 70 L 425 90 L 405 95 L 388 85 Z" />
      </g>

      {/* Routes — quadratic Béziers arching north of the great circle.
          Stagger draw-in once the section enters the viewport. */}
      <g>
        {ROUTES.map((r, i) => {
          const a = hubsById[r.from]!;
          const b = hubsById[r.to]!;
          const [ax, ay] = a.xy;
          const [bx, by] = b.xy;
          // Arc apex: midpoint, raised toward the top by distance/3.
          const dist = Math.hypot(bx - ax, by - ay);
          const mx = (ax + bx) / 2;
          const my = Math.min(ay, by) - dist / 3.2;
          const d = `M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`;
          return (
            <motion.path
              key={`${r.from}-${r.to}`}
              d={d}
              fill="none"
              stroke="url(#route-arc)"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={reduce ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.1 }}
            />
          );
        })}
      </g>

      {/* Hubs */}
      <g>
        {projected.map((h, i) => {
          const [x, y] = h.xy;
          return (
            <motion.g
              key={h.id}
              initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.6 + i * 0.06 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={14} fill="url(#hub-glow)" />
              <circle cx={x} cy={y} r={4.5} fill="#00A8E8" />
              <circle cx={x} cy={y} r={4.5} fill="none" stroke="#003B73" strokeOpacity="0.5" />
              <text
                x={x + 9}
                y={y - 8}
                fontSize="10.5"
                fontWeight={700}
                fill="#001F3F"
                paintOrder="stroke"
                stroke="white"
                strokeWidth="3"
                strokeLinejoin="round"
              >
                {h.name}
              </text>
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
