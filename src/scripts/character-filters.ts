const filters = document.querySelector<HTMLFormElement>(
  '[data-character-filters]',
);
const cards = document.querySelectorAll<HTMLElement>('[data-character-card]');

function getFilterValue(name: string) {
  const field = filters?.elements.namedItem(name);

  return field instanceof HTMLSelectElement || field instanceof HTMLInputElement
    ? field.value
    : '';
}

function applyFilters() {
  const search = getFilterValue('search').trim().toLowerCase();
  const selectedElement = getFilterValue('element');
  const selectedRarity = getFilterValue('rarity');
  const selectedWeapon = getFilterValue('weapon');

  cards.forEach((card) => {
    const matchesSearch =
      !search || card.dataset.name?.toLowerCase().includes(search);
    const matchesElement =
      !selectedElement || card.dataset.element === selectedElement;
    const matchesRarity =
      !selectedRarity || card.dataset.rarity === selectedRarity;
    const matchesWeapon =
      !selectedWeapon || card.dataset.weapon === selectedWeapon;

    card.hidden = !(
      matchesSearch &&
      matchesElement &&
      matchesRarity &&
      matchesWeapon
    );
  });
}

filters?.addEventListener('change', applyFilters);
filters?.addEventListener('input', applyFilters);
