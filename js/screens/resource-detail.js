(function registerResourceDetail(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});

  screens["resource-detail"] = function renderResourceDetail({ route, data }) {
    const resource = data.resources.find((item) => item.id === route.id);
    if (!resource) {
      return `<section class="gc-page" data-screen="resource-detail"><h1>Resource not found</h1><a href="#/resources">Back to resources</a></section>`;
    }
    return `
      <section class="gc-page" data-screen="resource-detail">
        <nav class="gc-breadcrumb" aria-label="Breadcrumb"><a href="#/resources">Resources</a><span aria-hidden="true">/</span><span>${resource.name}</span></nav>
        <header class="gc-page-header"><div><p class="gc-eyebrow">${resource.type}</p><h1>${resource.name}</h1><p class="gc-page-description">${resource.region} · Updated ${resource.updated}</p></div></header>
        <section class="gc-panel"><h2>Summary</h2><p><span class="gc-status gc-status--success">${resource.status}</span></p></section>
      </section>`;
  };
})(window);
