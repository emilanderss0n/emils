// TextScramble — decode/scramble text reveal effect.
// Adapted from a CodePen by @kunit0shi (tech1 charset), typed & hardened for
// safe innerHTML (escapes <, >, & in scrambling glyphs).

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
}

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

const ENTITIES: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
const escapeGlyph = (ch: string): string => ENTITIES[ch] ?? ch;

export class TextScramble {
  private readonly el: HTMLElement;
  private readonly chars: string;
  private readonly revealSpeed: number;
  private readonly changeFrequency: number;
  private readonly highlightColor: string;
  private readonly glowIntensity: number;
  private queue: QueueItem[] = [];
  private frame = 0;
  private frameRequest = 0;
  private resolve: () => void = () => {};

  constructor(el: HTMLElement, options: TextScrambleOptions = {}) {
    this.el = el;
    this.chars = options.chars ?? CHAR_SETS.tech1;
    this.revealSpeed = options.revealSpeed ?? 2;
    this.changeFrequency = options.changeFrequency ?? 0.28;
    this.highlightColor = options.highlightColor ?? 'currentColor';
    this.glowIntensity = options.glowIntensity ?? 12;
    this.update = this.update.bind(this);
  }

  /** Animate from `fromText` (default: current text) to `newText`. */
  setText(newText: string, fromText: string = this.el.innerText): Promise<void> {
    const oldText = fromText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * (40 / this.revealSpeed));
      const end = start + Math.floor(Math.random() * (40 / this.revealSpeed));
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  private update(): void {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      const item = this.queue[i];
      let { char } = item;

      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!char || Math.random() < this.changeFrequency) {
          char = this.randomChar();
          item.char = char;
        }
        output += `<span class="scrambling" style="color:${this.highlightColor};text-shadow:0 0 ${this.glowIntensity}px currentColor;">${escapeGlyph(char)}</span>`;
      } else {
        output += item.from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
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
 *   data-scramble-speed  — higher = faster reveal (default 1.4)
 *   data-scramble-delay  — ms to wait before starting (default 0)
 *   data-scramble-from   — "empty" (materialise from nothing, default) or
 *                          "self" (scramble the existing text in place)
 *
 * Height is reserved during the animation so surrounding layout never shifts.
 * Skipped entirely when the user prefers reduced motion.
 */
export function initScramble(root: ParentNode = document): void {
  const hosts = Array.from(root.querySelectorAll<HTMLElement>('.scramble'));
  if (hosts.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const accent =
    getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() ||
    'currentColor';

  for (const host of hosts) {
    const segments = Array.from(host.querySelectorAll<HTMLElement>('.scramble-seg'));
    if (segments.length === 0) continue;

    const delay = Number(host.dataset.scrambleDelay ?? 0);
    const revealSpeed = Number(host.dataset.scrambleSpeed ?? 1.4);
    const fromEmpty = (host.dataset.scrambleFrom ?? 'empty') === 'empty';

    // Snapshot final text, reserve height, then blank out (when materialising).
    const finalText = segments.map((seg) => seg.dataset.text ?? seg.textContent ?? '');
    host.style.minHeight = `${host.offsetHeight}px`;
    if (fromEmpty) segments.forEach((seg) => (seg.textContent = ''));

    const start = (): void => {
      const runs = segments.map((seg, i) => {
        const fx = new TextScramble(seg, { highlightColor: accent, revealSpeed });
        return fx.setText(finalText[i], fromEmpty ? '' : finalText[i]);
      });
      void Promise.all(runs).then(() => {
        host.style.minHeight = '';
      });
    };

    if (delay > 0) window.setTimeout(start, delay);
    else start();
  }
}
