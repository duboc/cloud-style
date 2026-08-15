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
    python -m pip install -r requirements-dev.txt
    python -m playwright install chromium
"""

import argparse
import pathlib
import sys
from urllib.parse import urlsplit

from screenshot_manifest import SCREENSHOT_CASES

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit(
        "Verification dependency missing. Run:\n"
        "  python -m pip install -r requirements-dev.txt\n"
        "  python -m playwright install chromium"
    )

DESKTOP = {"width": 1600, "height": 900}
MOBILE = {"width": 390, "height": 844}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:8000/index.html")
    ap.add_argument("--out", default="docs/screenshots")
    ap.add_argument("--update-screenshots", action="store_true",
                    help="write every canonical manifest capture to docs/screenshots")
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

        if page.locator(".gc-supercloud").count() != 1:
            problems.append("[desktop] cover must contain the Super Cloud artwork")
        if page.locator(".gc-primary-action").count() != 1:
            problems.append("[desktop] cover must expose exactly one primary action")
        if page.locator(".gc-metric-tile").count() < 3:
            problems.append("[desktop] cover metrics are missing")
        fonts = page.locator(".gc-hero-copy").evaluate(
            "element => getComputedStyle(element).fontFamily"
        )
        if "Google Sans" not in fonts:
            problems.append(f"[desktop] prose is not using Google Sans: {fonts}")

        page.locator(".gc-hero-actions .gc-btn").click()
        page.wait_for_timeout(800)
        if page.locator('.gc-nav-link[aria-current="page"]').text_content() != "Catálogo de Demos":
            problems.append("[desktop] catalog navigation does not expose aria-current")
        page.screenshot(path=str(out / "template-menu.png"))
        print("  template-menu.png")
        if page.locator(".gc-console-surface").count() == 0:
            problems.append("[desktop] catalog is missing its Console surface")

        page.locator(".gc-menu-item").first.click()
        page.wait_for_timeout(800)
        page.screenshot(path=str(out / "template-cards.png"))
        print("  template-cards.png")
        if page.locator(".gc-console-surface").count() == 0:
            problems.append("[desktop] cards are missing their Console surface")

        first_card = page.locator(".gc-card").first
        first_card.focus()
        page.keyboard.press("Enter")
        page.wait_for_timeout(800)
        page.screenshot(path=str(out / "template-article.png"))
        print("  template-article.png")
        if page.locator(".gc-console-surface").count() == 0:
            problems.append("[desktop] detail is missing its Console surface")

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
        mobile_geometry = m.evaluate("""() => {
            const actions = document.querySelector('.gc-hero-actions').getBoundingClientRect();
            const metrics = document.querySelector('.gc-metrics-bar').getBoundingClientRect();
            return {
                overflow: document.documentElement.scrollWidth - innerWidth,
                actionBottom: actions.bottom,
                metricsTop: metrics.top,
                metricsBottom: metrics.bottom,
            };
        }""")
        if mobile_geometry["overflow"] > 1:
            problems.append(f"[mobile] horizontal overflow is {mobile_geometry['overflow']}px")
        if mobile_geometry["metricsTop"] < mobile_geometry["actionBottom"]:
            problems.append("[mobile] metrics overlap the cover actions")
        m.screenshot(path=str(out / "template-mobile-cover.png"), full_page=True)
        print("  template-mobile-cover.png")

        mobile_action = m.locator(".gc-hero-actions .gc-btn")
        mobile_action.focus()
        m.keyboard.press("Enter")
        m.wait_for_timeout(800)
        m.screenshot(path=str(out / "template-mobile-menu.png"), full_page=True)
        print("  template-mobile-menu.png")

        reduced = browser.new_page(viewport=DESKTOP, reduced_motion="reduce")
        watch(reduced, "reduced-motion")
        reduced.goto(args.url, wait_until="networkidle", timeout=60_000)
        reduced.locator(".gc-primary-action").click()
        reduced.locator(".gc-menu-item").first.click()
        live_card = reduced.locator(".gc-card--live").first
        if live_card.count() and live_card.evaluate(
            "element => getComputedStyle(element).animationName"
        ) != "none":
            problems.append("[reduced-motion] live-card pulse is still active")
        reduced.close()

        if args.update_screenshots:
            parsed = urlsplit(args.url)
            origin = f"{parsed.scheme}://{parsed.netloc}"
            for case in SCREENSHOT_CASES:
                width, height = case["viewport"]
                capture = browser.new_page(
                    viewport={"width": width, "height": height},
                    is_mobile=case.get("mobile", False),
                    has_touch=case.get("mobile", False),
                )
                watch(capture, case["name"])
                capture.goto(origin + case["path"], wait_until="networkidle", timeout=60_000)
                capture.wait_for_timeout(500)
                setup = case.get("setup")
                if setup in {"catalog", "cards", "detail"}:
                    capture.locator(".gc-primary-action").click()
                if setup in {"cards", "detail"}:
                    capture.locator(".gc-menu-item").first.click()
                if setup == "detail":
                    card = capture.locator(".gc-card").first
                    card.focus()
                    capture.keyboard.press("Enter")
                if setup == "focus-primary":
                    capture.locator("#primary").focus()
                capture.wait_for_timeout(300)
                target = capture.locator(case["selector"])
                if target.count() != 1:
                    problems.append(
                        f"[{case['name']}] selector {case['selector']} matched {target.count()} elements"
                    )
                else:
                    filename = out / f"{case['name']}.png"
                    target.screenshot(path=str(filename))
                    if not filename.exists() or filename.stat().st_size == 0:
                        problems.append(f"[{case['name']}] capture is empty")
                    else:
                        print(f"  {filename.name}")
                capture.close()

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
