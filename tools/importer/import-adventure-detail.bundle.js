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

  // tools/importer/import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".cmp-breadcrumb__item, li");
    const ul = document.createElement("ul");
    items.forEach((li) => {
      var _a;
      const link = li.querySelector("a");
      const isActive = li.classList.contains("cmp-breadcrumb__item--active");
      const label = (((_a = li.querySelector("span")) == null ? void 0 : _a.textContent) || li.textContent || "").trim();
      if (!label) return;
      const crumb = document.createElement("li");
      if (link && !isActive) {
        const a = document.createElement("a");
        let href = link.getAttribute("href") || "";
        href = href.replace(/\.html($|[?#])/, "$1");
        a.setAttribute("href", href);
        a.textContent = label;
        crumb.append(a);
      } else {
        crumb.textContent = label;
      }
      ul.append(crumb);
    });
    if (!ul.children.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells: [[ul]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse2(element, { document }) {
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

  // tools/importer/parsers/info-panel.js
  function parse3(element, { document }) {
    const facts = element.querySelectorAll(".cmp-contentfragment__element");
    const cells = [];
    facts.forEach((fact) => {
      var _a, _b;
      const label = (((_a = fact.querySelector("dt, .cmp-contentfragment__element-title")) == null ? void 0 : _a.textContent) || "").trim();
      const value = (((_b = fact.querySelector("dd, .cmp-contentfragment__element-value")) == null ? void 0 : _b.textContent) || "").trim();
      if (!label && !value) return;
      cells.push([label, value]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "info-panel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs.js
  function parse4(element, { document }) {
    const labels = [...element.querySelectorAll(":scope > .cmp-tabs__tablist > li, :scope > ol > li")];
    const panels = [...element.querySelectorAll(":scope > .cmp-tabs__tabpanel")];
    const cells = [];
    panels.forEach((panel, i) => {
      var _a;
      const label = (((_a = labels[i]) == null ? void 0 : _a.textContent) || `Tab ${i + 1}`).trim();
      const article = panel.querySelector("article, .cmp-contentfragment, .contentfragment") || panel;
      const contentNodes = [];
      const source = article.querySelector(".cmp-contentfragment__elements") || article;
      source.querySelectorAll("p, ul, ol, h1, h2, h3, h4, h5, h6, img, picture").forEach((node) => {
        if (node.closest(".aem-Grid") && !["P", "UL", "OL", "IMG", "PICTURE"].includes(node.tagName)) return;
        if ((node.tagName === "P" || /^H[1-6]$/.test(node.tagName)) && !node.textContent.trim() && !node.querySelector("img, picture")) return;
        contentNodes.push(node);
      });
      if (contentNodes.length === 0) contentNodes.push(article);
      cells.push([label, contentNodes]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs", cells });
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
        "#onetrust-banner-sdk",
        // Content-fragment internal title — not shown on the source page and
        // would otherwise duplicate the page H1 (e.g. "Bali Surf Camp").
        ".cmp-contentfragment__title"
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

  // tools/importer/import-adventure-detail.js
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    description: "WKND adventure detail: breadcrumb, hero image, H1, info panel, tabs",
    urls: [
      "https://wknd.site/us/en/adventures/bali-surf-camp.html",
      "https://wknd.site/us/en/adventures/yosemite-backpacking.html",
      "https://wknd.site/us/en/adventures/tahoe-skiing.html"
    ],
    blocks: [
      { name: "breadcrumb", instances: ["main nav.cmp-breadcrumb"] },
      { name: "hero", instances: ["main div.carousel.cmp-carousel--mini"] },
      { name: "info-panel", instances: ["main article > dl.cmp-contentfragment__elements"] },
      { name: "tabs", instances: ["main div.tabs.panelcontainer > div.cmp-tabs"] }
    ],
    sections: [
      { id: "d1", name: "Breadcrumb", selector: "main nav.cmp-breadcrumb", style: null, blocks: ["breadcrumb"], defaultContent: [] },
      { id: "d2", name: "Hero Image", selector: "main div.carousel.cmp-carousel--mini", style: null, blocks: ["hero"], defaultContent: [] },
      { id: "d3", name: "Title", selector: "main div.title.cmp-title--underline", style: null, blocks: [], defaultContent: ["main div.title.cmp-title--underline h1"] },
      { id: "d4", name: "Detail Body", selector: "main article > dl.cmp-contentfragment__elements", style: "detail-body", blocks: ["info-panel", "tabs"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  var parsers = {
    breadcrumb: parse,
    hero: parse2,
    "info-panel": parse3,
    tabs: parse4
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
  var import_adventure_detail_default = {
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
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_adventure_detail_exports);
})();
