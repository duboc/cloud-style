(function registerResources(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});
  const mounts = global.CloudStyleScreenMounts || (global.CloudStyleScreenMounts = {});

  function statusClass(status) {
    return status === "Attention" ? "warning" : "success";
  }

  function resourceRows(resources) {
    return resources.map((resource) => {
      const searchText = `${resource.name} ${resource.type} ${resource.region} ${resource.status}`.toLowerCase();
      return `
        <tr data-resource-row data-resource-id="${resource.id}" data-search="${searchText}" tabindex="0" aria-label="Open ${resource.name}">
          <th scope="row"><a href="#/resources/${resource.id}">${resource.name}</a><small>${resource.type}</small></th>
          <td>${resource.region}</td>
          <td><span class="gc-status gc-status--${statusClass(resource.status)}">${resource.status}</span></td>
          <td>${resource.updated}</td>
          <td class="gc-row-action"><a href="#/resources/${resource.id}" aria-label="Open ${resource.name}">View</a></td>
        </tr>`;
    }).join("");
  }

  screens.resources = function renderResources({ data }) {
    return `
      <section class="gc-page" data-screen="resources">
        <header class="gc-page-header">
          <div><p class="gc-eyebrow">Inventory</p><h1>Resources</h1><p class="gc-page-description">View status, location, and configuration for application resources.</p></div>
          <button class="gc-button gc-button--primary" type="button" data-sample-action>Create resource</button>
        </header>
        <section class="gc-panel gc-resource-panel" aria-labelledby="resource-list-heading">
          <div class="gc-resource-toolbar">
            <div><h2 id="resource-list-heading">Application resources</h2><p><span data-resource-count>${data.resources.length}</span> resources</p></div>
            <label class="gc-search-field"><span class="gc-visually-hidden">Filter resources</span><input type="search" placeholder="Filter resources" data-resource-filter><span aria-hidden="true">⌕</span></label>
          </div>
          <div class="gc-table-wrap">
            <table class="gc-resource-table">
              <thead><tr><th scope="col">Name</th><th scope="col">Region</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span class="gc-visually-hidden">Actions</span></th></tr></thead>
              <tbody>${resourceRows(data.resources)}</tbody>
            </table>
          </div>
          <div class="gc-empty-state" data-resource-empty hidden><h3>No matching resources</h3><p>Try a different name, type, region, or status.</p></div>
        </section>
      </section>`;
  };

  mounts.resources = function mountResources(root) {
    const input = root.querySelector("[data-resource-filter]");
    const rows = Array.from(root.querySelectorAll("[data-resource-row]"));
    const count = root.querySelector("[data-resource-count]");
    const empty = root.querySelector("[data-resource-empty]");
    rows.forEach((row) => {
      row.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        global.location.hash = `#/resources/${row.dataset.resourceId}`;
      });
      row.addEventListener("keydown", (event) => {
        if (!['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        global.location.hash = `#/resources/${row.dataset.resourceId}`;
      });
    });
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const matches = row.dataset.search.includes(query);
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = String(visible);
      empty.hidden = visible !== 0;
    });
  };
})(window);
