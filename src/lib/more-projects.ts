// The "More projects" list: GitHub repos and CodePen pens as one kind of row.
import { getMoreRepos } from '@lib/github';
import { getPens } from '@lib/codepen';

export interface MoreItem {
  name: string;
  text?: string | null;
  href: string;
  /** Shown first in the meta line, after a coloured dot: the repo's language ("Misc" when it has none), or "CodePen". */
  label?: { text: string; color: string };
}

// GitHub's own language colours.
const languageColors: Record<string, string> = {
  'C#': '#178600',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#663399',
  HTML: '#e34c26',
  PHP: '#4f5d95',
};

/** Spreads `b` evenly through `a`, keeping each list's own order. */
function mix<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    const takeA = j >= b.length || (i < a.length && (i + 0.5) / a.length <= (j + 0.5) / b.length);
    out.push(takeA ? a[i++] : b[j++]);
  }
  return out;
}

export async function getMoreItems(): Promise<MoreItem[]> {
  const repos = (await getMoreRepos()).map(({ data }) => ({
    name: data.name,
    text: data.description,
    href: data.url,
    // A repo with no language GitHub can name is filed under "Misc".
    label: data.language === 'N/A' ? { text: 'Misc', color: 'var(--muted)' } : { text: data.language, color: languageColors[data.language] ?? 'var(--muted)' },
  }));
  return mix(repos, getPens());
}
