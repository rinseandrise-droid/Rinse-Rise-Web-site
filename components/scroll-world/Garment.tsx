/**
 * Shirt artwork, collar at (0,0). Parts carry data-part attributes so the scroll
 * timeline can fold sleeves, fade stains and smooth wrinkles independently.
 */
export function Garment({ id, dirty = true, wrinkled = false }: { id: string; dirty?: boolean; wrinkled?: boolean }) {
  return (
    <g data-sw={id}>
      <g data-part="fold-x">
        <g data-part="fold-y">
          <g data-part="sleeve-l">
            <path d="M-94 24 L-168 118 Q-172 128 -162 134 L-124 156 Q-115 160 -110 152 L-82 92 Z" fill="url(#sw-shirt-side)" />
            <path d="M-166 124 L-120 152" stroke="#b9cbe0" strokeWidth="6" strokeLinecap="round" />
          </g>
          <g data-part="sleeve-r">
            <path d="M94 24 L168 118 Q172 128 162 134 L124 156 Q115 160 110 152 L82 92 Z" fill="url(#sw-shirt-side)" />
            <path d="M166 124 L120 152" stroke="#b9cbe0" strokeWidth="6" strokeLinecap="round" />
          </g>
          <path d="M-96 24 L-40 0 Q0 24 40 0 L96 24 L92 328 Q0 344 -92 328 Z" fill="url(#sw-shirt)" />
          <path d="M-40 0 L-16 34 L0 16 L16 34 L40 0 Q0 22 -40 0 Z" fill="#f4f8fc" stroke="#c4d4e6" strokeWidth="2" />
          <line x1="0" y1="18" x2="0" y2="336" stroke="#bccde1" strokeWidth="3" />
          {[64, 112, 160, 208, 256, 304].map((y) => (
            <circle key={y} cx="0" cy={y} r="4.5" fill="#f7fafd" stroke="#a9bdd5" strokeWidth="1.5" />
          ))}
          <rect x="-74" y="86" width="42" height="48" rx="6" fill="none" stroke="#b5c7dc" strokeWidth="2.5" />
          <g data-part="stains" opacity={dirty ? 1 : 0}>
            <ellipse cx="44" cy="150" rx="22" ry="15" fill="#9a7b5b" opacity="0.42" />
            <ellipse cx="54" cy="160" rx="10" ry="7" fill="#7f6248" opacity="0.38" />
            <ellipse cx="-48" cy="238" rx="18" ry="12" fill="#8b8f6a" opacity="0.38" />
            <ellipse cx="18" cy="282" rx="14" ry="9" fill="#9a7b5b" opacity="0.34" />
            <path d="M-130 120 q8 -6 14 2" stroke="#8a6e52" strokeWidth="6" strokeLinecap="round" opacity="0.32" fill="none" />
          </g>
          <g data-part="wrinkles" opacity={wrinkled ? 1 : 0} stroke="#a7bad2" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M-70 60 q20 18 8 44" />
            <path d="M60 70 q-16 24 2 52" />
            <path d="M-50 180 q30 10 40 -6" />
            <path d="M30 220 q22 16 44 4" />
            <path d="M-76 286 q26 -10 46 4" />
            <path d="M-140 108 q14 4 20 18" />
            <path d="M138 106 q-14 6 -18 20" />
          </g>
        </g>
      </g>
    </g>
  );
}

/** Neatly folded shirt used for the packing scenes; centred on (0,0). */
export function FoldedShirt({ id }: { id: string }) {
  return (
    <g data-sw={id}>
      <rect x="-104" y="-74" width="208" height="148" rx="14" fill="url(#sw-shirt)" stroke="#bccde1" strokeWidth="2" />
      <rect x="-104" y="18" width="208" height="56" rx="14" fill="#d3e1f0" opacity="0.7" />
      <path d="M-34 -74 L-12 -44 L0 -58 L12 -44 L34 -74 Q0 -56 -34 -74 Z" fill="#f4f8fc" stroke="#c4d4e6" strokeWidth="2" />
      <line x1="0" y1="-56" x2="0" y2="74" stroke="#bccde1" strokeWidth="3" />
      {[-24, 8, 40].map((y) => (
        <circle key={y} cx="0" cy={y} r="4" fill="#f7fafd" stroke="#a9bdd5" strokeWidth="1.5" />
      ))}
    </g>
  );
}

/** Shared gradients for garment artwork. Render once inside <defs>. */
export function GarmentDefs() {
  return (
    <>
      <linearGradient id="sw-shirt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#edf3fa" />
        <stop offset="1" stopColor="#cfdced" />
      </linearGradient>
      <linearGradient id="sw-shirt-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e3ecf6" />
        <stop offset="1" stopColor="#c6d6e9" />
      </linearGradient>
    </>
  );
}
