#!/usr/bin/env python3
"""Verify the neutral Google Cloud sample application in Chromium."""

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


DESKTOP = {"width": 1280, "height": 720}
MOBILE = {"width": 390, "height": 844}
EXPECTED_SCREENSHOTS = {
    "app-overview-desktop",
    "app-overview-4k",
    "app-overview-mobile",
    "app-resources-desktop",
    "app-resources-mobile",
    "app-resource-detail-desktop",
    "app-activity-states",
    "app-settings-validation",
    "components-app-surfaces",
}


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


def check_resource_workflow(browser, url: str, problems: list[str]) -> None:
    page = browser.new_page(viewport=DESKTOP)
    add_watchers(page, "resources", problems)
    page.goto(f"{url}#/resources", wait_until="networkidle", timeout=60_000)

    resource_filter = page.locator("[data-resource-filter]")
    if resource_filter.count() != 1:
        problems.append("[resources] missing resource filter")
    else:
        resource_filter.fill("edge")
        page.wait_for_timeout(50)
        rows = page.locator("[data-resource-row]:visible")
        if rows.count() != 1 or "Edge gateway" not in rows.first.inner_text():
            problems.append("[resources] filter did not isolate Edge gateway")
        else:
            rows.first.click()
            page.wait_for_timeout(50)
            if not page.url.endswith("#/resources/edge-gateway"):
                problems.append("[resources] resource row did not open its deep link")

    page.goto(f"{url}#/resources/edge-gateway", wait_until="networkidle", timeout=60_000)
    tabs = page.locator('[role="tab"]')
    if tabs.count() != 3:
        problems.append("[resources] detail must expose three tabs")
    else:
        for index in range(tabs.count()):
            tab = tabs.nth(index)
            panel_id = tab.get_attribute("aria-controls")
            tab.click()
            panel = page.locator(f"#{panel_id}")
            if panel.count() != 1 or not panel.is_visible():
                problems.append(f"[resources] tab {index + 1} did not reveal its panel")
        tabs.first.focus()
        page.keyboard.press("ArrowRight")
        if page.evaluate("document.activeElement?.getAttribute('role')") != "tab":
            problems.append("[resources] arrow navigation did not retain tab focus")
    page.close()


def check_activity_and_settings(browser, url: str, problems: list[str]) -> None:
    page = browser.new_page(viewport=DESKTOP)
    add_watchers(page, "states", problems)
    for state in ("loading", "empty", "success", "warning", "error"):
        page.goto(f"{url}#/activity?state={state}", wait_until="networkidle", timeout=60_000)
        region = page.locator(f'[data-state="{state}"]')
        if region.count() != 1 or not region.is_visible():
            problems.append(f"[states] activity state {state!r} is not visible")

    page.goto(f"{url}#/settings", wait_until="networkidle", timeout=60_000)
    display_name = page.locator('[name="displayName"]')
    form = page.locator("[data-settings-form]")
    if display_name.count() != 1 or form.count() != 1:
        problems.append("[settings] missing settings form or display-name field")
    else:
        display_name.fill("")
        form.locator('[type="submit"]').click()
        if page.locator("#display-name-error").count() != 1:
            problems.append("[settings] empty display name has no inline error")
        if page.evaluate("document.activeElement?.getAttribute('name')") != "displayName":
            problems.append("[settings] invalid field did not receive focus")
        display_name.fill("Temporary name")
        page.locator("[data-cancel-settings]").click()
        if display_name.input_value() != "Google Cloud App":
            problems.append("[settings] cancel did not restore the default display name")
        display_name.fill("Operations App")
        form.locator('[type="submit"]').click()
        dialog = page.locator("dialog[open]")
        if dialog.count() != 1:
            problems.append("[settings] save did not open confirmation dialog")
        else:
            dialog.locator("[data-confirm-save]").click()
            if "saved" not in page.locator("[data-settings-status]").inner_text().lower():
                problems.append("[settings] confirmation did not announce saved state")
    page.close()


def check_layout_and_accessibility(browser, url: str, problems: list[str]) -> None:
    for label, viewport, mobile in (
        ("desktop", DESKTOP, False),
        ("4k", {"width": 3840, "height": 2160}, False),
        ("mobile", MOBILE, True),
    ):
        page = browser.new_page(viewport=viewport, is_mobile=mobile, has_touch=mobile)
        add_watchers(page, label, problems)
        page.goto(f"{url}#/overview", wait_until="networkidle", timeout=60_000)
        overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        if overflow > 1:
            problems.append(f"[{label}] horizontal overflow is {overflow}px")
        primary = page.locator(".gc-button--primary:visible")
        if primary.count() > 1:
            problems.append(f"[{label}] overview exposes more than one primary action")
        if primary.count() == 1:
            primary.focus()
            shadow = primary.evaluate("element => getComputedStyle(element).boxShadow")
            if shadow == "none":
                problems.append(f"[{label}] primary action has no visible focus ring")
        page.close()

    reduced = browser.new_page(viewport=DESKTOP, reduced_motion="reduce")
    add_watchers(reduced, "reduced-motion", problems)
    reduced.goto(f"{url}#/activity?state=loading", wait_until="networkidle", timeout=60_000)
    duration = reduced.locator(".gc-spinner").evaluate("element => getComputedStyle(element).animationDuration")
    if duration not in {"0s", "1e-05s", "0.00001s"}:
        problems.append(f"[reduced-motion] spinner duration remains {duration}")
    reduced.close()


def check_screenshot_contract(problems: list[str]) -> None:
    names = {case["name"] for case in SCREENSHOT_CASES}
    if names != EXPECTED_SCREENSHOTS:
        problems.append(f"[screenshots] manifest names differ: {sorted(names ^ EXPECTED_SCREENSHOTS)}")
    for case in SCREENSHOT_CASES:
        if not case["path"].startswith("/"):
            problems.append(f"[screenshots] {case['name']} path must start with /")
        if len(case["viewport"]) != 2 or min(case["viewport"]) <= 0:
            problems.append(f"[screenshots] {case['name']} has an invalid viewport")
        if not case.get("selector"):
            problems.append(f"[screenshots] {case['name']} has no selector")


def capture_screenshots(browser, url: str, out: pathlib.Path, problems: list[str]) -> None:
    parsed = urlsplit(url)
    origin = f"{parsed.scheme}://{parsed.netloc}"
    for case in SCREENSHOT_CASES:
        width, height = case["viewport"]
        mobile = case.get("mobile", False)
        page = browser.new_page(
            viewport={"width": width, "height": height},
            is_mobile=mobile,
            has_touch=mobile,
            reduced_motion="reduce",
        )
        add_watchers(page, case["name"], problems)
        page.goto(origin + case["path"], wait_until="networkidle", timeout=60_000)
        page.wait_for_timeout(250)

        if case.get("setup") == "settings-invalid":
            page.locator('[name="displayName"]').fill("")
            page.locator('[data-settings-form] [type="submit"]').click()

        target = page.locator(case["selector"])
        if target.count() != 1:
            problems.append(
                f"[{case['name']}] selector {case['selector']!r} matched {target.count()} elements"
            )
        else:
            filename = out / f"{case['name']}.png"
            if case.get("full_page"):
                page.screenshot(path=str(filename), full_page=True)
            else:
                target.screenshot(path=str(filename))
            if not filename.exists() or filename.stat().st_size == 0:
                problems.append(f"[{case['name']}] capture is empty")
            else:
                print(f"  {filename.name}")
        page.close()


def check_screenshot_files(out: pathlib.Path, problems: list[str]) -> None:
    for name in EXPECTED_SCREENSHOTS:
        filename = out / f"{name}.png"
        if not filename.exists() or filename.stat().st_size == 0:
            problems.append(f"[screenshots] missing {filename.name}; run with --update-screenshots")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8000/index.html")
    parser.add_argument("--out", default="docs/screenshots")
    parser.add_argument("--runtime-only", action="store_true")
    parser.add_argument("--update-screenshots", action="store_true")
    parser.add_argument("--check-screenshot-contract", action="store_true")
    args = parser.parse_args()

    pathlib.Path(args.out).mkdir(parents=True, exist_ok=True)
    out = pathlib.Path(args.out)
    problems: list[str] = []
    check_screenshot_contract(problems)

    if args.check_screenshot_contract:
        if problems:
            for problem in problems:
                print(problem, file=sys.stderr)
            return 1
        print("OK - canonical screenshot contract passed")
        return 0

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        check_shell_routes(browser, args.url, problems)
        check_resource_workflow(browser, args.url, problems)
        check_activity_and_settings(browser, args.url, problems)
        check_layout_and_accessibility(browser, args.url, problems)
        if args.update_screenshots:
            capture_screenshots(browser, args.url, out, problems)
        browser.close()

    if not args.runtime_only and not args.update_screenshots:
        check_screenshot_files(out, problems)

    if problems:
        print("\nFAILED:", file=sys.stderr)
        for problem in problems:
            print(f"  {problem}", file=sys.stderr)
        return 1

    print("OK - neutral application runtime contract passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
