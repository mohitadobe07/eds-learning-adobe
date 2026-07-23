/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks.
 *
 * The homepage template defines 7 sections (see tools/importer/page-templates.json).
 * This transformer inserts an <hr> section break before each section except the
 * first, using the section selectors from `payload.template.sections`.
 *
 * None of the WKND homepage sections declare a `style`, so no Section Metadata
 * blocks are created. The logic below still handles styles (for reuse) by
 * creating a Section Metadata block for any section that has one.
 *
 * Runs in afterTransform only.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const document = element.ownerDocument;
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (sections.length < 2) {
      return;
    }

    // Resolve a section anchor from its CSS selector. Selectors are scoped to
    // `main`; the transformer receives `main` as `element`.
    const resolveSelector = (selector) => {
      if (!selector) return null;
      const scoped = selector.replace(/^main\s+/, ':scope ');
      return element.querySelector(scoped) || element.querySelector(selector);
    };

    // Block sections: by afterTransform the parsers have already replaced the
    // source element (e.g. .cmp-carousel--hero) with a block table
    // (div.carousel), so the original selector is stale. Resolve those sections
    // to their parsed block div, picking the Nth occurrence of that block name
    // in DOM order (rc5 = first .cards, rc11 = second .cards, etc.).
    const blockLists = {};
    const blockCounters = {};
    const resolveAnchor = (section) => {
      if (section.blocks && section.blocks.length) {
        const name = section.blocks[0];
        if (!blockLists[name]) {
          blockLists[name] = [...element.querySelectorAll(`.${name}`)];
          blockCounters[name] = 0;
        }
        const el = blockLists[name][blockCounters[name]];
        blockCounters[name] += 1;
        if (el) return el;
      }
      return resolveSelector(section.selector);
    };

    // Compute anchors in FORWARD order (so block ordinals count correctly),
    // then insert breaks in reverse so earlier insertions don't shift anchors.
    const resolved = sections.map((section) => {
      const anchor = resolveAnchor(section);
      if (!anchor) return null;
      // Walk up to the top-level child of `element`.
      let top = anchor;
      while (top.parentNode && top.parentNode !== element) {
        top = top.parentNode;
      }
      return (top.parentNode === element) ? { section, top } : null;
    });

    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const entry = resolved[i];
      if (!entry) continue;
      const { section, top } = entry;

      // Section Metadata block (only for sections that declare a style).
      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        top.parentNode.insertBefore(metadata, top.nextSibling);
      }

      // Insert <hr> before every section except the first.
      if (i > 0) {
        const hr = document.createElement('hr');
        top.parentNode.insertBefore(hr, top);
      }
    }
  }
}
