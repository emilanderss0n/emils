// Header: condenses into a floating bar once the page scrolls, highlights the
// nav link for the section in view, and shows the local time in Sweden.

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('.header');
  if (!header) return;

  const condense = () => header.toggleAttribute('data-condensed', window.scrollY > 48);
  condense();
  window.addEventListener('scroll', condense, { passive: true });

  initCurrentSection();
  initLocalTime();
}

function initCurrentSection(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.header-link'));
  const setCurrent = (id: string | null) => {
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  for (const link of links) {
    // Links are "/#work" off the home page; only observe sections on this page.
    const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
    if (section) observer.observe(section);
  }

  // Nothing is "current" while the hero fills the screen.
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < window.innerHeight * 0.4) setCurrent(null);
    },
    { passive: true },
  );
}

function initLocalTime(): void {
  const el = document.querySelector<HTMLElement>('[data-local-time]');
  if (!el) return;

  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const tick = () => {
    el.textContent = format.format(new Date());
  };
  tick();
  window.setInterval(tick, 15000);
}
