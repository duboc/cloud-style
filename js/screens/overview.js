(function registerOverview(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});

  screens.overview = function renderOverview() {
    return `
      <section class="gc-page" data-screen="overview">
        <header class="gc-page-header">
          <div>
            <p class="gc-eyebrow">Application</p>
            <h1>Overview</h1>
            <p class="gc-page-description">Monitor resources and recent operations from one place.</p>
          </div>
          <a class="gc-button gc-button--primary" href="#/resources">Create resource</a>
        </header>
        <section class="gc-panel">
          <h2>Application status</h2>
          <p><span class="gc-status gc-status--success">Healthy</span> All core services are available.</p>
        </section>
      </section>`;
  };
})(window);
