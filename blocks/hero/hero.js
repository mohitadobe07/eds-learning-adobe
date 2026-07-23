/**
 * WKND hero teaser — full-bleed background image with an overlapping white
 * content card (heading + description + CTA), matching the source hero teaser.
 *
 * Authored structure (one cell):
 *   | hero |
 *   | <picture>                 |
 *   | <h2>Heading</h2>          |
 *   | <p>Description</p>        |
 *   | <p><a>CTA</a></p>         |
 *
 * The order of picture vs text is tolerated; the image is pulled into a
 * background layer and the remaining text is grouped into a content card.
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div') || block;

  // Split image from the rest of the content.
  const picture = cell.querySelector('picture');
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hero-image';
  if (picture) {
    const pictureHost = picture.closest('p') || picture;
    imageWrapper.append(picture);
    if (pictureHost !== picture && pictureHost.parentNode) pictureHost.remove();
  }

  const content = document.createElement('div');
  content.className = 'hero-content';
  while (cell.firstChild) content.append(cell.firstChild);

  cell.append(imageWrapper, content);
}
