// 16×16 pixel-art cursors for the Services stage (components/ServiceStage.astro): the
// design tool's arrow and its edge-resize arrows for the UI state, and the grabbing hand
// for the 3D state. "o" is outline, "w" is fill, "." is transparent.
export interface Pixel {
  x: number;
  y: number;
  outline: boolean;
}

const pixels = (rows: string[]): Pixel[] =>
  rows.flatMap((row, y) => [...row].flatMap((pixel, x) => (pixel === '.' ? [] : [{ x, y, outline: pixel === 'o' }])));

export const arrowCursor = pixels([
  'o...............',
  'oo..............',
  'owo.............',
  'owwo............',
  'owwwo...........',
  'owwwwo..........',
  'owwwwwo.........',
  'owwwwwwo........',
  'owwwwwwwo.......',
  'owwwwwwwwo......',
  'owwwwwooooo.....',
  'owwowwo.........',
  'owo.owwo........',
  'oo..owwo........',
  'o....owwo.......',
  '.....ooo........',
]);

export const grabCursor = pixels([
  '................',
  '................',
  '................',
  '....oo.oo.oo....',
  '...owwowwowwoo..',
  '...owwwwwwwwowo.',
  '..oowwwwwwwwwwo.',
  '.owowwwwwwwwwwo.',
  '.owwwwwwwwwwwwo.',
  '..owwwwwwwwwwwo.',
  '...owwwwwwwwwo..',
  '....owwwwwwwwo..',
  '.....owwwwwwo...',
  '.....owwwwwwo...',
  '.....oooooooo...',
  '................',
]);

export const resizeCursor = pixels([
  '................',
  '................',
  '................',
  '................',
  '................',
  '....o......o....',
  '...oo......oo...',
  '..owo......owo..',
  '.owwoooooooowwo.',
  'owwwwwwwwwwwwwwo',
  '.owwoooooooowwo.',
  '..owo......owo..',
  '...oo......oo...',
  '....o......o....',
  '................',
  '................',
]);
