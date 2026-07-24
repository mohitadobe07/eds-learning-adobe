/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero.
 * Base block: hero
 * Source: https://wknd.site/us/en.html (main .teaser.cmp-teaser--hero.cmp-teaser--imagebottom)
 * Generated: 2026-07-23
 *
 * EDS "hero" convention: 1 column, with the block-name row followed by
 *   row 2 = background image
 *   row 3 = title + subheading + call-to-action
 * The WKND "Next Adventures" teaser (full-bleed image + overlapping content
 * card) maps directly onto this structure.
 */
export default function parse(element, { document }) {
  // Row: background image.
  const img = element.querySelector('.cmp-teaser__image img, img');

  // Row: title + subheading + CTA.
  const contentCell = [];
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  if (heading) contentCell.push(heading);
  const description = element.querySelector('.cmp-teaser__description, p');
  if (description) contentCell.push(description);
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, a');
  if (cta) contentCell.push(cta);

  // Empty-block guard.
  if (!img && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [img || ''],
    [contentCell.length ? contentCell : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
