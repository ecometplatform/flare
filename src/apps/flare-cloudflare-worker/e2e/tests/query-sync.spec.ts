/**
 * Query Client Sync E2E Tests
 *
 * Tests that queryClient.ensureQueryData calls are properly tracked
 * and synced across all navigation modes:
 * - SSR: queries serialized to self.flare.q
 * - HTML nav: queries included in response
 * - NDJSON nav: queries included in response stream
 */

import { expect, test } from "@playwright/test"

test.describe("Query sync - SSR", () => {
	test("SSR includes queries in flare state", async ({ page }) => {
		await page.goto("/query-test")

		/* Check self.flare.q contains tracked queries */
		const queries = await page.evaluate(() => {
			const flare = (window as unknown as { flare?: { q?: unknown[] } }).flare
			return flare?.q ?? []
		})

		expect(queries.length).toBeGreaterThan(0)

		/* Should have user query */
		const userQuery = queries.find(
			(q: unknown) =>
				Array.isArray((q as { key?: unknown[] }).key) &&
				(q as { key: unknown[] }).key[0] === "user",
		)
		expect(userQuery).toBeDefined()

		/* Should have settings query */
		const settingsQuery = queries.find(
			(q: unknown) =>
				Array.isArray((q as { key?: unknown[] }).key) &&
				(q as { key: unknown[] }).key[0] === "settings",
		)
		expect(settingsQuery).toBeDefined()
	})

	test("SSR query data is correct", async ({ page }) => {
		await page.goto("/query-test")

		const queries = await page.evaluate(() => {
			const flare = (window as unknown as { flare?: { q?: unknown[] } }).flare
			return flare?.q ?? []
		})

		const userQuery = queries.find(
			(q: unknown) =>
				Array.isArray((q as { key?: unknown[] }).key) &&
				(q as { key: unknown[] }).key[0] === "user",
		) as { data?: { id: string; name: string } } | undefined

		expect(userQuery?.data?.id).toBe("1")
		expect(userQuery?.data?.name).toBe("Test User")
	})

	test("SSR renders data correctly", async ({ page }) => {
		await page.goto("/query-test")

		await expect(page.getByTestId("user-id")).toContainText("ID: 1")
		await expect(page.getByTestId("user-name")).toContainText("Name: Test User")
		await expect(page.getByTestId("settings-theme")).toContainText("Theme: dark")
	})
})

test.describe("Query sync - HTML nav", () => {
	test("HTML nav response includes query state", async ({ request }) => {
		const response = await request.get("/query-test", {
			headers: {
				"x-d": "1",
				"x-f": "html",
			},
		})

		const html = await response.text()

		/* Should contain flare state script with queries */
		expect(html).toContain("self.flare")
		expect(html).toContain('"q":')
		expect(html).toContain('"user"')
		expect(html).toContain('"settings"')
	})

	test("HTML nav client receives queries", async ({ page }) => {
		/* Start on home page */
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Create visible link and navigate */
		await page.evaluate(() => {
			const a = document.createElement("a")
			a.href = "/query-test"
			a.id = "test-link"
			a.textContent = "Go to Query Test"
			a.style.display = "block"
			a.style.padding = "20px"
			document.body.appendChild(a)
		})

		/* Navigate and check queries are synced */
		await page.click("#test-link")
		await page.waitForURL("/query-test")

		/* Verify data rendered */
		await expect(page.getByTestId("user-name")).toContainText("Name: Test User")
	})
})

test.describe("Query sync - NDJSON nav", () => {
	test("NDJSON response includes query message", async ({ request }) => {
		const response = await request.get("/query-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Should have a query message type */
		const queryMsg = lines.find((line) => {
			try {
				const msg = JSON.parse(line)
				return msg.t === "q"
			} catch {
				return false
			}
		})

		expect(queryMsg).toBeDefined()

		const parsed = JSON.parse(queryMsg!)
		expect(parsed.d).toBeDefined()
		expect(Array.isArray(parsed.d)).toBe(true)
		expect(parsed.d.length).toBe(2)
	})

	test("NDJSON query message contains tracked queries", async ({ request }) => {
		const response = await request.get("/query-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const queryMsg = lines.find((line) => {
			try {
				const msg = JSON.parse(line)
				return msg.t === "q"
			} catch {
				return false
			}
		})

		expect(queryMsg).toBeDefined()

		if (queryMsg) {
			const parsed = JSON.parse(queryMsg) as { d: Array<{ key: unknown[] }> }
			const queries = parsed.d

			/* Should have user query */
			const userQuery = queries.find((q) => Array.isArray(q.key) && q.key[0] === "user")
			expect(userQuery).toBeDefined()

			/* Should have settings query */
			const settingsQuery = queries.find((q) => Array.isArray(q.key) && q.key[0] === "settings")
			expect(settingsQuery).toBeDefined()
		}
	})

	test("NDJSON client navigation syncs queries", async ({ page }) => {
		/* Start on home page */
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Add link to query-test */
		await page.evaluate(() => {
			const a = document.createElement("a")
			a.href = "/query-test"
			a.id = "query-test-link"
			a.textContent = "Query Test"
			document.body.appendChild(a)
		})

		/* Intercept NDJSON request */
		let ndjsonBody = ""
		page.on("response", async (response) => {
			if (
				response.url().includes("/query-test") &&
				response.headers()["content-type"]?.includes("ndjson")
			) {
				ndjsonBody = await response.text()
			}
		})

		/* Navigate */
		await page.click("#query-test-link")
		await page.waitForURL("/query-test")

		/* Verify data rendered (proves queries were synced) */
		await expect(page.getByTestId("user-name")).toContainText("Name: Test User")
		await expect(page.getByTestId("settings-theme")).toContainText("Theme: dark")
	})
})

test.describe("Query sync - with defer streaming", () => {
	test("NDJSON with defer includes query message before ready", async ({ request }) => {
		const response = await request.get("/query-defer-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find indices */
		let queryIndex = -1
		let readyIndex = -1
		let chunkIndex = -1

		lines.forEach((line, index) => {
			try {
				const msg = JSON.parse(line)
				if (msg.t === "q") queryIndex = index
				if (msg.t === "r") readyIndex = index
				if (msg.t === "c") chunkIndex = chunkIndex === -1 ? index : chunkIndex
			} catch {
				/* ignore */
			}
		})

		/* Query message should exist */
		expect(queryIndex).toBeGreaterThan(-1)

		/* Query should come before ready */
		expect(queryIndex).toBeLessThan(readyIndex)

		/* Chunks should come after ready (streaming) */
		if (chunkIndex !== -1) {
			expect(chunkIndex).toBeGreaterThan(readyIndex)
		}
	})

	test("NDJSON with defer has correct query data", async ({ request }) => {
		const response = await request.get("/query-defer-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const queryMsg = lines.find((line) => {
			try {
				return JSON.parse(line).t === "q"
			} catch {
				return false
			}
		})

		expect(queryMsg).toBeDefined()

		const parsed = JSON.parse(queryMsg!) as { d: Array<{ data: unknown; key: unknown[] }> }

		/* Should have all 3 queries */
		expect(parsed.d.length).toBe(3)

		/* Should have user query */
		const userQuery = parsed.d.find((q) => q.key[0] === "query-defer" && q.key[1] === "user")
		expect(userQuery).toBeDefined()
		expect((userQuery?.data as { name: string })?.name).toBe("Query Defer User")

		/* Should have config query */
		const configQuery = parsed.d.find((q) => q.key[0] === "query-defer" && q.key[1] === "config")
		expect(configQuery).toBeDefined()
		expect((configQuery?.data as { version: string })?.version).toBe("2.0")

		/* Should have jsonplaceholder query */
		const jpQuery = parsed.d.find((q) => q.key[0] === "jsonplaceholder")
		expect(jpQuery).toBeDefined()
		expect((jpQuery?.data as { id: number })?.id).toBe(1)
	})

	test("defer chunks stream after queries", async ({ request }) => {
		const response = await request.get("/query-defer-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const messages = lines
			.map((line) => {
				try {
					return JSON.parse(line)
				} catch {
					return null
				}
			})
			.filter(Boolean)

		/* Should have chunk message for deferred stats */
		const chunkMsg = messages.find((m) => m.t === "c" && m.k === "stats")
		expect(chunkMsg).toBeDefined()
		expect(chunkMsg.d).toEqual({ downloads: 1234, views: 5678 })
	})

	test("client renders queries and deferred via NDJSON nav", async ({ page }) => {
		/* Start on index - SSR works fine here */
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Add link to navigate via NDJSON */
		await page.evaluate(() => {
			const a = document.createElement("a")
			a.href = "/query-defer-test"
			a.id = "defer-link"
			a.textContent = "Go to Query Defer Test"
			a.style.cssText = "display:block;padding:20px;background:#eee;"
			document.body.appendChild(a)
		})

		/* Navigate via NDJSON (default nav format) */
		await page.click("#defer-link")
		await page.waitForURL("/query-defer-test")

		/* Sync query data should render */
		await expect(page.getByTestId("user-name")).toContainText("Query Defer User", { timeout: 5000 })
		await expect(page.getByTestId("config-version")).toContainText("2.0")

		/* Deferred data should stream and render */
		await expect(page.getByTestId("stats-views")).toContainText("5678", { timeout: 5000 })
		await expect(page.getByTestId("stats-downloads")).toContainText("1234")
	})

	test("useQuery uses server cache - no network request to jsonplaceholder", async ({ page }) => {
		/* Track all network requests to jsonplaceholder */
		const jsonPlaceholderRequests: string[] = []
		await page.route("**/jsonplaceholder.typicode.com/**", (route) => {
			jsonPlaceholderRequests.push(route.request().url())
			/* Abort the request - if it's made, test will fail anyway */
			route.abort()
		})

		/* Navigate directly to page - SSR will fetch from jsonplaceholder */
		await page.goto("/query-defer-test")
		await page.waitForLoadState("networkidle")

		/* Clear any SSR requests (SSR happens on server, not tracked) */
		jsonPlaceholderRequests.length = 0

		/* Verify the data is rendered (from server cache) */
		await expect(page.getByTestId("jp-status")).toContainText("success", { timeout: 5000 })
		await expect(page.getByTestId("jp-post-id")).toContainText("1")
		await expect(page.getByTestId("jp-network-call")).toContainText("false")

		/* Critical: NO network requests to jsonplaceholder from client */
		expect(jsonPlaceholderRequests).toHaveLength(0)
	})

	test("useQuery uses server cache on NDJSON nav - no network request", async ({ page }) => {
		/* Track all network requests to jsonplaceholder */
		const jsonPlaceholderRequests: string[] = []
		await page.route("**/jsonplaceholder.typicode.com/**", (route) => {
			jsonPlaceholderRequests.push(route.request().url())
			route.abort()
		})

		/* Start on index page */
		await page.goto("/")
		await page.waitForLoadState("networkidle")

		/* Clear any SSR requests */
		jsonPlaceholderRequests.length = 0

		/* Navigate via framework link (NDJSON) */
		await page.click('a[href="/query-defer-test"]')
		await page.waitForURL("/query-defer-test")

		/* Verify the data is rendered (from NDJSON cache) */
		await expect(page.getByTestId("jp-status")).toContainText("success", { timeout: 5000 })
		await expect(page.getByTestId("jp-post-id")).toContainText("1")
		await expect(page.getByTestId("jp-network-call")).toContainText("false")

		/* Critical: NO network requests to jsonplaceholder from client */
		expect(jsonPlaceholderRequests).toHaveLength(0)
	})
})

test.describe("Query sync - message protocol", () => {
	test("NDJSON query message format is correct", async ({ request }) => {
		const response = await request.get("/query-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		const queryMsg = lines.find((line) => {
			try {
				const msg = JSON.parse(line)
				return msg.t === "q"
			} catch {
				return false
			}
		})

		if (queryMsg) {
			const parsed = JSON.parse(queryMsg) as {
				d: Array<{ data: unknown; key: unknown[]; staleTime?: number }>
				t: string
			}

			/* Type should be 'q' */
			expect(parsed.t).toBe("q")

			/* Data should be array of query states */
			expect(Array.isArray(parsed.d)).toBe(true)

			for (const query of parsed.d) {
				/* Each query should have key and data */
				expect(query.key).toBeDefined()
				expect(Array.isArray(query.key)).toBe(true)
				expect("data" in query).toBe(true)
			}
		}
	})

	test("query message comes after loader messages", async ({ request }) => {
		const response = await request.get("/query-test", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		let lastLoaderIndex = -1
		let queryIndex = -1

		lines.forEach((line, index) => {
			try {
				const msg = JSON.parse(line)
				if (msg.t === "l") {
					lastLoaderIndex = index
				}
				if (msg.t === "q") {
					queryIndex = index
				}
			} catch {
				/* ignore */
			}
		})

		/* Query message should come after all loader messages */
		if (queryIndex !== -1 && lastLoaderIndex !== -1) {
			expect(queryIndex).toBeGreaterThan(lastLoaderIndex)
		}
	})
})
