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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/cards-person.js
  function parse(element, { document }) {
    const img = element.querySelector(".cmp-image img, img");
    const body = [];
    const name = element.querySelector(".title .cmp-title__text, h3");
    if (name) {
      const h3 = document.createElement("h3");
      h3.textContent = name.textContent.trim();
      body.push(h3);
    }
    const role = element.querySelector(".cmp-title--black .cmp-title__text, h5");
    if (role) {
      const h5 = document.createElement("h5");
      h5.textContent = role.textContent.trim();
      body.push(h5);
    }
    const socials = [...element.querySelectorAll(".cmp-buildingblock--btn-list a, .buildingblock a.cmp-button, a.cmp-button")];
    socials.forEach((a) => {
      const href = a.getAttribute("href") || "#";
      let label = (a.getAttribute("aria-label") || a.textContent || "").trim();
      const iconSpan = a.querySelector('[class*="cmp-button__icon--"]');
      if (iconSpan) {
        const m = [...iconSpan.classList].find((c) => c.startsWith("cmp-button__icon--"));
        if (m) label = m.replace("cmp-button__icon--", "");
      }
      if (!label) return;
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      p.append(link);
      body.push(p);
    });
    if (!img && !body.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[img || "", body.length ? body : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-person", cells });
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

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "WKND About Us: H1, Our Contributors + WKND Guides person card grids",
    urls: ["https://wknd.site/us/en/about-us.html"],
    blocks: [
      { name: "cards-person", instances: ["main section.experiencefragment.cmp-experience-fragment--contributor"] }
    ],
    sections: [
      { id: "a1", name: "Title", selector: "main .title:first-of-type", style: null, blocks: [], defaultContent: ["main .title:first-of-type h1"] },
      { id: "a2", name: "People Grids", selector: "main #container-5b0414191a", style: null, blocks: ["cards-person"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  var parsers = {
    "cards-person": parse
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
  var import_about_us_default = {
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
      const basePath = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      const path = `${basePath}/index`;
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
