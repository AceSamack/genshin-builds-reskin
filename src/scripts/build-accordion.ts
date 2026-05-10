const cards = document.querySelectorAll<HTMLElement>('.build-card');

function openCard(targetId: string | null) {
  cards.forEach((card) => {
    const isTarget = card.dataset.id === targetId;
    card.classList.toggle('open', isTarget);
  });
}

cards.forEach((card) => {
  const button = card.querySelector<HTMLButtonElement>('.build-header');

  if (!button) return;

  button.addEventListener('click', () => {
    const id = card.dataset.id;
    const isOpen = card.classList.contains('open');
    const newState = isOpen ? null : id;

    const url = new URL(window.location.href);

    if (newState) {
      url.searchParams.set('build', newState);
    } else {
      url.searchParams.delete('build');
    }

    window.history.pushState({}, '', url);
    openCard(newState ?? null);
  });
});

const initial = new URLSearchParams(window.location.search).get('build');

if (initial) {
  openCard(initial);
}
