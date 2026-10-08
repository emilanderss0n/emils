// Services: the service crossing the middle of the screen becomes the active one, and the
// sticky stage beside the list (components/ServiceStage.astro) switches to its state.
// The list only dims the other services once this runs (data-live), so without it all
// four read normally. The layout itself is desktop only (services.css).
//
// Every stage's card holds a short looping clip, which plays only while that stage is on
// screen and the tab is visible (and never with reduced motion: its poster stands in).

export function initServicesStage(): void {
  initClips();

  const stage = document.querySelector<HTMLElement>('.stage[data-live]');
  const items = Array.from(document.querySelectorAll<HTMLElement>('.service[data-state]'));
  const list = items[0]?.parentElement;
  if (!stage || !list) return;

  const activate = (item: HTMLElement) => {
    stage.dataset.state = item.dataset.state;
    for (const other of items) other.toggleAttribute('data-active', other === item);
  };

  list.setAttribute('data-live', '');
  activate(items[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activate(entry.target as HTMLElement);
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  for (const item of items) observer.observe(item);
}

function initClips(): void {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const clips = Array.from(document.querySelectorAll<HTMLVideoElement>('.stage .obj-video'));
  if (clips.length === 0) return;
  const onScreen = new Set<HTMLVideoElement>();

  const update = () => {
    for (const clip of clips) {
      if (onScreen.has(clip) && !document.hidden) clip.play().catch(() => {});
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
}
