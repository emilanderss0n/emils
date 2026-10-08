// "Copy" button next to the contact email. Hidden in the markup and only shown
// when the Clipboard API exists; falls back to opening a mailto: link.

export function initCopyEmail(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-copy]');
  if (!button || !navigator.clipboard) return;

  const value = button.dataset.copy ?? '';
  let resetTimer = 0;
  button.hidden = false;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copied';
      button.dataset.state = 'copied';
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.textContent = 'Copy';
        delete button.dataset.state;
      }, 2000);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  });
}
