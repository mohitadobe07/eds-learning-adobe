/**
 * Breadcrumb block — a navigation trail of ancestor links ending in the
 * current (active) page.
 *
 * Authored structure (1 column, N rows — one row per crumb):
 *   | breadcrumb |
 *   | [Adventures](/us/en/adventures) |  ← linked ancestor crumb
 *   | Bali Surf Camp                  |  ← active current page (plain text)
 *
 * Any row whose cell contains a link becomes a linked crumb; the final row
 * (or any row with no link) is treated as the active/current crumb.
 */
export default function decorate(block) {
  const rows = [...block.children];

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const list = document.createElement('ol');
  list.className = 'breadcrumb-list';

  rows.forEach((row, i) => {
    const cell = row.firstElementChild || row;
    const link = cell.querySelector('a');
    const isLast = i === rows.length - 1;

    const item = document.createElement('li');
    item.className = 'breadcrumb-item';

    if (link && !isLast) {
      link.className = 'breadcrumb-link';
      item.append(link);
    } else {
      // active / current page — render as plain text
      item.classList.add('breadcrumb-item-active');
      item.setAttribute('aria-current', 'page');
      const text = (link ? link.textContent : cell.textContent).trim();
      const span = document.createElement('span');
      span.textContent = text;
      item.append(span);
    }

    list.append(item);
  });

  nav.append(list);
  block.textContent = '';
  block.append(nav);
}
