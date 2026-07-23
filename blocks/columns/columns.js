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
  // Tag it so CSS can render it as a compact, dimmed locked card.
  if (!block.querySelector('a')) {
    block.classList.add('columns-locked');
  }
}
