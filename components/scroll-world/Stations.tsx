import { seeded } from "./scene-utils";

export function HangerRail({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-420" y="-58" width="840" height="12" rx="6" fill="url(#sw-steel)" />
      <rect x="-430" y="-70" width="16" height="36" rx="6" fill="#d9ccbf" />
      <rect x="414" y="-70" width="16" height="36" rx="6" fill="#d9ccbf" />
      <g data-sw="hanger">
        <path d="M0 -52 q0 -2 0 0 M0 -48 c-14 0 -16 -18 -2 -20 c12 -2 16 10 8 18 L0 0" stroke="#c9bdb2" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M0 0 L-118 44 Q-128 50 -118 54 L118 54 Q128 50 118 44 Z" fill="none" stroke="#d1a07a" strokeWidth="9" strokeLinejoin="round" />
      </g>
    </g>
  );
}

export function IroningStation({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="190" rx="300" ry="18" fill="#b98f6c" opacity="0.16" />
      <path d="M-200 60 L140 190 M200 60 L-140 190" stroke="#cbbcae" strokeWidth="12" strokeLinecap="round" />
      <path d="M-330 -110 H220 Q360 -110 360 0 Q360 110 220 110 H-330 Q-360 110 -360 80 V-80 Q-360 -110 -330 -110 Z" fill="url(#sw-board)" stroke="#eadfd6" strokeWidth="3" />
      <path d="M-330 -94 H216 Q340 -94 340 0 Q340 94 216 94 H-330" fill="none" stroke="#ffd2b0" strokeWidth="3" strokeDasharray="10 12" />
    </g>
  );
}

export function SteamIron({ puffs }: { puffs: number }) {
  const rand = seeded(91);
  return (
    <g data-sw="iron">
      <g data-sw="steam" opacity="0">
        {Array.from({ length: puffs }, (_, i) => (
          <circle
            key={i}
            cx={-60 + rand() * 120}
            cy={-70 - rand() * 20}
            r={10 + rand() * 12}
            fill="#ffffff"
            opacity="0.85"
            style={{ animation: `rise ${1.6 + rand() * 1.2}s ease-out ${rand() * 1.5}s infinite`, transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>
      <ellipse cx="0" cy="34" rx="110" ry="12" fill="#7d5a3e" opacity="0.18" />
      <path d="M-110 20 Q-100 -40 -20 -52 L80 -52 Q120 -52 120 -20 L120 20 Z" fill="url(#sw-iron)" />
      <path d="M-112 22 H122 V30 Q122 36 114 36 H-104 Q-112 36 -112 28 Z" fill="#cfd6de" />
      <path d="M-20 -52 Q-10 -96 40 -96 H74 Q98 -96 98 -72 V-52" fill="none" stroke="#2a2f36" strokeWidth="14" strokeLinecap="round" />
      <circle cx="58" cy="-14" r="9" fill="#ffffff" opacity="0.8" />
    </g>
  );
}

export function QualityTable({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="200" rx="420" ry="20" fill="#b98f6c" opacity="0.16" />
      <rect x="-430" y="-150" width="860" height="300" rx="34" fill="url(#sw-table)" stroke="#eadfd6" strokeWidth="3" />
      <rect x="-400" y="-122" width="800" height="244" rx="24" fill="none" stroke="#f1e1d3" strokeWidth="2" />
      <g data-sw="qc-lamp">
        <path d="M-300 -520 V-420 Q-300 -400 -280 -400 H-120" stroke="#cbbcae" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M-160 -420 H-60 L-40 -380 H-180 Z" fill="#2a2f36" />
      </g>
    </g>
  );
}

export function PackingStation({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="250" rx="420" ry="20" fill="#b98f6c" opacity="0.16" />
      <rect x="-430" y="140" width="860" height="40" rx="20" fill="url(#sw-table)" stroke="#eadfd6" strokeWidth="3" />
    </g>
  );
}

/** Clear garment pack with a branded seal; centred on (0,0). */
export function GarmentPack() {
  return (
    <g data-sw="pack" opacity="0">
      <rect x="-128" y="-100" width="256" height="200" rx="22" fill="#ffffff" fillOpacity="0.35" stroke="#ffffff" strokeWidth="4" />
      <rect x="-128" y="-100" width="256" height="200" rx="22" fill="none" stroke="#d9c8b8" strokeWidth="2" />
      <path d="M-110 -80 L-60 -92" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      <rect x="-128" y="-108" width="256" height="20" rx="8" fill="#ff6a00" opacity="0.9" />
      <g data-sw="pack-seal">
        <circle cx="82" cy="58" r="30" fill="#ff6a00" />
        <circle cx="82" cy="58" r="24" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" />
        <text x="82" y="64" textAnchor="middle" fontSize="16" fontWeight="800" fill="#ffffff" fontFamily="var(--font-sans)">
          R&amp;R
        </text>
      </g>
    </g>
  );
}

/** Branded delivery tote; origin at its opening centre. */
export function DeliveryBag() {
  return (
    <g data-sw="bag">
      <ellipse cx="0" cy="306" rx="200" ry="16" fill="#7d5a3e" opacity="0.16" />
      <path d="M-90 0 Q-90 -110 0 -110 Q90 -110 90 0" fill="none" stroke="#c94b00" strokeWidth="18" strokeLinecap="round" />
      <path d="M-180 0 H180 L160 300 Q158 310 148 310 H-148 Q-158 310 -160 300 Z" fill="url(#sw-bag)" />
      <path d="M-180 0 H180 V26 H-180 Z" fill="#c94b00" opacity="0.5" />
      <text x="0" y="150" textAnchor="middle" fontSize="34" fontWeight="800" fill="#ffffff" letterSpacing="2" fontFamily="var(--font-display)">
        RINSE &amp; RISE
      </text>
      <text x="0" y="186" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ffffff" opacity="0.8" letterSpacing="6" fontFamily="var(--font-sans)">
        LAUNDRYRITE
      </text>
    </g>
  );
}

export function StationDefs() {
  return (
    <>
      <linearGradient id="sw-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f2ede8" />
        <stop offset="1" stopColor="#cdbfb2" />
      </linearGradient>
      <linearGradient id="sw-board" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#fbefe5" />
      </linearGradient>
      <linearGradient id="sw-table" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f6ebe1" />
      </linearGradient>
      <linearGradient id="sw-iron" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff8a3d" />
        <stop offset="1" stopColor="#e95700" />
      </linearGradient>
      <linearGradient id="sw-bag" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff8a3d" />
        <stop offset="0.6" stopColor="#ff6a00" />
        <stop offset="1" stopColor="#e95700" />
      </linearGradient>
      <linearGradient id="sw-light" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff3c4" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff3c4" stopOpacity="0.85" />
        <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="sw-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffb27a" stopOpacity="0.45" />
        <stop offset="1" stopColor="#ffb27a" stopOpacity="0" />
      </radialGradient>
    </>
  );
}
