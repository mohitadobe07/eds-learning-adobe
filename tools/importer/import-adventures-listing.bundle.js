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

  // tools/importer/import-adventures-listing.js
  var import_adventures_listing_exports = {};
  __export(import_adventures_listing_exports, {
    default: () => import_adventures_listing_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document }) {
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

  // tools/importer/parsers/adventure-filter.js
  var CATEGORY_MAP = {
    Climbing: ["Climbing New Zealand", "Colorado Rock Climbing"],
    Cycling: ["Whistler Mountain Biking", "Cycling Tuscany", "West Coast Cycling"],
    Skiing: ["Downhill Skiing Wyoming", "Ski Touring Mont Blanc", "Tahoe Skiing"],
    Surfing: ["Bali Surf Camp", "Surf Camp in Costa Rica"],
    Travel: ["Beervana in Portland", "Cycling Tuscany", "Gastronomic Marais Tour", "Napa Wine Tasting", "Riverside Camping", "Yosemite Backpacking"]
  };
  function buildTitleToCategories() {
    const map = {};
    Object.keys(CATEGORY_MAP).forEach((category) => {
      CATEGORY_MAP[category].forEach((title) => {
        const key = title.trim().toLowerCase();
        if (!map[key]) map[key] = [];
        if (!map[key].includes(category)) map[key].push(category);
      });
    });
    return map;
  }
  function parse2(element, { document }) {
    const titleToCategories = buildTitleToCategories();
    const allPanel = element.querySelector(".cmp-tabs__tabpanel--active") || element.querySelector(".cmp-tabs__tabpanel") || element;
    const cards = allPanel.querySelectorAll(".cmp-image-list__item, li");
    const cells = [];
    cards.forEach((card) => {
      var _a, _b;
      const img = card.querySelector("img");
      const titleLink = card.querySelector(".cmp-image-list__item-title-link, a");
      const title = (((_a = card.querySelector(".cmp-image-list__item-title")) == null ? void 0 : _a.textContent) || (titleLink == null ? void 0 : titleLink.textContent) || "").trim();
      const description = (((_b = card.querySelector(".cmp-image-list__item-description")) == null ? void 0 : _b.textContent) || "").trim();
      if (!title && !img) return;
      let imageCell = "";
      if (img) {
        const picture = document.createElement("img");
        picture.setAttribute("src", img.getAttribute("src") || "");
        picture.setAttribute("alt", img.getAttribute("alt") || title);
        imageCell = picture;
      }
      const bodyCell = [];
      if (title) {
        const heading = document.createElement("h3");
        if (titleLink) {
          const a = document.createElement("a");
          let href = titleLink.getAttribute("href") || "";
          href = href.replace(/\.html($|[?#])/, "$1");
          a.setAttribute("href", href);
          a.textContent = title;
          heading.append(a);
        } else {
          heading.textContent = title;
        }
        bodyCell.push(heading);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description;
        bodyCell.push(p);
      }
      const categories = titleToCategories[title.toLowerCase()] || [];
      if (categories.length) {
        const catPara = document.createElement("p");
        catPara.textContent = categories.join(", ");
        bodyCell.push(catPara);
      }
      cells.push([imageCell, bodyCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "adventure-filter", cells });
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

  // tools/importer/import-adventures-listing.js
  var PAGE_TEMPLATE = {
    name: "adventures-listing",
    description: "WKND adventures listing: H1 banner, 2-col intro teaser, Current Adventures tab-filter over a card grid",
    urls: [
      "https://wknd.site/us/en/adventures.html"
    ],
    blocks: [
      {
        name: "columns",
        instances: ["main .teaser.cmp-teaser--hero .cmp-teaser"]
      },
      {
        name: "adventure-filter",
        instances: ["main #container-7ea6258004 .cmp-tabs", "main .cmp-tabs"]
      }
    ],
    sections: [
      { id: "s1", name: "Adventures Banner", selector: "main #container-6069f81f2b", style: null, blocks: ["columns"], defaultContent: ["#container-9e4d6ec1e1 .cmp-title h1"] },
      { id: "s2", name: "Current Adventures", selector: "main #container-7ea6258004", style: null, blocks: ["adventure-filter"], defaultContent: ["#title-dffa0ffaf3 .cmp-title h2"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  var parsers = {
    columns: parse,
    "adventure-filter": parse2
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
          pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_adventures_listing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      const seen = /* @__PURE__ */ new Set();
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        if (seen.has(block.element)) return;
        seen.add(block.element);
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
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_adventures_listing_exports);
})();
