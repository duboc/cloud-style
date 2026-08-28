(function startCloudStyleApp(global) {
  const root = document.getElementById("app");

  function navigationMarkup(currentSection, className) {
    return global.APP_CONFIG.navigation.map((item) => `
      <a class="${className}${item.id === currentSection ? " is-current" : ""}" href="${item.href}"${item.id === currentSection ? ' aria-current="page"' : ""}>
        <span>${item.label}</span>
      </a>`).join("");
  }

  function shellMarkup(route, content) {
    return `
      <div class="gc-app">
        <div class="gc-google-signature" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <header class="gc-app-header">
          <a class="gc-product" href="#/overview" aria-label="${global.APP_CONFIG.productName} home">
            <img class="gc-product-mark" src="assets/google-cloud.png" alt="" aria-hidden="true">
            <span>${global.APP_CONFIG.productName}</span>
          </a>
          <div class="gc-context" aria-label="Current project and environment">
            <span>${global.APP_CONFIG.projectLabel}</span><span aria-hidden="true">·</span><strong>${global.APP_CONFIG.environmentLabel}</strong>
          </div>
        </header>
        <nav class="gc-mobile-nav" aria-label="Primary navigation">${navigationMarkup(route.section, "gc-mobile-nav-link")}</nav>
        <div class="gc-app-body">
          <aside class="gc-sidebar">
            <p class="gc-sidebar-label">Application</p>
            <nav aria-label="Primary navigation">${navigationMarkup(route.section, "gc-nav-link")}</nav>
            <div class="gc-sidebar-meta"><span class="gc-status-dot" aria-hidden="true"></span><span>Services available</span></div>
          </aside>
          <main class="gc-main" id="main-content" tabindex="-1">${content}</main>
        </div>
      </div>`;
  }

  function renderApp() {
    const route = global.CloudStyleRouter.parseRoute(global.location.hash);
    const renderScreen = global.CloudStyleScreens[route.screen] || global.CloudStyleScreens.overview;
    root.innerHTML = shellMarkup(route, renderScreen({ route, data: global.SAMPLE_DATA, config: global.APP_CONFIG }));
    global.CloudStyleScreenMounts?.[route.screen]?.(root, { route, data: global.SAMPLE_DATA, config: global.APP_CONFIG });
    document.title = `${root.querySelector("h1")?.textContent || global.APP_CONFIG.productName} · ${global.APP_CONFIG.productName}`;
  }

  global.addEventListener("hashchange", renderApp);
  renderApp();
  if (!global.location.hash) global.history.replaceState(null, "", "#/overview");
  global.CloudStyleApp = Object.freeze({ renderApp });
})(window);
