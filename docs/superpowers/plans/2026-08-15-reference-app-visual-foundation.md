# Reference App Visual Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a stable, accessible, recognizably Google Cloud reference app with approved marketing and Console modes plus reproducible screen and component screenshots.

**Architecture:** Keep the dependency-free browser runtime, but split the current monolithic page into focused shell, routing, screen-renderer, and configuration modules. CSS remains container-query based and is divided by responsibility. Python `unittest` covers static contracts; Playwright covers runtime behavior, accessibility, responsive layouts, console errors, and screenshot generation.

**Tech Stack:** Plain HTML, CSS container queries, ES modules, Python 3 standard library, Playwright for Python, Chromium.

**Spec:** `docs/superpowers/specs/2026-08-15-antigravity-cloud-style-kit-design.md`

## Global Constraints

- Antigravity is the only supported developer-agent integration.
- Google Sans is mandatory for wordmarks, headings, navigation, controls, numeric emphasis, and application chrome.
- Google Sans Text is mandatory for paragraphs, descriptions, dense labels, tables, and sustained reading.
- Use the existing `assets/supercloud.png`; do not redraw, recolor, distort, or replace it.
- Desktop is a composed 16:9 surface; mobile at 390×844 is an intentionally stacked application layout.
- Use `cqw` inside `.gc-stage`; only documented `px` exceptions are permitted.
- `container-type` may appear on `.gc-stage` and nested demo/device containers only.
- Preserve reduced-motion behavior and keyboard access.
- No required verification may be skipped or reported as passing when its dependency is unavailable.

---

### Task 1: Establish reproducible test and verification dependencies

**Files:**
- Create: `requirements-dev.txt`
- Create: `tests/test_repository_contracts.py`
- Modify: `tools/verify.py`
- Modify: `README.md`

**Interfaces:**
- Consumes: Python 3 and the existing `tools/verify.py` entry point.
- Produces: `python -m unittest discover -s tests -v` and `python tools/verify.py` as canonical checks.

- [ ] **Step 1: Write the failing dependency-contract test**

```python
# tests/test_repository_contracts.py
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class RepositoryContractsTest(unittest.TestCase):
    def test_playwright_is_pinned(self):
        requirements = (ROOT / "requirements-dev.txt").read_text(encoding="utf-8")
        self.assertRegex(requirements, r"(?m)^playwright==\d+\.\d+\.\d+$")

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the test and verify the missing file fails**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_playwright_is_pinned -v`

Expected: `ERROR` with `FileNotFoundError` for `requirements-dev.txt`.

- [ ] **Step 3: Pin Playwright and make verification failures actionable**

Create `requirements-dev.txt` with the current verified Playwright version:

```text
playwright==1.62.0
```

Update `tools/verify.py` so an unavailable import exits with:

```text
Verification dependency missing. Run:
  python -m pip install -r requirements-dev.txt
  python -m playwright install chromium
```

Update the README verification section to use those two setup commands followed by `python tools/verify.py`.

- [ ] **Step 4: Run the repository-contract test**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_playwright_is_pinned -v`

Expected: `PASS`.

- [ ] **Step 5: Commit the dependency contract**

```bash
git add requirements-dev.txt tests/test_repository_contracts.py tools/verify.py README.md
git commit -m "test: make visual verification reproducible"
```

### Task 2: Remove current runtime and interaction blockers

**Files:**
- Modify: `index.html`
- Modify: `js/cloud-style.js`
- Modify: `tools/verify.py`
- Modify: `tests/test_repository_contracts.py`

**Interfaces:**
- Consumes: existing `data-go` routing and `gcNavigate` behavior.
- Produces: zero console errors; real buttons for cards; `setActiveNavigation(view)`.

- [ ] **Step 1: Add failing static tests for the current defects**

```python
def test_no_missing_badge_reference(self):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    self.assertNotIn("badge.hidden", html)

def test_cards_use_buttons(self):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    self.assertIn('<button class="gc-card', html)
    self.assertNotIn('<article class="gc-card', html)
```

- [ ] **Step 2: Run the tests and confirm both fail**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_no_missing_badge_reference tests.test_repository_contracts.RepositoryContractsTest.test_cards_use_buttons -v`

Expected: two `FAIL` results.

- [ ] **Step 3: Implement the minimal runtime fixes**

Remove the stale `badge.hidden` branch and the badge cycling listener unless a visible, labeled demo selector is added later. Render each `.gc-card` as a `<button type="button">` containing the existing card markup. Add:

```js
function setActiveNavigation(view) {
  document.querySelectorAll('.gc-nav-link').forEach(button => {
    const active = button.dataset.go === view ||
      (button.dataset.go === 'menu' && ['cards', 'article'].includes(view));
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
}
```

Call `setActiveNavigation(state.view)` from `render()`.

- [ ] **Step 4: Add and run browser regression checks**

Extend `tools/verify.py` to visit the cover, catalog, cards, and first demo; collect `page.on("console")` errors and `page.on("pageerror")`; press `Tab` until the first card is focused; press `Enter`; assert the detail title is visible.

Run: `python tools/verify.py`

Expected: all routes render, keyboard activation reaches the detail view, and console error count is zero.

- [ ] **Step 5: Run static tests and commit**

Run: `python -m unittest discover -s tests -v`

Expected: `PASS`.

```bash
git add index.html js/cloud-style.js tools/verify.py tests/test_repository_contracts.py
git commit -m "fix: restore reliable app navigation"
```

### Task 3: Separate shell, configuration, and screen renderers

**Files:**
- Create: `js/config.js`
- Create: `js/screens/cover.js`
- Create: `js/screens/catalog.js`
- Create: `js/screens/cards.js`
- Create: `js/screens/detail.js`
- Create: `js/router.js`
- Modify: `index.html`
- Modify: `content.js`
- Modify: `tests/test_repository_contracts.py`

**Interfaces:**
- Consumes: `CONTENT`, icon IDs, and existing `gcInitRails`/`gcInitDemos` hooks.
- Produces: `APP_CONFIG`, `renderCover(context)`, `renderCatalog(context)`, `renderCards(context)`, `renderDetail(context)`, and `createRouter(options)`.

- [ ] **Step 1: Write failing module-boundary tests**

```python
def test_screen_modules_exist(self):
    required = [
        "js/config.js", "js/router.js", "js/screens/cover.js",
        "js/screens/catalog.js", "js/screens/cards.js", "js/screens/detail.js",
    ]
    for relative in required:
        self.assertTrue((ROOT / relative).is_file(), relative)

def test_index_does_not_define_screen_templates(self):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    for name in ("function cover(", "function menu(", "function cards(", "function article("):
        self.assertNotIn(name, html)
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_screen_modules_exist tests.test_repository_contracts.RepositoryContractsTest.test_index_does_not_define_screen_templates -v`

Expected: `FAIL` for missing modules and inline render functions.

- [ ] **Step 3: Create stable module interfaces**

Define `APP_CONFIG` with `preset`, identity labels, navigation labels, metrics, and default route. Each renderer accepts:

```js
/** @typedef {{config: object, content: object, state: object, esc: Function, mark: Function}} ScreenContext */
export function renderCover(context) { return `...`; }
```

Define the router:

```js
export function createRouter({ initialState, onChange }) {
  let state = initialState;
  return {
    getState: () => ({ ...state }),
    go(next) { state = { ...state, ...next }; onChange({ ...state }); },
  };
}
```

Move Summit-specific metrics, hashtag, labels, and status text out of `index.html`. Keep `content.js` for tracks, facts, and demo assignment.

- [ ] **Step 4: Run static and browser tests**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py`

Expected: all tests pass and rendered text/navigation remain functional.

- [ ] **Step 5: Commit the module split**

```bash
git add index.html content.js js/config.js js/router.js js/screens tests/test_repository_contracts.py tools/verify.py
git commit -m "refactor: separate app shell and screens"
```

### Task 4: Split and codify the visual system

**Files:**
- Create: `css/shell.css`
- Create: `css/screens.css`
- Create: `css/responsive.css`
- Modify: `css/tokens.css`
- Modify: `css/cloud-style.css`
- Modify: `index.html`
- Modify: `tests/test_repository_contracts.py`

**Interfaces:**
- Consumes: existing `gc-*` class names and container-query invariants.
- Produces: stable token roles and focused CSS entry points loaded by `index.html`.

- [ ] **Step 1: Add failing visual-system contract tests**

```python
def test_visual_css_is_split(self):
    for relative in ("css/shell.css", "css/screens.css", "css/responsive.css"):
        self.assertTrue((ROOT / relative).is_file(), relative)

def test_google_sans_roles_are_mandatory(self):
    tokens = (ROOT / "css/tokens.css").read_text(encoding="utf-8")
    self.assertIn('--gc-font-display: "Google Sans"', tokens)
    self.assertIn('--gc-font-text: "Google Sans Text"', tokens)
```

- [ ] **Step 2: Run tests and verify the split test fails**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_visual_css_is_split -v`

Expected: `FAIL` because focused CSS files do not exist.

- [ ] **Step 3: Move rules without changing class contracts**

Move stage/app-bar/footer/identity rules to `shell.css`; cover/catalog/cards/detail rules to `screens.css`; and all `@media` rules to `responsive.css`. Retain shared primitives and demo-independent components in `cloud-style.css`. Add semantic tokens for action, selection, information, live status, border, neutral canvas, and official Google colors. Replace hard-coded values when an exact token exists.

- [ ] **Step 4: Run invariant checks**

Run: `python -m unittest discover -s tests -v`

Run: `rg -n "container-type" css`

Expected: occurrences only for `.gc-stage` and approved nested demo/device containers.

Run: `rg -n "px" css`

Expected: only the documented shadow, pill sentinel, view-transition transforms, and viewport breakpoints.

- [ ] **Step 5: Run screenshots and commit**

Run: `python tools/verify.py`

Expected: no console errors or unexpected route changes.

```bash
git add css index.html tests/test_repository_contracts.py
git commit -m "refactor: codify the Cloud Style visual system"
```

### Task 5: Implement the approved marketing entrance and Console workspace

**Files:**
- Modify: `js/screens/cover.js`
- Modify: `js/screens/catalog.js`
- Modify: `js/screens/detail.js`
- Modify: `css/shell.css`
- Modify: `css/screens.css`
- Modify: `css/tokens.css`
- Modify: `content.js`
- Modify: `tools/verify.py`

**Interfaces:**
- Consumes: `APP_CONFIG`, `CONTENT`, `assets/supercloud.png`, and stable renderer signatures.
- Produces: approved Hybrid entrance and Console-style working screens.

- [ ] **Step 1: Add failing visual-state assertions**

In `tools/verify.py`, assert the cover contains `.gc-supercloud`, one `.gc-primary-action`, and metrics; assert the catalog/detail views contain `.gc-console-surface`; assert computed `font-family` contains `Google Sans` for headings and `Google Sans Text` for prose.

- [ ] **Step 2: Run verification and confirm missing Console surface fails**

Run: `python tools/verify.py`

Expected: `FAIL` identifying `.gc-console-surface` as missing.

- [ ] **Step 3: Implement the approved direction**

Build the cover around the existing Super Cloud image, Google color strip, concise identity-led claim, one primary action, one outlined secondary action, and three restrained proof metrics. Build catalog and detail views with a stable app bar, selected navigation, pale neutral canvas, white working surfaces, clear borders, restrained shadows, operational status, and subtle Super Cloud crop or watermark.

Use Google Sans for chrome and Google Sans Text for prose. Remove competing oversized branding from working screens. Ensure `assets/supercloud.png` is referenced directly and never duplicated as a redrawn asset.

- [ ] **Step 4: Verify desktop and 4K composition**

Run: `python tools/verify.py --viewport 1280x720`

Run: `python tools/verify.py --viewport 3840x2160`

Expected: every route fits the 16:9 stage without clipping; detail content and demo slot do not overlap the app bar or breadcrumb.

- [ ] **Step 5: Commit the approved visual direction**

```bash
git add js/screens css content.js tools/verify.py
git commit -m "feat: apply the Google Cloud hybrid direction"
```

### Task 6: Design and verify the mobile application layout

**Files:**
- Modify: `css/responsive.css`
- Modify: `css/tokens.css`
- Modify: `tools/verify.py`

**Interfaces:**
- Consumes: unchanged desktop class contracts.
- Produces: intentional 390×844 stacking, scrolling, navigation, and demo layouts.

- [ ] **Step 1: Add failing mobile geometry assertions**

Add Playwright checks at 390×844 that every visible element's bounding box stays within the viewport width, the document has meaningful vertical content, navigation is reachable, and the footer follows content. Fail with selector and bounding box when an element clips.

- [ ] **Step 2: Run verification and capture current failures**

Run: `python tools/verify.py --viewport 390x844`

Expected: `FAIL` for clipped wordmark, overlapping hero/metrics/actions, or missing mobile navigation.

- [ ] **Step 3: Implement mobile-specific composition**

Use compact app chrome, a wrapped or shortened wordmark, a contained Super Cloud crop, stacked hero actions, a single-column proof row, vertical catalog cards, native horizontal scroll only where the card rail requires it, full-width detail/demo surfaces, and footer placement after content. Do not rely only on `position: static`; explicitly define mobile grid/flex layouts for new shell and screen classes.

- [ ] **Step 4: Run mobile, keyboard, and reduced-motion verification**

Run: `python tools/verify.py --viewport 390x844 --reduced-motion`

Expected: no clipping or overlap; all actions keyboard reachable; pulse and transitions disabled; page scrolls to the footer.

- [ ] **Step 5: Commit the mobile design**

```bash
git add css/responsive.css css/tokens.css tools/verify.py
git commit -m "feat: add intentional mobile layouts"
```

### Task 7: Generate the canonical screen and component screenshot catalog

**Files:**
- Create: `templates/06-screen-catalog.html`
- Create: `tools/screenshot_manifest.py`
- Modify: `tools/verify.py`
- Modify: `README.md`
- Modify: `docs/COMPONENTS.md`
- Generate: `docs/screenshots/*.png`

**Interfaces:**
- Consumes: stable routes and component states from Tasks 2–6.
- Produces: `SCREENSHOT_CASES`, stable filenames, and a verified screenshot manifest.

- [ ] **Step 1: Write failing manifest tests**

```python
def test_screenshot_manifest_has_required_viewports(self):
    from tools.screenshot_manifest import SCREENSHOT_CASES
    names = {case["name"] for case in SCREENSHOT_CASES}
    self.assertIn("hybrid-cover-desktop", names)
    self.assertIn("hybrid-cover-mobile", names)
    self.assertIn("hybrid-cover-4k", names)
    self.assertIn("component-buttons-rest", names)
    self.assertIn("component-buttons-focus", names)
```

- [ ] **Step 2: Run the test and verify the missing module fails**

Run: `python -m unittest tests.test_repository_contracts.RepositoryContractsTest.test_screenshot_manifest_has_required_viewports -v`

Expected: `ERROR` with `ModuleNotFoundError` for `tools.screenshot_manifest`.

- [ ] **Step 3: Define screenshot cases and component-state controls**

Create `SCREENSHOT_CASES` as a list of dictionaries with `name`, `path`, `viewport`, `selector`, and optional `setup` fields. Include cover, catalog, cards, detail, empty/loading/success/warning/error states, app bar, wordmark, buttons, tabs, chips, cards, breadcrumb, metrics, forms, dialog, focus, active, selected, success, and error states.

Use filenames required by the spec:

```python
{"name": "hybrid-cover-desktop", "path": "/#cover", "viewport": (1280, 720), "selector": ".gc-stage"}
```

- [ ] **Step 4: Generate and validate screenshots**

Run: `python tools/verify.py --update-screenshots`

Expected: PNG files under `docs/screenshots/`; zero console errors; every manifest entry reports a non-empty capture.

- [ ] **Step 5: Review screenshots by eye and commit**

Review cover, catalog, detail, mobile, 4K, focus, error, and component-catalog captures. Correct any clipping or stale state, rerun generation, then:

```bash
git add templates/06-screen-catalog.html tools/screenshot_manifest.py tools/verify.py docs/screenshots README.md docs/COMPONENTS.md tests/test_repository_contracts.py
git commit -m "docs: publish verified screen and component captures"
```
