from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class RepositoryContractsTest(unittest.TestCase):
    def test_playwright_is_pinned(self):
        requirements = (ROOT / "requirements-dev.txt").read_text(encoding="utf-8")
        self.assertRegex(requirements, r"(?m)^playwright==\d+\.\d+\.\d+$")


if __name__ == "__main__":
    unittest.main()
