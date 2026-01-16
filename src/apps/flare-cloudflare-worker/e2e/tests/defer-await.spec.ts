/**
 * Defer + Await Integration E2E Tests
 *
 * Tests full integration of defer() streaming with Await component.
 * SSR: data awaited, rendered without pending.
 * CSR navigation: pending shown while streaming, resolved when chunks arrive.
 */

import { expect, test } from "@playwright/test"

const ROUTE = "/defer-await"

test.describe("Defer-Await SSR Rendering", () => {
	test("page renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("defer-await-page")).toBeVisible()
	})

	test("immediate data renders first", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("page-id")).toHaveText("defer-await-page")
	})

	test("all sections visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("immediate-section")).toBeVisible()
		await expect(page.getByTestId("primary-section")).toBeVisible()
		await expect(page.getByTestId("secondary-section")).toBeVisible()
		await expect(page.getByTestId("tertiary-section")).toBeVisible()
		await expect(page.getByTestId("race-section")).toBeVisible()
		await expect(page.getByTestId("error-section")).toBeVisible()
		await expect(page.getByTestId("very-fast-section")).toBeVisible()
		await expect(page.getByTestId("deep-nested-section")).toBeVisible()
	})
})

test.describe("Defer-Await Primary Content", () => {
	test("primary content resolves", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("primary-resolved")
		await expect(resolved).toBeVisible({ timeout: 3000 })
	})

	test("primary title renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const title = page.getByTestId("primary-title")
		await expect(title).toHaveText("Primary Content Title", { timeout: 3000 })
	})

	test("primary body renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const body = page.getByTestId("primary-body")
		await expect(body).toContainText("primary content body", { timeout: 3000 })
	})

	test("primary author renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const author = page.getByTestId("primary-author")
		await expect(author).toHaveText("By: Test Author", { timeout: 3000 })
	})
})

test.describe("Defer-Await Secondary Content", () => {
	test("secondary content resolves", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("secondary-resolved")
		await expect(resolved).toBeVisible({ timeout: 2000 })
	})

	test("secondary items render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("secondary-item-1")).toHaveText("Secondary Item 1", {
			timeout: 2000,
		})
		await expect(page.getByTestId("secondary-item-2")).toHaveText("Secondary Item 2", {
			timeout: 2000,
		})
		await expect(page.getByTestId("secondary-item-3")).toHaveText("Secondary Item 3", {
			timeout: 2000,
		})
	})
})

test.describe("Defer-Await Tertiary Content", () => {
	test("tertiary content resolves (slower)", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("tertiary-resolved")
		await expect(resolved).toBeVisible({ timeout: 5000 })
	})

	test("tertiary stats render correctly", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("tertiary-views")).toHaveText("Views: 1234", { timeout: 5000 })
		await expect(page.getByTestId("tertiary-likes")).toHaveText("Likes: 42", { timeout: 5000 })
		await expect(page.getByTestId("tertiary-shares")).toHaveText("Shares: 7", { timeout: 5000 })
	})
})

test.describe("Defer-Await Racing Data", () => {
	test("all racers resolve", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("race-a-resolved")).toBeVisible({ timeout: 3000 })
		await expect(page.getByTestId("race-b-resolved")).toBeVisible({ timeout: 3000 })
		await expect(page.getByTestId("race-c-resolved")).toBeVisible({ timeout: 3000 })
	})

	test("racer A has correct data", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("race-a-resolved")).toHaveText("A:1", { timeout: 3000 })
	})

	test("racer B has correct data", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("race-b-resolved")).toHaveText("B:2", { timeout: 3000 })
	})

	test("racer C has correct data", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("race-c-resolved")).toHaveText("C:3", { timeout: 3000 })
	})
})

test.describe("Defer-Await Error Integration", () => {
	test("error boundary renders on rejection", async ({ page }) => {
		await page.goto(ROUTE)

		const errorBoundary = page.getByTestId("error-boundary")
		await expect(errorBoundary).toBeVisible({ timeout: 3000 })
	})

	test("error message displays correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const errorBoundary = page.getByTestId("error-boundary")
		await expect(errorBoundary).toContainText("integration-error", { timeout: 3000 })
	})

	test("error resolved not visible", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("error-boundary")).toBeVisible({ timeout: 3000 })
		await expect(page.getByTestId("error-resolved")).not.toBeVisible()
	})
})

test.describe("Defer-Await Very Fast", () => {
	test("very fast resolves quickly", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("very-fast-resolved")
		await expect(resolved).toBeVisible({ timeout: 1000 })
	})

	test("very fast has correct value", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("very-fast-resolved")).toHaveText("instant", { timeout: 1000 })
	})
})

test.describe("Defer-Await Deep Nested", () => {
	test("deep nested resolves", async ({ page }) => {
		await page.goto(ROUTE)

		const resolved = page.getByTestId("deep-nested-resolved")
		await expect(resolved).toBeVisible({ timeout: 4000 })
	})

	test("deep nested value renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const value = page.getByTestId("deep-nested-value")
		await expect(value).toHaveText("deeply-nested-value", { timeout: 4000 })
	})

	test("deep nested array renders correctly", async ({ page }) => {
		await page.goto(ROUTE)

		const array = page.getByTestId("deep-nested-array")
		await expect(array).toHaveText("1,2,3,4,5", { timeout: 4000 })
	})
})

test.describe("Defer-Await NDJSON Protocol", () => {
	test("NDJSON response is valid", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("NDJSON has multiple chunk messages", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		expect(chunks.length).toBeGreaterThan(5)
	})

	test("all expected keys present in NDJSON", async ({ request }) => {
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

		expect(keys).toContain("primary")
		expect(keys).toContain("secondary")
		expect(keys).toContain("tertiary")
		expect(keys).toContain("race-a")
		expect(keys).toContain("race-b")
		expect(keys).toContain("race-c")
		expect(keys).toContain("may-fail")
		expect(keys).toContain("very-fast")
		expect(keys).toContain("deep-nested")
	})

	test("primary chunk has correct data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const primaryChunk = chunks.find((c) => c.k === "primary")
		expect(primaryChunk?.d?.title).toBe("Primary Content Title")
		expect(primaryChunk?.d?.author).toBe("Test Author")
	})

	test("secondary chunk has correct data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const secondaryChunk = chunks.find((c) => c.k === "secondary")
		expect(secondaryChunk?.d?.items).toHaveLength(3)
	})

	test("error message present in NDJSON", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const errorMsg = messages.find((m) => m.t === "e" && m.k === "may-fail")
		expect(errorMsg).toBeDefined()
	})
})

test.describe("Defer-Await Ordering", () => {
	test("loader comes before ready", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const loaderIdx = messages.findIndex((m) => m.t === "l")
		const readyIdx = messages.findIndex((m) => m.t === "r")

		expect(loaderIdx).toBeLessThan(readyIdx)
	})

	test("ready comes before all chunks", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const readyIdx = messages.findIndex((m) => m.t === "r")
		const firstChunkIdx = messages.findIndex((m) => m.t === "c")

		expect(readyIdx).toBeLessThan(firstChunkIdx)
	})

	test("done is always last", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const lastMsg = messages[messages.length - 1]
		expect(lastMsg?.t).toBe("d")
	})
})

test.describe("Defer-Await Resolution Order Independence", () => {
	test("faster deferred can resolve before slower", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l, idx) => ({ ...JSON.parse(l), idx }))
			.filter((m) => m.t === "c")

		/* Very fast (10ms) should typically come before tertiary (400ms) */
		const veryFastIdx = chunks.find((c) => c.k === "very-fast")?.idx ?? Infinity
		const tertiaryIdx = chunks.find((c) => c.k === "tertiary")?.idx ?? -1

		/* This is probabilistic but very likely given 10ms vs 400ms */
		expect(veryFastIdx).toBeLessThan(tertiaryIdx)
	})

	test("all chunks eventually arrive regardless of timing", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		/* All success keys should be present (not may-fail which errors) */
		const keys = chunks.map((c) => c.k)
		expect(keys).toContain("primary")
		expect(keys).toContain("secondary")
		expect(keys).toContain("tertiary")
		expect(keys).toContain("very-fast")
		expect(keys).toContain("deep-nested")
	})
})

test.describe("Defer-Await CSR Navigation", () => {
	test("resolved content appears after CSR navigation", async ({ page }) => {
		await page.goto("/")

		/* Wait for hydration before CSR navigation */
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { name: "Defer + Await" }).click()

		await expect(page.getByTestId("primary-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("primary-title")).toHaveText("Primary Content Title")
	})

	test("secondary content resolves via CSR", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { name: "Defer + Await" }).click()

		await expect(page.getByTestId("secondary-item-1")).toHaveText("Secondary Item 1", {
			timeout: 5000,
		})
	})

	test("error boundary renders via CSR", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { name: "Defer + Await" }).click()

		await expect(page.getByTestId("error-boundary")).toBeVisible({ timeout: 5000 })
	})

	test("all sections resolve via CSR", async ({ page }) => {
		await page.goto("/")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.getByRole("link", { name: "Defer + Await" }).click()

		await expect(page.getByTestId("primary-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("secondary-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("tertiary-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("very-fast-resolved")).toBeVisible({ timeout: 5000 })
		await expect(page.getByTestId("deep-nested-resolved")).toBeVisible({ timeout: 5000 })
	})
})
