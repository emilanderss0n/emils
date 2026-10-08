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
  const nav = document.querySelector<HTMLElement>('.header-nav');
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.header-link'));
  if (!nav) return;

  let current: string | null = null;
  // While a nav click scrolls the page, the sections it passes don't take over.
  let heading: string | null | undefined;

  // Clips the highlight layer (.header-active) to the current link. It slides from
  // link to link; appearing from nothing it is placed without sliding and fades in.
  const place = (instant: boolean) => {
    const link = links.find((el) => el.hash === `#${current}`);
    if (!link) {
      nav.removeAttribute('data-current');
      return;
    }
    if (instant) nav.setAttribute('data-instant', '');
    nav.style.setProperty('--active-left', `${link.offsetLeft}px`);
    nav.style.setProperty('--active-right', `${nav.clientWidth - link.offsetLeft - link.offsetWidth}px`);
    nav.setAttribute('data-current', '');
    if (instant) {
      void nav.offsetWidth;
      nav.removeAttribute('data-instant');
    }
  };

  const setCurrent = (id: string | null) => {
    if (heading !== undefined && id !== heading) return;
    if (id === current) return;
    const wasShown = current !== null;
    current = id;
    for (const link of links) {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    place(!wasShown);
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
    if (!section) continue;
    observer.observe(section);
    link.addEventListener('click', () => {
      const id = section.id;
      heading = undefined;
      setCurrent(id);
      heading = id;
      const release = () => {
        heading = undefined;
        window.removeEventListener('scrollend', release);
      };
      window.addEventListener('scrollend', release);
      window.setTimeout(release, 2000);
    });
  }

  // Nothing is "current" while the hero fills the screen.
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < window.innerHeight * 0.4) setCurrent(null);
    },
    { passive: true },
  );

  // Link widths change once the web font is in, and with the window size.
  const replace = () => place(true);
  void document.fonts.ready.then(replace);
  new ResizeObserver(replace).observe(nav);
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
