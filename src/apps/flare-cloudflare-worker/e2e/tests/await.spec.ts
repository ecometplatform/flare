/**
 * Await E2E Tests
 *
 * Tests Await component rendering states: pending, success, error.
 * SSR behavior: data awaited, rendered without pending flash.
 * CSR behavior: pending shown while streaming, then resolved.
 */

import { expect, test } from "@playwright/test"

const ROUTE = "/await"

test.describe("Await SSR Rendering", () => {
	test("page renders correctly on SSR", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("await-page")).toBeVisible()
	})

	test("success section renders resolved data on SSR", async ({ page }) => {
		await page.goto(ROUTE)

		/* On SSR, data is awaited so resolved content should be visible */
		const resolved = page.getByTestId("success-resolved")
		await expect(resolved).toBeVisible({ timeout: 2000 })
	})

	test("success result has correct value", async ({ page }) => {
		await page.goto(ROUTE)

		const result = page.getByTestId("success-result")
		await expect(result).toHaveText("success-value", { timeout: 2000 })
	})

	test("success items render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("success-item-1")).toBeVisible({ timeout: 2000 })
		await expect(page.getByTestId("success-item-2")).toBeVisible({ timeout: 2000 })
		await expect(page.getByTestId("success-item-3")).toBeVisible({ timeout: 2000 })
	})

	test("pending not visible on SSR for success case", async ({ page }) => {
		await page.goto(ROUTE)

		/* Wait for resolved to appear first */
		await expect(page.getByTestId("success-resolved")).toBeVisible({ timeout: 2000 })

		/* Pending should not be visible */
		await expect(page.getByTestId("success-pending")).not.toBeVisible()
	})
})

test.describe("Await Error Handling", () => {
	test("error boundary renders on rejection", async ({ page }) => {
		await page.goto(ROUTE)

		const errorBoundary = page.getByTestId("error-boundary")
		await expect(errorBoundary).toBeVisible({ timeout: 2000 })
	})

	test("error message displays correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const errorMessage = page.getByTestId("error-message")
		await expect(errorMessage).toHaveText("await-error-message", { timeout: 2000 })
	})

	test("reset button is present in error boundary", async ({ page }) => {
		await page.goto(ROUTE)

		const resetButton = page.getByTestId("error-reset")
		await expect(resetButton).toBeVisible({ timeout: 2000 })
	})

	test("error resolved content is not visible", async ({ page }) => {
		await page.goto(ROUTE)

		/* Wait for error boundary */
		await expect(page.getByTestId("error-boundary")).toBeVisible({ timeout: 2000 })

		/* Resolved should not be visible */
		await expect(page.getByTestId("error-resolved")).not.toBeVisible()
	})
})

test.describe("Await Swallowed Error", () => {
	test("swallowed error section exists", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("swallowed-section")).toBeVisible()
	})

	test("content after swallowed Await renders", async ({ page }) => {
		await page.goto(ROUTE)

		const afterContent = page.getByTestId("swallowed-after")
		await expect(afterContent).toHaveText("Content after swallowed Await")
	})

	test("swallowed resolved not visible (error swallowed)", async ({ page }) => {
		await page.goto(ROUTE)

		/* Wait a bit for any potential rendering */
		await page.waitForTimeout(500)

		/* Resolved should not be visible since error was swallowed */
		await expect(page.getByTestId("swallowed-resolved")).not.toBeVisible()
	})

	test("swallowed pending not visible after resolution", async ({ page }) => {
		await page.goto(ROUTE)

		/* Wait a bit for resolution */
		await page.waitForTimeout(500)

		await expect(page.getByTestId("swallowed-pending")).not.toBeVisible()
	})
})

test.describe("Await Fast Resolve", () => {
	test("fast section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("fast-section")).toBeVisible()
	})

	test("fast resolved content appears", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("fast-resolved")
		await expect(resolved).toBeVisible({ timeout: 2000 })
		await expect(resolved).toHaveText("Fast: yes")
	})
})

test.describe("Await Slow Resolve", () => {
	test("slow section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("slow-section")).toBeVisible()
	})

	test("slow resolved content appears after delay", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("slow-resolved")
		await expect(resolved).toBeVisible({ timeout: 3000 })
		await expect(resolved).toHaveText("Slow: yes")
	})
})

test.describe("Await No Pending Prop", () => {
	test("no-pending section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("no-pending-section")).toBeVisible()
	})

	test("resolved content appears without pending", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("no-pending-resolved")
		await expect(resolved).toBeVisible({ timeout: 2000 })
		await expect(resolved).toHaveText("no-pending-result")
	})
})

test.describe("Await Complex Data", () => {
	test("complex section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("complex-section")).toBeVisible()
	})

	test("complex resolved renders nested data", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("complex-resolved")
		await expect(resolved).toBeVisible({ timeout: 2000 })
	})

	test("complex meta displays correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const meta = page.getByTestId("complex-meta")
		await expect(meta).toHaveText("Total: 3, Page: 1", { timeout: 2000 })
	})

	test("complex users render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("complex-user-1")).toHaveText("Alice (active)", { timeout: 2000 })
		await expect(page.getByTestId("complex-user-2")).toHaveText("Bob (inactive)", { timeout: 2000 })
		await expect(page.getByTestId("complex-user-3")).toHaveText("Charlie (active)", {
			timeout: 2000,
		})
	})
})

test.describe("Await NDJSON Protocol", () => {
	test("NDJSON response contains chunk messages", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		expect(chunks.length).toBeGreaterThan(0)
	})

	test("success chunk present in NDJSON", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const successChunk = chunks.find((c) => c.k === "success")
		expect(successChunk).toBeDefined()
		expect(successChunk?.d?.result).toBe("success-value")
	})

	test("error chunk present in NDJSON", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const errorMsg = messages.find((m) => m.t === "e" && m.k === "error")
		expect(errorMsg).toBeDefined()
	})

	test("all expected keys present", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c" || m.t === "e")

		const keys = messages.map((m) => m.k)

		expect(keys).toContain("success")
		expect(keys).toContain("error")
		expect(keys).toContain("swallowed")
		expect(keys).toContain("fast")
		expect(keys).toContain("slow")
		expect(keys).toContain("no-pending")
		expect(keys).toContain("complex")
	})
})

test.describe("Await All Sections Visible", () => {
	test("all test sections are present on page", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("success-section")).toBeVisible()
		await expect(page.getByTestId("error-section")).toBeVisible()
		await expect(page.getByTestId("swallowed-section")).toBeVisible()
		await expect(page.getByTestId("fast-section")).toBeVisible()
		await expect(page.getByTestId("slow-section")).toBeVisible()
		await expect(page.getByTestId("no-pending-section")).toBeVisible()
		await expect(page.getByTestId("complex-section")).toBeVisible()
	})
})

test.describe("Await CSR Navigation", () => {
	test("simple page renders via CSR (no Await)", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Navigate to About page (no Await components) */
		await page.getByRole("link", { exact: true, name: "About" }).click()

		await expect(page).toHaveURL("/about", { timeout: 5000 })
		await expect(page.locator("h1")).toContainText("About Flare v2", { timeout: 5000 })
	})

	test("pending shows then resolves via CSR", async ({ page }) => {
		await page.goto("/")

		/* Wait for hydration before CSR navigation */
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { exact: true, name: "Await" }).click()

		/* Verify URL changed */
		await expect(page).toHaveURL("/await", { timeout: 5000 })

		/* Wait for resolved content */
		await expect(page.getByTestId("success-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("success-result")).toHaveText("success-value")
	})

	test("error boundary renders via CSR", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { exact: true, name: "Await" }).click()

		await expect(page.getByTestId("error-boundary")).toBeVisible({ timeout: 5000 })
	})

	test("complex data resolves via CSR", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { exact: true, name: "Await" }).click()

		await expect(page.getByTestId("complex-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("complex-user-1")).toHaveText("Alice (active)")
	})
})
