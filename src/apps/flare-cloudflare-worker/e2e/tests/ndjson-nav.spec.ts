/**
 * NDJSON Navigation E2E Tests
 *
 * Tests NDJSON nav mode - streaming loader data for CSR navigation.
 */

import { expect, test } from "@playwright/test"

test.describe("NDJSON nav server responses", () => {
	test("CSR request returns NDJSON content type", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("NDJSON response ends with done message", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		expect(lines.length).toBeGreaterThan(0)
		expect(lines[lines.length - 1]).toBe('{"t":"d"}')
	})

	test("NDJSON response contains loader messages", async ({ request }) => {
		const response = await request.get("/products/123", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Should have at least one loader message and done */
		expect(lines.length).toBeGreaterThanOrEqual(2)

		/* Parse first message - should be loader type */
		const firstMsg = JSON.parse(lines[0])
		expect(firstMsg.t).toBe("l")
		expect(firstMsg.m).toBeDefined()
	})

	test("NDJSON loader message includes data", async ({ request }) => {
		const response = await request.get("/products/456", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find loader message for the page */
		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		expect(loaderMsgs.length).toBeGreaterThan(0)

		/* Should have loader data */
		const pageLoader = loaderMsgs.find((msg) => msg.m.includes("product"))
		expect(pageLoader).toBeDefined()
		expect(pageLoader.d).toBeDefined()
	})

	test("NDJSON includes match ID in loader messages", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		for (const msg of loaderMsgs) {
			expect(msg.m).toBeDefined()
			expect(typeof msg.m).toBe("string")
		}
	})

	test("prefetch header works with NDJSON", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
				"x-p": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})
})

test.describe("NDJSON nav with match IDs", () => {
	test("x-m header filters which loaders run", async ({ request }) => {
		/* Request only specific match */
		const response = await request.get("/products/789", {
			headers: {
				"x-d": "1",
				"x-m": "_root_/products/[id]",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		/* Should only have the requested match */
		expect(loaderMsgs.length).toBe(1)
		expect(loaderMsgs[0].m).toBe("_root_/products/[id]")
	})

	test("empty x-m runs all loaders", async ({ request }) => {
		const response = await request.get("/products/999", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		/* Should have multiple loaders (root layout + page) */
		expect(loaderMsgs.length).toBeGreaterThanOrEqual(1)
	})
})

test.describe("NDJSON message format", () => {
	test("loader message format is correct", async ({ request }) => {
		const response = await request.get("/", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		for (const line of lines) {
			const msg = JSON.parse(line)

			/* All messages must have type */
			expect(msg.t).toBeDefined()
			expect(["l", "c", "e", "h", "r", "d"]).toContain(msg.t)

			/* Loader messages must have match ID (data is optional for layouts without loaders) */
			if (msg.t === "l") {
				expect(msg.m).toBeDefined()
			}

			/* Done message has no other fields */
			if (msg.t === "d") {
				expect(Object.keys(msg)).toEqual(["t"])
			}
		}
	})

	test("each line is valid JSON", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		for (const line of lines) {
			expect(() => JSON.parse(line)).not.toThrow()
		}
	})
})

test.describe("NDJSON head updates", () => {
	test("NDJSON response contains head message", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find head message */
		const headMsgs = lines.map((line) => JSON.parse(line)).filter((msg) => msg.t === "h")

		expect(headMsgs.length).toBeGreaterThanOrEqual(1)
	})

	test("head message has correct format", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const headMsg = lines.map((line) => JSON.parse(line)).find((msg) => msg.t === "h")

		expect(headMsg).toBeDefined()
		expect(headMsg.t).toBe("h")
		expect(headMsg.d).toBeDefined()
		/* Head data should be an object */
		expect(typeof headMsg.d).toBe("object")
	})

	test("head message contains title from route config", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find the page-specific head message (not root layout) */
		const headMsg = lines
			.map((line) => JSON.parse(line))
			.find((msg) => msg.t === "h" && msg.m?.includes("about"))

		expect(headMsg.d.title).toBe("About - Flare v2")
		expect(headMsg.d.description).toBe("Learn more about Flare v2 framework")
	})

	test("head message contains dynamic data from loader", async ({ request }) => {
		const response = await request.get("/products/123", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find the page-specific head message (not root layout) */
		const headMsg = lines
			.map((line) => JSON.parse(line))
			.find((msg) => msg.t === "h" && msg.m?.includes("product"))

		expect(headMsg.d.title).toContain("Product 123")
		expect(headMsg.d.description).toContain("$1230") /* 123 * 10 */
	})

	test("client-side navigation updates document title", async ({ page }) => {
		/* Start at home page */
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Get initial title */
		const initialTitle = await page.title()

		/* Navigate to about page via link click */
		await page.click('a[href="/about"]')
		await page.waitForURL("/about")

		/* Wait for title to update */
		await expect(page).toHaveTitle("About - Flare v2")
	})

	test("client-side navigation updates meta description", async ({ page }) => {
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Navigate to about page */
		await page.click('a[href="/about"]')
		await page.waitForURL("/about")

		/* Check meta description was updated */
		const description = await page.$eval('meta[name="description"]', (el) =>
			el.getAttribute("content"),
		)
		expect(description).toBe("Learn more about Flare v2 framework")
	})

	test("navigating between pages updates head correctly", async ({ page }) => {
		/* Start at about page */
		await page.goto("/about")
		await page.waitForLoadState("networkidle")
		await expect(page).toHaveTitle("About - Flare v2")

		/* Navigate to product page */
		await page.goto("/products/456")
		await page.waitForLoadState("networkidle")

		/* Title should be updated with product name */
		await expect(page).toHaveTitle(/Product 456/)

		/* Description should contain price */
		const description = await page.$eval('meta[name="description"]', (el) =>
			el.getAttribute("content"),
		)
		expect(description).toContain("$4560")
	})
})

test.describe("NDJSON per-route head messages", () => {
	test("NDJSON response contains per-route head messages with matchId", async ({ request }) => {
		const response = await request.get("/products/123", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find all head messages */
		const headMsgs = lines.map((line) => JSON.parse(line)).filter((msg) => msg.t === "h")

		/* Should have per-route head messages with matchId */
		expect(headMsgs.length).toBeGreaterThan(0)

		/* At least one head message should have matchId (per-route) */
		const perRouteHead = headMsgs.find((msg) => msg.m !== undefined)
		expect(perRouteHead).toBeDefined()
		expect(typeof perRouteHead.m).toBe("string")
	})

	test("per-route head messages maintain route hierarchy order", async ({ request }) => {
		const response = await request.get("/products/456", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find all per-route head messages */
		const headMsgs = lines
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "h" && msg.m !== undefined)

		if (headMsgs.length > 1) {
			/* Root layouts should come before child routes */
			const matchIds = headMsgs.map((msg) => msg.m)
			/* Verify hierarchical order (parent routes before child routes) */
			for (let i = 1; i < matchIds.length; i++) {
				const current = matchIds[i]
				const previous = matchIds[i - 1]
				/* Current should be same depth or deeper in hierarchy */
				expect(current.length).toBeGreaterThanOrEqual(previous?.length ?? 0)
			}
		}
	})

	test("head config contains expected fields", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find head message for about page */
		const headMsgs = lines.map((line) => JSON.parse(line)).filter((msg) => msg.t === "h")

		/* Should have head data with title and/or description */
		const pageHead = headMsgs.find((msg) => msg.d?.title?.includes("About"))
		expect(pageHead).toBeDefined()
		expect(pageHead.d.title).toBe("About - Flare v2")
	})
})
