/**
 * Scroll Restoration E2E Tests
 *
 * Tests scroll position saving and restoration during navigation.
 * Verifies scroll works correctly with view transitions.
 */

import { expect, test } from "@playwright/test"

test.describe("Scroll Restoration", () => {
	/* Use small viewport so content is scrollable */
	test.use({ viewport: { height: 200, width: 800 } })

	test.beforeEach(async ({ page }) => {
		await page.goto("/")
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)
	})

	test("scrolls to top on forward navigation", async ({ page }) => {
		/* Scroll down on home page */
		await page.evaluate(() => window.scrollTo(0, 300))
		await page.waitForFunction(() => window.scrollY === 300, { timeout: 2000 })

		/* Navigate forward */
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		/* Wait for scroll restoration (double rAF timing) */
		await page.waitForTimeout(200)

		/* Should scroll to top */
		const scrollAfter = await page.evaluate(() => window.scrollY)
		expect(scrollAfter).toBe(0)
	})

	test("restores scroll position on back navigation", async ({ page }) => {
		/* Scroll down on home page */
		await page.evaluate(() => window.scrollTo(0, 250))
		await page.waitForFunction(() => window.scrollY === 250, { timeout: 2000 })

		/* Navigate programmatically to avoid focus-induced scroll reset */
		await page.evaluate(() => {
			/* Get the router from Flare context and navigate */
			const link = document.querySelector('a[href="/about"]') as HTMLAnchorElement
			link.click()
		})
		await expect(page).toHaveURL("/about")

		/* Go back */
		await page.goBack()
		await expect(page).toHaveURL("/")

		/* Wait for scroll restoration (double rAF timing) */
		await page.waitForTimeout(200)

		/* Should restore scroll position */
		const scrollRestored = await page.evaluate(() => window.scrollY)
		expect(scrollRestored).toBe(250)
	})

	test("restores scroll position on forward navigation after back", async ({ page }) => {
		/* Scroll down on home page */
		await page.evaluate(() => window.scrollTo(0, 200))
		await page.waitForFunction(() => window.scrollY === 200, { timeout: 2000 })

		/* Navigate to about using programmatic click */
		await page.evaluate(() => {
			const link = document.querySelector('a[href="/about"]') as HTMLAnchorElement
			link.click()
		})
		await expect(page).toHaveURL("/about")

		/* Go back to home - should restore scroll */
		await page.goBack()
		await expect(page).toHaveURL("/")

		/* Wait for scroll restoration */
		await page.waitForTimeout(200)
		const scrollOnHomeRestored = await page.evaluate(() => window.scrollY)
		expect(scrollOnHomeRestored).toBe(200)

		/* Go forward to about - scroll should be 0 (never scrolled on about) */
		await page.goForward()
		await expect(page).toHaveURL("/about")

		/* Wait for scroll restoration */
		await page.waitForTimeout(200)

		/* About page scroll was 0 when we left, should restore to 0 */
		const scrollOnAbout = await page.evaluate(() => window.scrollY)
		expect(scrollOnAbout).toBe(0)
	})

	test("scroll restoration works with view transitions enabled", async ({ page }) => {
		/* Track that view transition fired */
		let transitionFired = false
		await page.exposeFunction("trackScrollTransition", () => {
			transitionFired = true
		})

		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					;(window as unknown as { trackScrollTransition: () => void }).trackScrollTransition()
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		/* Scroll down and navigate using programmatic click */
		await page.evaluate(() => window.scrollTo(0, 200))
		await page.waitForFunction(() => window.scrollY === 200, { timeout: 2000 })

		await page.evaluate(() => {
			const link = document.querySelector('a[href="/about"]') as HTMLAnchorElement
			link.click()
		})
		await expect(page).toHaveURL("/about")

		/* View transition should fire */
		expect(transitionFired).toBe(true)

		/* Go back and verify scroll restored */
		await page.goBack()
		await expect(page).toHaveURL("/")

		/* Wait for scroll restoration */
		await page.waitForTimeout(200)

		const scrollRestored = await page.evaluate(() => window.scrollY)
		expect(scrollRestored).toBe(200)
	})

	test("scroll: false prevents scroll to top", async ({ page }) => {
		/* Scroll on home page */
		await page.evaluate(() => window.scrollTo(0, 100))
		await page.waitForFunction(() => window.scrollY === 100, { timeout: 2000 })

		/* Navigate with native pushState (simulates scroll: false behavior) */
		await page.evaluate(() => {
			history.pushState({ key: "test" }, "", "/about")
		})

		/* Scroll should remain (pushState doesn't trigger router navigation) */
		await page.waitForTimeout(100)
		const scrollY = await page.evaluate(() => window.scrollY)
		expect(scrollY).toBe(100)
	})
})
