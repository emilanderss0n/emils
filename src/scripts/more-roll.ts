// Direction for the hover on the More projects rows (sections/work.css), each a box that
// rolls. When the pointer comes in, the copy in the opposite theme rolls round through
// that edge and the rest face rolls away over the other one; when it leaves, the copy
// rolls out through that edge and the rest face follows from the far one. So the box
// keeps turning the way the pointer moves.
// Each row gets --side (where the copy waits: 1 for the top edge, -1 for the bottom),
// --away (where the rest face waits while the row is lit) and --depth, half its height.
// Mouse and trackpad only.

export function initMoreRoll(root: ParentNode = document): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  for (const row of root.querySelectorAll<HTMLElement>('.more-item')) {
    const roll = parseFloat(getComputedStyle(row).getPropertyValue('--roll'));
    // When the row last lit up or went out: until a roll has passed, its faces are moving.
    let changed = -Infinity;

    const edgeOf = (event: PointerEvent) => {
      const box = row.getBoundingClientRect();
      return event.clientY < box.top + box.height / 2 ? 1 : -1;
    };

    // Points a face at an edge. A face that has finished rolling is out of sight, so it
    // moves there at once (data-snap turns its transition off), ready to roll in from
    // that edge. A face still on its way turns back the way it came instead.
    const point = (face: 'lit' | 'rest', property: string, edge: number, settled: boolean) => {
      if (row.style.getPropertyValue(property) === String(edge)) return;
      row.style.setProperty(property, String(edge));
      if (!settled) return;
      row.setAttribute('data-snap', face);
      void getComputedStyle(row.querySelector(`.more-face-${face}`)!).transform;
      row.removeAttribute('data-snap');
    };

    row.addEventListener('pointerenter', (event) => {
      const edge = edgeOf(event);
      const settled = performance.now() - changed > roll;
      changed = performance.now();
      row.style.setProperty('--depth', `${row.offsetHeight / 2}px`);
      row.style.setProperty('--away', String(-edge));
      point('lit', '--side', edge, settled);
    });
    row.addEventListener('pointerleave', (event) => {
      const edge = edgeOf(event);
      const settled = performance.now() - changed > roll;
      changed = performance.now();
      row.style.setProperty('--side', String(edge));
      point('rest', '--away', -edge, settled);
    });
  }
}
