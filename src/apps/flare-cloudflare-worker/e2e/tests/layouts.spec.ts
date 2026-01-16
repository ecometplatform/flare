/**
 * Layout E2E Tests
 *
 * Tests layout rendering, nesting, loader data, and navigation.
 */

import { expect, test } from "../fixtures/flare.fixture"

test.describe("Layout - Basic rendering", () => {
	test("layout wraps page content", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Layout wrapper should exist */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		/* Layout header should exist */
		await expect(flare.page.locator('[data-testid="layout-tests-header"]')).toBeVisible()

		/* Layout content should contain page */
		await expect(flare.page.locator('[data-testid="layout-tests-content"]')).toBeVisible()

		/* Layout footer should exist */
		await expect(flare.page.locator('[data-testid="layout-tests-footer"]')).toBeVisible()

		/* Page content should be inside layout */
		await expect(flare.page.locator('[data-testid="layout-tests-index"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("layout loader data is rendered", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Layout name from loader should be in data attribute */
		const wrapper = flare.page.locator('[data-testid="layout-tests-wrapper"]')
		await expect(wrapper).toHaveAttribute("data-layout-name", "LayoutTestsLayout")

		/* Timestamp should be a number */
		const timestamp = await flare.page.locator('[data-testid="layout-timestamp"]').textContent()
		expect(Number(timestamp)).toBeGreaterThan(0)

		flare.assertNoPageErrors()
	})

	test("layout head is applied", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Title should include layout title */
		await expect(flare.page).toHaveTitle(/Layout Tests/)

		/* Layout meta tag should exist */
		const layoutMeta = await flare.page.locator('meta[name="layout-level"]').getAttribute("content")
		expect(layoutMeta).toBe("1")

		flare.assertNoPageErrors()
	})
})

test.describe("Layout - Nested layouts", () => {
	test("two-level nested layout renders both wrappers", async ({ flare }) => {
		await flare.goto("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Level 1 layout should exist */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		/* Level 2 (nested) layout should exist */
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()

		/* Page content should be inside nested layout */
		await expect(flare.page.locator('[data-testid="nested-index"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("nested layout loader data is available", async ({ flare }) => {
		await flare.goto("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Nested layout data attribute */
		const nestedWrapper = flare.page.locator('[data-testid="nested-layout-wrapper"]')
		await expect(nestedWrapper).toHaveAttribute("data-nested-data", "nested-layout-value")

		/* Nested timestamp should be rendered */
		const timestamp = await flare.page.locator('[data-testid="nested-timestamp"]').textContent()
		expect(Number(timestamp)).toBeGreaterThan(0)

		flare.assertNoPageErrors()
	})

	test("three-level deep nested layout renders all wrappers", async ({ flare }) => {
		await flare.goto("/layout-tests/nested/deep")
		await flare.page.waitForLoadState("networkidle")

		/* Level 1 layout */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		/* Level 2 layout */
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()

		/* Level 3 layout */
		await expect(flare.page.locator('[data-testid="deep-layout-wrapper"]')).toBeVisible()

		/* Deep page content */
		await expect(flare.page.locator('[data-testid="deep-nested-page"]')).toBeVisible()

		/* Depth attribute should be 3 */
		const deepWrapper = flare.page.locator('[data-testid="deep-layout-wrapper"]')
		await expect(deepWrapper).toHaveAttribute("data-depth", "3")

		flare.assertNoPageErrors()
	})

	test("nested layouts add cumulative meta tags", async ({ flare }) => {
		await flare.goto("/layout-tests/nested/deep")
		await flare.page.waitForLoadState("networkidle")

		/* Meta tags from different layout levels - each level adds one */
		const layoutMetaCount = await flare.page.locator('meta[name="layout-level"]').count()
		/* Deep nested layout should have 3 layout-level meta tags (from levels 1, 2, 3) */
		expect(layoutMetaCount).toBe(3)

		flare.assertNoPageErrors()
	})
})

test.describe("Layout - Sibling layouts", () => {
	test("sibling layout renders different wrapper than nested", async ({ flare }) => {
		await flare.goto("/layout-tests/sibling")
		await flare.page.waitForLoadState("networkidle")

		/* Level 1 layout should exist (shared) */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		/* Sibling layout should exist */
		await expect(flare.page.locator('[data-testid="sibling-layout-wrapper"]')).toBeVisible()

		/* Nested layout should NOT exist */
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})

	test("sibling layout has its own meta", async ({ flare }) => {
		await flare.goto("/layout-tests/sibling")
		await flare.page.waitForLoadState("networkidle")

		/* Sibling-specific meta should exist */
		const siblingMeta = await flare.page
			.locator('meta[name="sibling-marker"]')
			.getAttribute("content")
		expect(siblingMeta).toBe("true")

		flare.assertNoPageErrors()
	})

	test("navigating between sibling layouts switches wrappers", async ({ flare }) => {
		await flare.goto("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're in nested layout */
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="sibling-layout-wrapper"]')).not.toBeVisible()

		/* Navigate to sibling */
		await flare.page.click('a[href="/layout-tests/sibling"]')
		await flare.page.waitForURL("/layout-tests/sibling")
		await flare.page.waitForLoadState("networkidle")

		/* Now sibling should be visible, nested should not */
		await expect(flare.page.locator('[data-testid="sibling-layout-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).not.toBeVisible()

		/* Level 1 layout should still be there */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		flare.assertNoPageErrors()
	})
})

test.describe("Layout - Dynamic params", () => {
	test("layout with params renders correctly", async ({ flare }) => {
		await flare.goto("/layout-tests/dynamic/acme/dashboard")
		await flare.page.waitForLoadState("networkidle")

		/* Dynamic layout should exist */
		await expect(flare.page.locator('[data-testid="dynamic-layout-wrapper"]')).toBeVisible()

		/* Org ID should be in data attribute */
		const dynamicWrapper = flare.page.locator('[data-testid="dynamic-layout-wrapper"]')
		await expect(dynamicWrapper).toHaveAttribute("data-org-id", "acme")

		/* Org name should be in header */
		await expect(flare.page.locator('[data-testid="dynamic-layout-header"]')).toContainText(
			"Organization acme",
		)

		flare.assertNoPageErrors()
	})

	test("navigating to different org updates layout", async ({ flare }) => {
		await flare.goto("/layout-tests/dynamic/acme/dashboard")
		await flare.page.waitForLoadState("networkidle")

		/* Verify initial org */
		await expect(flare.page.locator('[data-testid="dynamic-layout-header"]')).toContainText(
			"Organization acme",
		)

		/* Navigate to different org */
		await flare.page.click('a:has-text("Switch to Globex")')
		await flare.page.waitForURL("/layout-tests/dynamic/globex/dashboard")
		await flare.page.waitForLoadState("networkidle")

		/* Layout should update */
		await expect(flare.page.locator('[data-testid="dynamic-layout-header"]')).toContainText(
			"Organization globex",
		)

		/* Data attribute should update */
		const dynamicWrapper = flare.page.locator('[data-testid="dynamic-layout-wrapper"]')
		await expect(dynamicWrapper).toHaveAttribute("data-org-id", "globex")

		flare.assertNoPageErrors()
	})

	test("layout head updates with params", async ({ flare }) => {
		await flare.goto("/layout-tests/dynamic/acme/dashboard")
		await flare.page.waitForLoadState("networkidle")

		/* Title should include org name */
		await expect(flare.page).toHaveTitle(/Org.*acme/i)

		flare.assertNoPageErrors()
	})
})

test.describe("Layout - Navigation and persistence", () => {
	test("layout persists during page navigation within same layout", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Get initial timestamp from layout loader */
		const initialTimestamp = await flare.page
			.locator('[data-testid="layout-timestamp"]')
			.textContent()

		/* Navigate to nested page (same parent layout) */
		await flare.page.click('a[href="/layout-tests/nested"]')
		await flare.page.waitForURL("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Layout should still be visible */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("back navigation restores layout state", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to nested */
		await flare.page.click('a[href="/layout-tests/nested"]')
		await flare.page.waitForURL("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Verify nested layout */
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()

		/* Go back */
		await flare.page.goBack()
		await flare.page.waitForURL("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Should be back to index, no nested layout */
		await expect(flare.page.locator('[data-testid="layout-tests-index"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})

	test("navigating away from layout group removes layout", async ({ flare }) => {
		await flare.goto("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Verify layouts exist */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()

		/* Navigate to home */
		await flare.page.click('a[href="/"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Layout test layouts should be gone */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).not.toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})
})

test.describe("Layout - Hydration", () => {
	test("layout hydrates correctly", async ({ flare }) => {
		await flare.goto("/layout-tests")
		await flare.page.waitForLoadState("networkidle")

		/* Verify hydration completes */
		const hydrated = await flare.page.evaluate(
			() => (window as unknown as { __FLARE_HYDRATED__?: boolean }).__FLARE_HYDRATED__,
		)
		expect(hydrated).toBe(true)

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})

	test("nested layouts hydrate correctly", async ({ flare }) => {
		await flare.goto("/layout-tests/nested/deep")
		await flare.page.waitForLoadState("networkidle")

		/* All three levels should be rendered */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="deep-layout-wrapper"]')).toBeVisible()

		/* Verify hydration completes */
		const hydrated = await flare.page.evaluate(
			() => (window as unknown as { __FLARE_HYDRATED__?: boolean }).__FLARE_HYDRATED__,
		)
		expect(hydrated).toBe(true)

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})
})

test.describe("Layout - CSR vs SSR consistency", () => {
	test("SSR renders layout structure", async ({ flare }) => {
		/* Fetch page directly to see SSR output */
		const response = await flare.page.request.get("/layout-tests/nested")
		const html = await response.text()

		/* SSR should include layout structure */
		expect(html).toContain('data-testid="layout-tests-wrapper"')
		expect(html).toContain('data-testid="nested-layout-wrapper"')
		expect(html).toContain('data-testid="nested-index"')
	})

	test("CSR navigation maintains layout structure", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Set marker for CSR detection */
		await flare.page.evaluate(() => {
			;(window as unknown as Record<string, boolean>).__CSR_MARKER__ = true
		})

		/* Navigate to layout tests via CSR */
		await flare.page.click('a[href="/layout-tests/nested"]')
		await flare.page.waitForURL("/layout-tests/nested")
		await flare.page.waitForLoadState("networkidle")

		/* Verify CSR (marker should still exist) */
		const markerExists = await flare.page.evaluate(
			() => (window as unknown as Record<string, boolean>).__CSR_MARKER__ === true,
		)
		expect(markerExists).toBe(true)

		/* Layouts should be rendered */
		await expect(flare.page.locator('[data-testid="layout-tests-wrapper"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="nested-layout-wrapper"]')).toBeVisible()

		flare.assertNoPageErrors()
	})
})
