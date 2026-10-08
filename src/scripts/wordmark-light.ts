// Footer wordmark: while the pointer is over the contact card, a soft light follows it
// (pointer-light.ts) and brightens the dots of the alias ("/ Moxo") underneath, like the
// hero's aura leaning toward the pointer.
import { followPointer } from './pointer-light';

export function initWordmarkLight(): void {
  const card = document.querySelector<HTMLElement>('.contact');
  const wordmark = card?.querySelector<HTMLElement>('.wordmark');
  if (!card || !wordmark) return;

  // Each letter paints its own light, so each gets the light's position relative to itself.
  followPointer(card, wordmark, Array.from(wordmark.querySelectorAll<HTMLElement>('.wordmark-alias')));
}
