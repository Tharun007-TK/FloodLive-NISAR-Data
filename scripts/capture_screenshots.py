import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

output_dir = Path("docs/screenshots")
output_dir.mkdir(parents=True, exist_ok=True)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Map (Home)...")
        page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=str(output_dir / "map_light.png"))
        print("Captured map_light.png")

        # Toggle theme to dark
        theme_btn = page.locator("button[aria-label='Switch to dark theme']")
        if theme_btn.count() > 0:
            theme_btn.click()
            time.sleep(1)
            page.screenshot(path=str(output_dir / "map_dark.png"))
            print("Captured map_dark.png")

        # Navigate to Impact
        print("Navigating to Impact Analysis...")
        page.goto("http://127.0.0.1:5173/impact", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=str(output_dir / "impact_dark.png"))
        print("Captured impact_dark.png")

        # Toggle to light
        theme_btn_light = page.locator("button[aria-label='Switch to light theme']")
        if theme_btn_light.count() > 0:
            theme_btn_light.click()
            time.sleep(1)
            page.screenshot(path=str(output_dir / "impact_light.png"))
            print("Captured impact_light.png")

        # Navigate to Method
        print("Navigating to Method...")
        page.goto("http://127.0.0.1:5173/method", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=str(output_dir / "method_light.png"))
        print("Captured method_light.png")

        # Toggle to dark
        theme_btn_dark = page.locator("button[aria-label='Switch to dark theme']")
        if theme_btn_dark.count() > 0:
            theme_btn_dark.click()
            time.sleep(1)
            page.screenshot(path=str(output_dir / "method_dark.png"))
            print("Captured method_dark.png")

        # Navigate to Export
        print("Navigating to Export...")
        page.goto("http://127.0.0.1:5173/export", wait_until="networkidle")
        time.sleep(2)
        page.screenshot(path=str(output_dir / "export_dark.png"))
        print("Captured export_dark.png")

        browser.close()
        print("Screenshots captured successfully.")

if __name__ == "__main__":
    run()
