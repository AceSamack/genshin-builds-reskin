const highlightClass = 'note-highlight';
const highlightDuration = 1400;

function highlightNote(target: Element | null) {
  if (!(target instanceof HTMLElement)) return;

  target.classList.remove(highlightClass);
  void target.offsetWidth;
  target.classList.add(highlightClass);

  window.setTimeout(() => {
    target.classList.remove(highlightClass);
  }, highlightDuration);
}

function findHashTarget(hash: string) {
  if (!hash) return null;

  return document.getElementById(decodeURIComponent(hash.slice(1)));
}

document.querySelectorAll<HTMLAnchorElement>('.note-link').forEach((link) => {
  link.addEventListener('click', () => {
    window.setTimeout(() => {
      highlightNote(findHashTarget(link.hash));
    }, 250);
  });
});

window.addEventListener('hashchange', () => {
  highlightNote(findHashTarget(window.location.hash));
});

if (window.location.hash) {
  highlightNote(findHashTarget(window.location.hash));
}
