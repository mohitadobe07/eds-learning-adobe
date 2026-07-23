/**
 * Breadcrumb block — a navigation trail of ancestor links ending in the
 * current (active) page.
 *
 * If crumbs are authored (a list of <li> items, ancestors as links + a final
 * plain-text active crumb), they are used as-is. Otherwise the trail is derived
 * from the current URL path so the breadcrumb is always correct even when the
 * authored content is sparse.
 */
function titleCase(segment) {
  return segment
    .replace(/\.html$/, '')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function decorate(block) {
  const authored = [...block.querySelectorAll('li')];

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const list = document.createElement('ol');
  list.className = 'breadcrumb-list';

  const addCrumb = (label, href, active) => {
    const item = document.createElement('li');
    item.className = 'breadcrumb-item';
    if (href && !active) {
      const a = document.createElement('a');
      a.className = 'breadcrumb-link';
      a.href = href;
      a.textContent = label;
      item.append(a);
    } else {
      item.classList.add('breadcrumb-item-active');
      item.setAttribute('aria-current', 'page');
      const span = document.createElement('span');
      span.textContent = label;
      item.append(span);
    }
    list.append(item);
  };

  // Use authored crumbs only if more than one is present (a full trail).
  if (authored.length > 1) {
    authored.forEach((li) => {
      const link = li.querySelector('a');
      if (link) addCrumb(link.textContent.trim(), link.getAttribute('href'), false);
      else addCrumb(li.textContent.trim(), null, true);
    });
  } else {
    // Derive from the URL path: /us/en/adventures/bali-surf-camp
    // → drop the /us/en locale prefix, link ancestors, active current page.
    const parts = window.location.pathname.split('/').filter(Boolean);
    const crumbs = parts.slice(2); // drop locale (us/en)
    let acc = `/${parts.slice(0, 2).join('/')}`;
    crumbs.forEach((seg, i) => {
      acc += `/${seg}`;
      const isLast = i === crumbs.length - 1;
      addCrumb(titleCase(seg), isLast ? null : `${acc}/`, isLast);
    });
  }

  nav.append(list);
  block.textContent = '';
  block.append(nav);
}
