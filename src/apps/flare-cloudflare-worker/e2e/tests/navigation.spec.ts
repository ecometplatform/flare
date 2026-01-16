/**
 * Navigation E2E Tests
 *
 * Tests client-side navigation and Link component.
 */

import { expect, test } from "@playwright/test"

test.describe("Navigation", () => {
	test("navigates from home to about page without full page reload", async ({ page }) => {
		/* Collect JS errors and warnings */
		const jsErrors: string[] = []
		const consoleWarnings: string[] = []
		const consoleErrors: string[] = []

		page.on("pageerror", (error) => jsErrors.push(error.message))
		page.on("console", (msg) => {
			if (msg.type() === "error") consoleErrors.push(msg.text())
			if (msg.type() === "warning") consoleWarnings.push(msg.text())
		})

		await page.goto("/")

		/* Wait for hydration to complete - check for hydration signal */
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Set marker to detect full page reload */
		await page.evaluate(() => {
			;(window as unknown as Record<string, boolean>).__CSR_MARKER__ = true
		})

		/* Log any JS errors/warnings before click for debugging */
		if (jsErrors.length > 0) console.log("JS errors before click:", jsErrors)
		if (consoleErrors.length > 0) console.log("Console errors before click:", consoleErrors)
		if (consoleWarnings.length > 0) console.log("Console warnings before click:", consoleWarnings)

		/* Click about link */
		await page.click('a[href="/about"]')

		/* Should navigate without full page reload */
		await expect(page).toHaveURL("/about")
		await expect(page.locator("h1")).toContainText("About Flare v2")

		/* Verify no full page reload - marker should still exist */
		const markerExists = await page.evaluate(
			() => (window as unknown as Record<string, boolean>).__CSR_MARKER__ === true,
		)

		/* No JS errors should occur */
		expect(jsErrors).toHaveLength(0)
		expect(consoleErrors).toHaveLength(0)
		expect(markerExists).toBe(true)
	})

	test("navigates from home to product page", async ({ page }) => {
		await page.goto("/")

		/* Click product link */
		await page.click("text=Product 123")

		await expect(page).toHaveURL("/products/123")
		await expect(page.locator("h1")).toContainText("Product 123")
	})

	test("navigates back using browser back button", async ({ page }) => {
		await page.goto("/")
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		/* Go back */
		await page.goBack()

		await expect(page).toHaveURL("/")
		await expect(page.locator("h1")).toContainText("Flare v2 Test Pages")
	})

	test("navigates between product pages", async ({ page }) => {
		await page.goto("/products/123")
		await expect(page.locator("h1")).toContainText("Product 123")

		/* Navigate to another product */
		await page.click("text=Product 999")

		await expect(page).toHaveURL("/products/999")
		await expect(page.locator("h1")).toContainText("Product 999")
		await expect(page.locator("text=$9990")).toBeVisible()
	})

	test("back to home from nested page", async ({ page }) => {
		await page.goto("/products/42")

		await page.click("text=Back to Home")

		await expect(page).toHaveURL("/")
		await expect(page.locator("h1")).toContainText("Flare v2 Test Pages")
	})
})
