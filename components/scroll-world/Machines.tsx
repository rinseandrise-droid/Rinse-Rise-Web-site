import { Garment } from "./Garment";
import { seeded } from "./scene-utils";

const DRUM_R = 134;

function DrumHoles({ seed }: { seed: number }) {
  const rand = seeded(seed);
  const holes = [];
  for (let ring = 1; ring <= 4; ring += 1) {
    const r = ring * 30;
    const count = ring * 8;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + rand() * 0.2;
      holes.push(<circle key={`${ring}-${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={2.6} fill="#9aa6b4" opacity="0.55" />);
    }
  }
  return <>{holes}</>;
}

/** Rising bubbles: continuous CSS motion; their visibility is scroll-controlled by the parent group. */
export function Bubbles({ count, seed, spread = 120, color = "#ffffff" }: { count: number; seed: number; spread?: number; color?: string }) {
  const rand = seeded(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = (rand() - 0.5) * spread * 2;
        const y = 40 + rand() * 90;
        const r = 4 + rand() * 9;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={color}
            fillOpacity="0.55"
            stroke="#ffffff"
            strokeOpacity="0.9"
            strokeWidth="1.5"
            style={{
              animation: `rise ${2.2 + rand() * 2.2}s ease-in ${rand() * 2.5}s infinite`,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
        );
      })}
    </>
  );
}

function MachineBody({ variant }: { variant: "washer" | "dryer" }) {
  const accent = variant === "washer" ? "#ff6a00" : "#e95700";
  return (
    <>
      <ellipse cx="0" cy="274" rx="250" ry="22" fill="#b98f6c" opacity="0.18" />
      <rect x="-232" y="-302" width="464" height="566" rx="38" fill="url(#sw-machine)" stroke="#eadfd6" strokeWidth="2" />
      <rect x="-232" y="-302" width="464" height="96" rx="38" fill="url(#sw-panel)" />
      <rect x="-232" y="-232" width="464" height="26" fill="url(#sw-panel)" />
      <line x1="-232" y1="-206" x2="232" y2="-206" stroke="#eadfd6" strokeWidth="2" />
      <rect x="-190" y="-276" width="150" height="44" rx="12" fill="#1f2328" />
      <text x="-115" y="-247" textAnchor="middle" fontSize="20" fontWeight="800" fill={accent} letterSpacing="3" fontFamily="var(--font-sans)">
        {variant === "washer" ? "WASH" : "DRY"}
      </text>
      <circle cx="150" cy="-254" r="26" fill="#ffffff" stroke="#e3d6cb" strokeWidth="3" />
      <circle cx="150" cy="-254" r="8" fill={accent} />
      <circle cx="82" cy="-254" r="7" fill={accent} opacity="0.85" />
      <circle cx="54" cy="-254" r="7" fill="#e3d6cb" />
      {variant === "dryer" && (
        <g stroke="#e3d6cb" strokeWidth="5" strokeLinecap="round">
          {[-150, -120, -90, 90, 120, 150].map((x) => (
            <line key={x} x1={x} y1="214" x2={x} y2="244" />
          ))}
        </g>
      )}
      <circle cx="0" cy="0" r="176" fill="#f3ece5" stroke="#e6dacf" strokeWidth="3" />
    </>
  );
}

function DoorSwing({ name }: { name: string }) {
  return (
    <g data-sw={name}>
      <circle cx="0" cy="0" r="160" fill="none" stroke="url(#sw-ring)" strokeWidth="26" />
      <circle cx="0" cy="0" r="142" fill="#ffffff" fillOpacity="0.14" />
      <path d="M-96 -92 A136 136 0 0 1 40 -128" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="146" y="-28" width="18" height="56" rx="9" fill="#d9cbbd" />
    </g>
  );
}

export function WashingMachine({ x, y, bubbleCount }: { x: number; y: number; bubbleCount: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <MachineBody variant="washer" />
      <circle cx="0" cy="0" r={DRUM_R + 6} fill="#2a2f36" />
      <g clipPath="url(#sw-drum-clip)">
        <circle cx="0" cy="0" r={DRUM_R} fill="url(#sw-drum)" />
        <g data-sw="washer-rotor">
          <DrumHoles seed={11} />
          <path d="M0 -134 L0 -100 M116 67 L87 50 M-116 67 L-87 50" stroke="#aab5c2" strokeWidth="12" strokeLinecap="round" />
          <g transform="translate(0 -52) scale(0.34)">
            <Garment id="washer-shirt" dirty />
          </g>
        </g>
        <g data-sw="washer-water" transform="translate(0 150)">
          <rect x="-150" y="0" width="300" height="300" fill="url(#sw-water-dirty)" />
          <rect data-sw="washer-water-clean" x="-150" y="0" width="300" height="300" fill="url(#sw-water-clean)" opacity="0" />
          <path d="M-150 0 Q-75 -14 0 0 T150 0 V12 H-150 Z" fill="#ffffff" opacity="0.45" />
        </g>
        <g data-sw="washer-foam" opacity="0">
          {seededFoam(21, 18)}
        </g>
        <g data-sw="washer-bubbles" opacity="0">
          <Bubbles count={bubbleCount} seed={33} />
        </g>
        <g data-sw="washer-speed" opacity="0" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M-110 -40 A118 118 0 0 1 -40 -110" />
          <path d="M110 40 A118 118 0 0 1 40 110" />
          <path d="M40 -110 A118 118 0 0 1 110 -40" />
          <path d="M-40 110 A118 118 0 0 1 -110 40" />
        </g>
      </g>
      <DoorSwing name="washer-door" />
    </g>
  );
}

function seededFoam(seed: number, count: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => (
    <circle key={i} cx={(rand() - 0.5) * 250} cy={-10 + (rand() - 0.5) * 60} r={14 + rand() * 22} fill="#ffffff" opacity={0.75 + rand() * 0.25} />
  ));
}

export function Dryer({ x, y, particleCount }: { x: number; y: number; particleCount: number }) {
  const rand = seeded(57);
  return (
    <g transform={`translate(${x} ${y})`}>
      <g data-sw="dryer-heat" opacity="0" stroke="#ff8a3d" strokeWidth="5" fill="none" strokeLinecap="round">
        {[-120, -40, 40, 120].map((hx, i) => (
          <path
            key={hx}
            d={`M${hx} -330 q16 -22 0 -44 q-16 -22 0 -44`}
            opacity="0.55"
            style={{ animation: `float-soft ${2.4 + i * 0.3}s ease-in-out infinite`, transformBox: "fill-box" }}
          />
        ))}
      </g>
      <MachineBody variant="dryer" />
      <circle cx="0" cy="0" r={DRUM_R + 6} fill="#2a2f36" />
      <g clipPath="url(#sw-drum-clip)">
        <circle cx="0" cy="0" r={DRUM_R} fill="url(#sw-drum-warm)" />
        <g data-sw="dryer-rotor">
          <DrumHoles seed={19} />
          <path d="M0 -134 L0 -100 M116 67 L87 50 M-116 67 L-87 50" stroke="#c9b3a0" strokeWidth="12" strokeLinecap="round" />
          <g transform="translate(0 -40) scale(0.34)">
            <Garment id="dryer-shirt" dirty={false} wrinkled />
          </g>
        </g>
        <g data-sw="dryer-air" opacity="0">
          {Array.from({ length: particleCount }, (_, i) => (
            <circle
              key={i}
              cx={(rand() - 0.5) * 220}
              cy={(rand() - 0.5) * 220}
              r={2.5 + rand() * 3.5}
              fill="#ffb27a"
              style={{ animation: `float-soft ${1.6 + rand() * 1.6}s ease-in-out ${rand()}s infinite`, transformBox: "fill-box" }}
            />
          ))}
        </g>
      </g>
      <DoorSwing name="dryer-door" />
    </g>
  );
}

export function MachineDefs() {
  return (
    <>
      <clipPath id="sw-drum-clip">
        <circle cx="0" cy="0" r={DRUM_R} />
      </clipPath>
      <linearGradient id="sw-machine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f6eee7" />
      </linearGradient>
      <linearGradient id="sw-panel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbf6f1" />
        <stop offset="1" stopColor="#f1e7de" />
      </linearGradient>
      <linearGradient id="sw-ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#d9ccbf" />
        <stop offset="1" stopColor="#f4ede6" />
      </linearGradient>
      <radialGradient id="sw-drum" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#f2f5f8" />
        <stop offset="1" stopColor="#bcc6d2" />
      </radialGradient>
      <radialGradient id="sw-drum-warm" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stopColor="#fff4ea" />
        <stop offset="1" stopColor="#e3c3a8" />
      </radialGradient>
      <linearGradient id="sw-water-dirty" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b8b49b" stopOpacity="0.75" />
        <stop offset="1" stopColor="#8f8a70" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="sw-water-clean" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfe8f7" stopOpacity="0.8" />
        <stop offset="1" stopColor="#8fc4e6" stopOpacity="0.85" />
      </linearGradient>
    </>
  );
}
