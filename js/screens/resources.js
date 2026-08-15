(function registerResources(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});

  screens.resources = function renderResources() {
    return `
      <section class="gc-page" data-screen="resources">
        <header class="gc-page-header">
          <div><p class="gc-eyebrow">Inventory</p><h1>Resources</h1><p class="gc-page-description">View and manage application resources.</p></div>
        </header>
        <section class="gc-panel"><p>Resource inventory is ready.</p></section>
      </section>`;
  };
})(window);
