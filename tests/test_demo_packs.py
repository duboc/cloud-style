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


if __name__ == "__main__":
    unittest.main()
