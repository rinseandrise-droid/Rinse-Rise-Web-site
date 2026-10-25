/**
 * Viewport change helper. Browser zoom, orientation, split-screen and
 * window resize all funnel through here so ScrollTrigger can refresh
 * without assuming a device width.
 */
export function onViewportChange(callback: () => void, delay = 120): () => void {
  let timer = 0;
  const fire = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(callback, delay);
  };

  window.addEventListener("resize", fire);
  window.addEventListener("orientationchange", fire);
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", fire);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("resize", fire);
    window.removeEventListener("orientationchange", fire);
    viewport?.removeEventListener("resize", fire);
  };
}
