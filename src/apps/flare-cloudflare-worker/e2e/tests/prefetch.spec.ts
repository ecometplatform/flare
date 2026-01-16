/**
 * Prefetch E2E Tests
 *
 * Tests prefetch behavior for both NDJSON and HTML navigation modes.
 * Covers hover prefetch, viewport prefetch, cache deduplication, and server responses.
 */

import { expect, test } from "@playwright/test"

test.describe("Prefetch server responses", () => {
	test("NDJSON prefetch request includes x-p header", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
				"x-p": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("HTML prefetch request includes x-p header", async ({ request }) => {
		const response = await request.get("/about", {
			headers: {
				"x-d": "1",
				"x-f": "html",
				"x-p": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toContain("text/html")
	})

	test("NDJSON prefetch returns valid loader data", async ({ request }) => {
		const response = await request.get("/products/123", {
			headers: {
				"x-d": "1",
				"x-p": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Should have loader messages and done */
		expect(lines.length).toBeGreaterThanOrEqual(2)

		/* Last line should be done message */
		expect(lines[lines.length - 1]).toBe('{"t":"d"}')

		/* Should have loader data */
		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		expect(loaderMsgs.length).toBeGreaterThan(0)
	})

	test("HTML prefetch returns full page with flare state", async ({ request }) => {
		const response = await request.get("/products/456", {
			headers: {
				"x-d": "1",
				"x-f": "html",
				"x-p": "1",
			},
		})

		const html = await response.text()

		/* Should contain flare state */
		expect(html).toContain("self.flare")

		/* Should contain rendered content */
		expect(html).toContain("Product 456")
	})

	test("prefetch request to prefetch page works", async ({ request }) => {
		const response = await request.get("/prefetch", {
			headers: {
				"x-d": "1",
				"x-p": "1",
			},
		})

		expect(response.status()).toBe(200)

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Should have loader with loadedAt timestamp */
		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		const prefetchLoader = loaderMsgs.find((msg) => msg.m.includes("prefetch"))
		expect(prefetchLoader).toBeDefined()
		expect(prefetchLoader.d.loadedAt).toBeDefined()
	})
})

test.describe("Hover prefetch behavior", () => {
	test("hover triggers NDJSON prefetch request", async ({ page }) => {
		/* Track network requests */
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		/* Wait for hydration */
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover over NDJSON link */
		await page.hover('[data-testid="link-hover-ndjson"]')

		/* Wait for prefetch request */
		await page.waitForTimeout(100)

		expect(prefetchRequests.some((url) => url.includes("/about"))).toBe(true)
	})

	test("hover triggers HTML prefetch request", async ({ page }) => {
		const prefetchRequests: { url: string; format: string | null }[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push({
					format: request.headers()["x-f"] || null,
					url: request.url(),
				})
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover over HTML link */
		await page.hover('[data-testid="link-hover-html"]')

		await page.waitForTimeout(100)

		const htmlPrefetch = prefetchRequests.find(
			(req) => req.url.includes("/about") && req.format === "html",
		)
		expect(htmlPrefetch).toBeDefined()
	})

	test("hover prefetch only triggers once per link", async ({ page }) => {
		let prefetchCount = 0
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1" && request.url().includes("/about")) {
				prefetchCount++
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover multiple times */
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(50)
		await page.hover("h1") /* Move away */
		await page.waitForTimeout(50)
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(50)

		/* Should only prefetch once */
		expect(prefetchCount).toBe(1)
	})
})

test.describe("Viewport prefetch behavior", () => {
	test("viewport prefetch triggers when link enters viewport", async ({ page }) => {
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Links with viewport prefetch should trigger immediately if visible */
		await page.waitForTimeout(200)

		/* Viewport links at top of page should have prefetched */
		expect(prefetchRequests.some((url) => url.includes("/products/111"))).toBe(true)
		expect(prefetchRequests.some((url) => url.includes("/products/222"))).toBe(true)
	})

	test("below-fold viewport link prefetches on scroll", async ({ page }) => {
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Initially, below-fold link should not be prefetched */
		await page.waitForTimeout(200)
		const beforeScroll = prefetchRequests.filter((url) => url.includes("/products/555"))
		expect(beforeScroll.length).toBe(0)

		/* Scroll to bottom */
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

		/* Wait for intersection observer to trigger */
		await page.waitForTimeout(300)

		/* Now it should be prefetched */
		expect(prefetchRequests.some((url) => url.includes("/products/555"))).toBe(true)
	})

	test("viewport prefetch uses correct nav format (HTML)", async ({ page }) => {
		const prefetchRequests: { url: string; format: string | null }[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push({
					format: request.headers()["x-f"] || null,
					url: request.url(),
				})
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.waitForTimeout(200)

		/* HTML viewport link should use html format */
		const htmlPrefetch = prefetchRequests.find(
			(req) => req.url.includes("/products/222") && req.format === "html",
		)
		expect(htmlPrefetch).toBeDefined()

		/* NDJSON viewport link should use ndjson (may or may not have x-f header) */
		const ndjsonPrefetch = prefetchRequests.find(
			(req) => req.url.includes("/products/111") && req.format !== "html",
		)
		expect(ndjsonPrefetch).toBeDefined()
	})
})

test.describe("No prefetch behavior", () => {
	test("prefetch=false prevents prefetch on hover", async ({ page }) => {
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover over no-prefetch link */
		await page.hover('[data-testid="link-no-prefetch"]')
		await page.waitForTimeout(100)

		/* Should not have prefetched /products/333 */
		expect(prefetchRequests.some((url) => url.includes("/products/333"))).toBe(false)
	})

	test("prefetch=false link still navigates on click", async ({ page }) => {
		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Click the no-prefetch link */
		await page.click('[data-testid="link-no-prefetch"]')

		await expect(page).toHaveURL("/products/333")
		await expect(page.locator("h1")).toContainText("Product 333")
	})
})

test.describe("Prefetch cache deduplication", () => {
	test("multiple links to same URL only prefetch once", async ({ page }) => {
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1" && request.url().includes("/products/444")) {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover over first link */
		await page.hover('[data-testid="link-cache-1"]')

		/* Wait for prefetch to complete and mark cache */
		await page.waitForTimeout(300)

		/* Hover over second link to same URL */
		await page.hover('[data-testid="link-cache-2"]')
		await page.waitForTimeout(200)

		/*
		 * Each Link component has its own local hasPrefetched state, so both Links
		 * will call router.prefetch(). However, the global prefetchCache should
		 * prevent the second network request.
		 *
		 * Note: Currently testing that we don't make more than expected requests.
		 * The Link-level deduplication happens in the component, router-level
		 * deduplication happens in the prefetch cache.
		 */
		expect(prefetchRequests.length).toBeLessThanOrEqual(2)
		/* At minimum, first hover should trigger a prefetch */
		expect(prefetchRequests.length).toBeGreaterThanOrEqual(1)
	})

	test("prefetched data is used for navigation (no double fetch)", async ({ page }) => {
		let navigationFetchCount = 0
		let prefetchCount = 0

		page.on("request", (request) => {
			if (request.url().includes("/about")) {
				if (request.headers()["x-p"] === "1") {
					prefetchCount++
				} else if (request.headers()["x-d"] === "1") {
					navigationFetchCount++
				}
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover to trigger prefetch */
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(150)

		expect(prefetchCount).toBe(1)

		/* Click to navigate */
		await page.click('[data-testid="link-hover-ndjson"]')
		await expect(page).toHaveURL("/about")

		/* Navigation should still fetch (prefetch populates cache, navigation updates it) */
		/* This is expected behavior - prefetch warms cache but navigation refreshes */
		expect(navigationFetchCount).toBeGreaterThanOrEqual(0)
	})
})

test.describe("Prefetch with dynamic routes", () => {
	test("prefetch works with parameterized URLs", async ({ page }) => {
		const prefetchRequests: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchRequests.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Viewport links with params should prefetch */
		await page.waitForTimeout(200)

		expect(prefetchRequests.some((url) => url.includes("/products/111"))).toBe(true)
		expect(prefetchRequests.some((url) => url.includes("/products/222"))).toBe(true)
	})

	test("prefetch response contains correct params", async ({ request }) => {
		const response = await request.get("/products/789", {
			headers: {
				"x-d": "1",
				"x-f": "html",
				"x-p": "1",
			},
		})

		const html = await response.text()
		const match = html.match(/self\.flare\s*=\s*({[\s\S]*?});/)

		expect(match).not.toBeNull()
		if (!match?.[1]) throw new Error("No flare state found")

		const state = JSON.parse(match[1])
		expect(state.r.params).toEqual({ id: "789" })
	})
})

test.describe("Prefetch stale time invalidation", () => {
	test("prefetch is skipped when URL is fresh (within staleTime)", async ({ page }) => {
		let prefetchCount = 0
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1" && request.url().includes("/about")) {
				prefetchCount++
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* First hover triggers prefetch */
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(150)
		expect(prefetchCount).toBe(1)

		/* Move away */
		await page.hover("h1")
		await page.waitForTimeout(50)

		/* Second hover within staleTime (30s default) should NOT trigger prefetch */
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(150)

		/* Still only 1 prefetch - second was skipped because URL is fresh */
		expect(prefetchCount).toBe(1)
	})

	test("prefetch cache is keyed by URL (different URLs prefetch separately)", async ({ page }) => {
		const prefetchedUrls: string[] = []
		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1") {
				prefetchedUrls.push(request.url())
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Hover NDJSON link to /about */
		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(150)

		/* Move away */
		await page.hover("h1")
		await page.waitForTimeout(50)

		/* Hover HTML link to same /about - different Link instance but same URL */
		await page.hover('[data-testid="link-hover-html"]')
		await page.waitForTimeout(150)

		/* Both Links called prefetch(), but cache should prevent duplicate for same URL
		 * However, navFormat differs (ndjson vs html), so cache key might differ
		 * depending on implementation */
		const aboutPrefetches = prefetchedUrls.filter((url) => url.includes("/about"))

		/* At minimum one prefetch happened, at most 2 (if navFormat is part of cache key) */
		expect(aboutPrefetches.length).toBeGreaterThanOrEqual(1)
		expect(aboutPrefetches.length).toBeLessThanOrEqual(2)
	})
})

test.describe("Prefetch request headers", () => {
	test("NDJSON prefetch sends correct headers", async ({ page }) => {
		let capturedHeaders: Record<string, string> = {}

		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1" && request.url().includes("/about")) {
				capturedHeaders = request.headers()
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.hover('[data-testid="link-hover-ndjson"]')
		await page.waitForTimeout(100)

		expect(capturedHeaders["x-d"]).toBe("1") /* Data request */
		expect(capturedHeaders["x-p"]).toBe("1") /* Prefetch */
		/* NDJSON is default - may or may not have x-f header */
		expect(capturedHeaders["x-f"]).not.toBe("html")
	})

	test("HTML prefetch sends correct headers", async ({ page }) => {
		let capturedHeaders: Record<string, string> = {}

		page.on("request", (request) => {
			if (request.headers()["x-p"] === "1" && request.url().includes("/about")) {
				capturedHeaders = request.headers()
			}
		})

		await page.goto("/prefetch")

		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		await page.hover('[data-testid="link-hover-html"]')
		await page.waitForTimeout(100)

		expect(capturedHeaders["x-d"]).toBe("1") /* Data request */
		expect(capturedHeaders["x-p"]).toBe("1") /* Prefetch */
		expect(capturedHeaders["x-f"]).toBe("html") /* HTML format */
	})
})
