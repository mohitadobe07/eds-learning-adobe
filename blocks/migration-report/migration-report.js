import reportData from './report-data.js';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

function buildTabs(sections) {
  const nav = el('nav', 'migration-report-tabs');
  sections.forEach((s, i) => {
    const btn = el('button', `migration-report-tab${i === 0 ? ' active' : ''}`, s.label);
    btn.dataset.target = s.id;
    btn.type = 'button';
    nav.append(btn);
  });
  return nav;
}

function metricCard(num, label, pct) {
  const card = el('div', 'migration-report-card');
  card.append(el('div', 'migration-report-card-num', esc(num)));
  card.append(el('div', 'migration-report-card-lbl', esc(label)));
  if (typeof pct === 'number') {
    const bar = el('div', 'migration-report-bar');
    bar.append(el('span', null, ''));
    bar.querySelector('span').style.width = `${pct}%`;
    card.append(bar);
  }
  return card;
}

function buildOverview(d) {
  const sec = el('section', 'migration-report-section');
  sec.id = 'overview';
  sec.append(el('h2', 'migration-report-h2', 'Overview'));
  sec.append(el(
    'p',
    'migration-report-sub',
    `Full-site crawl of wknd.site produced a template-driven migration scope. ${d.metrics.analyzedTemplates} of ${d.metrics.totalTemplates} templates are analyzed and block-mapped.`,
  ));
  const cards = el('div', 'migration-report-cards');
  const mtr = d.metrics;
  cards.append(metricCard(mtr.totalPages, 'Pages discovered'));
  cards.append(metricCard(mtr.totalTemplates, 'Page templates'));
  cards.append(metricCard(`${mtr.analyzedTemplates}/${mtr.totalTemplates}`, 'Templates analyzed', Math.round((mtr.analyzedTemplates / mtr.totalTemplates) * 100)));
  cards.append(metricCard(mtr.totalBlockTypes, `Block variants (${mtr.edsBlockVariants} EDS · ${mtr.unknownBlockVariants} custom)`));
  cards.append(metricCard(mtr.localeCount, 'Locales'));
  cards.append(metricCard(`${mtr.percentAnalyzed}%`, 'Analysis coverage', mtr.percentAnalyzed));
  sec.append(cards);
  sec.append(el('h3', 'migration-report-h3', 'Locales'));
  const chips = el('div', 'migration-report-chips');
  d.locales.forEach((l) => chips.append(el('span', 'migration-report-chip', `${esc(l.locale)} · ${l.pages}`)));
  sec.append(chips);
  return sec;
}

function buildTemplates(d) {
  const sec = el('section', 'migration-report-section');
  sec.id = 'templates';
  sec.append(el('h2', 'migration-report-h2', 'Page Templates'));
  sec.append(el(
    'p',
    'migration-report-sub',
    'Pages grouped by structural similarity into reusable templates. Click a template to expand its blocks, representative page and full page list.',
  ));
  d.templates.forEach((t, i) => {
    const det = el('details', 'migration-report-tmpl');
    if (i === 0) det.open = true;
    const sum = el('summary', 'migration-report-tmpl-sum');
    sum.innerHTML = `<span class="migration-report-tname">${esc(t.name)}</span>`
      + `<span class="migration-report-count">${t.count} page${t.count === 1 ? '' : 's'}</span>`
      + `<span class="migration-report-pill ${t.analyzed ? 'analyzed' : 'pending'}">${t.analyzed ? 'analyzed' : 'not analyzed'}</span>${
        t.blocks.length ? `<span class="migration-report-pill built">${t.blocks.length} blocks</span>` : ''}`;
    det.append(sum);
    const body = el('div', 'migration-report-tmpl-body');
    body.append(el('p', 'migration-report-desc', esc(t.desc)));
    if (t.rep) body.append(el('div', 'migration-report-rep', `<strong>Representative page:</strong> <a href="${esc(t.rep)}">${esc(t.rep)}</a>`));
    body.append(el('h4', 'migration-report-h4', `Mapped blocks (${t.blocks.length})`));
    const bl = el('div', 'migration-report-blocklist');
    if (t.blocks.length) {
      t.blocks.forEach((b) => bl.append(el('span', 'migration-report-blockchip', `${esc(b)}<span class="migration-report-pill built">built</span>`)));
    } else {
      bl.append(el('span', 'migration-report-muted', 'Default content only'));
    }
    body.append(bl);
    body.append(el('h4', 'migration-report-h4', `Pages (${t.count})`));
    const list = el('div', 'migration-report-urls');
    t.urls.forEach((u) => list.append(el('a', null, esc(u.replace(/^https?:\/\/wknd\.site/, ''))))
      && list.lastChild.setAttribute('href', u));
    body.append(list);
    det.append(body);
    sec.append(det);
  });
  return sec;
}

function buildBlocks(d) {
  const sec = el('section', 'migration-report-section');
  sec.id = 'blocks';
  sec.append(el('h2', 'migration-report-h2', 'Block Inventory'));
  sec.append(el(
    'p',
    'migration-report-sub',
    `${d.blocks.length} unique block variants detected. Filter by name or toggle EDS / custom / built.`,
  ));
  const bar = el('div', 'migration-report-filterbar');
  const input = el('input', 'migration-report-search');
  input.type = 'text';
  input.placeholder = 'Filter blocks by name or shape…';
  bar.append(input);
  [['all', 'All'], ['eds', 'EDS'], ['custom', 'Custom'], ['built', 'Built']].forEach(([f, l], i) => {
    const b = el('button', `migration-report-ftag${i === 0 ? ' on' : ''}`, l);
    b.type = 'button';
    b.dataset.f = f;
    bar.append(b);
  });
  sec.append(bar);
  const table = el('table', 'migration-report-table');
  table.innerHTML = '<thead><tr><th data-c="0">Variant</th><th data-c="1">Base</th>'
    + '<th data-c="2">Content shape</th><th data-c="3">Pages</th><th data-c="4">Type</th></tr></thead>';
  const tb = el('tbody');
  const sorted = d.blocks.slice().sort((a, b) => {
    if (a.base === b.base) return b.pages - a.pages;
    if (a.base === 'unknown') return 1;
    if (b.base === 'unknown') return -1;
    return a.base.localeCompare(b.base);
  });
  sorted.forEach((v) => {
    const type = v.base === 'unknown' ? 'custom' : 'eds';
    const tr = el('tr');
    tr.dataset.type = type;
    tr.dataset.built = v.built ? '1' : '0';
    tr.dataset.name = `${v.id} ${v.desc}`.toLowerCase();
    tr.innerHTML = `<td><code>${esc(v.id)}</code>${v.built ? '<span class="migration-report-pill built">built</span>' : ''}</td>`
      + `<td>${esc(v.base)}</td><td>${esc(v.desc)}</td><td>${v.pages}</td>`
      + `<td><span class="migration-report-pill ${type}">${type === 'custom' ? 'custom' : 'EDS block'}</span></td>`;
    tb.append(tr);
  });
  table.append(tb);
  sec.append(table);
  return sec;
}

function buildInventory(d) {
  const sec = el('section', 'migration-report-section');
  sec.id = 'inventory';
  sec.append(el('h2', 'migration-report-h2', 'Page Inventory'));
  sec.append(el('p', 'migration-report-sub', `${d.metrics.totalPages} pages across ${d.groups.length} URL path groups.`));
  const t1 = el('table', 'migration-report-table');
  t1.innerHTML = '<thead><tr><th>Path pattern</th><th>Pages</th><th>Confidence</th></tr></thead>';
  const tb1 = el('tbody');
  d.groups.forEach((g) => {
    tb1.append(el('tr', null, `<td><code>${esc(g.path)}</code></td><td>${g.pages}</td><td>${esc(g.confidence)}</td>`));
  });
  t1.append(tb1);
  sec.append(t1);
  sec.append(el('h3', 'migration-report-h3', 'Coverage by template'));
  const t2 = el('table', 'migration-report-table');
  t2.innerHTML = '<thead><tr><th>Template</th><th>Pages</th><th>Status</th><th>Blocks</th></tr></thead>';
  const tb2 = el('tbody');
  d.templates.forEach((t) => {
    tb2.append(el('tr', null, `<td>${esc(t.name)}</td><td>${t.count}</td>`
      + `<td><span class="migration-report-pill ${t.analyzed ? 'analyzed' : 'pending'}">${t.analyzed ? 'analyzed' : 'pending'}</span></td>`
      + `<td>${t.blocks.length || '—'}</td>`));
  });
  t2.append(tb2);
  sec.append(t2);
  return sec;
}

function buildPlan(d) {
  const sec = el('section', 'migration-report-section');
  sec.id = 'plan';
  sec.append(el('h2', 'migration-report-h2', 'Migration Plan & Effort Estimate'));
  sec.append(el(
    'p',
    'migration-report-sub',
    'Sequential build order for migrating the WKND site to Edge Delivery Services: foundation first (project setup → base styles → header & footer), then one template at a time, then the full multi-locale rollout and launch. All steps are pending — this is a forward-looking plan.',
  ));

  const es = d.effortSummary;
  if (es) {
    const cards = el('div', 'migration-report-cards');
    cards.append(metricCard(`${es.totalLow}–${es.totalHigh}`, `Total effort (${es.unit})`));
    cards.append(metricCard(d.plan.length, 'Steps'));
    cards.append(metricCard('0%', 'Completed'));
    sec.append(cards);
  }

  const ol = el('ol', 'migration-report-plan');
  d.plan.forEach((p) => {
    const li = el('li', `migration-report-step ${p.status}`);
    li.innerHTML = `<b>${esc(p.phase)}: ${esc(p.title)}`
      + '<span class="migration-report-st">Pending</span>'
      + `<span class="migration-report-effort">${esc(p.effort)}</span></b>${esc(p.desc)}`;
    ol.append(li);
  });
  sec.append(ol);

  if (es) {
    sec.append(el(
      'div',
      'migration-report-note',
      `<strong>Total estimated effort: ${es.totalLow}–${es.totalHigh} ${es.unit}.</strong> ${esc(es.note)}`,
    ));
  }
  return sec;
}

export default function decorate(block) {
  const d = reportData;
  block.textContent = '';

  const header = el('div', 'migration-report-header');
  header.innerHTML = '<div class="migration-report-wm">WKND</div>'
    + '<h1 class="migration-report-title">EDS Migration Scoping Report</h1>'
    + '<p class="migration-report-lead">Scope, template analysis, block inventory and migration plan for migrating the '
    + 'WKND adventure &amp; travel site to Adobe Experience Manager Edge Delivery Services.</p>'
    + `<span class="migration-report-src">Source: ${esc(d.meta.source)} · ${esc(d.meta.date)}</span>`;
  block.append(header);

  const sections = [
    { id: 'overview', label: 'Overview', build: buildOverview },
    { id: 'templates', label: 'Templates', build: buildTemplates },
    { id: 'blocks', label: 'Block Inventory', build: buildBlocks },
    { id: 'inventory', label: 'Page Inventory', build: buildInventory },
    { id: 'plan', label: 'Migration Plan', build: buildPlan },
  ];

  const tabs = buildTabs(sections);
  block.append(tabs);

  const body = el('div', 'migration-report-body');
  sections.forEach((s, i) => {
    const built = s.build(d);
    if (i !== 0) built.hidden = true;
    body.append(built);
  });
  block.append(body);

  // tab switching
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.migration-report-tab');
    if (!btn) return;
    tabs.querySelectorAll('.migration-report-tab').forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    body.querySelectorAll('.migration-report-section').forEach((sec) => {
      sec.hidden = sec.id !== btn.dataset.target;
    });
  });

  // block filter + search
  const search = block.querySelector('.migration-report-search');
  const rows = [...block.querySelectorAll('#blocks tbody tr')];
  let mode = 'all';
  const applyFilter = () => {
    const q = (search.value || '').toLowerCase();
    rows.forEach((r) => {
      const okText = r.dataset.name.includes(q);
      let okMode = true;
      if (mode === 'eds') okMode = r.dataset.type === 'eds';
      else if (mode === 'custom') okMode = r.dataset.type === 'custom';
      else if (mode === 'built') okMode = r.dataset.built === '1';
      r.hidden = !(okText && okMode);
    });
  };
  if (search) search.addEventListener('input', applyFilter);
  block.querySelectorAll('.migration-report-ftag').forEach((b) => b.addEventListener('click', () => {
    block.querySelectorAll('.migration-report-ftag').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    mode = b.dataset.f;
    applyFilter();
  }));

  // sortable block table
  block.querySelectorAll('#blocks th').forEach((th) => {
    let asc = true;
    th.addEventListener('click', () => {
      const c = +th.dataset.c;
      const tbody = th.closest('table').querySelector('tbody');
      [...tbody.rows].sort((a, b) => {
        const x = a.cells[c].innerText.trim();
        const y = b.cells[c].innerText.trim();
        const nx = parseFloat(x);
        const ny = parseFloat(y);
        if (!Number.isNaN(nx) && !Number.isNaN(ny)) return asc ? nx - ny : ny - nx;
        return asc ? x.localeCompare(y) : y.localeCompare(x);
      }).forEach((r) => tbody.append(r));
      asc = !asc;
    });
  });
}
