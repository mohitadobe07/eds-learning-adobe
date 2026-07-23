import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Person-card variant of the cards block.
 * Each card: portrait photo + H3 name + H5 role + a row of social icon links.
 * Content model matches the vanilla cards block (row per card, image cell + body cell);
 * this variant only differs in styling and adds a social-links row inside the body.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-person-card-image';
      else div.className = 'cards-person-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Group the trailing run of links in each card body into a social-links row.
  ul.querySelectorAll('.cards-person-card-body').forEach((body) => {
    const socialLinks = [...body.children].filter((el) => el.tagName === 'P' && el.querySelector('a') && el.textContent.trim() === el.querySelector('a').textContent.trim());
    // Also handle a single paragraph/list containing multiple anchors.
    const anchors = [...body.querySelectorAll(':scope > p > a, :scope > ul > li > a')];
    if (anchors.length >= 2) {
      const nav = document.createElement('p');
      nav.className = 'cards-person-social';
      anchors.forEach((a) => {
        // strip enclosing single-anchor paragraphs/list items
        const wrapper = a.closest('li') || a.closest('p');
        nav.append(a);
        if (wrapper && wrapper.parentElement && wrapper.textContent.trim() === '') wrapper.remove();
      });
      body.append(nav);
    }
    socialLinks.forEach(() => {});
  });

  block.replaceChildren(ul);
}
