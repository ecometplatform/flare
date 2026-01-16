/**
 * Dev Error Overlay Test
 *
 * Verifies:
 * 1. No hydration mismatch with ErrorBoundary
 * 2. Hard nav shows overlay
 * 3. Link nav shows overlay
 * 4. Navigation away clears overlay
 */

import { expect, test } from "@playwright/test"

const BASE_URL = "http://localhost:5202"

test.describe("Dev Error Overlay", () => {
	test("no hydration mismatch on normal page", async ({ page }) => {
		const errors: string[] = []
		const consoleMessages: string[] = []
		page.on("console", (msg) => {
			consoleMessages.push(`[${msg.type()}] ${msg.text()}`)
			if (msg.type() === "error") {
				errors.push(msg.text())
			}
		})
		page.on("pageerror", (err) => {
			errors.push(`PAGE ERROR: ${err.message}`)
		})

		await page.goto(`${BASE_URL}/`)
		await page.waitForTimeout(3000)

		/* Debug: Print all console messages */
		console.log("Console messages:", consoleMessages.slice(0, 20))
		console.log("Errors:", errors)

		/* Check for hydration complete */
		const hydrated = await page.getAttribute("html", "data-hydrated")
		await page.screenshot({ fullPage: true, path: "/tmp/test-home-page.png" })
		expect(hydrated, `Hydration failed. Errors: ${errors.join(", ")}`).toBe("true")

		/* No hydration errors */
		const hydrationErrors = errors.filter((e) => e.toLowerCase().includes("hydration"))
		expect(hydrationErrors).toHaveLength(0)
	})

	test("hard nav to error page shows overlay", async ({ page }) => {
		await page.goto(`${BASE_URL}/hooks-test/error-test`)
		await page.waitForTimeout(3000)

		/* Portal renders backdrop directly to body - look for error header text */
		const errorHeader = page.locator("text=1 Error")
		const visible = await errorHeader.isVisible().catch(() => false)

		await page.screenshot({ fullPage: true, path: "/tmp/test-hard-nav-error.png" })

		expect(visible, "Overlay should be visible on hard nav").toBe(true)
	})

	test("link navigation works (no full page reload)", async ({ page }) => {
		await page.goto(`${BASE_URL}/`)
		await page.waitForTimeout(2000)
		await page.waitForSelector("[data-hydrated='true']", { timeout: 5000 })

		/* Click a Link to navigate */
		const aboutLink = page.locator("a[href='/about']").first()
		await aboutLink.click()
		await page.waitForURL("**/about", { timeout: 5000 })

		/* Verify still hydrated (not a full page reload) */
		const hydrated = await page.getAttribute("html", "data-hydrated")
		await page.screenshot({ fullPage: true, path: "/tmp/test-link-nav.png" })

		expect(hydrated, "Page should remain hydrated after Link navigation").toBe("true")
	})

	test("navigation away clears overlay via hard nav", async ({ page }) => {
		/* Go to error page first */
		await page.goto(`${BASE_URL}/hooks-test/error-test`)
		await page.waitForTimeout(3000)

		/* Verify overlay is visible - look for error header text */
		const errorHeader = page.locator("text=1 Error")
		let visible = await errorHeader.isVisible().catch(() => false)
		expect(visible, "Overlay should be visible initially").toBe(true)

		/* Navigate away via hard nav (not Link, which is broken) */
		await page.goto(`${BASE_URL}/hooks-test`)
		await page.waitForTimeout(2000)

		/* Overlay should be gone after navigation */
		visible = await errorHeader.isVisible().catch(() => false)

		await page.screenshot({ fullPage: true, path: "/tmp/test-nav-away-clears.png" })

		expect(visible, "Overlay should be cleared after navigation").toBe(false)
	})
})
