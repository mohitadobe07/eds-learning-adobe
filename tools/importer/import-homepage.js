/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import recentArticlesParser from './parsers/recent-articles.js';
import heroParser from './parsers/hero.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND homepage: hero carousel, featured-article teaser, recent-articles card row, secondary hero teaser, destination card grid',
  urls: [
    'https://wknd.site/us/en.html',
  ],
  blocks: [
    {
      name: 'carousel',
      instances: ['main .carousel.cmp-carousel--hero'],
    },
    {
      name: 'columns',
      instances: ['main .teaser.cmp-teaser--featured'],
    },
    {
      name: 'recent-articles',
      instances: [
        'main .cmp-layout-container--fixed:nth-of-type(1) .image-list.list',
      ],
    },
    {
      name: 'cards',
      instances: [
        'main .cmp-layout-container--fixed:nth-of-type(2) .image-list.list',
      ],
    },
    {
      name: 'hero',
      instances: ['main .teaser.cmp-teaser--hero.cmp-teaser--imagebottom'],
    },
  ],
  sections: [
    { id: 'rc2', name: 'Hero Carousel', selector: 'main .cmp-carousel--hero', style: null, blocks: ['carousel'], defaultContent: [] },
    { id: 'rc3', name: 'Featured Article', selector: 'main .teaser.cmp-teaser--featured', style: null, blocks: ['columns'], defaultContent: [] },
    { id: 'rc4', name: 'Recent Articles Heading', selector: 'main .title.cmp-title--underline:nth-of-type(2)', style: null, blocks: [], defaultContent: ['main .title.cmp-title--underline:nth-of-type(2) h2'] },
    { id: 'rc5', name: 'Recent Articles Cards', selector: 'main .cmp-layout-container--fixed:nth-of-type(1) .image-list.list', style: null, blocks: ['recent-articles'], defaultContent: [] },
    { id: 'rc9', name: 'Next Adventures Teaser', selector: 'main .teaser.cmp-teaser--hero.cmp-teaser--imagebottom', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'rc10', name: 'Where To Go Heading', selector: 'main .cmp-layout-container--fixed:nth-of-type(2) .title', style: null, blocks: [], defaultContent: ['main .cmp-layout-container--fixed:nth-of-type(2) .title h3'] },
    { id: 'rc11', name: 'Destination Cards', selector: 'main .cmp-layout-container--fixed:nth-of-type(2) .image-list.list', style: null, blocks: ['cards'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (both hook-guarded internally)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

// PARSER REGISTRY
const parsers = {
  carousel: carouselParser,
  columns: columnsParser,
  cards: cardsParser,
  'recent-articles': recentArticlesParser,
  hero: heroParser,
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. The homepage (/us/en) is a section root
    // (parent of other content) so it becomes a folder-index document.
    const basePath = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );
    const path = `${basePath}/index`;

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
