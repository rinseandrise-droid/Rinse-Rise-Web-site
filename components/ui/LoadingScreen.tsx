/**
 * Pure-CSS intro (≈1.1s) shown once per browser session: a small shirt passes
 * through Wash → Dry → Press, then the wordmark appears. An inline script marks
 * repeat visits so it never shows again in the same session.
 */
export function LoadingScreen() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('rr-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('rr-no-intro')}else{sessionStorage.setItem('rr-intro','1')}}catch(e){}",
        }}
      />
      <div className="rr-intro" aria-hidden>
        <div className="rr-intro-track">
          {["Wash", "Dry", "Press"].map((label, i) => (
            <span key={label} className="rr-intro-step" style={{ animationDelay: `${i * 0.22}s` }}>
              {label}
            </span>
          ))}
          <svg className="rr-intro-shirt" viewBox="0 0 48 48" width="34" height="34">
            <path
              d="M17 6l-9 5-5 10 7 3 2-4v22h24V20l2 4 7-3-5-10-9-5c-1 3-4 5-7 5s-6-2-7-5z"
              fill="#ff6a00"
            />
          </svg>
        </div>
        <p className="rr-intro-word">
          RINSE <span>&amp;</span> RISE
        </p>
      </div>
      <style>{`
        .rr-intro{position:fixed;inset:0;z-index:100;display:grid;place-content:center;gap:22px;background:var(--canvas);animation:rr-intro-out .35s ease 1.05s forwards;pointer-events:none}
        .rr-no-intro .rr-intro{display:none}
        .rr-intro-track{position:relative;display:flex;gap:28px;padding-top:40px;font:700 12px/1 var(--font-sans);letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
        .rr-intro-step{opacity:.35;animation:rr-step .3s ease forwards}
        .rr-intro-shirt{position:absolute;top:0;left:0;animation:rr-shirt .75s cubic-bezier(.6,0,.3,1) forwards}
        .rr-intro-word{text-align:center;font:800 26px/1 var(--font-display);letter-spacing:-.01em;opacity:0;transform:translateY(8px);animation:rr-word .3s ease .7s forwards}
        .rr-intro-word span{color:var(--orange)}
        @keyframes rr-step{to{opacity:1;color:var(--orange-dark)}}
        @keyframes rr-shirt{from{transform:translateX(0)}to{transform:translateX(calc(100% + 150px))}}
        @keyframes rr-word{to{opacity:1;transform:none}}
        @keyframes rr-intro-out{to{opacity:0;visibility:hidden}}
      `}</style>
    </>
  );
}
