/* eslint-disable */
/* global WebImporter */
/**
 * Parser for adventure-filter (dynamic).
 * Base: adventure-filter (custom block).
 * Source: https://wknd.site/us/en/adventures.html
 * Selector: main #container-7ea6258004 .cmp-tabs, main .cmp-tabs
 *
 * The target block (blocks/adventure-filter/adventure-filter.js) builds its card
 * grid at runtime from the published query index of the adventure detail pages,
 * so the authored source card list is not migrated. We emit a single-cell block
 * carrying the query-index path; the block filters cards by their `category`
 * metadata (indexed via helix-query.yaml).
 */

const INDEX_PATH = '/us/en/adventures/query-index.json';

export default function parse(element, { document }) {
  const cells = [[INDEX_PATH]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'adventure-filter', cells });
  element.replaceWith(block);
}
