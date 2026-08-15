export function renderCards({ content, state, esc, mark, pad }) {
  const category = content.categories[state.cat];
  return `
    <div class="gc-detail gc-console-surface" style="view-transition-name: gc-detail">
      <div class="gc-breadcrumb">
        <button class="gc-icon-btn" data-go="cover" aria-label="Home">
          <svg><use href="#gc-icon-home"/></svg>
        </button>
        <button class="gc-icon-btn" data-go="menu" aria-label="Back">
          <svg><use href="#gc-icon-back"/></svg>
        </button>
        <span class="gc-icon-tile gc-icon-tile--sm">
          <svg><use href="#${esc(category.icon)}"/></svg>
        </span>
        <h2 class="gc-breadcrumb-title">${esc(category.title)}</h2>
        <span class="gc-breadcrumb-num">${pad(state.cat)}</span>
      </div>

      <div class="gc-rail gc-no-scrollbar">
        <div class="gc-rail-track">
          ${category.facts.map((fact, index) => `
            <button type="button" class="gc-card${fact.live ? ' gc-card--live' : ''}"
                    data-go="article" data-cat="${state.cat}" data-fact="${index}">
              <div class="gc-card-head">
                <span>${mark(content.brand.cardBold, content.brand.cardLight)}</span>
                <span class="gc-card-num">${index + 1}</span>
              </div>
              <div class="gc-card-body">
                <p class="gc-card-title">${esc(fact.title)}</p>
                ${fact.tag ? `<span class="gc-tag">${esc(fact.tag)}</span>` : ''}
              </div>
            </button>`).join('')}
        </div>
      </div>
    </div>`;
}
