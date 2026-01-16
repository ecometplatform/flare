/**
 * Await SSR E2E Tests
 *
 * Tests Await component with SSR pre-resolved data.
 * With stream: false, deferred data is awaited during SSR and
 * __resolved is populated - Await renders immediately without pending.
 */

import { expect, test } from "@playwright/test"

const ROUTE = "/await-ssr"

test.describe("Await SSR Pre-resolved Data", () => {
	test("page renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("await-ssr-page")).toBeVisible()
	})

	test("immediate data renders first", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("immediate-source")).toHaveText("immediate")
	})

	test("SSR data renders without pending flash", async ({ page }) => {
		await page.goto(ROUTE)

		/* Resolved should be visible immediately */
		const resolved = page.getByTestId("ssr-data-resolved")
		await expect(resolved).toBeVisible({ timeout: 1000 })
	})

	test("SSR data message is correct", async ({ page }) => {
		await page.goto(ROUTE)

		const message = page.getByTestId("ssr-data-message")
		await expect(message).toHaveText("ssr-pre-resolved", { timeout: 1000 })
	})

	test("SSR data timestamp is present", async ({ page }) => {
		await page.goto(ROUTE)

		const timestamp = page.getByTestId("ssr-data-timestamp")
		await expect(timestamp).toBeVisible({ timeout: 1000 })

		const text = await timestamp.textContent()
		expect(Number(text)).toBeGreaterThan(0)
	})

	test("SSR pending not visible (data pre-resolved)", async ({ page }) => {
		await page.goto(ROUTE)

		/* Ensure resolved is visible */
		await expect(page.getByTestId("ssr-data-resolved")).toBeVisible({ timeout: 1000 })

		/* Pending should never be visible on SSR */
		await expect(page.getByTestId("ssr-data-pending")).not.toBeVisible()
	})
})

test.describe("Await SSR Pre-resolved List", () => {
	test("list section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-list-section")).toBeVisible()
	})

	test("list renders without pending", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("ssr-list-resolved")
		await expect(resolved).toBeVisible({ timeout: 1000 })
	})

	test("list items render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-list-item-0")).toHaveText("ssr-item-1", { timeout: 1000 })
		await expect(page.getByTestId("ssr-list-item-1")).toHaveText("ssr-item-2", { timeout: 1000 })
		await expect(page.getByTestId("ssr-list-item-2")).toHaveText("ssr-item-3", { timeout: 1000 })
	})

	test("list pending not visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-list-resolved")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-list-pending")).not.toBeVisible()
	})
})

test.describe("Await SSR Pre-resolved Nested", () => {
	test("nested section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-nested-section")).toBeVisible()
	})

	test("nested resolved renders without pending", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("ssr-nested-resolved")
		await expect(resolved).toBeVisible({ timeout: 1000 })
	})

	test("nested user data renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const user = page.getByTestId("ssr-nested-user")
		await expect(user).toHaveText("SSR User (ID: ssr-1)", { timeout: 1000 })
	})

	test("nested permissions render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const permissions = page.getByTestId("ssr-nested-permissions")
		await expect(permissions).toHaveText("read, write, admin", { timeout: 1000 })
	})

	test("nested pending not visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-nested-resolved")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-nested-pending")).not.toBeVisible()
	})
})

test.describe("Await SSR Error Case", () => {
	test("error section renders", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-error-section")).toBeVisible()
	})

	test("error boundary renders on SSR rejection", async ({ page }) => {
		await page.goto(ROUTE)

		const errorBoundary = page.getByTestId("ssr-error-boundary")
		await expect(errorBoundary).toBeVisible({ timeout: 1000 })
	})

	test("error message displays correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const errorMessage = page.getByTestId("ssr-error-message")
		await expect(errorMessage).toHaveText("ssr-error-message", { timeout: 1000 })
	})

	test("error resolved not visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-error-boundary")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-error-resolved")).not.toBeVisible()
	})

	test("error pending not visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("ssr-error-boundary")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-error-pending")).not.toBeVisible()
	})
})

test.describe("Await SSR All Sections Present", () => {
	test("all test sections are visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("immediate-section")).toBeVisible()
		await expect(page.getByTestId("ssr-data-section")).toBeVisible()
		await expect(page.getByTestId("ssr-list-section")).toBeVisible()
		await expect(page.getByTestId("ssr-nested-section")).toBeVisible()
		await expect(page.getByTestId("ssr-error-section")).toBeVisible()
	})
})

test.describe("Await SSR No Pending Flash", () => {
	test("no pending elements visible on initial load", async ({ page }) => {
		await page.goto(ROUTE)

		/* All pending elements should not be visible */
		await expect(page.getByTestId("ssr-data-pending")).not.toBeVisible()
		await expect(page.getByTestId("ssr-list-pending")).not.toBeVisible()
		await expect(page.getByTestId("ssr-nested-pending")).not.toBeVisible()
		await expect(page.getByTestId("ssr-error-pending")).not.toBeVisible()
	})

	test("all resolved content visible immediately", async ({ page }) => {
		await page.goto(ROUTE)

		/* All resolved elements should be visible immediately (except error which shows boundary) */
		await expect(page.getByTestId("ssr-data-resolved")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-list-resolved")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-nested-resolved")).toBeVisible({ timeout: 1000 })
		await expect(page.getByTestId("ssr-error-boundary")).toBeVisible({ timeout: 1000 })
	})
})

test.describe("Await SSR HTML Response", () => {
	test("HTML response contains pre-rendered data", async ({ request }) => {
		const response = await request.get(ROUTE)

		const html = await response.text()

		/* Pre-rendered content should be in HTML */
		expect(html).toContain("ssr-pre-resolved")
		expect(html).toContain("ssr-item-1")
		expect(html).toContain("SSR User")
		expect(html).toContain("read, write, admin")
	})

	test("HTML response does not contain pending text", async ({ request }) => {
		const response = await request.get(ROUTE)

		const html = await response.text()

		/* Pending text should NOT be in pre-rendered HTML */
		expect(html).not.toContain("SHOULD NOT SEE THIS ON SSR")
	})

	test("HTML response contains error message (pre-rendered)", async ({ request }) => {
		const response = await request.get(ROUTE)

		const html = await response.text()

		/* Error should be pre-rendered */
		expect(html).toContain("ssr-error-message")
	})
})

test.describe("Await SSR NDJSON Protocol", () => {
	test("NDJSON response has no streaming chunks (all awaited)", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		/* With stream: false, data is included in loader, not as chunks */
		const chunks = messages.filter((m) => m.t === "c")

		/* Should have no chunks since all deferred used stream: false */
		expect(chunks.length).toBe(0)
	})

	test("loader message contains pre-resolved data markers", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const loaderMsg = messages.find((m) => m.t === "l" && m.m?.includes("await-ssr"))
		expect(loaderMsg).toBeDefined()
	})
})
