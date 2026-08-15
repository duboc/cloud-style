export function renderCards({ content, state, esc }) {
  const category = content.categories[state.cat];
  return `
    <section class="gc-detail gc-workflow-page" style="view-transition-name: gc-detail">
      <header class="gc-workflow-header">
        <span class="gc-workflow-eyebrow">Solutions</span>
        <h2>${esc(category.title)}</h2>
        <p>${esc(category.description || 'Choose a workflow to customize for your application.')}</p>
      </header>
      <div class="gc-workflow-list" role="list">
        ${category.facts.map((fact, index) => `
          <button type="button" class="gc-workflow-row" role="listitem"
                  data-go="article" data-cat="${state.cat}" data-fact="${index}">
            <span class="gc-workflow-copy">
              <strong>${esc(fact.title)}</strong>
              <span>${esc(fact.lede)}</span>
            </span>
            <span class="gc-workflow-meta">${fact.live ? 'Interactive workflow' : 'Starter workflow'}</span>
            <span class="gc-workflow-open">Open <span aria-hidden="true">&rarr;</span></span>
          </button>`).join('')}
      </div>
    </section>`;
}
