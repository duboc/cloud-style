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
        self.assertRegex(cards, r'<button[^>]*class="gc-card')
        self.assertNotIn('<article class="gc-card', cards)

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
        self.assertIn("gc-console-surface", catalog)
        self.assertIn("gc-console-surface", cards)
        self.assertIn("gc-console-surface", detail)

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
