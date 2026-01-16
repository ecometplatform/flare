/**
 * Input Validation E2E Tests
 *
 * Tests that input validators (params, searchParams, hash) are executed at runtime.
 */

import { expect, test } from "@playwright/test"

test.describe("Input Validation", () => {
	test("params enum validation renders correct data", async ({ page }) => {
		await page.goto("/input-tests/category/electronics")
		await expect(page.getByTestId("params-enum")).toBeVisible()
		await expect(page.locator("h1")).toContainText("Category: electronics")
	})

	test("search params validation renders with defaults", async ({ page }) => {
		await page.goto("/input-tests/search")
		await expect(page.getByTestId("search-params")).toBeVisible()
		/* Default values from zod schema */
		await expect(page.locator("text=Page: 1")).toBeVisible()
		await expect(page.locator("text=Sort: asc")).toBeVisible()
	})

	test("search params validation with custom values", async ({ page }) => {
		await page.goto("/input-tests/search?page=5&sort=desc&q=hello")
		await expect(page.getByTestId("search-params")).toBeVisible()
		await expect(page.locator("text=Page: 5")).toBeVisible()
		await expect(page.locator("text=Sort: desc")).toBeVisible()
		await expect(page.locator("text=Query: hello")).toBeVisible()
	})

	test("catch-all params renders array as path", async ({ page }) => {
		await page.goto("/input-tests/docs/getting-started/installation")
		await expect(page.getByTestId("catch-all")).toBeVisible()
		await expect(page.locator("h1")).toContainText("Docs: getting-started/installation")
	})

	test("optional catch-all shows root when no path", async ({ page }) => {
		await page.goto("/input-tests/files")
		await expect(page.getByTestId("optional-catch-all")).toBeVisible()
		await expect(page.locator("text=At root")).toBeVisible()
	})

	test("optional catch-all shows path when provided", async ({ page }) => {
		await page.goto("/input-tests/files/src/components")
		await expect(page.getByTestId("optional-catch-all")).toBeVisible()
		await expect(page.locator("text=In subdirectory")).toBeVisible()
		await expect(page.locator("h1")).toContainText("Files: src/components")
	})

	test("multi params with coercion", async ({ page }) => {
		await page.goto("/input-tests/store/123/product/550e8400-e29b-41d4-a716-446655440000")
		await expect(page.getByTestId("multi-params")).toBeVisible()
		/* storeId should be coerced to number */
		await expect(page.locator("h1")).toContainText("Store 123")
		await expect(page.locator("text=Product: 550e8400-e29b-41d4-a716-446655440000")).toBeVisible()
	})

	test("combined input validation", async ({ page }) => {
		const response = await page.goto(
			"/input-tests/shop/electronics/AB-1234?color=blue&size=m#reviews",
		)
		const status = response?.status()
		if (status !== 200) {
			const content = await page.content()
			console.log("Response status:", status)
			console.log("Page content:", content.substring(0, 2000))
		}
		expect(status).toBe(200)
		await expect(page.getByTestId("combined-input")).toBeVisible()
		await expect(page.locator("h1")).toContainText("electronics - AB-1234")
		await expect(page.locator("text=Color: blue")).toBeVisible()
		await expect(page.locator("text=Size: m")).toBeVisible()
	})

	test("invalid params enum returns 500", async ({ page }) => {
		const response = await page.goto("/input-tests/category/invalid-category")
		/* Zod validation failure should cause error */
		expect(response?.status()).toBe(500)
	})

	test("invalid item ID format returns 500", async ({ page }) => {
		const response = await page.goto("/input-tests/shop/electronics/invalid-id")
		/* Regex validation should fail */
		expect(response?.status()).toBe(500)
	})
})
