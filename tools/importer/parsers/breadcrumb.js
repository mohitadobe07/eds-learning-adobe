/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb.
 * Base: breadcrumb (custom block).
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Selector: main nav.cmp-breadcrumb
 *
 * Target block (blocks/breadcrumb/breadcrumb.js) expects a 1-column table,
 * one row per crumb. A row with a link = linked ancestor crumb; the final
 * (active) row = plain-text current page. .html is stripped from crumb links.
 */
export default function parse(element, { document }) {
  // Each crumb is an <li> in the source breadcrumb list.
  const items = element.querySelectorAll('.cmp-breadcrumb__item, li');
  const cells = [];

  items.forEach((li) => {
    const link = li.querySelector('a');
    const isActive = li.classList.contains('cmp-breadcrumb__item--active');
    const label = (li.querySelector('span')?.textContent || li.textContent || '').trim();
    if (!label) return;

    if (link && !isActive) {
      // Linked ancestor crumb — strip .html from the href.
      const a = document.createElement('a');
      let href = link.getAttribute('href') || '';
      href = href.replace(/\.html($|[?#])/, '$1');
      a.setAttribute('href', href);
      a.textContent = label;
      cells.push([a]);
    } else {
      // Active current page — plain text crumb.
      cells.push([label]);
    }
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
