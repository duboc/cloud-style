(function registerSettings(global) {
  const screens = global.CloudStyleScreens || (global.CloudStyleScreens = {});
  const mounts = global.CloudStyleScreenMounts || (global.CloudStyleScreenMounts = {});

  screens.settings = function renderSettings({ data }) {
    const defaults = data.settings;
    return `
      <section class="gc-page" data-screen="settings">
        <header class="gc-page-header"><div><p class="gc-eyebrow">Application</p><h1>Settings</h1><p class="gc-page-description">Configure application identity and operational notifications.</p></div></header>
        <div class="gc-settings-layout">
          <form class="gc-panel gc-settings-form" data-settings-form novalidate>
            <div class="gc-section-heading"><div><p class="gc-eyebrow">General</p><h2>Application details</h2></div></div>
            <label class="gc-field">
              <span>Display name</span>
              <input name="displayName" value="${defaults.displayName}" aria-describedby="display-name-help">
              <small id="display-name-help">Shown in the application header and browser title.</small>
              <small class="gc-field-error" id="display-name-error" hidden>Enter a display name.</small>
            </label>
            <label class="gc-field">
              <span>Environment</span>
              <select name="environment" aria-describedby="environment-help">
                <option${defaults.environment === "Production" ? " selected" : ""}>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
              <small id="environment-help">Used as visible context. This sample does not change cloud resources.</small>
            </label>
            <label class="gc-checkbox-field">
              <input type="checkbox" name="notifications"${defaults.notifications ? " checked" : ""}>
              <span><strong>Operational notifications</strong><small>Receive local sample notifications for warnings and errors.</small></span>
            </label>
            <div class="gc-form-actions">
              <button class="gc-button gc-button--secondary" type="button" data-cancel-settings>Cancel</button>
              <button class="gc-button gc-button--primary" type="submit">Save changes</button>
            </div>
            <p class="gc-form-status" data-settings-status role="status" aria-live="polite"></p>
          </form>
          <aside class="gc-panel gc-settings-note">
            <p class="gc-eyebrow">Sample data</p>
            <h2>Changes stay in this browser</h2>
            <p>This form demonstrates labels, help text, validation, confirmation, and feedback without connecting to a Google Cloud project.</p>
          </aside>
        </div>
        <dialog class="gc-dialog" data-settings-dialog aria-labelledby="confirm-settings-title">
          <form method="dialog">
            <h2 id="confirm-settings-title">Save application settings?</h2>
            <p>The sample updates local interface state only.</p>
            <div class="gc-form-actions">
              <button class="gc-button gc-button--secondary" value="cancel">Cancel</button>
              <button class="gc-button gc-button--primary" value="confirm" data-confirm-save>Save</button>
            </div>
          </form>
        </dialog>
      </section>`;
  };

  mounts.settings = function mountSettings(root, { data }) {
    const form = root.querySelector("[data-settings-form]");
    const displayName = form.elements.displayName;
    const error = root.querySelector("#display-name-error");
    const status = root.querySelector("[data-settings-status]");
    const dialog = root.querySelector("[data-settings-dialog]");

    function showError() {
      displayName.setAttribute("aria-invalid", "true");
      displayName.setAttribute("aria-describedby", "display-name-help display-name-error");
      error.hidden = false;
      displayName.focus();
    }

    function clearError() {
      displayName.removeAttribute("aria-invalid");
      displayName.setAttribute("aria-describedby", "display-name-help");
      error.hidden = true;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!displayName.value.trim()) {
        showError();
        return;
      }
      clearError();
      dialog.showModal();
    });

    displayName.addEventListener("input", () => {
      if (displayName.value.trim()) clearError();
    });

    root.querySelector("[data-cancel-settings]").addEventListener("click", () => {
      form.reset();
      displayName.value = data.settings.displayName;
      clearError();
      status.textContent = "Changes discarded.";
    });

    root.querySelector("[data-confirm-save]").addEventListener("click", () => {
      status.textContent = "Settings saved in this sample.";
    });
  };
})(window);
