# Neutral Google Cloud App Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the presentation and solution-catalog implementation with one neutral, responsive Google Cloud sample application that agents can adopt for new or existing products.

**Architecture:** Keep the repository framework-free and split responsibilities into application configuration, deterministic sample data, route parsing, screen renderers, shell composition, and focused CSS modules. The browser application renders normal document flow with a persistent desktop sidebar and compact mobile navigation; URL hashes preserve deep links without a server router.

**Tech Stack:** Semantic HTML, CSS custom properties, vanilla JavaScript, Python `unittest`, Playwright Chromium, local HTTP server.

**Spec:** `docs/superpowers/specs/2026-08-15-neutral-google-cloud-app-template-design.md`

## Global Constraints

- The visible product name is `Google Cloud App`, configurable in `js/config.js`.
- Use Google Sans for product chrome and Google Sans Text for prose and form content.
- The active application contains no fixed 16:9 stage, slide footer, phone mockup, numbered card rail, solution catalog, event content, or demo-pack routing.
- Reserve Google blue for links, focus, selected navigation, and one primary action per view.
- Sample identity and data remain outside component and shell internals.
- Desktop verification targets 1280x720 and 3840x2160; mobile targets 390x844.
- Every behavior change follows red-green-refactor and keeps browser console output clean.

---

### Task 1: Replace repository contracts

**Files:**
- Modify: `tests/test_repository_contracts.py`
- Delete: `tests/test_demo_packs.py`
- Delete: `starter/demo-packs/registry.js`
- Delete: `starter/demo-packs/types.js`
- Delete: `starter/demo-packs/shared.css`
- Delete: `starter/demo-packs/image-studio/index.js`
- Delete: `starter/demo-packs/image-studio/sample-data.js`
- Delete: `starter/demo-packs/image-studio/styles.css`
- Delete: `templates/01-cover.html`
- Delete: `templates/02-menu.html`
- Delete: `templates/03-cards.html`
- Delete: `templates/04-article.html`
- Delete: `templates/05-components.html`
- Delete: `templates/06-screen-catalog.html`

**Interfaces:**
- Consumes: the approved spec and repository file tree.
- Produces: executable contracts for the new module boundaries and removal of active legacy surfaces.

- [ ] **Step 1: Write failing neutral-application contracts**

Replace catalog-specific assertions with behavioral repository checks:

```python
def test_index_loads_neutral_application_modules(self):
    index = read("index.html")
    for source in (
        "js/config.js", "js/data.js", "js/router.js", "js/app.js",
        "js/screens/overview.js", "js/screens/resources.js",
        "js/screens/resource-detail.js", "js/screens/activity.js",
        "js/screens/settings.js",
    ):
        self.assertIn(f'src="{source}"', index)

def test_active_files_do_not_restore_removed_product_primitives(self):
    active = [ROOT / "index.html", *sorted((ROOT / "js").rglob("*.js")),
              *sorted((ROOT / "css").glob("*.css"))]
    joined = "\n".join(path.read_text(encoding="utf-8") for path in active)
    for forbidden in ("Cloud Workspace", "Demo Packs", "gc-phone", "gc-rail", "gc-stage"):
        self.assertNotIn(forbidden, joined)
```

- [ ] **Step 2: Run tests and verify RED**

Run: `python -m unittest tests.test_repository_contracts -v`

Expected: FAIL because `js/data.js` and neutral screen modules do not exist and legacy primitives remain.

- [ ] **Step 3: Remove only the listed legacy active files and obsolete assertions**

Use patch-based deletion for the exact files above. Keep historical specifications and plans because they document superseded decisions.

- [ ] **Step 4: Run tests and confirm remaining failures are missing neutral modules**

Run: `python -m unittest tests.test_repository_contracts -v`

Expected: FAIL only on missing neutral application modules and current production markup.

- [ ] **Step 5: Commit**

```bash
git add tests/test_repository_contracts.py tests/test_demo_packs.py starter/demo-packs templates
git commit -m "test: define neutral application contracts"
```

### Task 2: Build the shell and route contract

**Files:**
- Modify: `index.html`
- Modify: `js/config.js`
- Create: `js/data.js`
- Modify: `js/router.js`
- Modify: `js/app.js`
- Create: `js/screens/overview.js`
- Create: `js/screens/resources.js`
- Create: `js/screens/resource-detail.js`
- Create: `js/screens/activity.js`
- Create: `js/screens/settings.js`
- Modify: `tests/test_repository_contracts.py`

**Interfaces:**
- Consumes: `APP_CONFIG`, `SAMPLE_DATA`, and `parseRoute(hash)`.
- Produces: `window.CloudStyleScreens` render functions, `renderApp(route)`, and hash routes `#/overview`, `#/resources`, `#/resources/:id`, `#/activity`, `#/settings`.

- [ ] **Step 1: Add a failing route-and-shell browser contract**

Add a Playwright test to `tests/test_repository_contracts.py` through a Node evaluation fixture or extend the runtime verifier to assert:

```javascript
const routes = ["#/overview", "#/resources", "#/resources/api-gateway", "#/activity", "#/settings"];
for (const hash of routes) {
  location.hash = hash;
  await new Promise(resolve => setTimeout(resolve, 30));
  if (!document.querySelector("main.gc-main h1")) throw new Error(`missing heading: ${hash}`);
  if (!document.querySelector(`[aria-current="page"]`)) throw new Error(`missing current nav: ${hash}`);
}
```

- [ ] **Step 2: Run the runtime check and verify RED**

Run: `python tools/verify.py --runtime-only`

Expected: FAIL because the current app exposes solution routes and no neutral shell contract.

- [ ] **Step 3: Implement configuration, data, route parser, and semantic shell**

Define these stable shapes:

```javascript
const APP_CONFIG = {
  productName: "Google Cloud App",
  projectLabel: "sample-project",
  environmentLabel: "Production",
  navigation: [
    { id: "overview", label: "Overview", href: "#/overview" },
    { id: "resources", label: "Resources", href: "#/resources" },
    { id: "activity", label: "Activity", href: "#/activity" },
    { id: "settings", label: "Settings", href: "#/settings" },
  ],
};

function parseRoute(hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "resources" && parts[1]) return { screen: "resource-detail", id: parts[1] };
  return { screen: ["overview", "resources", "activity", "settings"].includes(parts[0]) ? parts[0] : "overview" };
}
```

`index.html` contains only the font link, stylesheet links, `<div id="app">`, and ordered script tags. `renderApp()` composes the multicolor signature, compact header, project context, sidebar/mobile navigation, and one `<main class="gc-main">`.

- [ ] **Step 4: Run contract and runtime tests and verify GREEN**

Run: `python -m unittest tests.test_repository_contracts -v`

Run: `python tools/verify.py --runtime-only`

Expected: PASS with all five routes producing one page heading and current navigation state.

- [ ] **Step 5: Commit**

```bash
git add index.html js/config.js js/data.js js/router.js js/app.js js/screens tests/test_repository_contracts.py
git commit -m "feat: add the neutral application shell"
```

### Task 3: Implement overview and resource workflows

**Files:**
- Modify: `js/data.js`
- Modify: `js/screens/overview.js`
- Modify: `js/screens/resources.js`
- Modify: `js/screens/resource-detail.js`
- Modify: `js/app.js`
- Modify: `tools/verify.py`

**Interfaces:**
- Consumes: `SAMPLE_DATA.resources`, `SAMPLE_DATA.operations`, route IDs, and delegated click/input events.
- Produces: filterable resource rows, deep-linked detail pages, and `Summary`, `Configuration`, `Activity` tabs.

- [ ] **Step 1: Add failing runtime behaviors**

Add checks that type `edge` into `[data-resource-filter]`, assert only `Edge gateway` remains, activate its row, then assert the URL ends in `#/resources/edge-gateway`. Activate each `[role="tab"]` and assert its matching panel is visible.

- [ ] **Step 2: Run the verifier and verify RED**

Run: `python tools/verify.py --runtime-only`

Expected: FAIL on missing resource filter, detail deep link, or tab behavior.

- [ ] **Step 3: Implement the overview and resources screens**

Overview renders a restrained status summary, environment section, recent operations, and one `Create resource` primary action. Resources renders a search field and semantic table/list; filtering is case-insensitive against resource name, type, region, and status. Detail lookup uses `resources.find(resource => resource.id === route.id)` and renders an error state when absent.

- [ ] **Step 4: Implement accessible tabs**

Use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and matching `role="tabpanel"`. Left/Right arrows move focus and activate the adjacent tab; click activation updates local state without changing the resource route.

- [ ] **Step 5: Run all tests and verify GREEN**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --runtime-only`

Expected: PASS, including filter, deep link, unknown-resource error, and keyboard tab activation.

- [ ] **Step 6: Commit**

```bash
git add js/data.js js/app.js js/screens/overview.js js/screens/resources.js js/screens/resource-detail.js tools/verify.py
git commit -m "feat: add resource management workflows"
```

### Task 4: Implement activity states and settings validation

**Files:**
- Modify: `js/screens/activity.js`
- Modify: `js/screens/settings.js`
- Modify: `js/app.js`
- Modify: `tools/verify.py`

**Interfaces:**
- Consumes: `SAMPLE_DATA.activity`, settings defaults, and query-string state controls used by verification.
- Produces: activity state variants, local settings validation, confirmation dialog, save success feedback, and cancel reset.

- [ ] **Step 1: Add failing activity and settings checks**

The runtime verifier visits `#/activity?state=loading|empty|success|warning|error` and checks for a visible region with the corresponding `data-state`. It visits `#/settings`, clears the display-name field, submits, expects inline error text and focus on the field, restores a valid value, saves, confirms in the dialog, and expects a success notice.

- [ ] **Step 2: Run the verifier and verify RED**

Run: `python tools/verify.py --runtime-only`

Expected: FAIL on missing state variants, validation, or confirmation flow.

- [ ] **Step 3: Implement deterministic activity states**

Render a quiet chronological list by default. Query state is explicitly a sample-state control and must not masquerade as live backend behavior. Every state uses a heading or status label, useful next action, and no layout jump larger than the content region.

- [ ] **Step 4: Implement settings form behavior**

Use `<label>`, help text linked with `aria-describedby`, inline error linked with `aria-invalid`, secondary cancel, and one primary save action. Use native `<dialog>` for confirmation, preserve form values locally, reset to defaults on cancel, and announce saved state with `role="status"`.

- [ ] **Step 5: Run all tests and verify GREEN**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --runtime-only`

Expected: PASS for all state variants and both invalid and valid settings flows.

- [ ] **Step 6: Commit**

```bash
git add js/app.js js/screens/activity.js js/screens/settings.js tools/verify.py
git commit -m "feat: add application states and settings"
```

### Task 5: Replace the visual system with app-native surfaces

**Files:**
- Modify: `css/tokens.css`
- Modify: `css/cloud-style.css`
- Modify: `css/shell.css`
- Modify: `css/screens.css`
- Modify: `css/responsive.css`
- Modify: `tests/test_repository_contracts.py`

**Interfaces:**
- Consumes: semantic `gc-` markup from Tasks 2–4 and `assets/supercloud.png`.
- Produces: tokenized desktop/mobile application layout with visible focus, reduced motion, no clipping, and no presentation framing.

- [ ] **Step 1: Add failing CSS architecture checks**

Assert the production styles expose app tokens such as `--gc-space-4`, `--gc-border-subtle`, `--gc-surface`, and `--gc-focus-ring`, while active selectors do not define `.gc-stage`, `.gc-phone`, `.gc-rail`, `.gc-footer`, or `aspect-ratio: 16 / 9`.

- [ ] **Step 2: Run unit tests and verify RED**

Run: `python -m unittest tests.test_repository_contracts -v`

Expected: FAIL because presentation tokens and selectors still dominate the CSS.

- [ ] **Step 3: Implement tokens and app shell styles**

Keep official Google brand colors, semantic states, Google Sans stacks, and the current artwork. Replace presentation scale with application tokens for spacing, type, border, elevation, and motion. Use a thin multicolor top signature, 64-unit header, 232-unit desktop navigation, centered readable content width, quiet borders, and restrained card surfaces.

- [ ] **Step 4: Implement screen and component styles**

Style tables, status indicators, tabs, details, activity items, fields, banners, empty states, and dialog consistently. The artwork appears only as a clipped low-emphasis Overview accent. One view contains one filled blue action.

- [ ] **Step 5: Implement responsive and accessibility styles**

At the existing mobile breakpoint, hide the sidebar, show compact horizontal navigation, stack page header actions and data rows, preserve a minimum 44-unit control target, and allow document scrolling. Add `:focus-visible` and `prefers-reduced-motion: reduce` rules.

- [ ] **Step 6: Run tests and inspect computed layout**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --runtime-only`

Expected: PASS with no horizontal overflow at all target sizes and a visible focus indicator.

- [ ] **Step 7: Commit**

```bash
git add css/tokens.css css/cloud-style.css css/shell.css css/screens.css css/responsive.css tests/test_repository_contracts.py
git commit -m "feat: apply the Google Cloud application visual system"
```

### Task 6: Align agent guidance and canonical verification

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `docs/LAYOUT.md`
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/COMPONENTS.md`
- Create: `docs/ANTIGRAVITY.md`
- Modify: `tools/screenshot_manifest.py`
- Modify: `tools/capture_screenshots.js`
- Modify: `tools/verify.py`
- Replace: `docs/screenshots/*.png`

**Interfaces:**
- Consumes: final application routes and visual contract.
- Produces: new-app and adopt-existing-app Antigravity instructions, canonical app/component screenshots, and one reproducible verification command.

- [ ] **Step 1: Add failing canonical screenshot expectations**

The manifest names only:

```python
SCREENSHOTS = (
    "app-overview-desktop.png",
    "app-resources-desktop.png",
    "app-resource-detail-desktop.png",
    "app-activity-states.png",
    "app-settings-validation.png",
    "app-overview-mobile.png",
    "app-resources-mobile.png",
    "components-app-surfaces.png",
)
```

Run: `python tools/verify.py --check-screenshot-contract`

Expected: FAIL because the old manifest and screenshots remain.

- [ ] **Step 2: Rewrite current guidance**

`AGENTS.md` points to the app-flow layout, tokens, components, configuration/data boundaries, and verification. `docs/ANTIGRAVITY.md` has two explicit procedures: create a new application by pruning the sample, and adopt an existing application by inventorying behavior, applying tokens/shell to one representative route, verifying, then continuing incrementally.

- [ ] **Step 3: Replace the screenshot manifest and capture logic**

Capture every primary destination, a resource detail, all activity states arranged in a canonical component capture, settings invalid state, desktop at 1280x720, overview at 3840x2160, and mobile at 390x844. Fail on console errors, page errors, horizontal overflow, forbidden active primitives, or missing focus visibility.

- [ ] **Step 4: Run full verification and generate screenshots**

Run: `python tools/verify.py --update-screenshots`

Expected: PASS and write only the canonical filenames above plus the required 4K overview capture if stored separately by the manifest.

- [ ] **Step 5: Inspect every screenshot and refine**

Open each PNG at full size. Confirm it reads as an application rather than a slide, content density is Console-like, artwork remains secondary, controls align, long rows do not clip, and the mobile layout scrolls naturally. Apply visual fixes through tokens or focused component selectors, then rerun the full verifier.

- [ ] **Step 6: Final verification**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py`

Run: `git diff --check`

Expected: all commands exit 0, the browser console is clean, and the worktree contains no unintended files.

- [ ] **Step 7: Commit**

```bash
git add AGENTS.md README.md docs/LAYOUT.md docs/DESIGN-SYSTEM.md docs/COMPONENTS.md docs/ANTIGRAVITY.md docs/screenshots tools/screenshot_manifest.py tools/capture_screenshots.js tools/verify.py
git commit -m "docs: publish the neutral app template workflow"
```
