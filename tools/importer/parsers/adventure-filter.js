/* eslint-disable */
/* global WebImporter */
/**
 * Parser for adventure-filter.
 * Base: adventure-filter (custom block).
 * Source: https://wknd.site/us/en/adventures.html
 * Selector: main #container-7ea6258004 .cmp-tabs, main .cmp-tabs
 *
 * Target block (blocks/adventure-filter/adventure-filter.js) expects one row
 * per adventure card:
 *   Column 1 = the card image.
 *   Column 2 = card body: linked heading + description paragraph.
 *   Column 3 = comma-separated categories (e.g. "Surfing, Travel"), or empty
 *              for uncategorized (All-only) cards. A dedicated column keeps the
 *              categories unambiguous even when a card has no category.
 *
 * Source: an AEM cmp-tabs whose FIRST (active) tab-panel — the "All" tab — holds
 * every unique adventure card as <li class="cmp-image-list__item"> nodes. Later
 * tab-panels only repeat subsets, so we read cards from the "All" panel and
 * attach each card's categories from the authored category mapping below.
 */

// Category -> adventure titles (from adventures-listing page-structure.json
// cardCategoryMapping). Inverted at runtime to title -> [categories].
const CATEGORY_MAP = {
  Climbing: ['Climbing New Zealand', 'Colorado Rock Climbing'],
  Cycling: ['Whistler Mountain Biking', 'Cycling Tuscany', 'West Coast Cycling'],
  Skiing: ['Downhill Skiing Wyoming', 'Ski Touring Mont Blanc', 'Tahoe Skiing'],
  Surfing: ['Bali Surf Camp', 'Surf Camp in Costa Rica'],
  Travel: ['Beervana in Portland', 'Cycling Tuscany', 'Gastronomic Marais Tour', 'Napa Wine Tasting', 'Riverside Camping', 'Yosemite Backpacking'],
};

function buildTitleToCategories() {
  const map = {};
  Object.keys(CATEGORY_MAP).forEach((category) => {
    CATEGORY_MAP[category].forEach((title) => {
      const key = title.trim().toLowerCase();
      if (!map[key]) map[key] = [];
      if (!map[key].includes(category)) map[key].push(category);
    });
  });
  return map;
}

export default function parse(element, { document }) {
  const titleToCategories = buildTitleToCategories();

  // The active "All" tab-panel holds the full, de-duplicated card set.
  const allPanel = element.querySelector('.cmp-tabs__tabpanel--active')
    || element.querySelector('.cmp-tabs__tabpanel')
    || element;
  const cards = allPanel.querySelectorAll('.cmp-image-list__item, li');

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const titleLink = card.querySelector('.cmp-image-list__item-title-link, a');
    const title = (card.querySelector('.cmp-image-list__item-title')?.textContent
      || titleLink?.textContent
      || '').trim();
    const description = (card.querySelector('.cmp-image-list__item-description')?.textContent || '').trim();

    if (!title && !img) return;

    // Column 1: image cell.
    let imageCell = '';
    if (img) {
      const picture = document.createElement('img');
      picture.setAttribute('src', img.getAttribute('src') || '');
      picture.setAttribute('alt', img.getAttribute('alt') || title);
      imageCell = picture;
    }

    // Column 2: body cell — linked heading + description.
    const bodyCell = [];

    if (title) {
      const heading = document.createElement('h3');
      if (titleLink) {
        const a = document.createElement('a');
        let href = titleLink.getAttribute('href') || '';
        href = href.replace(/\.html($|[?#])/, '$1');
        a.setAttribute('href', href);
        a.textContent = title;
        heading.append(a);
      } else {
        heading.textContent = title;
      }
      bodyCell.push(heading);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      bodyCell.push(p);
    }

    // Column 3: comma-separated categories (empty for All-only cards).
    const categories = titleToCategories[title.toLowerCase()] || [];
    const categoryCell = categories.join(', ');

    cells.push([imageCell, bodyCell, categoryCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'adventure-filter', cells });
  element.replaceWith(block);
}
