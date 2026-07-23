/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 *
 * Removes AEM Sites chrome / non-authorable content and unwraps the deep
 * responsivegrid / cmp-container wrapper divs so the actual content sections
 * are exposed at the top level of `main`.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Enable body scroll (source body carries the `scrolly` class and may lock
    // overflow). Verified: <body class="page basicpage anonymous scrolly">.
    const doc = element.ownerDocument;
    if (doc && doc.body) {
      doc.body.classList.remove('scrolly');
      doc.body.style.overflow = 'scroll';
    }

    // Non-content resources / noise that could interfere with parsing.
    // Verified generic tags; site emits scripts/styles/noscript/meta noise.
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      // Cookie / consent banners (generic + common vendor ids/classes).
      '[id*="cookie"]',
      '[class*="cookie"]',
      '[id*="consent"]',
      '[class*="consent"]',
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      // Content-fragment internal title — not shown on the source page and
      // would otherwise duplicate the page H1 (e.g. "Bali Surf Camp").
      '.cmp-contentfragment__title',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove AEM Sites global chrome (non-authorable).
    // Verified in cleaned.html:
    //   <header ... class="experiencefragment cmp-experiencefragment--header ...">
    //   <footer ... class="experiencefragment cmp-experiencefragment--footer ...">
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      '.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      '.cmp-experiencefragment--footer',
      // Mobile navigation clone lives outside the header/footer XF wrappers and
      // otherwise leaks the site nav (Home / Magazine / Adventures / ...) into content.
      '.cmp-navigation--mobile',
      '.cmp-navigation',
      '.cmp-languagenavigation',
      'iframe',
      'source',
    ]);

    // Unwrap the deep AEM responsivegrid / container wrapper chain so the real
    // content sections become direct children. Verified wrapper selectors:
    //   .root.container.responsivegrid > #container-... .cmp-container > .aem-Grid
    //   nested .container.responsivegrid > .cmp-container > .aem-Grid ...
    //   inner <main class="... cmp-layout-container--fixed ...">
    // We unwrap repeatedly until no wrapper remains, promoting each wrapper's
    // children into its parent while preserving content order.
    const WRAPPER_SELECTOR = [
      '.responsivegrid',
      '.cmp-container',
      '.aem-Grid',
      'main.cmp-layout-container--fixed',
    ].join(',');

    let wrapper = element.querySelector(WRAPPER_SELECTOR);
    let guard = 0;
    while (wrapper && wrapper !== element && guard < 5000) {
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

    // Strip AEM data-layer / accessibility attributes that authors never edit.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-hook-image');
      el.removeAttribute('data-cmp-hook-teaser');
      el.removeAttribute('data-cmp-hook-carousel');
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-cmp-link-accessibility-enabled');
      el.removeAttribute('data-cmp-link-accessibility-text');
    });

    // Normalize internal links to extensionless EDS paths: strip the trailing
    // `.html` from same-host / relative page links (preserving query + hash).
    // External links (other hosts) and non-page hrefs are left untouched.
    const sourceHost = (() => {
      try { return new URL(payload && payload.url).hostname; } catch (e) { return null; }
    })();
    element.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      // Only touch relative paths or absolute URLs on the source host.
      let isInternal = href.startsWith('/');
      let url = null;
      if (!isInternal) {
        try {
          url = new URL(href, payload && payload.url);
          isInternal = sourceHost && url.hostname === sourceHost;
        } catch (e) { return; }
      }
      if (!isInternal) return;
      // Strip `.html` sitting just before end / query / hash.
      const normalized = href.replace(/\.html(?=$|[?#])/i, '');
      if (normalized !== href) a.setAttribute('href', normalized);
    });

    // Buttonize standalone AEM CTAs (a.cmp-button) that survive as default
    // content (block parsers have already consumed block-scoped CTAs). Wrap the
    // link text in <strong><em> so EDS decorateButtons renders it as the yellow
    // accent button — matching the source WKND primary buttons.
    element.querySelectorAll('a.cmp-button').forEach((a) => {
      const doc = a.ownerDocument;
      // Use the button label text (source wraps it in span.cmp-button__text).
      const label = (a.textContent || '').trim();
      if (!label) return;
      const link = doc.createElement('a');
      link.setAttribute('href', a.getAttribute('href') || '');
      link.textContent = label;
      const em = doc.createElement('em');
      const strong = doc.createElement('strong');
      em.append(link);
      strong.append(em);
      a.replaceWith(strong);
    });
  }
}
