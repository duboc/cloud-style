from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class RepositoryContractsTest(unittest.TestCase):
    def test_playwright_is_pinned(self):
        requirements = (ROOT / "requirements-dev.txt").read_text(encoding="utf-8")
        self.assertRegex(requirements, r"(?m)^playwright==\d+\.\d+\.\d+$")

    def test_no_missing_badge_reference(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("badge.hidden", html)

    def test_cards_use_buttons(self):
        cards = (ROOT / "js/screens/cards.js").read_text(encoding="utf-8")
        self.assertRegex(cards, r'<button[^>]*class="gc-workflow-row')
        self.assertNotIn('<article class="gc-workflow-row', cards)

    def test_navigation_exposes_current_page(self):
        app = (ROOT / "js/app.js").read_text(encoding="utf-8")
        self.assertIn("function setActiveNavigation(view)", app)
        self.assertIn("aria-current", app)

    def test_screen_modules_exist(self):
        required = [
            "js/app.js",
            "js/config.js",
            "js/router.js",
            "js/screens/cover.js",
            "js/screens/catalog.js",
            "js/screens/cards.js",
            "js/screens/detail.js",
        ]
        for relative in required:
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_index_does_not_define_screen_templates(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for name in (
            "function cover(",
            "function menu(",
            "function cards(",
            "function article(",
        ):
            self.assertNotIn(name, html)

    def test_shell_labels_come_from_config(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for label in ("DEMO CONSOLE", "Visão Geral", "Catálogo de Demos"):
            self.assertNotIn(label, html)
        app = (ROOT / "js/app.js").read_text(encoding="utf-8")
        self.assertIn("APP_CONFIG.navigation", app)
        self.assertIn("APP_CONFIG.status", app)

    def test_visual_css_is_split(self):
        for relative in ("css/shell.css", "css/screens.css", "css/responsive.css"):
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_google_sans_roles_are_mandatory(self):
        tokens = (ROOT / "css/tokens.css").read_text(encoding="utf-8")
        self.assertIn('--gc-font-display: "Google Sans"', tokens)
        self.assertIn('--gc-font-text:    "Google Sans Text"', tokens)

    def test_hybrid_direction_has_visual_landmarks(self):
        cover = (ROOT / "js/screens/cover.js").read_text(encoding="utf-8")
        catalog = (ROOT / "js/screens/catalog.js").read_text(encoding="utf-8")
        cards = (ROOT / "js/screens/cards.js").read_text(encoding="utf-8")
        detail = (ROOT / "js/screens/detail.js").read_text(encoding="utf-8")
        self.assertEqual(cover.count("gc-primary-action"), 1)
        self.assertIn("gc-workspace-list", catalog)
        self.assertIn("gc-workflow-page", cards)
        self.assertIn("gc-tool-surface", detail)

    def test_workspace_uses_neutral_template_language(self):
        config = (ROOT / "js/config.js").read_text(encoding="utf-8").lower()
        catalog = (ROOT / "js/screens/catalog.js").read_text(encoding="utf-8")
        for rejected in ("catálogo", "catalogo", "demo console", "demos interativas"):
            self.assertNotIn(rejected, config)
        for rejected_markup in ("gc-icon-tile", "gc-menu-badge", "gc-menu-num"):
            self.assertNotIn(rejected_markup, catalog)
        self.assertIn("gc-solution-description", catalog)

    def test_workspace_has_application_shell(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        shell = (ROOT / "css/shell.css").read_text(encoding="utf-8")
        self.assertIn('class="gc-app-sidebar"', html)
        self.assertIn(".gc-app-sidebar", shell)
        self.assertIn(".gc-footer { display: none; }", shell)

    def test_navigation_handles_skipped_view_transitions(self):
        source = (ROOT / "js/cloud-style.js").read_text(encoding="utf-8")
        self.assertIn("transition.ready.catch", source)
        self.assertIn("transition.finished.catch", source)

    def test_solution_details_use_application_workflow_rows(self):
        source = (ROOT / "js/screens/cards.js").read_text(encoding="utf-8")
        self.assertIn("gc-workflow-list", source)
        self.assertIn("gc-workflow-row", source)
        for rejected in ("gc-icon-tile", "gc-card-head", "gc-tag", "gc-rail"):
            self.assertNotIn(rejected, source)

    def test_selected_workflows_use_full_application_workspace(self):
        source = (ROOT / "js/screens/detail.js").read_text(encoding="utf-8")
        self.assertIn("gc-tool-page", source)
        self.assertIn("gc-tool-surface", source)
        self.assertIn("gc-tool-breadcrumb", source)
        for rejected in (
            "gc-device-slot",
            "gc-phone",
            "gc-breadcrumb",
            "gc-icon-btn",
            "gc-article-body",
        ):
            self.assertNotIn(rejected, source)

    def test_screen_renderers_do_not_restore_slide_primitives(self):
        sources = "\n".join(
            (ROOT / path).read_text(encoding="utf-8")
            for path in (
                "js/screens/catalog.js",
                "js/screens/cards.js",
                "js/screens/detail.js",
            )
        )
        for rejected in ("gc-menu-num", "gc-card-head", "gc-device-slot", "gc-phone"):
            self.assertNotIn(rejected, sources)

    def test_screenshot_manifest_has_required_viewports(self):
        from tools.screenshot_manifest import SCREENSHOT_CASES

        names = {case["name"] for case in SCREENSHOT_CASES}
        self.assertIn("hybrid-cover-desktop", names)
        self.assertIn("hybrid-cover-mobile", names)
        self.assertIn("hybrid-cover-4k", names)
        self.assertIn("component-buttons-rest", names)
        self.assertIn("component-buttons-focus", names)


if __name__ == "__main__":
    unittest.main()
