/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion.
 * Base block: accordion
 * Source: https://wknd.site/us/en/faqs.html (main .accordion .cmp-accordion)
 *
 * EDS accordion convention: a 2-column table, one row per accordion item —
 * cell 1 = the clickable title, cell 2 = the collapsible content. The target
 * block (blocks/accordion/accordion.js) converts each row into
 * <details><summary>title</summary><div>content</div></details>.
 *
 * Source structure: <div class="cmp-accordion"> with repeated
 * <div class="cmp-accordion__item">, each holding
 *   h3.cmp-accordion__header > button > span.cmp-accordion__title (title)
 *   div.cmp-accordion__panel (content, wrapped in AEM grid/text containers).
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll(':scope > .cmp-accordion__item, .cmp-accordion__item')];
  const cells = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header');
    const title = (titleEl ? titleEl.textContent : '').trim();

    const panel = item.querySelector('.cmp-accordion__panel');
    const contentNodes = [];
    if (panel) {
      const source = panel.querySelector('.cmp-text') || panel;
      source.querySelectorAll('p, ul, ol, h1, h2, h3, h4, h5, h6').forEach((node) => {
        if ((node.tagName === 'P' || /^H[1-6]$/.test(node.tagName)) && !node.textContent.trim() && !node.querySelector('img, picture')) return;
        contentNodes.push(node);
      });
      if (contentNodes.length === 0 && panel.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = panel.textContent.trim();
        contentNodes.push(p);
      }
    }

    if (title || contentNodes.length) {
      const titleCell = document.createElement('p');
      titleCell.textContent = title;
      cells.push([titleCell, contentNodes.length ? contentNodes : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
