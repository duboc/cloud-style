#!/usr/bin/env python3
"""
Screenshot every screen of the template so a change can be eyeballed or diffed.

Fails (exit 1) on any console error or uncaught page error, so it doubles as a
smoke test for the router and the card rail.

    python3 -m http.server 8000 &
    python3 tools/verify.py

Options:
    --url  http://localhost:8000/index.html   page under test
    --out  docs/screenshots                   where to write template-*.png

Requires:
    pip install playwright && playwright install chromium
"""

import argparse
import pathlib
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit("playwright not installed:\n"
             "  pip install playwright && playwright install chromium")

DESKTOP = {"width": 1600, "height": 900}
MOBILE = {"width": 390, "height": 844}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:8000/index.html")
    ap.add_argument("--out", default="docs/screenshots")
    args = ap.parse_args()

    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    problems: list[str] = []

    def watch(page, label):
        page.on("console", lambda m: problems.append(f"[{label}] console.{m.type}: {m.text}")
                if m.type == "error" else None)
        page.on("pageerror", lambda e: problems.append(f"[{label}] pageerror: {e}"))

    with sync_playwright() as p:
        browser = p.chromium.launch()

        # ---- desktop: walk cover -> menu -> cards -> article -----------------
        page = browser.new_page(viewport=DESKTOP)
        watch(page, "desktop")
        page.goto(args.url, wait_until="networkidle", timeout=60_000)
        page.wait_for_timeout(1500)          # let webfonts settle

        page.screenshot(path=str(out / "template-cover.png"))
        print("  template-cover.png")

        page.locator(".gc-btn--cover").click()
        page.wait_for_timeout(800)
        page.screenshot(path=str(out / "template-menu.png"))
        print("  template-menu.png")

        page.locator(".gc-menu-item").first.click()
        page.wait_for_timeout(800)
        page.screenshot(path=str(out / "template-cards.png"))
        print("  template-cards.png")

        page.locator(".gc-card").first.click()
        page.wait_for_timeout(800)
        page.screenshot(path=str(out / "template-article.png"))
        print("  template-article.png")

        # The article screen must actually have rendered — if the rail's drag
        # handler swallows the click, this is where you find out.
        if page.locator(".gc-article-title").count() == 0:
            problems.append("[desktop] clicking a card did not open the article")

        # ---- scaling: the layout must scale, not reflow ----------------------
        # Same DOM, two widths: the wordmark's width as a FRACTION of the stage
        # must be identical. If it isn't, something is sized in px.
        ratios = []
        for width in (1280, 3840):
            page.set_viewport_size({"width": width, "height": int(width * 9 / 16)})
            page.wait_for_timeout(400)
            ratios.append(page.evaluate("""() => {
                const w = document.querySelector('.gc-wordmark h1').getBoundingClientRect().width;
                const s = document.querySelector('.gc-stage').getBoundingClientRect().width;
                return w / s;
            }"""))
        if abs(ratios[0] - ratios[1]) > 0.005:
            problems.append(
                f"[scaling] wordmark/stage ratio drifts between viewports: "
                f"{ratios[0]:.4f} vs {ratios[1]:.4f} — something is sized in px")
        else:
            print(f"  scaling OK (wordmark = {ratios[0]:.1%} of stage at both 1280 and 3840)")

        page.close()

        # ---- mobile ----------------------------------------------------------
        m = browser.new_page(viewport=MOBILE, is_mobile=True,
                             has_touch=True, device_scale_factor=2)
        watch(m, "mobile")
        m.goto(args.url, wait_until="networkidle", timeout=60_000)
        m.wait_for_timeout(1200)
        m.screenshot(path=str(out / "template-mobile-cover.png"), full_page=True)
        print("  template-mobile-cover.png")

        m.locator(".gc-btn--cover").click()
        m.wait_for_timeout(800)
        m.screenshot(path=str(out / "template-mobile-menu.png"), full_page=True)
        print("  template-mobile-menu.png")

        browser.close()

    if problems:
        print("\nFAILED:", file=sys.stderr)
        for p_ in problems:
            print("  " + p_, file=sys.stderr)
        return 1

    print(f"\nOK — screenshots in {out}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
