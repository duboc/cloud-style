export function renderCatalog({ config, content, esc }) {
  return `
    <div class="gc-menu-header" style="view-transition-name: gc-lede">
      <h2 class="gc-menu-title">${esc(config.catalogTitle)}</h2>
      <p class="gc-menu-subtitle">${esc(config.catalogSubtitle)}</p>
    </div>
    <nav class="gc-menu gc-workspace-list" aria-label="Solution starters" style="view-transition-name: gc-menu">
      ${content.categories.map((category, index) => `
        <button class="gc-menu-item" data-go="cards" data-cat="${index}">
          <span class="gc-menu-copy">
            <span class="gc-menu-label">${esc(category.title)}</span>
            <span class="gc-solution-description">${esc(category.description || 'Customize this starter for your application.')}</span>
          </span>
          <span class="gc-solution-arrow" aria-hidden="true">&rarr;</span>
        </button>`).join('')}
    </nav>`;
}
