// CardSlider — horizontal slider with JS-driven fade mask.
// Attached to any element with [data-slider] attribute.
// Usage: <div data-slider="true"> ... </div>

export function initCardSlider(root: HTMLElement | Document = document) {
  const tracks = root.querySelectorAll<HTMLElement>('[data-slider]');
  tracks.forEach((track) => {
    const container = track.parentElement!;
    const prevBtn = container.querySelector('.slider-btn--prev') as HTMLButtonElement;
    const nextBtn = container.querySelector('.slider-btn--next') as HTMLButtonElement;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    function update() {
      // Batch all reads first to avoid forced reflow
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

    update();
    track.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('cursor-grabbing');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('cursor-grabbing');
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('cursor-grabbing');
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    prevBtn.addEventListener('click', () => {
      const card = track.querySelector<HTMLElement>(':scope > *');
      if (card) track.scrollBy({ left: -(card.offsetWidth + 20) * 2, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      const card = track.querySelector<HTMLElement>(':scope > *');
      if (card) track.scrollBy({ left: (card.offsetWidth + 20) * 2, behavior: 'smooth' });
    });
  });
}
