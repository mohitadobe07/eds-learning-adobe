/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb.
 * Base: breadcrumb (custom block).
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Selector: main nav.cmp-breadcrumb
 *
 * Target block (blocks/breadcrumb/breadcrumb.js) expects a single cell holding
 * an <ul> of crumbs — each <li> is one crumb (ancestors contain a link, the
 * active current page is plain text). A list survives the markdown round-trip
 * intact, whereas multi-column or mixed inline cells lose the leading link.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.cmp-breadcrumb__item, li');
  const ul = document.createElement('ul');

  items.forEach((li) => {
    const link = li.querySelector('a');
    const isActive = li.classList.contains('cmp-breadcrumb__item--active');
    const label = (li.querySelector('span')?.textContent || li.textContent || '').trim();
    if (!label) return;

    const crumb = document.createElement('li');
    if (link && !isActive) {
      const a = document.createElement('a');
      let href = link.getAttribute('href') || '';
      href = href.replace(/\.html($|[?#])/, '$1');
      a.setAttribute('href', href);
      a.textContent = label;
      crumb.append(a);
    } else {
      crumb.textContent = label;
    }
    ul.append(crumb);
  });

  if (!ul.children.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells: [[ul]] });
  element.replaceWith(block);
}
