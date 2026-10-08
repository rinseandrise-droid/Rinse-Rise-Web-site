import { FoldedShirt, Garment, GarmentDefs } from "./Garment";
import { Dryer, MachineDefs, WashingMachine } from "./Machines";
import { seeded, STATION_WIDTH, WORLD } from "./scene-utils";
import {
  DeliveryBag,
  GarmentPack,
  HangerRail,
  IroningStation,
  PackingStation,
  QualityTable,
  StationDefs,
  SteamIron,
} from "./Stations";

const STATIONS = 6;

function Backdrop({ particles }: { particles: number }) {
  const rand = seeded(7);
  const worldWidth = STATION_WIDTH * STATIONS;
  return (
    <g aria-hidden>
      <rect x="-800" y="-400" width={worldWidth + 1600} height="1800" fill="url(#sw-wall)" />
      {Array.from({ length: STATIONS }, (_, i) => (
        <g key={i}>
          <circle cx={i * STATION_WIDTH + 800} cy="430" r="520" fill="url(#sw-glow)" />
          <rect
            x={i * STATION_WIDTH + 140}
            y="70"
            width="1320"
            height="640"
            rx="48"
            fill="none"
            stroke="#f3e4d7"
            strokeWidth="2"
          />
        </g>
      ))}
      <rect x="-800" y="790" width={worldWidth + 1600} height="600" fill="url(#sw-floor)" />
      <line x1="-800" y1="790" x2={worldWidth + 800} y2="790" stroke="#efdccc" strokeWidth="3" />
      {Array.from({ length: particles }, (_, i) => (
        <circle
          key={i}
          cx={rand() * worldWidth}
          cy={80 + rand() * 660}
          r={2 + rand() * 4}
          fill={i % 3 === 0 ? "#ffb27a" : "#ffffff"}
          opacity={0.5 + rand() * 0.4}
          style={{ animation: `float-soft ${5 + rand() * 5}s ease-in-out ${rand() * 4}s infinite`, transformBox: "fill-box" }}
        />
      ))}
    </g>
  );
}

/**
 * The whole laundry studio as one SVG world. Stations sit side by side; the
 * camera group (cam-zoom > cam-pan) is moved by the scroll timeline.
 */
export function LaundryScene({ compact }: { compact: boolean }) {
  return (
    <svg
      className="h-full w-full"
      viewBox={compact ? "420 40 760 1060" : "0 0 1600 900"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="sw-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdfb" />
          <stop offset="1" stopColor="#fff4ea" />
        </linearGradient>
        <linearGradient id="sw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbeee3" />
          <stop offset="1" stopColor="#fff8f2" />
        </linearGradient>
        <GarmentDefs />
        <MachineDefs />
        <StationDefs />
      </defs>

      <g data-sw="cam-zoom">
        <g data-sw="cam-pan">
          <Backdrop particles={compact ? 10 : 26} />

          <HangerRail x={WORLD.hanger.x} y={WORLD.hanger.y} />
          <WashingMachine x={WORLD.washer.x} y={WORLD.washer.y} bubbleCount={compact ? 10 : 22} />
          <Dryer x={WORLD.dryer.x} y={WORLD.dryer.y} particleCount={compact ? 10 : 22} />
          <IroningStation x={WORLD.board.x} y={WORLD.board.y} />
          <QualityTable x={WORLD.table.x} y={WORLD.table.y} />
          <PackingStation x={WORLD.pack.x} y={WORLD.pack.y} />

          <rect data-sw="qc-sweep" x="-50" y={WORLD.table.y - 160} width="100" height="320" fill="url(#sw-light)" opacity="0" />

          <g data-sw="shirt-move">
            <g data-sw="shirt-wobble">
              <Garment id="shirt" dirty />
            </g>
          </g>

          <SteamIron puffs={compact ? 5 : 9} />

          <g data-sw="folded-move">
            <FoldedShirt id="folded" />
            <GarmentPack />
          </g>

          <g data-sw="bag-move">
            <DeliveryBag />
          </g>
        </g>
      </g>
    </svg>
  );
}
