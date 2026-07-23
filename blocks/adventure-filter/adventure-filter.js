import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Adventure Filter block.
 *
 * Renders a grid of adventure cards (image + linked title + description) with an
 * interactive category filter bar above it. Categories are derived from each
 * card's authored category list, so authors never maintain a separate tab list.
 *
 * Expected authored structure (one row per adventure card):
 *   Column 1 = the card image.
 *   Column 2 = card body: a linked heading and a description paragraph.
 *   Column 3 = one or more comma-separated categories (e.g. "Surfing, Travel"),
 *              or empty for uncategorized (All-only) cards. Consumed to build
 *              the filter; not rendered in the card.
 *
 * @param {Element} block The block element
 */
const ALL_LABEL = 'All';

function slug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function decorate(block) {
  const rows = [...block.children];

  // Build the card list from authored rows.
  const ul = document.createElement('ul');
  const orderedCategories = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    // Column 3 (if present) holds the comma-separated categories.
    const categoryCol = cols.length >= 3 ? cols[cols.length - 1] : null;
    const cardCategories = [];
    if (categoryCol) {
      categoryCol.textContent.split(',').forEach((cat) => {
        const label = cat.trim();
        if (!label) return;
        cardCategories.push(label);
        if (!orderedCategories.includes(label)) orderedCategories.push(label);
      });
      categoryCol.remove();
    }

    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Classify the remaining columns: image vs body.
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'adventure-filter-card-image';
      } else {
        div.className = 'adventure-filter-card-body';
      }
    });

    li.dataset.categories = cardCategories.map(slug).join(' ');
    ul.append(li);
  });

  // Optimize images.
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Build the filter tab bar: All + each discovered category (in first-seen order).
  const nav = document.createElement('div');
  nav.className = 'adventure-filter-tabs';
  nav.setAttribute('role', 'tablist');

  const makeTab = (label, value, active) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'adventure-filter-tab';
    btn.textContent = label;
    btn.dataset.filter = value;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    if (active) btn.classList.add('adventure-filter-tab-active');
    return btn;
  };

  nav.append(makeTab(ALL_LABEL, '*', true));
  orderedCategories.forEach((label) => nav.append(makeTab(label, slug(label), false)));

  const applyFilter = (value) => {
    [...ul.children].forEach((li) => {
      const cats = (li.dataset.categories || '').split(' ').filter(Boolean);
      const show = value === '*' || cats.includes(value);
      li.hidden = !show;
    });
  };

  nav.addEventListener('click', (e) => {
    const tab = e.target.closest('.adventure-filter-tab');
    if (!tab) return;
    nav.querySelectorAll('.adventure-filter-tab').forEach((t) => {
      t.classList.remove('adventure-filter-tab-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('adventure-filter-tab-active');
    tab.setAttribute('aria-selected', 'true');
    applyFilter(tab.dataset.filter);
  });

  ul.className = 'adventure-filter-cards';
  block.replaceChildren(nav, ul);
}
