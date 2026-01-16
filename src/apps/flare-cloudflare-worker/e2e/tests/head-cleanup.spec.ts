/**
 * Per-Route Head Cleanup E2E Tests
 *
 * Tests that head elements are properly cleaned up when navigating between routes.
 * Verifies:
 * - OG meta tags are removed when navigating away
 * - Twitter meta tags are removed when navigating away
 * - JSON-LD is updated/replaced on navigation
 * - Custom meta tags are cleaned up per-route
 * - Layout head elements persist while page elements are cleaned
 * - Hreflang links are cleaned up
 * - Robots meta is updated
 * - Canonical link is updated
 */

import { expect, test } from "@playwright/test"

test.describe("Per-Route Head Cleanup", () => {
	test.describe("OpenGraph Meta Cleanup", () => {
		test("OG meta tags are present on Page A", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page A OG Title",
			)
			await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
				"content",
				"Page A OG Description",
			)
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article")
			await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
				"content",
				"https://example.com/head-test/page-a",
			)
			await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
				"content",
				"Head Test Site",
			)
			await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
				"content",
				"https://example.com/page-a-og.jpg",
			)
		})

		test("OG meta tags change when navigating from Page A to Page B", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			/* Verify Page A OG tags */
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page A OG Title",
			)
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article")

			/* Navigate to Page B */
			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			/* Verify Page B OG tags replaced Page A */
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page B OG Title",
			)
			await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
				"content",
				"Page B OG Description",
			)
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "product")
			await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
				"content",
				"https://example.com/head-test/page-b",
			)
			await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
				"content",
				"Different Site Name",
			)
			await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
				"content",
				"https://example.com/page-b-og.jpg",
			)
		})

		test("OG meta tags are removed when navigating outside layout", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			/* Verify Page A OG tags present */
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page A OG Title",
			)

			/* Navigate to About page (outside head-test layout) */
			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			/* OG tags should be removed - About page has no OG */
			await expect(page.locator('meta[property="og:title"]')).toHaveCount(0)
			await expect(page.locator('meta[property="og:description"]')).toHaveCount(0)
			await expect(page.locator('meta[property="og:type"]')).toHaveCount(0)
			await expect(page.locator('meta[property="og:url"]')).toHaveCount(0)
			await expect(page.locator('meta[property="og:site_name"]')).toHaveCount(0)
			await expect(page.locator('meta[property="og:image"]')).toHaveCount(0)
		})
	})

	test.describe("Twitter Card Meta Cleanup", () => {
		test("Twitter meta tags are present on Page A", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
				"content",
				"summary_large_image",
			)
			await expect(page.locator('meta[name="twitter:site"]')).toHaveCount(1)
			await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
				"content",
				"Page A Twitter Title",
			)
			await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
				"content",
				"Page A Twitter Description",
			)
		})

		test("Twitter meta tags change when navigating to Page B", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
				"content",
				"summary_large_image",
			)

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary")
			await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
				"content",
				"Page B Twitter Title",
			)
			await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
				"content",
				"Page B Twitter Description",
			)
		})

		test("Twitter meta tags are removed when navigating outside layout", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(0)
			await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(0)
			await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(0)
		})
	})

	test.describe("JSON-LD Cleanup", () => {
		test("JSON-LD is present on Page A with Article schema", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			const jsonLd = page.locator('script[type="application/ld+json"]')
			await expect(jsonLd).toHaveCount(1)

			const content = await jsonLd.textContent()
			const parsed = JSON.parse(content!)
			expect(parsed["@type"]).toBe("Article")
			expect(parsed.headline).toBe("Page A Article")
		})

		test("JSON-LD changes to Product schema on Page B", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			let jsonLd = page.locator('script[type="application/ld+json"]')
			let content = await jsonLd.textContent()
			let parsed = JSON.parse(content!)
			expect(parsed["@type"]).toBe("Article")

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			jsonLd = page.locator('script[type="application/ld+json"]')
			await expect(jsonLd).toHaveCount(1)

			content = await jsonLd.textContent()
			parsed = JSON.parse(content!)
			expect(parsed["@type"]).toBe("Product")
			expect(parsed.name).toBe("Page B Product")
		})

		test("JSON-LD is removed when navigating to page without it", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			/* About page has no JSON-LD - should be removed */
			/* Note: JSON-LD might persist if not tracked by route - this tests cleanup */
			const count = await page.locator('script[type="application/ld+json"]').count()
			/* If cleanup works, count should be 0 */
			expect(count).toBe(0)
		})
	})

	test.describe("Robots Meta Cleanup", () => {
		test("robots meta is set correctly on Page A", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			const robots = page.locator('meta[name="robots"]')
			await expect(robots).toHaveCount(1)
			const content = await robots.getAttribute("content")
			expect(content).toContain("index")
			expect(content).toContain("follow")
			expect(content).toContain("noarchive")
		})

		test("robots meta changes on Page B (noindex, nofollow)", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			const robots = page.locator('meta[name="robots"]')
			await expect(robots).toHaveCount(1)
			const content = await robots.getAttribute("content")
			expect(content).toContain("noindex")
			expect(content).toContain("nofollow")
		})

		test("robots meta is removed when navigating to page without it", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="robots"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
		})
	})

	test.describe("Canonical Link Cleanup", () => {
		test("canonical link is set correctly on Page A", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				"https://example.com/head-test/page-a",
			)
		})

		test("canonical link changes on Page B", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				"https://example.com/head-test/page-b",
			)
		})
	})

	test.describe("Keywords Meta Cleanup", () => {
		test("keywords meta changes between pages", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="keywords"]')).toHaveAttribute(
				"content",
				"page-a, testing, head",
			)

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			await expect(page.locator('meta[name="keywords"]')).toHaveAttribute(
				"content",
				"page-b, different, head",
			)
		})

		test("keywords meta is removed when navigating to page without it", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="keywords"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			await expect(page.locator('meta[name="keywords"]')).toHaveCount(0)
		})
	})

	test.describe("Hreflang Links Cleanup", () => {
		test("hreflang links are present on Page A", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
				"href",
				"https://example.com/en/page-a",
			)
			await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
				"href",
				"https://example.com/fr/page-a",
			)
		})

		test("hreflang links change on Page B (different languages)", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			/* Page A has en and fr */
			await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(1)

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			/* Page B has en and de - fr should be removed */
			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
				"href",
				"https://example.com/en/page-b",
			)
			await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
				"href",
				"https://example.com/de/page-b",
			)
			/* fr should be removed */
			await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(0)
		})

		test("hreflang links are removed when navigating outside", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(0)
			await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveCount(0)
		})
	})

	test.describe("Custom Meta Cleanup", () => {
		test("custom page-specific meta changes between pages", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="page-specific-meta"]')).toHaveAttribute(
				"content",
				"page-a-value",
			)
			await expect(page.locator('meta[property="article:author"]')).toHaveCount(1)

			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			await expect(page.locator('meta[name="page-specific-meta"]')).toHaveAttribute(
				"content",
				"page-b-value",
			)
			/* article:author should be removed, product:price should be added */
			await expect(page.locator('meta[property="article:author"]')).toHaveCount(0)
			await expect(page.locator('meta[property="product:price"]')).toHaveCount(1)
		})

		test("custom meta is removed when navigating outside", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="page-specific-meta"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			await expect(page.locator('meta[name="page-specific-meta"]')).toHaveCount(0)
			await expect(page.locator('meta[property="article:author"]')).toHaveCount(0)
		})
	})

	test.describe("Layout Meta Persistence", () => {
		test("layout meta persists when navigating between child pages", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			/* Layout meta should be present */
			await expect(page.locator('meta[name="layout-meta"]')).toHaveAttribute(
				"content",
				"head-test-layout",
			)

			/* Navigate to Page B (same layout) */
			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")

			/* Layout meta should still be present */
			await expect(page.locator('meta[name="layout-meta"]')).toHaveAttribute(
				"content",
				"head-test-layout",
			)
		})

		test("layout meta is removed when navigating outside layout", async ({ page }) => {
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[name="layout-meta"]')).toHaveCount(1)

			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			/* Layout meta should be removed */
			await expect(page.locator('meta[name="layout-meta"]')).toHaveCount(0)
		})
	})

	test.describe("Navigation Round Trip", () => {
		test("head elements are restored when navigating back", async ({ page }) => {
			/* Start on Page A */
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")

			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page A OG Title",
			)
			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
				"content",
				"summary_large_image",
			)

			/* Navigate to About (outside layout) */
			await page.click('a[href="/about"]')
			await page.waitForURL("/about")

			/* Verify cleanup */
			await expect(page.locator('meta[property="og:title"]')).toHaveCount(0)
			await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(0)

			/* Navigate back to Page A */
			await page.goBack()
			await page.waitForURL("/head-test/page-a")

			/* Verify head elements are restored */
			await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
				"content",
				"Page A OG Title",
			)
			await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
				"content",
				"summary_large_image",
			)
			await expect(page.locator('meta[name="layout-meta"]')).toHaveAttribute(
				"content",
				"head-test-layout",
			)
		})

		test("full round trip: A -> B -> About -> B -> A", async ({ page }) => {
			/* Start on Page A */
			await page.goto("/head-test/page-a")
			await page.waitForLoadState("networkidle")
			await expect(page).toHaveTitle("Page A - Head Test")

			/* Navigate to Page B */
			await page.click('a[href="/head-test/page-b"]')
			await page.waitForURL("/head-test/page-b")
			await expect(page).toHaveTitle("Page B - Head Test")
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "product")

			/* Navigate to About */
			await page.click('a[href="/about"]')
			await page.waitForURL("/about")
			await expect(page).toHaveTitle("About - Flare v2")
			await expect(page.locator('meta[property="og:type"]')).toHaveCount(0)
			await expect(page.locator('meta[name="layout-meta"]')).toHaveCount(0)

			/* Navigate back to Page B */
			await page.goBack()
			await page.waitForURL("/head-test/page-b")
			await expect(page).toHaveTitle("Page B - Head Test")
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "product")
			await expect(page.locator('meta[name="layout-meta"]')).toHaveAttribute(
				"content",
				"head-test-layout",
			)

			/* Navigate back to Page A */
			await page.goBack()
			await page.waitForURL("/head-test/page-a")
			await expect(page).toHaveTitle("Page A - Head Test")
			await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article")
		})
	})
})
