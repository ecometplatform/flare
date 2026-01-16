/**
 * Hydration E2E Tests
 *
 * Verifies SSR hydration works correctly on all pages.
 * Tests capture console errors, page errors, and specifically detect hydration mismatches.
 *
 * IMPORTANT: Each test MUST verify page-specific content to ensure the correct page loaded.
 * Just checking URL is not enough - navigation bugs can update URL without changing content.
 */

import { expect, test } from "../fixtures/flare.fixture"

test.describe("Hydration - No errors on page load", () => {
	test("home page hydrates without errors", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify HOME page specific content */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")
		await expect(flare.page.locator("nav ul li")).toHaveCount(50)
		await expect(flare.page.locator("text=NDJSON streaming protocol")).toBeVisible()
	})

	test("about page hydrates without errors", async ({ flare }) => {
		await flare.goto("/about")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify ABOUT page specific content */
		await expect(flare.page.locator("h1")).toContainText("About Flare v2")
		await expect(flare.page.locator("text=Version:")).toBeVisible()
		await expect(flare.page.locator("text=lightweight SSR/SPA framework")).toBeVisible()
	})

	test("defer page hydrates without errors", async ({ flare }) => {
		await flare.goto("/defer")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify DEFER page specific content */
		await expect(flare.page.locator("h1")).toContainText("Defer")
		await expect(flare.page.locator("text=Immediate Data")).toBeVisible()
	})

	test("query-test page hydrates without errors", async ({ flare }) => {
		await flare.goto("/query-test")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify QUERY-TEST page specific content */
		await expect(flare.page.locator("h1")).toContainText("Query Test")
		await expect(flare.page.locator("text=User Data")).toBeVisible()
	})

	test("query-defer-test page hydrates without errors", async ({ flare }) => {
		await flare.goto("/query-defer-test")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify QUERY-DEFER-TEST page specific content */
		await expect(flare.page.locator("h1")).toContainText("Query + Defer")
		await expect(flare.page.locator("text=Deferred Stats")).toBeVisible()
	})

	test("dynamic route hydrates without errors", async ({ flare }) => {
		await flare.goto("/products/123")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify PRODUCT page specific content with dynamic param */
		await expect(flare.page.locator("h1")).toContainText("Product 123")
	})
})

test.describe("Hydration - Client navigation updates content", () => {
	test("navigation from home to about updates page content", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")
		flare.assertNoHydrationErrors()

		/* Verify we're on HOME page */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.clearCaptures()

		/* Navigate to About */
		await flare.clickLink("About")
		await flare.page.waitForURL("**/about")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify ABOUT page content loaded, not still showing home */
		await expect(flare.page.locator("h1")).toContainText("About Flare v2")
		await expect(flare.page.locator("text=Version:")).toBeVisible()
		/* Should NOT have home page content */
		await expect(flare.page.locator("text=NDJSON streaming protocol")).not.toBeVisible()
	})

	test("navigation from home to defer updates page content", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're on HOME page */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.clearCaptures()

		/* Navigate to Defer - use exact link to avoid matching "Defer + Await" etc */
		await flare.page.getByRole("link", { exact: true, name: "Defer" }).click()
		await flare.page.waitForURL("**/defer")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify DEFER page content loaded */
		await expect(flare.page.locator("h1")).toContainText("Defer")
		await expect(flare.page.locator("text=Immediate Data")).toBeVisible()
	})

	test("navigation to query test page updates content", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're on HOME page */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.clearCaptures()

		await flare.clickLink("Query Test")
		await flare.page.waitForURL("**/query-test")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify QUERY-TEST page content loaded */
		await expect(flare.page.locator("h1")).toContainText("Query Test")
		await expect(flare.page.locator("text=User Data")).toBeVisible()
	})

	test("navigation to dynamic route updates content", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're on HOME page */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.clearCaptures()

		await flare.clickLink("Product 123")
		await flare.page.waitForURL("**/products/123")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify PRODUCT page content loaded with param */
		await expect(flare.page.locator("h1")).toContainText("Product 123")
	})
})

test.describe("Hydration - Back/forward navigation", () => {
	test("back navigation updates page content correctly", async ({ flare }) => {
		/* Start on home */
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		/* Navigate to about */
		await flare.clickLink("About")
		await flare.page.waitForURL("**/about")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator("h1")).toContainText("About Flare v2")

		flare.clearCaptures()

		/* Go back - should show HOME content */
		await flare.page.goBack()
		await flare.page.waitForURL("**/")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify we're back on HOME page */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")
		await expect(flare.page.locator("nav ul li")).toHaveCount(50)
	})

	test("forward navigation updates page content correctly", async ({ flare }) => {
		/* Start on home, go to about, go back */
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		await flare.clickLink("About")
		await flare.page.waitForURL("**/about")
		await flare.page.waitForLoadState("networkidle")

		await flare.page.goBack()
		await flare.page.waitForURL("**/")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.clearCaptures()

		/* Go forward - should show ABOUT content */
		await flare.page.goForward()
		await flare.page.waitForURL("**/about")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoPageErrors()

		/* CRITICAL: Verify we're on ABOUT page */
		await expect(flare.page.locator("h1")).toContainText("About Flare v2")
		await expect(flare.page.locator("text=Version:")).toBeVisible()
	})
})

test.describe("Hydration - Link components render correctly", () => {
	test("all links on home page render text content", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify all link texts are visible (not empty markers) */
		const links = flare.page.locator("nav a")
		const count = await links.count()
		expect(count).toBeGreaterThan(0)

		for (let i = 0; i < count; i++) {
			const linkText = await links.nth(i).textContent()
			expect(linkText).not.toBe("")
			expect(linkText).not.toMatch(/^<!--.*-->$/)
		}
	})

	test("links have correct href attributes", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Check specific links */
		await expect(flare.page.locator('a[href="/defer"]')).toHaveText("Defer")
		await expect(flare.page.locator('a[href="/about"]')).toHaveText("About")
		await expect(flare.page.locator('a[href="/query-test"]')).toHaveText("Query Test")
	})
})
