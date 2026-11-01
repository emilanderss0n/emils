// Footer wordmark: while the pointer is over the contact card, a soft light follows it
// (pointer-light.ts) and brightens the dots of the alias ("/ Moxo") underneath. With a
// mouse, and motion allowed, the script draws those dots itself so the pointer can also
// push them around (wordmark-dots.ts).
import { followPointer } from './pointer-light';
import { initWordmarkDots } from './wordmark-dots';

export function initWordmarkLight(): void {
  const card = document.querySelector<HTMLElement>('.contact');
  const wordmark = card?.querySelector<HTMLElement>('.wordmark');
  if (!card || !wordmark) return;

  const letters = Array.from(wordmark.querySelectorAll<HTMLElement>('.wordmark-alias'));
  const moveLight = initWordmarkDots(card, wordmark, letters);
  if (moveLight) return followPointer(card, wordmark, [], moveLight);
  // Otherwise each letter paints its own light, so each gets the light's position relative
  // to itself.
  followPointer(card, wordmark, letters);
}
