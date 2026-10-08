// TextScramble — decode/scramble text reveal effect.
// Adapted from a CodePen by @kunit0shi (tech1 charset), typed & hardened for
// safe innerHTML (all text is escaped).
//
// Layout never moves. Every real character stays in the text on every frame,
// hidden until it's revealed, so line breaks, sizes and kerning match the final
// text throughout. The scrambling glyphs live on a separate overlay layer, each
// placed over its hidden character, so however wide or narrow they are they
// can't touch the text's layout.

const CHAR_SETS = {
  tech1: '!<>-_\\/[]{}—=+*^?#________',
  tech2: '!<>-_\\/[]{}—=+*^?#$%&()~',
} as const;

export type CharSetName = keyof typeof CHAR_SETS;

export interface TextScrambleOptions {
  /** Glyph pool used while scrambling. Defaults to the `tech1` set. */
  chars?: string;
  /** Higher = faster reveal. Default 2. */
  revealSpeed?: number;
  /** 0–1 probability a scrambling glyph changes each frame. Default 0.28. */
  changeFrequency?: number;
  /** Colour of glyphs while scrambling. Defaults to `currentColor`. */
  highlightColor?: string;
  /** Glow blur (px) applied to scrambling glyphs. Default 12. */
  glowIntensity?: number;
  /** Element the glyph overlay is added to. Defaults to the text element's parent. */
  layer?: HTMLElement;
}

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
  glyph?: HTMLElement;
}

const ENTITIES: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
const escapeText = (text: string): string => text.replace(/[<>&"]/g, (ch) => ENTITIES[ch]);
const isSpace = (ch: string): boolean => /\s/.test(ch);
const hidden = (ch: string): string => `<span class="scramble-hidden">${escapeText(ch)}</span>`;

export class TextScramble {
  private readonly el: HTMLElement;
  private readonly layer: HTMLElement;
  private readonly chars: string;
  private readonly revealSpeed: number;
  private readonly changeFrequency: number;
  private readonly highlightColor: string;
  private readonly glowIntensity: number;
  private queue: QueueItem[] = [];
  private overlay?: HTMLElement;
  private frame = 0;
  private frameRequest = 0;
  private resolve: () => void = () => {};

  constructor(el: HTMLElement, options: TextScrambleOptions = {}) {
    this.el = el;
    this.layer = options.layer ?? el.parentElement ?? el;
    this.chars = options.chars ?? CHAR_SETS.tech1;
    this.revealSpeed = options.revealSpeed ?? 2;
    this.changeFrequency = options.changeFrequency ?? 0.28;
    this.highlightColor = options.highlightColor ?? 'currentColor';
    this.glowIntensity = options.glowIntensity ?? 12;
    this.update = this.update.bind(this);
  }

  /** Animate from `fromText` (default: current text) to `newText`. */
  setText(newText: string, fromText: string = this.el.innerText): Promise<void> {
    const length = Math.max(fromText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = fromText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * (40 / this.revealSpeed));
      const end = start + Math.floor(Math.random() * (40 / this.revealSpeed));
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.placeGlyphs();
    this.update();
    return promise;
  }

  /** Lays out every character hidden, then puts a glyph slot over each one. */
  private placeGlyphs(): void {
    this.overlay?.remove();
    this.el.innerHTML = this.queue.map((item) => (isSpace(item.to) ? item.to : hidden(item.to || item.from))).join('');

    const overlay = document.createElement('span');
    overlay.className = 'scramble-layer';
    overlay.setAttribute('aria-hidden', 'true');
    this.layer.append(overlay);
    const origin = overlay.getBoundingClientRect();

    const slots = Array.from(this.el.children) as HTMLElement[];
    let next = 0;
    for (const item of this.queue) {
      if (isSpace(item.to)) continue;
      const slot = slots[next++];
      const box = slot.getBoundingClientRect();
      const font = getComputedStyle(slot);
      const glyph = document.createElement('span');
      glyph.className = 'scramble-glyph';
      glyph.hidden = true;
      Object.assign(glyph.style, {
        left: `${box.left - origin.left}px`,
        top: `${box.top - origin.top}px`,
        // A line box exactly as tall as the character's box puts both on the same baseline.
        lineHeight: `${box.height}px`,
        fontFamily: font.fontFamily,
        fontSize: font.fontSize,
        fontStyle: font.fontStyle,
        fontWeight: font.fontWeight,
        color: this.highlightColor,
        textShadow: `0 0 ${this.glowIntensity}px currentColor`,
      });
      overlay.append(glyph);
      item.glyph = glyph;
    }
    this.overlay = overlay;
  }

  private update(): void {
    let html = '';
    let complete = 0;

    for (const item of this.queue) {
      const revealed = this.frame >= item.end;
      const scrambling = !revealed && this.frame >= item.start && !isSpace(item.to);

      if (revealed) {
        complete++;
        html += escapeText(item.to);
      } else if (isSpace(item.to)) {
        html += item.to;
      } else if (!scrambling && item.from) {
        html += escapeText(item.from);
      } else {
        html += hidden(item.to || item.from);
      }

      if (item.glyph) {
        item.glyph.hidden = !scrambling;
        if (scrambling && (!item.char || Math.random() < this.changeFrequency)) {
          item.char = this.randomChar();
          item.glyph.textContent = item.char;
        }
      }
    }

    this.el.innerHTML = html;

    if (complete === this.queue.length) {
      this.overlay?.remove();
      this.overlay = undefined;
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  private randomChar(): string {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/**
 * Scrambles every `.scramble` host found under `root`. Each host animates its
 * `.scramble-seg` children (gradient segments keep their gradient classes).
 *
 * Per-host config via data attributes:
 *   data-scramble-speed    — higher = faster reveal (default 1.4)
 *   data-scramble-delay    — ms to wait before starting (default 0)
 *   data-scramble-from     — "empty" (materialise from nothing, default) or
 *                            "self" (scramble the existing text in place)
 *   data-scramble-trigger  — "load" (start now, default) or "view" (start when
 *                            the host scrolls into view; the delay counts from then)
 *
 * Segments stay hidden by text-scramble.css (once JS is known to run) until
 * their host starts.
 * The animation is skipped (text shown as-is) when the user prefers reduced motion.
 */
export function initScramble(root: ParentNode = document): void {
  const hosts = Array.from(root.querySelectorAll<HTMLElement>('.scramble'));
  if (hosts.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
    'currentColor';

  // Shared by every "view" host: fires once each host is ~15% into the viewport.
  const waiting = new Map<Element, () => void>();
  let observer: IntersectionObserver | undefined;
  const whenInView = (host: HTMLElement, callback: () => void) => {
    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.unobserve(entry.target);
          waiting.get(entry.target)?.();
          waiting.delete(entry.target);
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    waiting.set(host, callback);
    observer.observe(host);
  };

  for (const host of hosts) {
    const segments = Array.from(host.querySelectorAll<HTMLElement>('.scramble-seg'));
    const show = () => {
      for (const el of host.querySelectorAll<HTMLElement>('.scramble-seg, .scramble-sep')) {
        el.style.opacity = '1';
      }
    };
    if (reduceMotion || segments.length === 0) {
      show();
      continue;
    }

    const delay = Number(host.dataset.scrambleDelay ?? 0);
    const revealSpeed = Number(host.dataset.scrambleSpeed ?? 1.4);
    const fromEmpty = (host.dataset.scrambleFrom ?? 'empty') === 'empty';
    const finalText = segments.map((seg) => seg.dataset.text ?? seg.textContent ?? '');

    const start = (): void => {
      // The first frame renders synchronously (every character hidden), so the
      // segments can be shown straight after without the final text flashing.
      // Glyph overlays go on the host, outside the text, so they never split it.
      for (const [i, seg] of segments.entries()) {
        const fx = new TextScramble(seg, { highlightColor: accent, revealSpeed, layer: host });
        void fx.setText(finalText[i], fromEmpty ? '' : finalText[i]);
      }
      show();
    };

    const schedule = () => {
      if (delay > 0) window.setTimeout(start, delay);
      else start();
    };

    if (host.dataset.scrambleTrigger === 'view') whenInView(host, schedule);
    else schedule();
  }
}
