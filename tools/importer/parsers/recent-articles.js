/* eslint-disable */
/* global WebImporter */
/**
 * Parser for recent-articles (dynamic).
 * Source: https://wknd.site/us/en.html — "Recent Articles" .image-list.list.
 *
 * The target block (blocks/recent-articles/recent-articles.js) builds its card
 * row at runtime from the published magazine query index, sorted by
 * last-modified, so the authored source cards are not migrated. We emit a
 * single-cell block carrying the query-index path.
 */

const INDEX_PATH = '/us/en/magazine/query-index.json';

export default function parse(element, { document }) {
  const cells = [[INDEX_PATH]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'recent-articles', cells });
  element.replaceWith(block);
}
