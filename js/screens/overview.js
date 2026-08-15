(function registerOverview(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});

  function outcomeClass(outcome) {
    return outcome.toLowerCase() === "warning" ? "warning" : "success";
  }

  screens.overview = function renderOverview({ data, config }) {
    const healthyResources = data.resources.filter((resource) => resource.status === "Healthy").length;
    const operations = data.operations.slice(0, 3).map((operation) => `
      <li class="gc-operation-row">
        <span class="gc-operation-icon gc-operation-icon--${outcomeClass(operation.outcome)}" aria-hidden="true"></span>
        <span><strong>${operation.label}</strong><small>${operation.actor}</small></span>
        <time>${operation.time}</time>
      </li>`).join("");

    return `
      <section class="gc-page gc-overview" data-screen="overview">
        <header class="gc-page-header">
          <div>
            <p class="gc-eyebrow">${config.environmentLabel} environment</p>
            <h1>Overview</h1>
            <p class="gc-page-description">Monitor resources and recent operations from one place.</p>
          </div>
          <a class="gc-button gc-button--primary" href="#/resources">Create resource</a>
        </header>

        <section class="gc-overview-hero" aria-labelledby="environment-heading">
          <div class="gc-overview-hero-copy">
            <span class="gc-status gc-status--success">Healthy</span>
            <h2 id="environment-heading">Your application is running normally</h2>
            <p>Core resources are available and recent operations completed without service disruption.</p>
            <a class="gc-text-link" href="#/activity">View application activity</a>
          </div>
          <img src="assets/supercloud.png" alt="" aria-hidden="true">
        </section>

        <div class="gc-overview-grid">
          <section class="gc-panel" aria-labelledby="environment-summary-heading">
            <div class="gc-section-heading">
              <div><p class="gc-eyebrow">Environment</p><h2 id="environment-summary-heading">Production summary</h2></div>
              <a class="gc-text-link" href="#/resources">View resources</a>
            </div>
            <dl class="gc-summary-list">
              <div><dt>Project</dt><dd>${config.projectLabel}</dd></div>
              <div><dt>Resources</dt><dd>${data.resources.length}</dd></div>
              <div><dt>Healthy</dt><dd>${healthyResources} of ${data.resources.length}</dd></div>
              <div><dt>Primary region</dt><dd>us-central1</dd></div>
            </dl>
          </section>

          <section class="gc-panel" aria-labelledby="recent-operations-heading">
            <div class="gc-section-heading">
              <div><p class="gc-eyebrow">Latest changes</p><h2 id="recent-operations-heading">Recent operations</h2></div>
              <a class="gc-text-link" href="#/activity">View all</a>
            </div>
            <ol class="gc-operation-list">${operations}</ol>
          </section>
        </div>
      </section>`;
  };
})(window);
