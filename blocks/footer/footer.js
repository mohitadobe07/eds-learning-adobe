import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Append a trailing slash to internal page links. Skips hash-only anchors,
 * external URLs, and links that already end with a slash.
 * @param {Element} container Element whose descendant links to normalize
 */
function addTrailingSlashToLinks(container) {
  container.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    const [path, rest = ''] = href.split(/(?=[?#])/);
    if (path.endsWith('/')) return;
    a.setAttribute('href', `${path}/${rest}`);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  addTrailingSlashToLinks(footer);

  block.append(footer);
}
