/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel.
 * Base block: carousel
 * Source: https://wknd.site/us/en.html (main .carousel.cmp-carousel--hero)
 * Generated: 2026-07-23
 *
 * Structure (from library-description.txt): 2 columns, multiple rows.
 * Each subsequent row is one slide: cell 1 = image, cell 2 = [title, description, CTA].
 * Source: each slide is a `.cmp-carousel__item` containing a `.cmp-teaser`.
 */
export default function parse(element, { document }) {
  const cells = [];

  const slides = element.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // Image cell: the teaser image
    const img = slide.querySelector('.cmp-teaser__image img, img');

    // Content cell: title, description, CTA link
    const contentCell = [];
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (title) contentCell.push(title);
    const description = slide.querySelector('.cmp-teaser__description, p');
    if (description) contentCell.push(description);
    const cta = slide.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');
    if (cta) contentCell.push(cta);

    // Only add a slide row if it has meaningful content
    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
