export function renderCatalog({ config, content, esc, pad }) {
  return `
    <div class="gc-menu-header" style="view-transition-name: gc-lede">
      <h2 class="gc-menu-title">${esc(config.catalogTitle)}</h2>
      <p class="gc-menu-subtitle">${esc(config.catalogSubtitle)}</p>
    </div>
    <nav class="gc-menu gc-console-surface" style="view-transition-name: gc-menu">
      ${content.categories.map((category, index) => `
        <button class="gc-menu-item" data-go="cards" data-cat="${index}">
          <span class="gc-icon-tile"><svg><use href="#${esc(category.icon)}"/></svg></span>
          <span class="gc-menu-label">${esc(category.title)}</span>
          <span class="gc-menu-badge">${category.facts.length} Demos</span>
          <span class="gc-menu-num">${pad(index)}</span>
        </button>`).join('')}
    </nav>`;
}
