/**
 * SSR E2E Tests
 *
 * Tests server-side rendering and initial page load.
 */

import { expect, test } from "@playwright/test"

test.describe("SSR", () => {
	test("renders home page", async ({ page }) => {
		await page.goto("/")

		/* Check page title */
		await expect(page).toHaveTitle("Flare v2 Tests")

		/* Check page header */
		await expect(page.locator("h1")).toContainText("Flare v2 Test Pages")
	})

	test("renders about page", async ({ page }) => {
		await page.goto("/about")

		await expect(page.locator("h1")).toContainText("About Flare v2")
		await expect(page.locator("text=Version: 2.0.0")).toBeVisible()
	})

	test("renders dynamic product page with params", async ({ page }) => {
		await page.goto("/products/42")

		await expect(page.locator("h1")).toContainText("Product 42")
		await expect(page.locator("text=ID")).toBeVisible()
		await expect(page.locator("text=$420")).toBeVisible()
	})

	test("returns 404 for unknown routes", async ({ page }) => {
		const response = await page.goto("/unknown-route")

		expect(response?.status()).toBe(404)
		await expect(page.locator("text=404")).toBeVisible()
	})

	test("flare state is embedded in HTML", async ({ page }) => {
		await page.goto("/")

		/* Check self.flare script exists */
		const flareScript = await page.evaluate(() => {
			return typeof (window as unknown as { flare: unknown }).flare
		})

		expect(flareScript).toBe("object")
	})
})
