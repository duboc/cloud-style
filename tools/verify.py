#!/usr/bin/env python3
"""Verify the neutral Google Cloud sample application in Chromium."""

import argparse
import pathlib
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit(
        "Verification dependency missing. Run:\n"
        "  python -m pip install -r requirements-dev.txt\n"
        "  python -m playwright install chromium"
    )


DESKTOP = {"width": 1280, "height": 720}
MOBILE = {"width": 390, "height": 844}


def add_watchers(page, label: str, problems: list[str]) -> None:
    page.on(
        "console",
        lambda message: problems.append(f"[{label}] console.{message.type}: {message.text}")
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: problems.append(f"[{label}] pageerror: {error}"))


def check_shell_routes(browser, url: str, problems: list[str]) -> None:
    page = browser.new_page(viewport=DESKTOP)
    add_watchers(page, "routes", problems)
    page.goto(url, wait_until="networkidle", timeout=60_000)
    routes = (
        ("#/overview", "Overview"),
        ("#/resources", "Resources"),
        ("#/resources/api-gateway", "API gateway"),
        ("#/activity", "Activity"),
        ("#/settings", "Settings"),
    )
    for route, heading in routes:
        page.evaluate("route => { window.location.hash = route; }", route)
        page.wait_for_timeout(80)
        page_heading = page.locator("main.gc-main h1")
        if page_heading.count() != 1:
            problems.append(f"[routes] missing one page heading for {route}")
            continue
        if heading not in page_heading.inner_text():
            problems.append(f"[routes] expected heading {heading!r} for {route}")
        if page.locator('[aria-current="page"]').count() < 1:
            problems.append(f"[routes] missing current navigation state for {route}")
    page.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8000/index.html")
    parser.add_argument("--out", default="docs/screenshots")
    parser.add_argument("--runtime-only", action="store_true")
    parser.add_argument("--update-screenshots", action="store_true")
    parser.add_argument("--check-screenshot-contract", action="store_true")
    args = parser.parse_args()

    pathlib.Path(args.out).mkdir(parents=True, exist_ok=True)
    problems: list[str] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        check_shell_routes(browser, args.url, problems)
        browser.close()

    if problems:
        print("\nFAILED:", file=sys.stderr)
        for problem in problems:
            print(f"  {problem}", file=sys.stderr)
        return 1

    print("OK - neutral application runtime contract passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
