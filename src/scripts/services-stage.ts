// Services: one service is the active one, and the stage (components/ServiceStage.astro)
// shows its state. Where the stage is pinned beside the list (wide screens, services.css),
// the service crossing the middle of the screen becomes the active one. Where the stage
// sits above a compact list, a tap on a service picks it, and so does a sideways swipe on
// the stage. The list only steps the other services back once this runs (data-live), so
// without it all four read normally.
//
// The stage holds two copies of a short looping clip: one in the card and one on the
// video state's monitor. The copy that is showing plays only while the stage is on
// screen and the tab is visible, and never with reduced motion (its poster stands in).
// While the pointer is over the stage, a faint light follows it over the dot grid
// (pointer-light.ts), like the footer wordmark's.
import { followPointer } from './pointer-light';

const SWIPE = 40;

export function initServicesStage(): void {
  const updateClips = initClips();
  const stage = document.querySelector<HTMLElement>('.stage');
  const items = Array.from(document.querySelectorAll<HTMLElement>('.service[data-state]'));
  const list = items[0]?.parentElement;
  if (!stage || !list) return;
  followPointer(stage, stage, [stage]);

  const picks = items.map((item) => item.querySelector('button'));
  let current = 0;

  const activate = (index: number) => {
    current = index;
    stage.dataset.state = items[index].dataset.state;
    items.forEach((item, i) => {
      item.toggleAttribute('data-active', i === index);
      picks[i]?.setAttribute('aria-current', String(i === index));
    });
    updateClips();
  };

  // The breakpoint lives in the stylesheet: the stage is sticky only in the wide layout.
  const pinned = () => getComputedStyle(stage).position === 'sticky';

  list.setAttribute('data-live', '');
  activate(0);

  const observer = new IntersectionObserver(
    (entries) => {
      if (!pinned()) return;
      for (const entry of entries) {
        if (entry.isIntersecting) activate(items.indexOf(entry.target as HTMLElement));
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  for (const item of items) observer.observe(item);

  picks.forEach((pick, i) => pick?.addEventListener('click', () => activate(i)));

  let from: { x: number; y: number } | undefined;
  stage.addEventListener('pointerdown', (event) => {
    from = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointercancel', () => {
    from = undefined;
  });
  stage.addEventListener('pointerup', (event) => {
    if (!from || pinned()) return;
    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    from = undefined;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy)) return;
    const next = current + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < items.length) activate(next);
  });
}

function initClips(): () => void {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return () => {};

  const clips = Array.from(document.querySelectorAll<HTMLVideoElement>('.stage video'));
  if (clips.length === 0) return () => {};
  const onScreen = new Set<HTMLVideoElement>();

  const showing = (clip: HTMLVideoElement) => {
    const onMonitor = clip.classList.contains('mon-video');
    const inVideoState = clip.closest<HTMLElement>('.stage')?.dataset.state === 'video';
    return onMonitor === inVideoState;
  };

  const update = () => {
    for (const clip of clips) {
      if (onScreen.has(clip) && !document.hidden && showing(clip)) clip.play().catch(() => {});
      else clip.pause();
    }
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const clip = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) onScreen.add(clip);
      else onScreen.delete(clip);
    }
    update();
  });
  for (const clip of clips) observer.observe(clip);
  document.addEventListener('visibilitychange', update);
  return update;
}
