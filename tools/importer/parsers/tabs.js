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

    // Promote image captions (<span class="cmp-image__title">) to italic
    // paragraphs so they survive as visible content — otherwise the span is
    // dropped when only p/ul/ol/headings/images are collected below.
    source.querySelectorAll('.cmp-image__title').forEach((cap) => {
      const text = cap.textContent.trim();
      if (!text) return;
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = text;
      p.append(em);
      const img = cap.closest('.cmp-image') || cap.parentElement;
      // Insert the caption paragraph right after the image wrapper.
      img.parentNode.insertBefore(p, img.nextSibling);
    });

    source.querySelectorAll('p, ul, ol, h1, h2, h3, h4, h5, h6, img, picture').forEach((node) => {
      // Skip AEM layout wrappers and empty nodes. Headings (H1-H6) are real
      // content even when nested in an .aem-Grid, so let them through.
      if (node.closest('.aem-Grid') && !['P', 'UL', 'OL', 'IMG', 'PICTURE'].includes(node.tagName) && !/^H[1-6]$/.test(node.tagName)) return;
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
