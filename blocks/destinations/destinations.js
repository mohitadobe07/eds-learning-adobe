import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Destinations block (dynamic).
 *
 * Builds the destination card grid at runtime from the published adventures
 * query index, showing every adventure. Adding or removing an adventure detail
 * page automatically updates this grid after publish — no authored card list.
 *
 * Authored structure: a single-cell block whose text is the query-index path
 * (defaults to `/us/en/adventures/query-index.json`). An optional second cell
 * may carry a max card count (defaults to all).
 *
 * @param {Element} block The block element
 */
const DEFAULT_INDEX = '/us/en/adventures/query-index.json';

export default async function decorate(block) {
  const cells = [...block.children].map((row) => row.textContent.trim());
  const indexPath = cells[0] || DEFAULT_INDEX;
  const limit = Number.parseInt(cells[1], 10) || 0;
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

  rows.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  let items = rows.filter((r) => r.title);
  if (limit > 0) items = items.slice(0, limit);

  const ul = document.createElement('ul');
  items.forEach((row) => {
    const li = document.createElement('li');

    const imageDiv = document.createElement('div');
    imageDiv.className = 'cards-card-image';
    if (row.image) {
      imageDiv.append(createOptimizedPicture(row.image, row.title, false, [{ width: '750' }]));
    }

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'cards-card-body';
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
    ul.append(li);
  });

  block.replaceChildren(ul);
}
