(function registerActivity(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});

  function outcomeClass(outcome) {
    return outcome.toLowerCase() === "warning" ? "warning" : "success";
  }

  function activityList(operations) {
    return `<ol class="gc-activity-list">${operations.map((operation) => `
      <li class="gc-activity-item">
        <span class="gc-operation-icon gc-operation-icon--${outcomeClass(operation.outcome)}" aria-hidden="true"></span>
        <div><strong>${operation.label}</strong><p>${operation.actor} · Operation ${operation.id}</p></div>
        <time>${operation.time}</time>
        <span class="gc-status gc-status--${outcomeClass(operation.outcome)}">${operation.outcome}</span>
      </li>`).join("")}</ol>`;
  }

  function stateMarkup(state, operations) {
    const states = {
      loading: `<div class="gc-state gc-state--loading" data-state="loading" role="status"><span class="gc-spinner" aria-hidden="true"></span><div><h2>Loading activity</h2><p>Retrieving the latest application operations.</p></div></div>`,
      empty: `<div class="gc-state" data-state="empty"><span class="gc-state-symbol" aria-hidden="true">○</span><h2>No activity yet</h2><p>Operations will appear here when resources change.</p><a class="gc-text-link" href="#/resources">View resources</a></div>`,
      success: `<div class="gc-state gc-state--success" data-state="success"><span class="gc-state-symbol" aria-hidden="true">✓</span><h2>Operations completed</h2><p>Recent changes finished successfully.</p>${activityList(operations.filter((item) => item.outcome === "Success"))}</div>`,
      warning: `<div class="gc-state gc-state--warning" data-state="warning"><span class="gc-state-symbol" aria-hidden="true">!</span><h2>One operation needs attention</h2><p>The application remains available while the backup is reviewed.</p>${activityList(operations.filter((item) => item.outcome === "Warning"))}</div>`,
      error: `<div class="gc-state gc-state--error" data-state="error"><span class="gc-state-symbol" aria-hidden="true">!</span><h2>Activity could not be loaded</h2><p>Check the connection and try again.</p><button class="gc-button gc-button--primary" type="button" data-retry-activity>Try again</button></div>`,
    };
    return states[state] || `<div data-state="default">${activityList(operations)}</div>`;
  }

  screens.activity = function renderActivity({ route, data }) {
    const state = route.query.get("state") || "default";
    return `
      <section class="gc-page" data-screen="activity">
        <header class="gc-page-header"><div><p class="gc-eyebrow">Operations</p><h1>Activity</h1><p class="gc-page-description">Review application changes, actors, times, and outcomes.</p></div></header>
        <section class="gc-panel gc-activity-panel" aria-live="polite">${stateMarkup(state, data.operations)}</section>
      </section>`;
  };
})(window);
