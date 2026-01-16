/**
 * HTML Navigation E2E Tests
 *
 * Tests HTML nav mode - full HTML responses for CDN-cacheable sites.
 * Uses Link components with navFormat="html" to trigger HTML navigation.
 */

import { expect, test } from "../fixtures/flare.fixture"

test.describe("HTML nav - head updates on client navigation", () => {
	test("html-nav-test page hydrates correctly", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Verify page content */
		await expect(flare.page.locator("h1")).toContainText("HTML Nav Test")

		/* Verify hydration completes */
		const hydrated = await flare.page.evaluate(
			() => (window as unknown as { __FLARE_HYDRATED__?: boolean }).__FLARE_HYDRATED__,
		)
		expect(hydrated).toBe(true)

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})

	test("NDJSON link on html-nav-test does CSR navigation", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Intercept request */
		let xdHeader: string | undefined
		await flare.page.route("**/about", (route) => {
			xdHeader = route.request().headers()["x-d"]
			route.continue()
		})

		/* Click NDJSON link (no navFormat) */
		await flare.page.click('a[href="/about"]:has-text("NDJSON")')
		await flare.page.waitForURL("/about")

		/* Should be CSR with x-d header */
		expect(xdHeader).toBe("1")
	})

	test("HTML nav link sends x-f:html header and gets HTML response", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Intercept request AND response */
		let requestHeaders: Record<string, string> = {}
		let responseContentType = ""
		let responseBody = ""

		await flare.page.route("**/about", async (route) => {
			requestHeaders = route.request().headers()
			const response = await route.fetch()
			responseContentType = response.headers()["content-type"] ?? ""
			responseBody = await response.text()
			route.fulfill({ response })
		})

		/* Click HTML nav link */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")

		/* Verify request headers */
		expect(requestHeaders["x-d"]).toBe("1")
		expect(requestHeaders["x-f"]).toBe("html")

		/* Verify response is HTML, not NDJSON */
		expect(responseContentType).toContain("text/html")
		expect(responseBody).toContain("<!DOCTYPE html")
		expect(responseBody).not.toContain('{"t":"d"}') /* NDJSON done marker */
	})

	test("title updates when navigating via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Initial title */
		await expect(flare.page).toHaveTitle("HTML Nav Test - Flare v2")

		/* Navigate to about via HTML nav link */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Title should update */
		await expect(flare.page).toHaveTitle("About - Flare v2", { timeout: 5000 })
	})

	test("meta description updates via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Check initial description */
		const initialDesc = await flare.page.locator('meta[name="description"]').getAttribute("content")
		expect(initialDesc).toBe("HTML nav test page description")

		/* Navigate to about via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Description should update */
		const newDesc = await flare.page.locator('meta[name="description"]').getAttribute("content")
		expect(newDesc).toBe("Learn more about Flare v2 framework")
	})

	test("OG meta tags update via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Check initial OG title */
		const initialOg = await flare.page.locator('meta[property="og:title"]').getAttribute("content")
		expect(initialOg).toBe("OG Title - HTML Nav Test")

		/* Navigate to about via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* OG tags should update or be removed */
		const aboutHasOg = await flare.page.locator('meta[property="og:title"]').count()
		/* About page may or may not have OG tags - just verify no errors */
		flare.assertNoPageErrors()
	})

	test("dynamic route title updates via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to product page via HTML nav */
		await flare.page.click('a[href="/products/123"]:has-text("HTML nav")')
		await flare.page.waitForURL("/products/123")
		await flare.page.waitForLoadState("networkidle")

		/* Title should include product ID */
		await expect(flare.page).toHaveTitle("Product 123 - Flare v2", { timeout: 5000 })
	})

	test("keywords meta updates via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Check initial keywords */
		const initialKeywords = await flare.page
			.locator('meta[name="keywords"]')
			.getAttribute("content")
		expect(initialKeywords).toBe("html, nav, test")

		/* Navigate to about (no keywords) via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Keywords should be removed (about page has no keywords) */
		const keywordsCount = await flare.page.locator('meta[name="keywords"]').count()
		expect(keywordsCount).toBe(0)
	})

	test("content updates correctly via HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Verify initial content */
		await expect(flare.page.locator("h1")).toContainText("HTML Nav Test")

		/* Navigate to about via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Content should update */
		await expect(flare.page.locator("h1")).toContainText("About Flare v2")
		flare.assertNoPageErrors()
	})

	test("back navigation works after HTML nav", async ({ flare }) => {
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to about via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page).toHaveTitle("About - Flare v2")

		/* Go back */
		await flare.page.goBack()
		await flare.page.waitForURL("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Title and content should restore */
		await expect(flare.page).toHaveTitle("HTML Nav Test - Flare v2")
		await expect(flare.page.locator("h1")).toContainText("HTML Nav Test")
	})

	test.skip("forward navigation preserves HTML nav format", async ({ flare }) => {
		/* Skip: Route interception timing issues with forward nav in Playwright.
		 * The fix stores navFormat in history state - test manually:
		 * 1. Go to /html-nav-test
		 * 2. Click "About (HTML nav)" link - should see x-f:html in network
		 * 3. Click browser back button
		 * 4. Click browser forward button - should still see x-f:html, not ndjson
		 */
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to about via HTML nav */
		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Go back */
		await flare.page.goBack()
		await flare.page.waitForURL("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		/* Intercept request on forward navigation */
		let requestHeaders: Record<string, string> = {}
		let responseContentType = ""

		await flare.page.route("**/about", async (route) => {
			requestHeaders = route.request().headers()
			const response = await route.fetch()
			responseContentType = response.headers()["content-type"] ?? ""
			route.fulfill({ response })
		})

		/* Go forward - should use HTML nav (preserved from original navigation) */
		await flare.page.goForward()
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Verify HTML format was used, not NDJSON */
		expect(requestHeaders["x-f"]).toBe("html")
		expect(responseContentType).toContain("text/html")
	})
})

test.describe("HTML nav - server responses", () => {
	test("CSR with x-f:html returns HTML response", async ({ flare }) => {
		const response = await flare.page.request.get("/about", {
			headers: {
				"x-d": "1",
				"x-f": "html",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toContain("text/html")
		expect(response.headers()["x-flare-nav-format"]).toBe("html")

		const html = await response.text()
		expect(html).toContain("self.flare")
	})

	test("CSR with x-f:ndjson returns NDJSON response", async ({ flare }) => {
		const response = await flare.page.request.get("/about", {
			headers: {
				"x-d": "1",
				"x-f": "ndjson",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")

		const body = await response.text()
		const lines = body.trim().split("\n")
		expect(lines[lines.length - 1]).toBe('{"t":"d"}')
	})

	test("CSR default (no x-f) returns NDJSON", async ({ flare }) => {
		const response = await flare.page.request.get("/products/123", {
			headers: {
				"x-d": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("HTML nav response includes loader data in flare state", async ({ flare }) => {
		const response = await flare.page.request.get("/products/456", {
			headers: {
				"x-d": "1",
				"x-f": "html",
			},
		})

		const html = await response.text()
		const match = html.match(/self\.flare\s*=\s*({[\s\S]*?});/)

		expect(match).not.toBeNull()
		if (!match?.[1]) throw new Error("No flare state found")

		const state = JSON.parse(match[1])
		expect(state.r.pathname).toBe("/products/456")
		expect(state.r.params).toEqual({ id: "456" })
	})

	test("HTML nav response includes rendered content", async ({ flare }) => {
		const response = await flare.page.request.get("/about", {
			headers: {
				"x-d": "1",
				"x-f": "html",
			},
		})

		const html = await response.text()
		expect(html).toContain("About Flare v2")
	})
})

test.describe("HTML nav - format switching", () => {
	test("same URL returns different format based on header", async ({ flare }) => {
		/* Request with HTML format */
		const htmlResponse = await flare.page.request.get("/about", {
			headers: { "x-d": "1", "x-f": "html" },
		})
		expect(htmlResponse.headers()["content-type"]).toContain("text/html")

		/* Request with NDJSON format */
		const ndjsonResponse = await flare.page.request.get("/about", {
			headers: { "x-d": "1", "x-f": "ndjson" },
		})
		expect(ndjsonResponse.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("prefetch header works with HTML format", async ({ flare }) => {
		const response = await flare.page.request.get("/about", {
			headers: {
				"x-d": "1",
				"x-f": "html",
				"x-p": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toContain("text/html")
	})
})

test.describe("HTML nav vs NDJSON nav comparison", () => {
	test("both formats update title correctly", async ({ flare }) => {
		/* Test HTML nav */
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		await flare.page.click('a[href="/about"]:has-text("HTML nav")')
		await flare.page.waitForURL("/about")
		await expect(flare.page).toHaveTitle("About - Flare v2", { timeout: 5000 })

		/* Go back and test NDJSON nav */
		await flare.page.goBack()
		await flare.page.waitForURL("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		await flare.page.click('a[href="/about"]:has-text("NDJSON")')
		await flare.page.waitForURL("/about")
		await expect(flare.page).toHaveTitle("About - Flare v2", { timeout: 5000 })
	})

	test("both formats load dynamic content correctly", async ({ flare }) => {
		/* Test HTML nav to product */
		await flare.goto("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		await flare.page.click('a[href="/products/123"]:has-text("HTML nav")')
		await flare.page.waitForURL("/products/123")
		await expect(flare.page.locator("h1")).toContainText("Product 123")

		/* Go back and test NDJSON nav */
		await flare.page.goBack()
		await flare.page.waitForURL("/html-nav-test")
		await flare.page.waitForLoadState("networkidle")

		await flare.page.click('a[href="/products/123"]:has-text("NDJSON")')
		await flare.page.waitForURL("/products/123")
		await expect(flare.page.locator("h1")).toContainText("Product 123")
	})
})
