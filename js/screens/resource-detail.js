(function registerResourceDetail(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});
  const mounts = global.CloudStyleScreenMounts || (global.CloudStyleScreenMounts = {});

  function tabButton(id, label, selected) {
    return `<button id="tab-${id}" role="tab" aria-selected="${selected}" aria-controls="panel-${id}" tabindex="${selected ? "0" : "-1"}" type="button">${label}</button>`;
  }

  function panel(id, label, content, selected) {
    return `<section id="panel-${id}" role="tabpanel" aria-labelledby="tab-${id}"${selected ? "" : " hidden"}><h2 class="gc-visually-hidden">${label}</h2>${content}</section>`;
  }

  screens["resource-detail"] = function renderResourceDetail({ route, data }) {
    const resource = data.resources.find((item) => item.id === route.id);
    if (!resource) {
      return `<section class="gc-page" data-screen="resource-detail"><nav class="gc-breadcrumb" aria-label="Breadcrumb"><a href="#/resources">Resources</a><span aria-hidden="true">/</span><span>Not found</span></nav><div class="gc-state gc-state--error"><p class="gc-eyebrow">Error</p><h1>Resource not found</h1><p>The requested resource is not part of this sample environment.</p><a class="gc-button gc-button--primary" href="#/resources">Back to resources</a></div></section>`;
    }

    const warning = resource.status === "Attention";
    return `
      <section class="gc-page" data-screen="resource-detail">
        <nav class="gc-breadcrumb" aria-label="Breadcrumb"><a href="#/resources">Resources</a><span aria-hidden="true">/</span><span>${resource.name}</span></nav>
        <header class="gc-page-header">
          <div><p class="gc-eyebrow">${resource.type}</p><h1>${resource.name}</h1><p class="gc-page-description">${resource.region} · Updated ${resource.updated}</p></div>
          <button class="gc-button gc-button--primary" type="button" data-select-tab="configuration">Edit configuration</button>
        </header>
        <div class="gc-detail-status"><span class="gc-status gc-status--${warning ? "warning" : "success"}">${resource.status}</span><span>${warning ? "Review the latest operation before making changes." : "This resource is serving traffic normally."}</span></div>
        <section class="gc-panel gc-detail-panel">
          <div class="gc-tabs" role="tablist" aria-label="Resource details">
            ${tabButton("summary", "Summary", true)}
            ${tabButton("configuration", "Configuration", false)}
            ${tabButton("activity", "Activity", false)}
          </div>
          <div class="gc-tab-content">
            ${panel("summary", "Summary", `<dl class="gc-detail-list"><div><dt>Resource ID</dt><dd>${resource.id}</dd></div><div><dt>Type</dt><dd>${resource.type}</dd></div><div><dt>Region</dt><dd>${resource.region}</dd></div><div><dt>Last updated</dt><dd>${resource.updated}</dd></div></dl>`, true)}
            ${panel("configuration", "Configuration", `<dl class="gc-detail-list"><div><dt>Environment</dt><dd>Production</dd></div><div><dt>Protection</dt><dd>Managed</dd></div><div><dt>Autoscaling</dt><dd>Enabled</dd></div><div><dt>Access</dt><dd>Project members</dd></div></dl>`, false)}
            ${panel("activity", "Activity", `<ol class="gc-operation-list"><li class="gc-operation-row"><span class="gc-operation-icon gc-operation-icon--success" aria-hidden="true"></span><span><strong>Health check completed</strong><small>system</small></span><time>10:18</time></li><li class="gc-operation-row"><span class="gc-operation-icon gc-operation-icon--success" aria-hidden="true"></span><span><strong>Configuration synchronized</strong><small>alex@example.com</small></span><time>09:44</time></li></ol>`, false)}
          </div>
        </section>
      </section>`;
  };

  mounts["resource-detail"] = function mountResourceDetail(root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));

    function activate(tab, moveFocus = false) {
      tabs.forEach((candidate) => {
        const selected = candidate === tab;
        candidate.setAttribute("aria-selected", String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        root.querySelector(`#${candidate.getAttribute("aria-controls")}`).hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        activate(tabs[(index + delta + tabs.length) % tabs.length], true);
      });
    });

    root.querySelector("[data-select-tab]")?.addEventListener("click", (event) => {
      activate(root.querySelector(`#tab-${event.currentTarget.dataset.selectTab}`), true);
    });
  };
})(window);
