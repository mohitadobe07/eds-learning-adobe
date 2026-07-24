export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // "Members only" locked teaser: a columns teaser with no CTA link (the source
  // "Read More" is plain text on the locked WKND magazine members-only cards).
  // Tag it so CSS can render it as a compact, dimmed locked card, and move the
  // image column to the top of each row so the card is image-over-text
  // regardless of the source cell order.
  // Gated on the page also having a `.cards` block (the magazine listing "All
  // Articles" grid) so the linkless intro teaser on the adventures-listing page
  // — which has no `.cards` — is not mistaken for a locked members-only card.
  if (!block.querySelector('a') && document.querySelector('.cards')) {
    block.classList.add('columns-locked');
    [...block.children].forEach((row) => {
      const imgCol = row.querySelector(':scope > .columns-img-col');
      if (imgCol && row.firstElementChild !== imgCol) {
        row.insertBefore(imgCol, row.firstElementChild);
      }
    });
  }
}
