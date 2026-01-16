/**
 * Lazy Loading E2E Tests
 *
 * Tests lazy(), clientLazy(), and preload() behavior in browser.
 * Verifies SSR output, client hydration, and dynamic loading.
 */

import { expect, test } from "../fixtures/flare.fixture"

test.describe("Lazy Loading - Hydration", () => {
	test("lazy-test page hydrates without errors", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()

		/* Verify page loaded */
		await expect(flare.page.locator("h1")).toContainText("Lazy Loading Basic Tests")
	})
})

test.describe("lazy() - SSR Lazy Component", () => {
	test("SSR component content is present in initial HTML", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")

		/* SSR lazy component should be rendered in initial HTML */
		await expect(flare.page.getByTestId("ssr-lazy-section")).toBeVisible()

		/* The loaded content should be visible (SSR rendered) */
		await expect(flare.page.getByTestId("ssr-lazy-loaded")).toBeVisible()
		await expect(flare.page.getByTestId("ssr-lazy-content")).toContainText(
			"SSR Component loaded: SSR Test",
		)
	})

	test("SSR component hydrates correctly", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()

		/* Content should still be visible after hydration */
		await expect(flare.page.getByTestId("ssr-lazy-content")).toContainText(
			"SSR Component loaded: SSR Test",
		)
	})
})

test.describe("clientLazy() - Client-only Component", () => {
	test("shows pending on server, loads on client", async ({ flare }) => {
		/* Navigate and check initial state */
		await flare.goto("/lazy-test/basic")

		/* Scope to the client-lazy-section to avoid ambiguity */
		const section = flare.page.getByTestId("client-lazy-section")

		/* Should eventually load the client component */
		await expect(section.getByTestId("client-lazy-loaded")).toBeVisible({ timeout: 5000 })

		/* Content should be correct */
		await expect(section.getByTestId("client-lazy-content")).toContainText(
			"Client Component loaded: Client Test",
		)

		/* Client-only component should have access to browser APIs */
		await expect(section.getByTestId("client-lazy-mounted")).toContainText("Mounted: yes")
	})

	test("client-only component uses browser APIs", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")

		/* Scope to the client-lazy-section to avoid ambiguity */
		const section = flare.page.getByTestId("client-lazy-section")

		/* Wait for component to load and mount */
		await expect(section.getByTestId("client-lazy-loaded")).toBeVisible({ timeout: 5000 })

		/* Window width should be populated (browser API) */
		const windowText = await section.getByTestId("client-lazy-window").textContent()
		expect(windowText).toMatch(/Window width: \d+px/)
	})

	test("prop override for pending works", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")

		/* Wait for override section to load */
		const overrideSection = flare.page.getByTestId("override-section")
		await expect(overrideSection).toBeVisible()

		/* Should eventually show loaded component */
		await expect(overrideSection.getByTestId("client-lazy-loaded")).toBeVisible({ timeout: 5000 })
	})
})

test.describe("clientLazy() with eager loading", () => {
	test("eager component loads", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")

		/* Eager component should load */
		await expect(flare.page.getByTestId("eager-lazy-loaded")).toBeVisible({ timeout: 5000 })
		await expect(flare.page.getByTestId("eager-lazy-content")).toContainText(
			"Eager Component loaded!",
		)
	})
})

test.describe("preload() utility", () => {
	test("preload button triggers preload", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		/* Click preload button */
		await flare.page.getByTestId("preload-trigger").click()

		/* Result should show preload started */
		await expect(flare.page.getByTestId("preload-result")).toContainText("Preload started")
	})

	test("load and use utility", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		/* Click load button */
		await flare.page.getByTestId("preload-load").click()

		/* Result should show computation result (5 + 3 = 8) */
		await expect(flare.page.getByTestId("preload-result")).toContainText("Result: 8")
	})

	test("preload then load is instant", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		/* Preload first */
		await flare.page.getByTestId("preload-trigger").click()

		/* Wait a bit for preload to complete */
		await flare.page.waitForTimeout(100)

		/* Now load - should be instant since preloaded */
		await flare.page.getByTestId("preload-load").click()

		/* Result should appear quickly */
		await expect(flare.page.getByTestId("preload-result")).toContainText("Result: 8", {
			timeout: 1000,
		})
	})
})

test.describe("Navigation with lazy components", () => {
	test("navigate to lazy-test page via link", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Click link to lazy-test basic */
		await flare.page.getByRole("link", { name: "Lazy Basic" }).click()

		/* Should navigate to lazy-test/basic page */
		await flare.waitForNavigation("/lazy-test/basic")

		/* Verify content loaded */
		await expect(flare.page.locator("h1")).toContainText("Lazy Loading Basic Tests")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})

	test("navigate away and back maintains state", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		/* Load the utility first */
		await flare.page.getByTestId("preload-load").click()
		await expect(flare.page.getByTestId("preload-result")).toContainText("Result: 8")

		/* Navigate away using direct navigation */
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate back via link */
		await flare.page.getByRole("link", { name: "Lazy Basic" }).click()
		await flare.waitForNavigation("/lazy-test/basic")

		/* Verify lazy components still work */
		const section = flare.page.getByTestId("client-lazy-section")
		await expect(section.getByTestId("client-lazy-loaded")).toBeVisible({ timeout: 5000 })

		flare.assertNoPageErrors()
	})
})

test.describe("Error handling", () => {
	test("no errors on page load", async ({ flare }) => {
		await flare.goto("/lazy-test/basic")
		await flare.page.waitForLoadState("networkidle")

		/* Wait for all lazy components to load */
		await expect(flare.page.getByTestId("ssr-lazy-loaded")).toBeVisible()
		await expect(
			flare.page.getByTestId("client-lazy-section").getByTestId("client-lazy-loaded"),
		).toBeVisible({ timeout: 5000 })
		await expect(flare.page.getByTestId("eager-lazy-loaded")).toBeVisible({ timeout: 5000 })

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})
})
