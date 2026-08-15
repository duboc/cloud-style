# Antigravity Cloud Style Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Package the verified Cloud Style system as native Antigravity rules, skill, and create/adopt/verify workflows for cloned and existing repositories.

**Architecture:** Short always-active workspace rules enforce non-negotiable constraints. One modular Cloud Style skill supplies detailed design knowledge and verified visual references. Three user-invoked workflows orchestrate creation, adoption, and verification while preserving application architecture and producing evidence.

**Tech Stack:** Antigravity `.agents` rules/skills/workflows, Markdown with YAML skill frontmatter, Python 3 validation scripts, existing Playwright verification tooling.

**Spec:** `docs/superpowers/specs/2026-08-15-antigravity-cloud-style-kit-design.md`

## Global Constraints

- Complete the reference-app and demo-pack plans before validating this package.
- Antigravity is the only supported developer-agent integration; add no Claude Code or Codex package.
- Support both clone/create and portable adopt paths.
- Creation defaults to Hybrid; Showcase and Console remain selectable.
- Adoption preserves framework, routes, data flow, public behavior, accessibility, and existing tests unless separately approved.
- Google Sans, Google Sans Text, official Google colors, `assets/supercloud.png`, and verified screenshots are mandatory identity references.
- The package must not overwrite an existing `.agents` directory wholesale.
- Verification must fail explicitly when required tooling or evidence is unavailable.

---

### Task 1: Validate native Antigravity package structure

**Files:**
- Create: `.agents/rules/cloud-style-foundations.md`
- Create: `.agents/rules/responsive-layout.md`
- Create: `.agents/rules/visual-verification.md`
- Create: `.agents/skills/cloud-style/SKILL.md`
- Create: `.agents/workflows/create-cloud-demo.md`
- Create: `.agents/workflows/adopt-cloud-style.md`
- Create: `.agents/workflows/verify-cloud-style.md`
- Create: `tools/validate_antigravity_kit.py`
- Create: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: Antigravity native `.agents/rules`, `.agents/skills`, and `.agents/workflows` conventions.
- Produces: `validate_kit(root: Path) -> list[str]` returning validation errors.

- [ ] **Step 1: Write the failing structure validator test**

```python
# tests/test_antigravity_kit.py
from pathlib import Path
import unittest
from tools.validate_antigravity_kit import validate_kit

ROOT = Path(__file__).resolve().parents[1]

class AntigravityKitTest(unittest.TestCase):
    def test_required_package_is_valid(self):
        self.assertEqual(validate_kit(ROOT), [])

if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: `ERROR` because the validator module does not exist.

- [ ] **Step 3: Implement structural validation and minimal files**

`validate_kit` must verify required paths, non-empty Markdown, unique workflow names, `SKILL.md` YAML frontmatter with `name: cloud-style` and a non-empty `description`, relative reference targets, and absence of `CLAUDE.md`, `.claude/`, or Codex-specific package paths created by this feature.

Create minimal files containing their title and purpose so validation can run; later tasks replace their bodies.

- [ ] **Step 4: Run validation**

Run: `python tools/validate_antigravity_kit.py`

Expected: `Antigravity Cloud Style kit: valid`.

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: `PASS`.

- [ ] **Step 5: Commit the native package skeleton**

```bash
git add .agents tools/validate_antigravity_kit.py tests/test_antigravity_kit.py
git commit -m "feat: scaffold the Antigravity Cloud Style kit"
```

### Task 2: Write concise always-active workspace rules

**Files:**
- Modify: `.agents/rules/cloud-style-foundations.md`
- Modify: `.agents/rules/responsive-layout.md`
- Modify: `.agents/rules/visual-verification.md`
- Modify: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: verified design-system constraints.
- Produces: always-active identity, layout, preservation, and completion rules.

- [ ] **Step 1: Add failing rule-content tests**

```python
def test_rules_contain_non_negotiable_language(self):
    rules = "\n".join(path.read_text(encoding="utf-8") for path in (ROOT / ".agents/rules").glob("*.md"))
    required = [
        "Google Sans", "Google Sans Text", "assets/supercloud.png",
        "390×844", "1280×720", "3840×2160", "console errors",
        "preserve", "framework", "routes", "reduced motion",
    ]
    for phrase in required:
        self.assertIn(phrase, rules)
```

- [ ] **Step 2: Run the test and verify incomplete rules fail**

Run: `python -m unittest tests.test_antigravity_kit.AntigravityKitTest.test_rules_contain_non_negotiable_language -v`

Expected: `FAIL` listing missing phrases.

- [ ] **Step 3: Write focused rules**

`cloud-style-foundations.md` must require recognizable Google Cloud identity, mandatory font roles, official colors, exact Super Cloud asset reuse, tokens, real interaction, and preservation during adoption. `responsive-layout.md` must encode stage/container restrictions, composed desktop, intentionally stacked mobile, and accessibility. `visual-verification.md` must prohibit completion claims without tests, screenshots, console checks, keyboard checks, and reduced motion.

Keep each file under 120 lines and link detailed topics to the skill rather than duplicating them.

- [ ] **Step 4: Run content and structure validation**

Run: `python -m unittest tests.test_antigravity_kit -v`

Run: `python tools/validate_antigravity_kit.py`

Expected: both pass.

- [ ] **Step 5: Commit the rules**

```bash
git add .agents/rules tests/test_antigravity_kit.py
git commit -m "docs: define Antigravity Cloud Style rules"
```

### Task 3: Build the modular Cloud Style skill

**Files:**
- Modify: `.agents/skills/cloud-style/SKILL.md`
- Create: `.agents/skills/cloud-style/references/visual-language.md`
- Create: `.agents/skills/cloud-style/references/component-contracts.md`
- Create: `.agents/skills/cloud-style/references/adoption-guide.md`
- Create: `.agents/skills/cloud-style/references/failure-examples.md`
- Create: `.agents/skills/cloud-style/assets/manifest.json`
- Modify: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: `docs/DESIGN-SYSTEM.md`, `docs/LAYOUT.md`, `docs/COMPONENTS.md`, demo-pack registry, and verified screenshot catalog.
- Produces: task-triggered Cloud Style knowledge with routed references and screenshot assets.

- [ ] **Step 1: Add failing skill-coverage tests**

```python
def test_skill_routes_required_topics(self):
    skill = (ROOT / ".agents/skills/cloud-style/SKILL.md").read_text(encoding="utf-8")
    for reference in ("visual-language.md", "component-contracts.md", "adoption-guide.md", "failure-examples.md"):
        self.assertIn(reference, skill)

def test_skill_asset_manifest_points_to_existing_pngs(self):
    import json
    manifest = json.loads((ROOT / ".agents/skills/cloud-style/assets/manifest.json").read_text(encoding="utf-8"))
    for entry in manifest["screenshots"]:
        self.assertTrue((ROOT / entry["source"]).is_file(), entry["source"])
```

- [ ] **Step 2: Run tests and confirm missing references fail**

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: `FAIL` or `ERROR` for missing references and manifest.

- [ ] **Step 3: Write the skill and references**

`SKILL.md` must describe when to load the skill, require inspection of existing code before adoption, route creation/adoption/verification/component tasks to the correct references, and prohibit implementation claims without evidence.

`visual-language.md` defines Console and marketing qualities, Google identity invariants, presets, typography, color roles, Super Cloud use, and responsive intent. `component-contracts.md` maps shell and five demo-pack interfaces. `adoption-guide.md` defines inventory, mapping, reference-screen migration, preservation, conflict handling, and rollback. `failure-examples.md` lists generic blue dashboards, fake Console chrome, oversized branding, decorative interactions, clipped mobile layouts, and unlabeled data visuals.

Populate `manifest.json` with verified cover, Console workspace, mobile, component, and five demo-pack captures using repository-relative `docs/screenshots/*.png` sources.

- [ ] **Step 4: Validate references and assets**

Run: `python tools/validate_antigravity_kit.py`

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: all links and screenshots resolve and tests pass.

- [ ] **Step 5: Commit the skill**

```bash
git add .agents/skills/cloud-style tests/test_antigravity_kit.py
git commit -m "docs: teach Antigravity the Cloud Style system"
```

### Task 4: Implement `/create-cloud-demo`

**Files:**
- Modify: `.agents/workflows/create-cloud-demo.md`
- Create: `tests/fixtures/antigravity/create-brief.md`
- Modify: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: Cloud Style rules/skill, starter shell, presets, content schema, demo-pack registry, and verification command.
- Produces: repeatable new-app discovery, specification, build, and evidence workflow.

- [ ] **Step 1: Add failing workflow checkpoint tests**

```python
def test_create_workflow_has_required_checkpoints(self):
    workflow = (ROOT / ".agents/workflows/create-cloud-demo.md").read_text(encoding="utf-8")
    for phrase in ("audience", "framework", "Showcase", "Console", "Hybrid", "product.md", "ui.md", "engineering.md", "verify-cloud-style", "walkthrough"):
        self.assertIn(phrase, workflow)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_antigravity_kit.AntigravityKitTest.test_create_workflow_has_required_checkpoints -v`

Expected: `FAIL` listing missing checkpoints.

- [ ] **Step 3: Write the create workflow**

Define inputs, missing-decision questions, brief files, plan approval, preset default, shell/config/content/demo-pack boundaries, implementation order, safe mutation scope, tests, screenshot generation, and final walkthrough. Explicitly direct Antigravity to modify content/config/demo packs rather than rewriting stable shell internals unless the approved brief requires a shell feature.

Add a realistic fixture request for a retail support application using Image Studio, Analytics, and Business Flows.

- [ ] **Step 4: Validate workflow structure**

Run: `python tools/validate_antigravity_kit.py`

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: all checks pass.

- [ ] **Step 5: Commit the create workflow**

```bash
git add .agents/workflows/create-cloud-demo.md tests/fixtures/antigravity/create-brief.md tests/test_antigravity_kit.py
git commit -m "docs: add the Antigravity create workflow"
```

### Task 5: Implement `/adopt-cloud-style`

**Files:**
- Modify: `.agents/workflows/adopt-cloud-style.md`
- Create: `tests/fixtures/antigravity/existing-app-inventory.md`
- Modify: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: Cloud Style skill adoption guide and an existing application inventory.
- Produces: architecture-preserving adoption map, reference-screen migration, verification, and continuation gate.

- [ ] **Step 1: Add failing preservation tests**

```python
def test_adopt_workflow_preserves_application_contracts(self):
    workflow = (ROOT / ".agents/workflows/adopt-cloud-style.md").read_text(encoding="utf-8")
    for phrase in ("framework", "routes", "data flow", "public interfaces", "existing tests", "representative screen", "approval", "conflict"):
        self.assertIn(phrase, workflow)
    self.assertNotIn("replace the framework", workflow.lower())
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_antigravity_kit.AntigravityKitTest.test_adopt_workflow_preserves_application_contracts -v`

Expected: `FAIL` listing missing preservation language.

- [ ] **Step 3: Write the adoption workflow**

Define inventory, screen-role mapping, design-system conflict report, migration sequence, plan approval, tokens/shell first, one representative screen, verification gate, and screen-by-screen continuation. Require a pause when adoption would change public behavior or when an existing design system conflicts with mandatory Google Cloud identity.

Add an existing-app fixture describing React routes, state, API boundaries, tests, accessibility, and a non-Google theme to exercise the mapping.

- [ ] **Step 4: Validate the workflow**

Run: `python tools/validate_antigravity_kit.py`

Run: `python -m unittest tests.test_antigravity_kit -v`

Expected: all checks pass.

- [ ] **Step 5: Commit the adoption workflow**

```bash
git add .agents/workflows/adopt-cloud-style.md tests/fixtures/antigravity/existing-app-inventory.md tests/test_antigravity_kit.py
git commit -m "docs: add the Antigravity adoption workflow"
```

### Task 6: Implement `/verify-cloud-style`

**Files:**
- Modify: `.agents/workflows/verify-cloud-style.md`
- Modify: `tools/verify.py`
- Modify: `tools/screenshot_manifest.py`
- Modify: `tests/test_antigravity_kit.py`

**Interfaces:**
- Consumes: project test commands, `tools/verify.py`, screenshot manifest, and Cloud Style acceptance criteria.
- Produces: deterministic verification report and screenshot walkthrough.

- [ ] **Step 1: Add failing evidence tests**

```python
def test_verify_workflow_requires_all_evidence(self):
    workflow = (ROOT / ".agents/workflows/verify-cloud-style.md").read_text(encoding="utf-8")
    for phrase in ("console errors", "1280×720", "3840×2160", "390×844", "keyboard", "focus", "reduced motion", "screenshots", "must not report completion"):
        self.assertIn(phrase, workflow)
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `python -m unittest tests.test_antigravity_kit.AntigravityKitTest.test_verify_workflow_requires_all_evidence -v`

Expected: `FAIL` listing missing evidence requirements.

- [ ] **Step 3: Write the verification workflow and report contract**

Define dependency checks, existing test discovery, static contracts, route/demo traversal, viewports, keyboard/focus, reduced motion, clipping, accessible names, live interaction, screenshot generation, visual review, and report fields. Require failure status when any check cannot run. The walkthrough must list commands, pass/fail counts, screenshot paths, and unresolved limitations.

- [ ] **Step 4: Run the workflow's underlying commands**

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --all-demos --update-screenshots`

Expected: all checks pass and required screenshots exist.

- [ ] **Step 5: Commit the verification workflow**

```bash
git add .agents/workflows/verify-cloud-style.md tools/verify.py tools/screenshot_manifest.py tests/test_antigravity_kit.py docs/screenshots
git commit -m "docs: add the Antigravity verification workflow"
```

### Task 7: Package portable installation without overwriting `.agents`

**Files:**
- Create: `tools/install_antigravity_kit.py`
- Create: `docs/ANTIGRAVITY.md`
- Create: `tests/test_install_antigravity_kit.py`
- Modify: `README.md`

**Interfaces:**
- Consumes: repository `.agents` package, theme/assets, and verification tools.
- Produces: `build_install_plan(source: Path, target: Path) -> list[CopyOperation]` and a `--dry-run` installer.

- [ ] **Step 1: Write failing installer safety tests**

```python
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from tools.install_antigravity_kit import build_install_plan, install

class InstallerTest(unittest.TestCase):
    def test_existing_agent_file_is_not_overwritten(self):
        with TemporaryDirectory() as directory:
            target = Path(directory)
            existing = target / ".agents/rules/team.md"
            existing.parent.mkdir(parents=True)
            existing.write_text("keep me", encoding="utf-8")
            install(target=target, dry_run=False)
            self.assertEqual(existing.read_text(encoding="utf-8"), "keep me")
```

- [ ] **Step 2: Run the test and confirm the missing installer fails**

Run: `python -m unittest tests.test_install_antigravity_kit -v`

Expected: `ERROR` with `ModuleNotFoundError`.

- [ ] **Step 3: Implement safe copy planning and installation**

Use `CopyOperation(source, destination, conflict)` records. Copy only Cloud Style-owned rule, skill, and workflow paths plus documented theme/assets/verification files. Default to dry run. On destination conflict, report it and skip unless the file is byte-identical; do not delete or overwrite unrelated content. Support `--target <path>`, `--dry-run`, and `--apply`.

Document clone/create and portable/adopt steps with example prompts and explicit conflict behavior in `docs/ANTIGRAVITY.md`.

- [ ] **Step 4: Test dry run and a temporary installation**

Run: `python -m unittest tests.test_install_antigravity_kit -v`

Run: `python tools/install_antigravity_kit.py --target . --dry-run`

Expected: tests pass; dry run lists Cloud Style-owned paths and no deletions.

- [ ] **Step 5: Commit installation support**

```bash
git add tools/install_antigravity_kit.py tests/test_install_antigravity_kit.py docs/ANTIGRAVITY.md README.md
git commit -m "feat: add portable Antigravity kit installation"
```

### Task 8: Validate create and adopt paths in clean workspaces

**Files:**
- Create: `tools/validate_antigravity_examples.py`
- Create: `docs/antigravity/create-walkthrough.md`
- Create: `docs/antigravity/adopt-walkthrough.md`
- Modify: `tests/test_antigravity_kit.py`
- Modify: `README.md`

**Interfaces:**
- Consumes: installer, three workflows, fixtures, repository tests, visual verifier, and screenshots.
- Produces: reproducible create/adopt walkthrough evidence.

- [ ] **Step 1: Add failing walkthrough-evidence tests**

```python
def test_walkthroughs_include_commands_and_evidence(self):
    for relative in ("docs/antigravity/create-walkthrough.md", "docs/antigravity/adopt-walkthrough.md"):
        text = (ROOT / relative).read_text(encoding="utf-8")
        for phrase in ("Commands run", "Tests", "Screenshots", "Limitations"):
            self.assertIn(phrase, text)
```

- [ ] **Step 2: Run tests and confirm missing walkthroughs fail**

Run: `python -m unittest tests.test_antigravity_kit.AntigravityKitTest.test_walkthroughs_include_commands_and_evidence -v`

Expected: `ERROR` for missing walkthrough files.

- [ ] **Step 3: Validate package installation in temporary workspaces**

`validate_antigravity_examples.py` must create temporary create/adopt workspace fixtures, run the installer, call `validate_kit`, check that existing files remain unchanged, and print the commands a human must run inside Antigravity. It must not pretend to execute Antigravity itself when no CLI automation contract is available.

Record an actual manual Antigravity run for both workflows in the walkthroughs. Include prompt, generated plan, files changed, commands run, tests, screenshot paths, behavior preserved, and limitations.

- [ ] **Step 4: Run all validation and inspect evidence**

Run: `python tools/validate_antigravity_examples.py`

Run: `python -m unittest discover -s tests -v`

Run: `python tools/verify.py --all-demos`

Expected: temporary installations validate, existing fixture files are preserved, repository tests pass, and screenshot references resolve.

- [ ] **Step 5: Commit final evidence and documentation**

```bash
git add tools/validate_antigravity_examples.py docs/antigravity README.md tests/test_antigravity_kit.py
git commit -m "docs: validate Antigravity create and adopt paths"
```

