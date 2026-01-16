/**
 * Cross-Root Layout Navigation E2E Tests
 *
 * Tests navigation between different root layouts (_root_ and _admin_).
 * Verifies:
 * - Root layout switching on navigation
 * - Full document structure changes
 * - Loader data isolation between roots
 * - Head management across roots
 * - Back/forward navigation between roots
 * - No hydration errors
 * - SSR consistency
 */

import { expect, test } from "../fixtures/flare.fixture"

test.describe("Cross-Root Navigation - Basic", () => {
	test("navigates from _root_ to _admin_ root layout", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're in _root_ layout */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		/* Root layout marker should NOT exist (only _admin_ has it) */
		const rootMarker = await flare.page.locator('meta[name="root-layout-marker"]').count()
		expect(rootMarker).toBe(0)

		/* Click link to admin */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're now in _admin_ layout */
		await expect(flare.page.locator("h1")).toContainText("Admin Dashboard")
		await expect(flare.page.locator('[data-testid="admin-page-marker"]')).toBeVisible()

		/* Admin root layout marker should exist */
		const adminMarker = await flare.page
			.locator('meta[name="root-layout-marker"]')
			.getAttribute("content")
		expect(adminMarker).toBe("admin-root")

		/* Admin shell structure should be present */
		await expect(flare.page.locator('[data-testid="admin-header"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-footer"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("navigates from _admin_ to _root_ root layout", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're in _admin_ layout */
		await expect(flare.page.locator("h1")).toContainText("Admin Dashboard")
		await expect(flare.page.locator('[data-testid="admin-root-marker"]')).toContainText(
			"ROOT: admin",
		)

		/* Click link to public home */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're now in _root_ layout */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		/* Admin-specific elements should NOT exist */
		await expect(flare.page.locator('[data-testid="admin-header"]')).not.toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-footer"]')).not.toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-root-marker"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})

	test("navigates from _admin_ users to _root_ about", async ({ flare }) => {
		await flare.goto("/admin/users")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're in _admin_ layout with users page */
		await expect(flare.page.locator("h1")).toContainText("Users Management")
		await expect(flare.page.locator('[data-testid="users-table"]')).toBeVisible()

		/* Click link to public home */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Verify we're in _root_ layout */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - Document Structure", () => {
	test("html data attribute changes between root layouts", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin root should have data-root-layout="admin" on html */
		const adminHtmlAttr = await flare.page.locator("html").getAttribute("data-root-layout")
		expect(adminHtmlAttr).toBe("admin")

		/* Navigate to public */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Public root should NOT have data-root-layout (or different value) */
		const publicHtmlAttr = await flare.page.locator("html").getAttribute("data-root-layout")
		expect(publicHtmlAttr).toBeNull()

		flare.assertNoPageErrors()
	})

	test("body structure changes between root layouts", async ({ flare }) => {
		/* Start at admin */
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin body has specific testid */
		await expect(flare.page.locator('[data-testid="admin-body"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-shell"]')).toBeVisible()

		/* Navigate to public */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Admin body structure should be gone */
		await expect(flare.page.locator('[data-testid="admin-body"]')).not.toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-shell"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})

	test("meta tags switch between root layouts", async ({ flare }) => {
		/* Start at admin */
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin root layout meta should exist */
		const adminMeta = await flare.page
			.locator('meta[name="root-layout-marker"]')
			.getAttribute("content")
		expect(adminMeta).toBe("admin-root")

		/* Navigate to public */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Admin root layout meta should NOT exist */
		const publicMeta = await flare.page.locator('meta[name="root-layout-marker"]').count()
		expect(publicMeta).toBe(0)

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - Loader Data", () => {
	test("admin root loader data is available", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin header should show version from root loader */
		await expect(flare.page.locator('[data-testid="admin-version"]')).toContainText("Admin Panel v")

		/* Admin footer should have loaded timestamp */
		await expect(flare.page.locator('[data-testid="admin-loaded-at"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("admin page loader data is available", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Stats from page loader should be present */
		await expect(flare.page.locator('[data-testid="admin-stats"]')).toContainText(
			"Active Users: 42",
		)
		await expect(flare.page.locator('[data-testid="admin-stats"]')).toContainText(
			"Pending Orders: 7",
		)

		flare.assertNoPageErrors()
	})

	test("admin users page has its own loader data", async ({ flare }) => {
		await flare.goto("/admin/users")
		await flare.page.waitForLoadState("networkidle")

		/* Users data should be loaded */
		await expect(flare.page.locator('[data-testid="users-count"]')).toContainText("Total users: 3")
		await expect(flare.page.locator('[data-testid="user-row-1"]')).toContainText(
			"alice@example.com",
		)
		await expect(flare.page.locator('[data-testid="user-row-2"]')).toContainText("bob@example.com")

		flare.assertNoPageErrors()
	})

	test("admin settings page has its own loader data", async ({ flare }) => {
		await flare.goto("/admin/settings")
		await flare.page.waitForLoadState("networkidle")

		/* Settings data should be loaded */
		await expect(flare.page.locator('[data-testid="setting-theme"]')).toContainText("dark")
		await expect(flare.page.locator('[data-testid="setting-language"]')).toContainText("en")

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - Head Management", () => {
	test("title updates when navigating between roots", async ({ flare }) => {
		/* Start at public home */
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page).toHaveTitle(/Flare v2 Tests/)

		/* Navigate to admin */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Title should change to admin */
		await expect(flare.page).toHaveTitle(/Dashboard - Admin Panel/)

		/* Navigate back to public */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Title should be back to public */
		await expect(flare.page).toHaveTitle(/Flare v2 Tests/)

		flare.assertNoPageErrors()
	})

	test("meta description updates between roots", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin dashboard description */
		const adminDesc = await flare.page.locator('meta[name="description"]').getAttribute("content")
		expect(adminDesc).toBe("Admin dashboard overview")

		/* Navigate to public about */
		await flare.page.click('[data-testid="link-to-public-about"]')
		await flare.page.waitForURL("/about")
		await flare.page.waitForLoadState("networkidle")

		/* Public about description */
		const publicDesc = await flare.page.locator('meta[name="description"]').getAttribute("content")
		expect(publicDesc).toBe("Learn more about Flare v2 framework")

		flare.assertNoPageErrors()
	})

	test("head elements from different roots don't leak", async ({ flare }) => {
		/* Start at admin (has root-layout-marker meta) */
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		const adminMarkerCount = await flare.page.locator('meta[name="root-layout-marker"]').count()
		expect(adminMarkerCount).toBe(1)

		/* Navigate to public */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Admin's root-layout-marker should be removed */
		const publicMarkerCount = await flare.page.locator('meta[name="root-layout-marker"]').count()
		expect(publicMarkerCount).toBe(0)

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - History", () => {
	test("back button navigates from _admin_ to _root_", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to admin */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Verify admin */
		await expect(flare.page.locator('[data-testid="admin-page-marker"]')).toBeVisible()

		/* Go back */
		await flare.page.goBack()
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Should be back in _root_ */
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")
		await expect(flare.page.locator('[data-testid="admin-page-marker"]')).not.toBeVisible()

		flare.assertNoPageErrors()
	})

	test("forward button navigates from _root_ to _admin_", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to admin then back */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.goBack()
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Go forward */
		await flare.page.goForward()
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Should be back in _admin_ */
		await expect(flare.page.locator('[data-testid="admin-page-marker"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("complex back/forward between multiple root pages", async ({ flare }) => {
		/* Start: _root_ home */
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate: _root_ home -> _admin_ dashboard */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate: _admin_ dashboard -> _admin_ users */
		await flare.page.click('a[href="/admin/users"]')
		await flare.page.waitForURL("/admin/users")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate: _admin_ users -> _root_ home */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		/* Back: _root_ home <- _admin_ users */
		await flare.page.goBack()
		await flare.page.waitForURL("/admin/users")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator('[data-testid="admin-users"]')).toBeVisible()

		/* Back: _admin_ users <- _admin_ dashboard */
		await flare.page.goBack()
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator('[data-testid="admin-dashboard"]')).toBeVisible()

		/* Back: _admin_ dashboard <- _root_ home */
		await flare.page.goBack()
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator("h1")).toContainText("Flare v2 Test Pages")

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - Hydration", () => {
	test("admin root layout hydrates without errors", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Wait for hydration */
		const hydrated = await flare.page.evaluate(
			() => (window as unknown as { __FLARE_HYDRATED__?: boolean }).__FLARE_HYDRATED__,
		)
		expect(hydrated).toBe(true)

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})

	test("cross-root navigation doesn't cause hydration errors", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Navigate to admin */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()

		/* Navigate back */
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")
		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})

	test("multiple cross-root round trips don't cause errors", async ({ flare }) => {
		await flare.goto("/")
		await flare.page.waitForLoadState("networkidle")

		/* Round trip 1 */
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")

		/* Round trip 2 */
		await flare.page.click('[data-testid="link-to-admin-users"]')
		await flare.page.waitForURL("/admin/users")
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")

		/* Round trip 3 */
		await flare.page.click('[data-testid="link-to-admin-settings"]')
		await flare.page.waitForURL("/admin/settings")
		await flare.page.click('[data-testid="link-to-public-home"]')
		await flare.page.waitForURL("/")

		await flare.page.waitForLoadState("networkidle")

		flare.assertNoHydrationErrors()
		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - SSR", () => {
	test("admin pages render correctly via SSR", async ({ flare }) => {
		/* Fetch admin page directly to see SSR output */
		const response = await flare.page.request.get("/admin")
		const html = await response.text()

		/* SSR should include admin structure */
		expect(html).toContain('data-root-layout="admin"')
		expect(html).toContain('data-testid="admin-shell"')
		expect(html).toContain('data-testid="admin-header"')
		expect(html).toContain('data-testid="admin-footer"')
		expect(html).toContain("Admin Dashboard")
	})

	test("admin users page SSR includes loader data", async ({ flare }) => {
		const response = await flare.page.request.get("/admin/users")
		const html = await response.text()

		/* SSR should include users data */
		expect(html).toContain("Users Management")
		expect(html).toContain("alice@example.com")
		expect(html).toContain("bob@example.com")
		expect(html).toContain("charlie@example.com")
	})

	test("SSR vs CSR consistency for admin pages", async ({ flare }) => {
		/* Get SSR HTML */
		const ssrResponse = await flare.page.request.get("/admin")
		const ssrHtml = await ssrResponse.text()

		/* Navigate via CSR */
		await flare.goto("/")
		await flare.page.click('[data-testid="link-to-admin"]')
		await flare.page.waitForURL("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Both should have same structure */
		const csrHtml = await flare.page.content()

		/* Key elements should match */
		expect(ssrHtml).toContain('data-testid="admin-dashboard"')
		expect(csrHtml).toContain('data-testid="admin-dashboard"')

		expect(ssrHtml).toContain('data-testid="admin-stats"')
		expect(csrHtml).toContain('data-testid="admin-stats"')

		flare.assertNoPageErrors()
	})
})

test.describe("Cross-Root Navigation - NDJSON Protocol", () => {
	test("NDJSON request to admin page returns correct format", async ({ request }) => {
		const response = await request.get("/admin", {
			headers: {
				"x-d": "1",
			},
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Should end with done message */
		expect(lines[lines.length - 1]).toBe('{"t":"d"}')

		/* Should have loader messages */
		const loaderMsgs = lines
			.slice(0, -1)
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l")

		expect(loaderMsgs.length).toBeGreaterThan(0)
	})

	test("NDJSON request includes admin root layout data", async ({ request }) => {
		const response = await request.get("/admin", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find root layout loader message */
		const loaderMsgs = lines
			.map((line) => JSON.parse(line))
			.filter((msg) => msg.t === "l" && msg.m?.includes("_admin_"))

		expect(loaderMsgs.length).toBeGreaterThan(0)
	})

	test("NDJSON head message includes admin page title", async ({ request }) => {
		const response = await request.get("/admin", {
			headers: {
				"x-d": "1",
			},
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		/* Find head message */
		const headMsgs = lines.map((line) => JSON.parse(line)).filter((msg) => msg.t === "h")

		expect(headMsgs.length).toBeGreaterThan(0)

		/* One of the head messages should have admin title */
		const hasAdminTitle = headMsgs.some((msg) => msg.d?.title?.includes("Admin"))
		expect(hasAdminTitle).toBe(true)
	})
})

test.describe("Cross-Root Navigation - Within Admin", () => {
	test("navigates between admin pages without leaving root", async ({ flare }) => {
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")

		/* Admin shell should exist */
		await expect(flare.page.locator('[data-testid="admin-shell"]')).toBeVisible()

		/* Navigate to users */
		await flare.page.click('a[href="/admin/users"]')
		await flare.page.waitForURL("/admin/users")
		await flare.page.waitForLoadState("networkidle")

		/* Admin shell should still exist */
		await expect(flare.page.locator('[data-testid="admin-shell"]')).toBeVisible()
		await expect(flare.page.locator('[data-testid="admin-header"]')).toBeVisible()

		/* Navigate to settings */
		await flare.page.click('a[href="/admin/settings"]')
		await flare.page.waitForURL("/admin/settings")
		await flare.page.waitForLoadState("networkidle")

		/* Admin shell should still exist */
		await expect(flare.page.locator('[data-testid="admin-shell"]')).toBeVisible()

		flare.assertNoPageErrors()
	})

	test("admin pages share root layout structure", async ({ flare }) => {
		/* Check dashboard has admin header */
		await flare.goto("/admin")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator('[data-testid="admin-version"]')).toBeVisible()

		/* Check users page also has admin header */
		await flare.page.click('a[href="/admin/users"]')
		await flare.page.waitForURL("/admin/users")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator('[data-testid="admin-version"]')).toBeVisible()

		/* Check settings page also has admin header */
		await flare.page.click('a[href="/admin/settings"]')
		await flare.page.waitForURL("/admin/settings")
		await flare.page.waitForLoadState("networkidle")
		await expect(flare.page.locator('[data-testid="admin-version"]')).toBeVisible()

		flare.assertNoPageErrors()
	})
})
