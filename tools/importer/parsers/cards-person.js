/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-person.
 * Base block: cards-person (person-card variant of cards)
 * Source: https://wknd.site/us/en/about-us.html
 *   (main section.experiencefragment.cmp-experience-fragment--contributor)
 *
 * EDS cards convention: a 2-column table, one row per card — cell 1 = image,
 * cell 2 = text content (title heading, then description/links). Each source
 * instance is ONE person's experience fragment, so this parser emits a
 * one-row cards-person block per person (image cell + body cell holding the
 * name h3, role h5, and social links).
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.cmp-image img, img');

  const body = [];
  const name = element.querySelector('.title .cmp-title__text, h3');
  if (name) {
    const h3 = document.createElement('h3');
    h3.textContent = name.textContent.trim();
    body.push(h3);
  }
  const role = element.querySelector('.cmp-title--black .cmp-title__text, h5');
  if (role) {
    const h5 = document.createElement('h5');
    h5.textContent = role.textContent.trim();
    body.push(h5);
  }

  // Social links: the button-list anchors (Facebook / Twitter / Instagram).
  const socials = [...element.querySelectorAll('.cmp-buildingblock--btn-list a, .buildingblock a.cmp-button, a.cmp-button')];
  socials.forEach((a) => {
    const href = a.getAttribute('href') || '#';
    let label = (a.getAttribute('aria-label') || a.textContent || '').trim();
    const iconSpan = a.querySelector('[class*="cmp-button__icon--"]');
    if (iconSpan) {
      const m = [...iconSpan.classList].find((c) => c.startsWith('cmp-button__icon--'));
      if (m) label = m.replace('cmp-button__icon--', '');
    }
    if (!label) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    p.append(link);
    body.push(p);
  });

  if (!img && !body.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[img || '', body.length ? body : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-person', cells });
  element.replaceWith(block);
}
