/**
 * View Transitions E2E Tests
 *
 * Tests view transitions API integration with navigation.
 * Verifies direction detection, data attributes, and smooth transitions.
 */

import { expect, test } from "@playwright/test"

test.describe("View Transitions", () => {
	test.beforeEach(async ({ page }) => {
		/* Navigate to home and wait for hydration */
		await page.goto("/")
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)
	})

	test("triggers view transition on forward navigation", async ({ page }) => {
		/* Track startViewTransition calls */
		let transitionCalled = false

		await page.exposeFunction("trackTransition", () => {
			transitionCalled = true
		})

		/* Inject tracking before navigation */
		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					;(window as unknown as { trackTransition: () => void }).trackTransition()
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		/* Navigate forward */
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		/* Verify transition was triggered */
		expect(transitionCalled).toBe(true)
	})

	test("sets forward direction on link click navigation", async ({ page }) => {
		/* Capture direction during transition */
		let capturedDirection: string | undefined

		await page.exposeFunction("captureDirection", (direction: string) => {
			capturedDirection = direction
		})

		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					const direction = document.documentElement.dataset.transitionDirection
					;(window as unknown as { captureDirection: (d: string) => void }).captureDirection(
						direction ?? "",
					)
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		expect(capturedDirection).toBe("forward")
	})

	test("direction attribute is set to forward during transition", async ({ page }) => {
		/* Check direction attribute is set during transition */
		let directionDuringTransition: string | undefined

		await page.exposeFunction("captureDirectionAttr", (direction: string) => {
			directionDuringTransition = direction
		})

		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					/* Capture direction right when transition starts */
					const direction = document.documentElement.dataset.transitionDirection
					;(
						window as unknown as { captureDirectionAttr: (d: string) => void }
					).captureDirectionAttr(direction ?? "none")
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		expect(directionDuringTransition).toBe("forward")
	})

	test("navigation works correctly with view transitions enabled", async ({ page }) => {
		/* Collect any JS errors */
		const jsErrors: string[] = []
		page.on("pageerror", (error) => jsErrors.push(error.message))

		/* Set marker to detect full page reload */
		await page.evaluate(() => {
			;(window as unknown as Record<string, boolean>).__VT_MARKER__ = true
		})

		/* Navigate to about */
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")
		await expect(page.locator("h1")).toContainText("About Flare v2")

		/* Go back to home */
		await page.goBack()
		await expect(page).toHaveURL("/")
		await expect(page.locator("h1")).toContainText("Flare v2 Test Pages")

		/* Navigate to products from home */
		await page.click("text=Product 123")
		await expect(page).toHaveURL("/products/123")
		await expect(page.locator("h1")).toContainText("Product 123")

		/* Verify no full page reload */
		const markerExists = await page.evaluate(
			() => (window as unknown as Record<string, boolean>).__VT_MARKER__ === true,
		)

		expect(jsErrors).toHaveLength(0)
		expect(markerExists).toBe(true)
	})

	test("view transitions work with nested route navigation", async ({ page }) => {
		/* Navigate to nested product page */
		await page.click("text=Product 123")
		await expect(page).toHaveURL("/products/123")

		/* Wait for hydration */
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Track if transition fires on next navigation */
		let transitionFired = false

		await page.exposeFunction("trackNestedTransition", () => {
			transitionFired = true
		})

		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					;(window as unknown as { trackNestedTransition: () => void }).trackNestedTransition()
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		/* Navigate to another product */
		await page.click("text=Product 999")
		await expect(page).toHaveURL("/products/999")

		expect(transitionFired).toBe(true)
	})

	test("respects prefers-reduced-motion", async ({ page }) => {
		/* Emulate reduced motion preference */
		await page.emulateMedia({ reducedMotion: "reduce" })

		/* Reload to pick up media query */
		await page.goto("/")
		await page.waitForFunction(
			() => (window as unknown as Record<string, boolean>).__FLARE_HYDRATED__ === true,
			{ timeout: 5000 },
		)

		/* Track if startViewTransition is called */
		let transitionCalled = false

		await page.exposeFunction("trackReducedMotion", () => {
			transitionCalled = true
		})

		await page.evaluate(() => {
			const originalStartViewTransition = document.startViewTransition
			if (originalStartViewTransition) {
				document.startViewTransition = (callbackOrOptions) => {
					;(window as unknown as { trackReducedMotion: () => void }).trackReducedMotion()
					return originalStartViewTransition.call(document, callbackOrOptions)
				}
			}
		})

		/* Navigate */
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		/* View transition should NOT be called due to reduced motion */
		expect(transitionCalled).toBe(false)
	})

	test("no JS errors during view transition navigation", async ({ page }) => {
		const jsErrors: string[] = []
		const consoleErrors: string[] = []

		page.on("pageerror", (error) => jsErrors.push(error.message))
		page.on("console", (msg) => {
			if (msg.type() === "error") consoleErrors.push(msg.text())
		})

		/* Navigate multiple times */
		await page.click('a[href="/about"]')
		await expect(page).toHaveURL("/about")

		await page.goBack()
		await expect(page).toHaveURL("/")

		await page.click("text=Product 123")
		await expect(page).toHaveURL("/products/123")

		await page.click("text=Back to Home")
		await expect(page).toHaveURL("/")

		/* No errors should occur */
		expect(jsErrors).toHaveLength(0)
		expect(consoleErrors).toHaveLength(0)
	})
})
