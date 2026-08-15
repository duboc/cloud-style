# Cloud Style Demo Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five isolated, accessible, responsive, and meaningfully interactive demo packs for image editing, video editing, data analytics, databases, and business flows.

**Architecture:** Each pack exports a shared `DemoPack` contract and owns its renderer, event binding, cleanup, sample data, styles, and verification scenario. A registry resolves content configuration to a pack without coupling screen renderers to pack internals. All packs use the stable Google Cloud shell and typography from the reference-app plan.

**Tech Stack:** Plain ES modules, HTML, CSS container queries, JSON-compatible sample data, Python `unittest`, Playwright for Python.

**Spec:** `docs/superpowers/specs/2026-08-15-antigravity-cloud-style-kit-design.md`

## Global Constraints

- Complete `2026-08-15-reference-app-visual-foundation.md` first.
- Every pack must remain recognizably Google Cloud and use Google Sans/Google Sans Text for their defined roles.
- Interactive-looking controls must work; live indicators must never label static placeholders.
- Each pack must expose realistic sample data, accessible states, responsive behavior, cleanup, verification, and screenshots.
- Packs must clearly label simulated data and must not imply a live service connection.
- Use tokens and `cqw`; do not create new container-query roots outside approved pack/device containers.

---

### Task 1: Define the shared demo-pack contract and registry

**Files:**
- Create: `starter/demo-packs/types.js`
- Create: `starter/demo-packs/registry.js`
- Create: `starter/demo-packs/shared.css`
- Create: `tests/test_demo_packs.py`
- Modify: `js/screens/detail.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: detail screen state and content field `demo`.
- Produces: `registerDemoPack(pack)`, `getDemoPack(id)`, `mountDemoPack(host, id, data)`, and `unmountDemoPack(host)`.

- [ ] **Step 1: Write failing registry contract tests**

```python
# tests/test_demo_packs.py
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class DemoPackContractTest(unittest.TestCase):
    def test_registry_exports_required_functions(self):
        source = (ROOT / "starter/demo-packs/registry.js").read_text(encoding="utf-8")
        for name in ("registerDemoPack", "getDemoPack", "mountDemoPack", "unmountDemoPack"):
            self.assertIn(f"export function {name}", source)

    def test_pack_ids_are_registered_once(self):
        source = (ROOT / "starter/demo-packs/registry.js").read_text(encoding="utf-8")
        for pack_id in ("image-studio", "video-studio", "analytics", "databases", "business-flows"):
            self.assertEqual(source.count(f"'{pack_id}'"), 1)
```

- [ ] **Step 2: Run tests and verify missing files fail**

Run: `python -m unittest tests.test_demo_packs -v`

Expected: `ERROR` with `FileNotFoundError`.

- [ ] **Step 3: Implement the registry and lifecycle**

Define the contract in JSDoc:

```js
/** @typedef {{
 * id: string,
 * label: string,
 * render: (data: object) => string,
 * mount: (host: HTMLElement, data: object) => void,
 * unmount: (host: HTMLElement) => void
 * }} DemoPack */
```

`mountDemoPack` must call `unmountDemoPack`, render into the host, set `host.dataset.demoPack`, and invoke the pack's mount function. `unmountDemoPack` must invoke the active pack cleanup before clearing state. Unknown IDs must render a labeled unavailable state and log no exception.

- [ ] **Step 4: Run tests and a detail-route smoke check**

Run: `python -m unittest tests.test_demo_packs -v`

Run: `python tools/verify.py --route '#article/0/0'`

Expected: registry tests pass and detail route has no console error.

- [ ] **Step 5: Commit the pack foundation**

```bash
git add starter/demo-packs js/screens/detail.js index.html tests/test_demo_packs.py
git commit -m "feat: add demo pack lifecycle"
```

### Task 2: Build Image Studio

**Files:**
- Create: `starter/demo-packs/image-studio/index.js`
- Create: `starter/demo-packs/image-studio/styles.css`
- Create: `starter/demo-packs/image-studio/sample-data.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `tests/test_demo_packs.py`
- Modify: `tools/screenshot_manifest.py`

**Interfaces:**
- Consumes: the `DemoPack` contract.
- Produces: pack ID `image-studio` with crop, retouch, compare, history, and approval states.

- [ ] **Step 1: Add failing Image Studio contract tests**

```python
def test_image_studio_has_meaningful_controls(self):
    source = (ROOT / "starter/demo-packs/image-studio/index.js").read_text(encoding="utf-8")
    for control in ('data-action="crop"', 'data-action="retouch"', 'data-action="compare"', 'data-action="approve"'):
        self.assertIn(control, source)
    self.assertIn("aria-pressed", source)
```

- [ ] **Step 2: Run the test and confirm the missing pack fails**

Run: `python -m unittest tests.test_demo_packs.DemoPackContractTest.test_image_studio_has_meaningful_controls -v`

Expected: `ERROR` for the missing module.

- [ ] **Step 3: Implement working edit states**

Render a source preview, edited preview, toolbar, compare toggle, prompt/edit history, and approval status. Crop and retouch update `data-edit-state` and visible preview treatment; compare switches between source and edited states; approve creates a visible audit entry. Use native buttons and `aria-pressed` on toggles. Cleanup removes registered listeners.

- [ ] **Step 4: Verify interaction and screenshots**

Add Playwright setup that activates crop, retouch, compare, and approve; assert state and audit text after each action. Add `demo-image-studio-desktop`, `demo-image-studio-mobile`, `component-image-studio-compare`, and `component-image-studio-approved` captures.

Run: `python tools/verify.py --demo image-studio --update-screenshots`

Expected: interactions pass, no console errors, and four captures are generated.

- [ ] **Step 5: Commit Image Studio**

```bash
git add starter/demo-packs/image-studio starter/demo-packs/registry.js tests/test_demo_packs.py tools/screenshot_manifest.py docs/screenshots
git commit -m "feat: add Image Studio demo pack"
```

### Task 3: Build Video Studio

**Files:**
- Create: `starter/demo-packs/video-studio/index.js`
- Create: `starter/demo-packs/video-studio/styles.css`
- Create: `starter/demo-packs/video-studio/sample-data.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `tests/test_demo_packs.py`
- Modify: `tools/screenshot_manifest.py`

**Interfaces:**
- Consumes: the `DemoPack` contract.
- Produces: pack ID `video-studio` with playback, trim, caption, chapter, review, and export states.

- [ ] **Step 1: Add failing Video Studio contract tests**

```python
def test_video_studio_has_editing_controls(self):
    source = (ROOT / "starter/demo-packs/video-studio/index.js").read_text(encoding="utf-8")
    for control in ('data-action="play"', 'data-action="set-in"', 'data-action="set-out"', 'data-action="caption"', 'data-action="export"'):
        self.assertIn(control, source)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_demo_packs.DemoPackContractTest.test_video_studio_has_editing_controls -v`

Expected: `ERROR` for the missing module.

- [ ] **Step 3: Implement an interactive editing timeline**

Render player controls, timecode, range/timeline, trim in/out, captions toggle, chapter markers, review status, and simulated export progress. Playback must update timecode; trim buttons persist values; captions change visible state; export moves deterministically from queued to complete without an endless timer. Cleanup cancels timers and listeners.

- [ ] **Step 4: Verify and capture states**

Test play/pause, trim boundaries, captions, chapter selection, and export completion. Capture desktop, mobile, trimmed, captions-on, and export-complete states.

Run: `python tools/verify.py --demo video-studio --update-screenshots`

Expected: all assertions and five captures pass.

- [ ] **Step 5: Commit Video Studio**

```bash
git add starter/demo-packs/video-studio starter/demo-packs/registry.js tests/test_demo_packs.py tools/screenshot_manifest.py docs/screenshots
git commit -m "feat: add Video Studio demo pack"
```

### Task 4: Build Data Analytics

**Files:**
- Create: `starter/demo-packs/analytics/index.js`
- Create: `starter/demo-packs/analytics/styles.css`
- Create: `starter/demo-packs/analytics/sample-data.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `tests/test_demo_packs.py`
- Modify: `tools/screenshot_manifest.py`

**Interfaces:**
- Consumes: the `DemoPack` contract.
- Produces: pack ID `analytics` with query, filters, labeled chart, evidence, and decision explanation.

- [ ] **Step 1: Add failing analytics contract tests**

```python
def test_analytics_has_labels_and_units(self):
    source = (ROOT / "starter/demo-packs/analytics/index.js").read_text(encoding="utf-8")
    self.assertIn('aria-label="Run query"', source)
    self.assertIn("data-axis=", source)
    self.assertIn("data-unit=", source)
    self.assertIn("decision-explanation", source)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_demo_packs.DemoPackContractTest.test_analytics_has_labels_and_units -v`

Expected: `ERROR` for the missing module.

- [ ] **Step 3: Implement query-to-evidence interaction**

Render a safe sample query editor, date/category filters, run action, labeled SVG chart, evidence table, and one explanation connecting the result to an operational decision. Filter and query actions must update chart marks, table rows, units, and explanation together. Use a visible `SIMULATED DATA` label.

- [ ] **Step 4: Verify data consistency and captures**

Test that filter changes update chart and table counts, query execution updates the explanation, every chart has an accessible name, and labels do not clip at 390px. Capture desktop, mobile, filtered, and query-result states.

Run: `python tools/verify.py --demo analytics --update-screenshots`

Expected: assertions pass and four captures are generated.

- [ ] **Step 5: Commit Data Analytics**

```bash
git add starter/demo-packs/analytics starter/demo-packs/registry.js tests/test_demo_packs.py tools/screenshot_manifest.py docs/screenshots
git commit -m "feat: add Data Analytics demo pack"
```

### Task 5: Build Databases

**Files:**
- Create: `starter/demo-packs/databases/index.js`
- Create: `starter/demo-packs/databases/styles.css`
- Create: `starter/demo-packs/databases/sample-data.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `tests/test_demo_packs.py`
- Modify: `tools/screenshot_manifest.py`

**Interfaces:**
- Consumes: the `DemoPack` contract.
- Produces: pack ID `databases` with schema, safe query, topology, replication, and health states.

- [ ] **Step 1: Add failing database contract tests**

```python
def test_databases_labels_simulation_and_query_safety(self):
    source = (ROOT / "starter/demo-packs/databases/index.js").read_text(encoding="utf-8")
    self.assertIn("SIMULATED DATA", source)
    self.assertIn("validateReadOnlyQuery", source)
    self.assertIn("replication-status", source)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_demo_packs.DemoPackContractTest.test_databases_labels_simulation_and_query_safety -v`

Expected: `ERROR` for the missing module.

- [ ] **Step 3: Implement safe database exploration**

Render schema navigation, read-only query editor, results table, topology/replication diagram, and health/status evidence. Implement `validateReadOnlyQuery(sql)` to accept trimmed `SELECT`/`WITH` statements and reject mutation keywords with a visible error; never execute external SQL. Selecting a schema changes sample columns and results.

- [ ] **Step 4: Verify safety, states, and captures**

Test a valid `SELECT`, rejected `DELETE`, schema selection, replication detail, success, warning, and error states. Capture desktop, mobile, topology, query-result, and rejected-query states.

Run: `python tools/verify.py --demo databases --update-screenshots`

Expected: all assertions pass and five captures are generated.

- [ ] **Step 5: Commit Databases**

```bash
git add starter/demo-packs/databases starter/demo-packs/registry.js tests/test_demo_packs.py tools/screenshot_manifest.py docs/screenshots
git commit -m "feat: add Databases demo pack"
```

### Task 6: Build Business Flows

**Files:**
- Create: `starter/demo-packs/business-flows/index.js`
- Create: `starter/demo-packs/business-flows/styles.css`
- Create: `starter/demo-packs/business-flows/sample-data.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `tests/test_demo_packs.py`
- Modify: `tools/screenshot_manifest.py`

**Interfaces:**
- Consumes: the `DemoPack` contract.
- Produces: pack ID `business-flows` with requests, automated steps, approvals, handoffs, exceptions, audit history, and completion.

- [ ] **Step 1: Add failing business-flow contract tests**

```python
def test_business_flows_has_accountable_transitions(self):
    source = (ROOT / "starter/demo-packs/business-flows/index.js").read_text(encoding="utf-8")
    for state in ("requested", "automated", "awaiting-approval", "exception", "completed"):
        self.assertIn(state, source)
    self.assertIn("audit-history", source)
    self.assertIn("data-action=\"approve\"", source)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_demo_packs.DemoPackContractTest.test_business_flows_has_accountable_transitions -v`

Expected: `ERROR` for the missing module.

- [ ] **Step 3: Implement deterministic state transitions**

Render a labeled flow, current-state detail, owner, automated step, approval controls, exception branch, and timestamped audit history. A normal scenario must progress `requested → automated → awaiting-approval → completed`; an exception scenario must progress `requested → automated → exception → awaiting-approval → completed`. Every transition appends actor, action, and time to the audit history.

- [ ] **Step 4: Verify both paths and captures**

Test normal and exception paths, keyboard approval, audit entries, and completion. Capture desktop, mobile, awaiting-approval, exception, and completed states.

Run: `python tools/verify.py --demo business-flows --update-screenshots`

Expected: both paths pass and five captures are generated.

- [ ] **Step 5: Commit Business Flows**

```bash
git add starter/demo-packs/business-flows starter/demo-packs/registry.js tests/test_demo_packs.py tools/screenshot_manifest.py docs/screenshots
git commit -m "feat: add Business Flows demo pack"
```

### Task 7: Integrate the five-pack catalog and complete cross-pack verification

**Files:**
- Modify: `content.js`
- Modify: `js/screens/catalog.js`
- Modify: `js/screens/detail.js`
- Modify: `starter/demo-packs/registry.js`
- Modify: `templates/06-screen-catalog.html`
- Modify: `tools/screenshot_manifest.py`
- Modify: `tools/verify.py`
- Modify: `docs/COMPONENTS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: all five registered pack IDs.
- Produces: catalog selection, content-to-pack mapping, complete screenshots, and developer documentation.

- [ ] **Step 1: Add failing integration assertions**

Add Playwright assertions that the catalog exposes five labeled pack cards, each opens a detail route, exactly one pack mounts, navigating away calls cleanup, and returning mounts a fresh state.

- [ ] **Step 2: Run integration verification and confirm missing catalog entries fail**

Run: `python tools/verify.py --all-demos`

Expected: `FAIL` until all five catalog entries and routes are connected.

- [ ] **Step 3: Wire content and catalog configuration**

Add one reference fact per pack with `demo` equal to the registered pack ID. Render pack label, description, live status, and action from registry metadata. Remove direct demo-type switch statements from screen code.

- [ ] **Step 4: Run the complete suite and inspect screenshots**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --all-demos --update-screenshots`

Expected: all static/runtime checks pass; every pack has desktop/mobile and required state captures; no console errors or leaked timers remain after navigation.

- [ ] **Step 5: Commit catalog integration**

```bash
git add content.js js/screens starter/demo-packs templates/06-screen-catalog.html tools tests docs/COMPONENTS.md README.md
git commit -m "feat: publish the Cloud Style demo catalog"
```

