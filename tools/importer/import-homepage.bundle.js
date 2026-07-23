/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document }) {
    const cells = [];
    const slides = element.querySelectorAll(".cmp-carousel__item");
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, img");
      const contentCell = [];
      const title = slide.querySelector(".cmp-teaser__title, h1, h2, h3, h4, h5, h6");
      if (title) contentCell.push(title);
      const description = slide.querySelector(".cmp-teaser__description, p");
      if (description) contentCell.push(description);
      const cta = slide.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
      if (cta) contentCell.push(cta);
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const contentCell = [];
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    if (pretitle) contentCell.push(pretitle);
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3, h4, h5, h6");
    if (heading) contentCell.push(heading);
    const description = element.querySelector(".cmp-teaser__description, p:not(.cmp-teaser__pretitle)");
    if (description) contentCell.push(description);
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a");
    if (cta) contentCell.push(cta);
    const img = element.querySelector(".cmp-teaser__image img, img");
    if (!contentCell.length && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [contentCell.length ? contentCell : "", img || ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".cmp-image-list__item");
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image-list__item-image img, img");
      const contentCell = [];
      const titleLink = item.querySelector("a.cmp-image-list__item-title-link");
      const titleText = item.querySelector(".cmp-image-list__item-title");
      if (titleLink) {
        const heading = document.createElement("h3");
        const link = document.createElement("a");
        link.href = titleLink.getAttribute("href");
        link.textContent = (titleText ? titleText.textContent : titleLink.textContent).trim();
        heading.append(link);
        contentCell.push(heading);
      } else if (titleText) {
        const heading = document.createElement("h3");
        heading.textContent = titleText.textContent.trim();
        contentCell.push(heading);
      }
      const description = item.querySelector(".cmp-image-list__item-description");
      if (description) contentCell.push(description);
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse4(element, { document }) {
    const img = element.querySelector(".cmp-teaser__image img, img");
    const contentCell = [];
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3, h4, h5, h6");
    if (heading) contentCell.push(heading);
    const description = element.querySelector(".cmp-teaser__description, p");
    if (description) contentCell.push(description);
    const cta = element.querySelector(".cmp-teaser__action-link, .cmp-teaser__action-container a, a");
    if (cta) contentCell.push(cta);
    if (!img && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [img || ""],
      [contentCell.length ? contentCell : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      const doc = element.ownerDocument;
      if (doc && doc.body) {
        doc.body.classList.remove("scrolly");
        doc.body.style.overflow = "scroll";
      }
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        // Cookie / consent banners (generic + common vendor ids/classes).
        '[id*="cookie"]',
        '[class*="cookie"]',
        '[id*="consent"]',
        '[class*="consent"]',
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        ".cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        ".cmp-experiencefragment--footer",
        // Mobile navigation clone lives outside the header/footer XF wrappers and
        // otherwise leaks the site nav (Home / Magazine / Adventures / ...) into content.
        ".cmp-navigation--mobile",
        ".cmp-navigation",
        ".cmp-languagenavigation",
        "iframe",
        "source"
      ]);
      const WRAPPER_SELECTOR = [
        ".responsivegrid",
        ".cmp-container",
        ".aem-Grid",
        "main.cmp-layout-container--fixed"
      ].join(",");
      let wrapper = element.querySelector(WRAPPER_SELECTOR);
      let guard = 0;
      while (wrapper && wrapper !== element && guard < 5e3) {
        const parent = wrapper.parentNode;
        if (parent) {
          while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, wrapper);
          }
          wrapper.remove();
        } else {
          break;
        }
        wrapper = element.querySelector(WRAPPER_SELECTOR);
        guard += 1;
      }
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("data-cmp-hook-teaser");
        el.removeAttribute("data-cmp-hook-carousel");
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("data-cmp-link-accessibility-enabled");
        el.removeAttribute("data-cmp-link-accessibility-text");
      });
      const sourceHost = (() => {
        try {
          return new URL(payload && payload.url).hostname;
        } catch (e) {
          return null;
        }
      })();
      element.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#")) return;
        let isInternal = href.startsWith("/");
        let url = null;
        if (!isInternal) {
          try {
            url = new URL(href, payload && payload.url);
            isInternal = sourceHost && url.hostname === sourceHost;
          } catch (e) {
            return;
          }
        }
        if (!isInternal) return;
        const normalized = href.replace(/\.html(?=$|[?#])/i, "");
        if (normalized !== href) a.setAttribute("href", normalized);
      });
      element.querySelectorAll("a.cmp-button").forEach((a) => {
        const doc = a.ownerDocument;
        const label = (a.textContent || "").trim();
        if (!label) return;
        const link = doc.createElement("a");
        link.setAttribute("href", a.getAttribute("href") || "");
        link.textContent = label;
        const em = doc.createElement("em");
        const strong = doc.createElement("strong");
        em.append(link);
        strong.append(em);
        a.replaceWith(strong);
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const document = element.ownerDocument;
      const sections = payload && payload.template && payload.template.sections || [];
      if (sections.length < 2) {
        return;
      }
      const resolveSelector = (selector) => {
        if (!selector) return null;
        const scoped = selector.replace(/^main\s+/, ":scope ");
        return element.querySelector(scoped) || element.querySelector(selector);
      };
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
      const resolved = sections.map((section) => {
        const anchor = resolveAnchor(section);
        if (!anchor) return null;
        let top = anchor;
        while (top.parentNode && top.parentNode !== element) {
          top = top.parentNode;
        }
        return top.parentNode === element ? { section, top } : null;
      });
      for (let i = resolved.length - 1; i >= 0; i -= 1) {
        const entry = resolved[i];
        if (!entry) continue;
        const { section, top } = entry;
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          top.parentNode.insertBefore(metadata, top.nextSibling);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          top.parentNode.insertBefore(hr, top);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND homepage: hero carousel, featured-article teaser, recent-articles card row, secondary hero teaser, destination card grid",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      {
        name: "carousel",
        instances: ["main .carousel.cmp-carousel--hero"]
      },
      {
        name: "columns",
        instances: ["main .teaser.cmp-teaser--featured"]
      },
      {
        name: "cards",
        instances: [
          "main .cmp-layout-container--fixed:nth-of-type(1) .image-list.list",
          "main .cmp-layout-container--fixed:nth-of-type(2) .image-list.list"
        ]
      },
      {
        name: "hero",
        instances: ["main .teaser.cmp-teaser--hero.cmp-teaser--imagebottom"]
      }
    ],
    sections: [
      { id: "rc2", name: "Hero Carousel", selector: "main .cmp-carousel--hero", style: null, blocks: ["carousel"], defaultContent: [] },
      { id: "rc3", name: "Featured Article", selector: "main .teaser.cmp-teaser--featured", style: null, blocks: ["columns"], defaultContent: [] },
      { id: "rc4", name: "Recent Articles Heading", selector: "main .title.cmp-title--underline:nth-of-type(2)", style: null, blocks: [], defaultContent: ["main .title.cmp-title--underline:nth-of-type(2) h2"] },
      { id: "rc5", name: "Recent Articles Cards", selector: "main .cmp-layout-container--fixed:nth-of-type(1) .image-list.list", style: null, blocks: ["cards"], defaultContent: [] },
      { id: "rc9", name: "Next Adventures Teaser", selector: "main .teaser.cmp-teaser--hero.cmp-teaser--imagebottom", style: null, blocks: ["hero"], defaultContent: [] },
      { id: "rc10", name: "Where To Go Heading", selector: "main .cmp-layout-container--fixed:nth-of-type(2) .title", style: null, blocks: [], defaultContent: ["main .cmp-layout-container--fixed:nth-of-type(2) .title h3"] },
      { id: "rc11", name: "Destination Cards", selector: "main .cmp-layout-container--fixed:nth-of-type(2) .image-list.list", style: null, blocks: ["cards"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  var parsers = {
    carousel: parse,
    columns: parse2,
    cards: parse3,
    hero: parse4
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
