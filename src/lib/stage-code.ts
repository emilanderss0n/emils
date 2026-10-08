// The code the Services stage shows for its "web" state (components/ServiceStage.astro):
// the stage's own card written as HTML, one array of [token kind, text] pairs per line.
// Kept out of the component because Astro's frontmatter parser trips over tags in strings.
export type CodeToken = ['tag' | 'attr' | 'str' | 'text', string];

export const stageCode: CodeToken[][] = [
  [['tag', '<article'], ['attr', ' class'], ['tag', '='], ['str', '"card"'], ['tag', '>']],
  [['text', '  '], ['tag', '<video'], ['attr', ' src'], ['tag', '='], ['str', '"skater.mp4"'], ['tag', '>']],
  [['text', '  '], ['tag', '<h3>'], ['text', 'NHLPLAY'], ['tag', '</h3>']],
  [['text', '  '], ['tag', '<p>'], ['text', 'Live games, player stats…'], ['tag', '</p>']],
  [['text', '  '], ['tag', '<a'], ['attr', ' href'], ['tag', '='], ['str', '"/app"'], ['tag', '>'], ['text', 'Open app'], ['tag', '</a>']],
  [['tag', '</article>']],
];
