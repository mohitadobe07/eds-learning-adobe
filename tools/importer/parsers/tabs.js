/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs.
 * Base: tabs.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Selector: main div.tabs.panelcontainer > div.cmp-tabs
 *
 * Target block (blocks/tabs/tabs.js) treats each block row as one tab: the
 * row's first cell is the tab label, the remaining cell(s) are the panel
 * content. So we emit a 2-column table, one row per tab: [label, panelContent].
 *
 * Source structure: an <ol class="cmp-tabs__tablist"> of <li> labels followed
 * by sibling <div class="cmp-tabs__tabpanel"> panels, paired by document order.
 */
export default function parse(element, { document }) {
  const labels = [...element.querySelectorAll(':scope > .cmp-tabs__tablist > li, :scope > ol > li')];
  const panels = [...element.querySelectorAll(':scope > .cmp-tabs__tabpanel')];

  const cells = [];

  panels.forEach((panel, i) => {
    const label = (labels[i]?.textContent || `Tab ${i + 1}`).trim();

    // Panel content lives inside the content fragment article; fall back to
    // the panel itself. Pull the meaningful content nodes (drop empty AEM grids).
    const article = panel.querySelector('article, .cmp-contentfragment, .contentfragment') || panel;

    const contentNodes = [];
    const source = article.querySelector('.cmp-contentfragment__elements') || article;
    source.querySelectorAll('p, ul, ol, h1, h2, h3, h4, h5, h6, img, picture').forEach((node) => {
      // Skip AEM layout wrappers and empty nodes.
      if (node.closest('.aem-Grid') && !['P', 'UL', 'OL', 'IMG', 'PICTURE'].includes(node.tagName)) return;
      if ((node.tagName === 'P' || /^H[1-6]$/.test(node.tagName)) && !node.textContent.trim() && !node.querySelector('img, picture')) return;
      contentNodes.push(node);
    });

    if (contentNodes.length === 0) contentNodes.push(article);
    cells.push([label, contentNodes]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
