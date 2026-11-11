// Plays a project's video in the page's video dialog (components/VideoDialog.astro).
// Any link with a data-video attribute (a YouTube video id) opens it on a plain click;
// a Ctrl/Cmd/Shift/middle click still follows the link itself.
// Nothing is requested from YouTube before that: the player's iframe is built when the
// dialog opens and removed when it closes, which is also what stops the video.
// The video waits for the visitor to press play, and starts without captions.

// Chrome keeps a closing dialog on screen while it fades out (the CSS `overlay`
// property). Firefox and Safari drop it at once, so there the script holds the dialog
// open until the fade has played (see `close` below).
const fadesOutNatively = CSS.supports('overlay', 'auto');

const youtube = 'https://www.youtube-nocookie.com';

// enablejsapi lets the page send the player commands (see `tell`); YouTube wants to
// know which site they will come from (origin).
const embedUrl = (id: string) =>
  `${youtube}/embed/${encodeURIComponent(id)}?playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;

// Sends the player a message in the format YouTube's player listens for.
const tell = (player: HTMLIFrameElement, message: object) =>
  player.contentWindow?.postMessage(JSON.stringify(message), youtube);

export function initVideoDialog(): void {
  const dialog = document.querySelector<HTMLDialogElement>('.video-dialog');
  const title = dialog?.querySelector<HTMLElement>('.video-dialog-title');
  const projectLink = dialog?.querySelector<HTMLAnchorElement>('.video-dialog-link');
  const frame = dialog?.querySelector<HTMLElement>('.video-dialog-frame');
  if (!dialog || !title || !projectLink || !frame) return;

  const stop = () => frame.replaceChildren();
  let captionsDropped = false;

  const open = (link: HTMLAnchorElement) => {
    const name = link.dataset.videoTitle ?? '';
    title.textContent = name;
    projectLink.href = link.href;

    const player = document.createElement('iframe');
    player.src = embedUrl(link.dataset.video ?? '');
    player.title = `${name} video`;
    player.allow = 'encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    // YouTube refuses to play when it can't see which site the player is on.
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    // Asks the player to report when it's ready and when the video starts (see below).
    player.addEventListener('load', () => tell(player, { event: 'listening', id: 1, channel: 'widget' }));
    captionsDropped = false;
    frame.replaceChildren(player);

    dialog.showModal();
  };

  const close = async () => {
    stop();
    if (!fadesOutNatively) {
      dialog.dataset.closing = '';
      await Promise.allSettled(dialog.getAnimations().map((animation) => animation.finished));
      delete dialog.dataset.closing;
    }
    dialog.close();
  };

  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-video]')) {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(link);
    });
  }

  dialog.querySelector('.video-dialog-close')?.addEventListener('click', () => void close());
  // Escape, the phone's back gesture and a click outside the dialog all arrive here.
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    void close();
  });
  dialog.addEventListener('close', stop);

  // YouTube shows this video's captions on its own, and has no link setting to stop
  // that. So the player is told to drop them: once when it's ready and once when the
  // video first starts, which is when it loads them. After that the visitor's own
  // choice on the player's CC button is left alone.
  window.addEventListener('message', (event) => {
    const player = frame.querySelector('iframe');
    if (!player || event.source !== player.contentWindow || event.origin !== youtube) return;
    let message: { event?: string; info?: unknown };
    try {
      message = JSON.parse(event.data);
    } catch {
      return;
    }
    const started = message.event === 'onStateChange' && message.info === 1;
    if (message.event !== 'onReady' && !(started && !captionsDropped)) return;
    if (started) captionsDropped = true;
    tell(player, { event: 'command', func: 'unloadModule', args: ['captions'] });
  });

  // Safari still scrolls the page behind an open dialog when the wheel turns over it or
  // its backdrop (the CSS that prevents this elsewhere has no effect there yet). Nothing
  // in the dialog scrolls, so the wheel is simply switched off; Ctrl + wheel still zooms.
  dialog.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) event.preventDefault();
  }, { passive: false });

  // Safari doesn't know closedby="any" yet, so a click outside the dialog is caught by
  // hand: the press and the release both have to land outside it.
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (event: PointerEvent) => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (event) => {
      pressedOutside = outside(event);
    });
    dialog.addEventListener('pointerup', (event) => {
      if (pressedOutside && outside(event)) void close();
    });
  }
}
