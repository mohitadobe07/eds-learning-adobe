/* eslint-disable */
/* global WebImporter */
/**
 * Parser for destinations (dynamic).
 * Source: https://wknd.site/us/en.html — "Where do you want to go?" destination
 * .image-list.list grid.
 *
 * The target block (blocks/destinations/destinations.js) builds its card grid at
 * runtime from the published adventures query index, so the authored source
 * cards are not migrated. We emit a single-cell block carrying the query-index
 * path.
 */

const INDEX_PATH = '/us/en/adventures/query-index.json';

export default function parse(element, { document }) {
  const cells = [[INDEX_PATH]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'destinations', cells });
  element.replaceWith(block);
}
