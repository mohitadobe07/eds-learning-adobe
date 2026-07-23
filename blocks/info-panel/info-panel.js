/**
 * Info panel block — a set of label/value facts rendered as a definition list.
 *
 * Authored structure (2 columns, N rows — one row per fact):
 *   | info-panel |
 *   | Activity       | Surfing        |
 *   | Adventure Type | Overnight Trip |
 *   | Trip Length    | 6 Days         |
 *   | ...            | ...            |
 *
 * Left cell = term (label), right cell = definition (value).
 */
export default function decorate(block) {
  const rows = [...block.children];

  const dl = document.createElement('dl');
  dl.className = 'info-panel-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const valueCell = cells[1];
    if (!labelCell) return;

    const dt = document.createElement('dt');
    dt.className = 'info-panel-term';
    dt.textContent = labelCell.textContent.trim();

    const dd = document.createElement('dd');
    dd.className = 'info-panel-value';
    if (valueCell) {
      dd.innerHTML = valueCell.innerHTML.trim();
    }

    dl.append(dt, dd);
  });

  block.textContent = '';
  block.append(dl);
}
