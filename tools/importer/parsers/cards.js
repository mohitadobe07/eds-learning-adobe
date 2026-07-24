/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards.
 * Base block: cards
 * Source: https://wknd.site/us/en.html
 *   (main .cmp-layout-container--fixed .image-list.list — recent articles & destinations)
 * Generated: 2026-07-23
 *
 * Structure (from library-description.txt): 2 columns, multiple rows.
 * Each subsequent row is one card: cell 1 = image, cell 2 = [title/heading, description].
 * Source: each card is a `.cmp-image-list__item` containing an image link, a
 * title link, and a description span.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Variant B: "up next" / related-stories list — each item is a linked title
  // plus a date, no image (main aside .list.cmp-list--upnext). One card per
  // item: a single body cell holding an <h3><a>title</a></h3> and the date.
  const listItems = element.querySelectorAll('.cmp-list__item');
  if (listItems.length) {
    listItems.forEach((item) => {
      const link = item.querySelector('a.cmp-list__item-link, a');
      const title = item.querySelector('.cmp-list__item-title');
      const date = item.querySelector('.cmp-list__item-date');
      const contentCell = [];
      if (link) {
        const heading = document.createElement('h3');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = (title ? title.textContent : link.textContent).trim();
        heading.append(a);
        contentCell.push(heading);
      }
      if (date && date.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = date.textContent.trim();
        contentCell.push(p);
      }
      if (contentCell.length) cells.push([contentCell]);
    });

    if (cells.length) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
      element.replaceWith(block);
      return;
    }
  }

  const items = element.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    // Image cell
    const img = item.querySelector('.cmp-image-list__item-image img, img');

    // Text cell: linked title/heading + description
    const contentCell = [];
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleText = item.querySelector('.cmp-image-list__item-title');
    if (titleLink) {
      // Preserve the link but expose the title text as its label
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href');
      link.textContent = (titleText ? titleText.textContent : titleLink.textContent).trim();
      heading.append(link);
      contentCell.push(heading);
    } else if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText.textContent.trim();
      contentCell.push(heading);
    }

    const description = item.querySelector('.cmp-image-list__item-description');
    if (description) contentCell.push(description);

    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
