import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Adventure Filter block (dynamic).
 *
 * Renders a filterable grid of adventure cards built at runtime from the
 * published query index of the adventure detail pages, so the listing always
 * reflects the current set of child pages under /us/en/adventures/ without any
 * authored card list to maintain.
 *
 * Authored structure: a single-cell block whose text is the query-index path.
 * If empty, defaults to `/us/en/adventures/query-index.json` (a sibling of the
 * listing page).
 *
 * Each index row provides: path, title, description, image, category. The
 * `category` value may be comma-separated (a card can belong to several
 * filters). The filter tab bar is derived from the categories present, in a
 * fixed WKND order (All first).
 *
 * @param {Element} block The block element
 */
const ALL_LABEL = 'All';
const DEFAULT_INDEX = '/us/en/adventures/query-index.json';
const CATEGORY_ORDER = ['Surfing', 'Travel', 'Climbing', 'Cycling', 'Skiing'];

function slug(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function splitCategories(value) {
  return (value || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

function buildCard(row) {
  const li = document.createElement('li');
  const categories = splitCategories(row.category);
  li.dataset.categories = categories.map(slug).join(' ');

  const imageDiv = document.createElement('div');
  imageDiv.className = 'adventure-filter-card-image';
  if (row.image) {
    const link = document.createElement('a');
    link.href = row.path;
    link.append(createOptimizedPicture(row.image, row.title, false, [{ width: '750' }]));
    imageDiv.append(link);
  }

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'adventure-filter-card-body';
  const h3 = document.createElement('h3');
  const a = document.createElement('a');
  a.href = row.path;
  a.textContent = row.title;
  h3.append(a);
  bodyDiv.append(h3);
  if (row.description) {
    const p = document.createElement('p');
    p.textContent = row.description;
    bodyDiv.append(p);
  }

  li.append(imageDiv, bodyDiv);
  return li;
}

export default async function decorate(block) {
  const indexPath = (block.textContent || '').trim() || DEFAULT_INDEX;
  block.textContent = '';

  let rows = [];
  try {
    const resp = await fetch(indexPath);
    if (resp.ok) {
      const json = await resp.json();
      rows = json.data || [];
    }
  } catch (e) {
    rows = [];
  }

  // Keep a stable order: sort by title.
  rows.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const ul = document.createElement('ul');
  ul.className = 'adventure-filter-cards';

  const present = new Set();
  rows.forEach((row) => {
    if (!row.title) return;
    splitCategories(row.category).forEach((c) => present.add(c));
    ul.append(buildCard(row));
  });

  // Build the filter tab bar: All + each present category (fixed WKND order,
  // then any extra categories alphabetically).
  const ordered = [
    ...CATEGORY_ORDER.filter((c) => present.has(c)),
    ...[...present].filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ];

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
  ordered.forEach((label) => nav.append(makeTab(label, slug(label), false)));

  const applyFilter = (value) => {
    [...ul.children].forEach((li) => {
      const cats = (li.dataset.categories || '').split(' ').filter(Boolean);
      li.hidden = !(value === '*' || cats.includes(value));
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

  block.replaceChildren(nav, ul);
}
