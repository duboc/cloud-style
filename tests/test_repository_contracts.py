from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


def read(relative_path: str) -> str:
    return (ROOT / relative_path).read_text(encoding="utf-8")


class RepositoryContractsTest(unittest.TestCase):
    def test_playwright_is_pinned(self):
        self.assertRegex(read("requirements-dev.txt"), r"(?m)^playwright==\d+\.\d+\.\d+$")

    def test_index_loads_neutral_application_modules(self):
        index = read("index.html")
        sources = (
            "js/config.js",
            "js/data.js",
            "js/router.js",
            "js/screens/overview.js",
            "js/screens/resources.js",
            "js/screens/resource-detail.js",
            "js/screens/activity.js",
            "js/screens/settings.js",
            "js/app.js",
        )
        positions = []
        for source in sources:
            marker = f'src="{source}"'
            self.assertIn(marker, index)
            positions.append(index.index(marker))
        self.assertEqual(positions, sorted(positions), "application modules must load in dependency order")

    def test_neutral_screen_modules_exist(self):
        required = (
            "js/data.js",
            "js/screens/overview.js",
            "js/screens/resources.js",
            "js/screens/resource-detail.js",
            "js/screens/activity.js",
            "js/screens/settings.js",
        )
        for relative in required:
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_active_files_do_not_restore_removed_product_primitives(self):
        active_files = [
            ROOT / "index.html",
            ROOT / "js/config.js",
            ROOT / "js/data.js",
            ROOT / "js/router.js",
            ROOT / "js/app.js",
            *sorted((ROOT / "js/screens").glob("*.js")),
        ]
        active_source = "\n".join(path.read_text(encoding="utf-8") for path in active_files)
        forbidden = (
            "Cloud Workspace",
            "Demo Packs",
            "gc-phone",
            "gc-device-slot",
            "gc-rail",
            "gc-stage",
        )
        for primitive in forbidden:
            self.assertNotIn(primitive, active_source)

    def test_legacy_active_surfaces_are_removed(self):
        removed_paths = (
            "tests/test_demo_packs.py",
            "templates/01-cover.html",
            "templates/02-menu.html",
            "templates/03-cards.html",
            "templates/04-article.html",
            "templates/05-components.html",
            "templates/06-screen-catalog.html",
        )
        for relative in removed_paths:
            self.assertFalse((ROOT / relative).exists(), relative)
        legacy_files = [path for path in (ROOT / "starter/demo-packs").rglob("*") if path.is_file()]
        self.assertEqual(legacy_files, [])

    def test_visual_css_is_split_by_responsibility(self):
        for relative in (
            "css/tokens.css",
            "css/cloud-style.css",
            "css/shell.css",
            "css/screens.css",
            "css/responsive.css",
        ):
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_google_sans_roles_are_mandatory(self):
        tokens = read("css/tokens.css")
        self.assertIn('--gc-font-display: "Google Sans"', tokens)
        self.assertIn('--gc-font-text:    "Google Sans Text"', tokens)

    def test_css_exposes_application_tokens(self):
        tokens = read("css/tokens.css")
        for token in ("--gc-space-4", "--gc-border-subtle", "--gc-surface", "--gc-focus-ring"):
            self.assertIn(token, tokens)

    def test_css_does_not_define_presentation_primitives(self):
        styles = "\n".join(read(relative) for relative in (
            "css/tokens.css",
            "css/cloud-style.css",
            "css/shell.css",
            "css/screens.css",
            "css/responsive.css",
        ))
        for primitive in (".gc-stage", ".gc-phone", ".gc-device-slot", ".gc-rail", ".gc-footer"):
            self.assertNotIn(primitive, styles)
        self.assertNotIn("aspect-ratio: 16 / 9", styles)


if __name__ == "__main__":
    unittest.main()
