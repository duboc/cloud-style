export function renderDetail({ content, state, esc, demoHtml }) {
  const category = content.categories[state.cat];
  const fact = category.facts[state.fact];
  const demoType = fact.demo || 'chat';
  const isPack = [
    'image-studio', 'video-studio', 'analytics', 'databases', 'business-flows',
  ].includes(demoType);
  return `
    <section class="gc-detail gc-tool-page" style="view-transition-name: gc-detail">
      <header class="gc-tool-header">
        <div class="gc-tool-breadcrumb">
          <button data-go="menu">Solutions</button>
          <span>/</span>
          <button data-go="cards" data-cat="${state.cat}">${esc(category.title)}</button>
          <span>/</span>
          <span>${esc(fact.title)}</span>
        </div>
        <h2>${esc(fact.title)}</h2>
        <p>${esc(fact.lede)}</p>
      </header>
      <div class="gc-tool-surface">
        ${isPack
          ? `<div class="gc-demo-pack-host" data-demo-pack-id="${esc(demoType)}"></div>`
          : demoHtml(demoType, fact)}
      </div>
    </section>`;
}
