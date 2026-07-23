/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbParser from './parsers/breadcrumb.js';
import heroParser from './parsers/hero.js';
import infoPanelParser from './parsers/info-panel.js';
import tabsParser from './parsers/tabs.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  description: 'WKND adventure detail: breadcrumb, hero image, H1, info panel, tabs',
  urls: [
    'https://wknd.site/us/en/adventures/bali-surf-camp.html',
    'https://wknd.site/us/en/adventures/yosemite-backpacking.html',
    'https://wknd.site/us/en/adventures/tahoe-skiing.html',
  ],
  blocks: [
    { name: 'breadcrumb', instances: ['main nav.cmp-breadcrumb'] },
    { name: 'hero', instances: ['main div.carousel.cmp-carousel--mini'] },
    { name: 'info-panel', instances: ['main article > dl.cmp-contentfragment__elements'] },
    { name: 'tabs', instances: ['main div.tabs.panelcontainer > div.cmp-tabs'] },
  ],
  sections: [
    { id: 'd1', name: 'Breadcrumb', selector: 'main nav.cmp-breadcrumb', style: null, blocks: ['breadcrumb'], defaultContent: [] },
    { id: 'd2', name: 'Hero Image', selector: 'main div.carousel.cmp-carousel--mini', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'd3', name: 'Title', selector: 'main div.title.cmp-title--underline', style: null, blocks: [], defaultContent: ['main div.title.cmp-title--underline h1'] },
    { id: 'd4', name: 'Detail Body', selector: 'main article > dl.cmp-contentfragment__elements', style: 'detail-body', blocks: ['info-panel', 'tabs'], defaultContent: [] },
  ],
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

const parsers = {
  breadcrumb: breadcrumbParser,
  hero: heroParser,
  'info-panel': infoPanelParser,
  tabs: tabsParser,
};

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
