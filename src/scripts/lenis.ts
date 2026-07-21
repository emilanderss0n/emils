import Lenis from 'lenis';

export function initLenis(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const lenis = new Lenis({
    autoRaf: true,
  });

  return () => lenis.destroy();
}