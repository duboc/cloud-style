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
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertRegex(html, r'<button[^>]*class="gc-card')
        self.assertNotIn('<article class="gc-card', html)

    def test_navigation_exposes_current_page(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("function setActiveNavigation(view)", html)
        self.assertIn("aria-current", html)


if __name__ == "__main__":
    unittest.main()
