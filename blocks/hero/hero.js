/**
 * WKND hero teaser — full-bleed background image with an overlapping white
 * content card (heading + description + CTA), matching the source hero teaser.
 *
 * Authored structure (1 column, 2 rows):
 *   | hero |
 *   | <picture>                 |   ← background image
 *   | <h2>Heading</h2>          |   ← content card
 *   | <p>Description</p>        |
 *   | <p><a>CTA</a></p>         |
 */
export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows[0];
  const contentRow = rows[1];

  if (imageRow) {
    imageRow.className = 'hero-image';
    const inner = imageRow.querySelector(':scope > div');
    if (inner) inner.replaceWith(...inner.childNodes);
  }

  if (contentRow) {
    contentRow.className = 'hero-content';
    const inner = contentRow.querySelector(':scope > div');
    if (inner) inner.replaceWith(...inner.childNodes);
  }
}
