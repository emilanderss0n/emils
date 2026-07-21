// CardSlider — horizontal slider with JS-driven fade mask.
// Attached to any element with [data-slider] attribute.
// Returns a cleanup function and guards against double-init via data-initialized marker.

const initializedTracks = new WeakSet<HTMLElement>();

export function initCardSlider(root: HTMLElement | Document = document): () => void {
  const cleanupFns: (() => void)[] = [];
  const tracks = root.querySelectorAll<HTMLElement>('[data-slider]:not([data-initialized])');

  tracks.forEach((track) => {
    if (initializedTracks.has(track)) return;
    initializedTracks.add(track);
    track.dataset.initialized = 'true';

    const container = track.parentElement!;
    const prevBtn = container.querySelector('.slider-btn--prev') as HTMLButtonElement;
    const nextBtn = container.querySelector('.slider-btn--next') as HTMLButtonElement;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    function onScroll() {
      const sl = track.scrollLeft;
      const cw = track.clientWidth;
      const sw = track.scrollWidth;

      requestAnimationFrame(() => {
        const atStart = sl <= 4;
        const atEnd = sl + cw >= sw - 4;
        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
        const mL = atStart ? 'black' : 'transparent';
        const mR = atEnd ? 'black' : 'transparent';
        const mask = `linear-gradient(to right, ${mL} 0%, black 6%, black 94%, ${mR} 100%)`;
        track.style.webkitMaskImage = mask;
        track.style.maskImage = mask;
      });
    }

    function onMouseDown(e: MouseEvent) {
      isDown = true;
      track.classList.add('cursor-grabbing');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    }
    function onMouseLeave() {
      isDown = false;
      track.classList.remove('cursor-grabbing');
    }
    function onMouseUp() {
      isDown = false;
      track.classList.remove('cursor-grabbing');
    }
    function onMouseMove(e: MouseEvent) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    }
    function getCardStep(card: HTMLElement) {
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.offsetWidth + gap;
    }
    function onPrevClick() {
      const card = track.querySelector<HTMLElement>(':scope > *');
      if (card) track.scrollBy({ left: -getCardStep(card) * 2, behavior: 'smooth' });
    }
    function onNextClick() {
      const card = track.querySelector<HTMLElement>(':scope > *');
      if (card) track.scrollBy({ left: getCardStep(card) * 2, behavior: 'smooth' });
    }

    onScroll();
    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    track.addEventListener('mousedown', onMouseDown);
    track.addEventListener('mouseleave', onMouseLeave);
    track.addEventListener('mouseup', onMouseUp);
    track.addEventListener('mousemove', onMouseMove);
    prevBtn.addEventListener('click', onPrevClick);
    nextBtn.addEventListener('click', onNextClick);

    cleanupFns.push(() => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      track.removeEventListener('mousedown', onMouseDown);
      track.removeEventListener('mouseleave', onMouseLeave);
      track.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('mousemove', onMouseMove);
      prevBtn.removeEventListener('click', onPrevClick);
      nextBtn.removeEventListener('click', onNextClick);
      track.removeAttribute('data-initialized');
      initializedTracks.delete(track);
    });
  });

  return () => cleanupFns.forEach((fn) => fn());
}
