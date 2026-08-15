export function renderCover({ config, content, esc }) {
  const brand = content.brand;
  return `
    <div class="gc-hero-card" style="view-transition-name: gc-lede">
      <div class="gc-hero-tag">${esc(config.heroTag)}</div>
      <div class="gc-hero-copy">
        ${brand.ledeStrong.map(line => `<h2 class="is-strong">${esc(line)}</h2>`).join('')}
        ${brand.ledeSoft.map(line => `<p class="is-soft">${esc(line)}</p>`).join('')}
      </div>
      <div class="gc-hero-actions">
        <button class="gc-btn gc-primary-action" data-go="menu"
                style="view-transition-name: gc-cta">${esc(brand.cta)} &rarr;</button>
        <button class="gc-btn-secondary" data-go="menu">Ver Trilhas (${content.categories.length})</button>
      </div>
    </div>

    <div class="gc-metrics-bar">
      ${config.metrics.map(metric => `
        <div class="gc-metric-tile">
          <span class="gc-metric-val">${esc(metric.value)}</span>
          <span class="gc-metric-lbl">${esc(metric.label)}</span>
        </div>`).join('')}
    </div>`;
}
