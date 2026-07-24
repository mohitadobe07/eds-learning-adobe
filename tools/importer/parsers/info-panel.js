/* eslint-disable */
/* global WebImporter */
/**
 * Parser for info-panel.
 * Base: info-panel (custom block).
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Selector: main article > dl.cmp-contentfragment__elements
 *
 * Target block (blocks/info-panel/info-panel.js) expects a 2-column table,
 * one row per fact: left cell = label (dt), right cell = value (dd).
 * Source: a definition list where each fact is wrapped in a
 * div.cmp-contentfragment__element containing a <dt> title and <dd> value.
 */
export default function parse(element, { document }) {
  // Each fact is a div holding a dt (label) + dd (value).
  const facts = element.querySelectorAll('.cmp-contentfragment__element');
  const cells = [];

  facts.forEach((fact) => {
    const label = (fact.querySelector('dt, .cmp-contentfragment__element-title')?.textContent || '').trim();
    const value = (fact.querySelector('dd, .cmp-contentfragment__element-value')?.textContent || '').trim();
    if (!label && !value) return;
    cells.push([label, value]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'info-panel', cells });
  element.replaceWith(block);
}
