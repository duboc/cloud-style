export function renderDetail({ content, state, esc, demoHtml }) {
  const category = content.categories[state.cat];
  const fact = category.facts[state.fact];
  const demoType = fact.demo || 'chat';
  return `
    <div class="gc-detail gc-console-surface" style="view-transition-name: gc-detail">
      <div class="gc-breadcrumb">
        <button class="gc-icon-btn" data-go="cover" aria-label="Home">
          <svg><use href="#gc-icon-home"/></svg>
        </button>
        <button class="gc-icon-btn" data-go="cards" data-cat="${state.cat}" aria-label="Back">
          <svg><use href="#gc-icon-back"/></svg>
        </button>
        <span class="gc-icon-tile gc-icon-tile--sm">
          <svg><use href="#${esc(category.icon)}"/></svg>
        </span>
        <h2 class="gc-breadcrumb-title">${esc(category.title)} | ${esc(content.brand.cardBold)}${esc(content.brand.cardLight)} ${state.fact + 1}</h2>
      </div>
      <p class="gc-article-title">${esc(fact.title)}</p>
      <p class="gc-article-lede">${esc(fact.lede)}</p>
      <p class="gc-article-body">${esc(fact.body)}</p>
    </div>

    <div class="gc-device-slot">
      <div class="gc-phone">
        <div class="gc-phone-screen">
          ${demoHtml(demoType, fact)}
        </div>
      </div>
    </div>`;
}
