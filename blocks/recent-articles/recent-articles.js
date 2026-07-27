import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Recent Articles block (dynamic).
 *
 * Builds the card row at runtime from the published magazine query index,
 * showing the most recently modified articles. Adding or updating a magazine
 * article automatically refreshes this row after publish — no authored list.
 *
 * Authored structure: a single-cell block whose text is the query-index path
 * (defaults to `/us/en/magazine/query-index.json`). An optional second cell may
 * carry the number of cards to show (defaults to 4).
 *
 * @param {Element} block The block element
 */
const DEFAULT_INDEX = '/us/en/magazine/query-index.json';
const DEFAULT_LIMIT = 4;

export default async function decorate(block) {
  const cells = [...block.children].map((row) => row.textContent.trim());
  const indexPath = cells[0] || DEFAULT_INDEX;
  const limit = Number.parseInt(cells[1], 10) || DEFAULT_LIMIT;
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

  // Most recently modified first.
  rows.sort((a, b) => Number(b.lastModified || 0) - Number(a.lastModified || 0));
  const recent = rows.filter((r) => r.title).slice(0, limit);

  const ul = document.createElement('ul');
  recent.forEach((row) => {
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
