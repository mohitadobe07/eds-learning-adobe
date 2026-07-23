/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns.
 * Base block: columns
 * Source: https://wknd.site/us/en.html (main .teaser.cmp-teaser--featured)
 * Generated: 2026-07-23
 *
 * Structure (from library-description.txt): multiple columns/rows; column count
 * derived from the natural grouping of source content. WKND "Featured Article"
 * teaser is a single row with 2 columns:
 *   cell 1 = [pretitle text, heading, description, CTA link]
 *   cell 2 = image
 */
export default function parse(element, { document }) {
  // Text content column
  const contentCell = [];
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  if (pretitle) contentCell.push(pretitle);
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  if (heading) contentCell.push(heading);
  const description = element.querySelector('.cmp-teaser__description, p:not(.cmp-teaser__pretitle)');
  if (description) contentCell.push(description);
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a');
  if (cta) contentCell.push(cta);

  // Image column
  const img = element.querySelector('.cmp-teaser__image img, img');

  // Empty-block guard
  if (!contentCell.length && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [contentCell.length ? contentCell : '', img || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
