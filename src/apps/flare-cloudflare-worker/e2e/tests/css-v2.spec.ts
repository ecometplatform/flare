/**
 * CSS v2 API E2E Tests
 *
 * Tests the css() function with state and variables.
 */

import { expect, test } from "@playwright/test"

test.describe("CSS v2 - Basic Rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("renders page with css() styled elements", async ({ page }) => {
		await expect(page.locator("h1")).toContainText("CSS v2 API Test")
	})

	test("elements have data-c attribute with component name", async ({ page }) => {
		/* All css() calls should add data-c with the component name */
		const page_ = page.locator('[data-c="css-v2-page"]')
		const title = page.locator('[data-c="css-v2-title"]')
		const controls = page.locator('[data-c="css-v2-controls"]')
		const demo = page.locator('[data-c="css-v2-demo"]')
		const products = page.locator('[data-c="css-v2-products"]')
		const simpleBox = page.locator('[data-c="css-v2-simple-box"]')

		await expect(page_).toBeVisible()
		await expect(title).toBeVisible()
		await expect(controls).toBeVisible()
		await expect(demo).toBeVisible()
		await expect(products).toBeVisible()
		await expect(simpleBox).toBeVisible()
	})

	test("applies basic styles from css() string", async ({ page }) => {
		const simpleBox = page.locator('[data-c="css-v2-simple-box"]')

		const styles = await simpleBox.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				backgroundColor: computed.backgroundColor,
				borderRadius: computed.borderRadius,
				padding: computed.padding,
				textAlign: computed.textAlign,
			}
		})

		/* padding: 1rem = 16px */
		expect(styles.padding).toBe("16px")
		/* border-radius: 8px */
		expect(styles.borderRadius).toBe("8px")
		/* background: #e0e0e0 = rgb(224, 224, 224) */
		expect(styles.backgroundColor).toBe("rgb(224, 224, 224)")
		/* text-align: center */
		expect(styles.textAlign).toBe("center")
	})

	test("applies styles from css() config object", async ({ page }) => {
		const pageEl = page.locator('[data-c="css-v2-page"]')

		const styles = await pageEl.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				fontFamily: computed.fontFamily,
				margin: computed.margin,
				maxWidth: computed.maxWidth,
				padding: computed.padding,
			}
		})

		/* padding: 2rem = 32px */
		expect(styles.padding).toBe("32px")
		/* max-width: 800px */
		expect(styles.maxWidth).toBe("800px")
		/* margin: 0 auto */
		expect(styles.margin).toMatch(/0px/)
	})
})

test.describe("CSS v2 - State Attributes", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("adds data-* attributes for state", async ({ page }) => {
		/* Demo section has loading state */
		const demo = page.locator('[data-c="css-v2-demo"]')
		const loadingAttr = await demo.getAttribute("data-loading")
		expect(loadingAttr).toBe("false")
	})

	test("product items have active state attribute", async ({ page }) => {
		const items = page.locator('[data-c="css-v2-product-item"]')

		/* First item should be active (activeIndex = 0 by default) */
		const firstItem = items.nth(0)
		const secondItem = items.nth(1)
		const thirdItem = items.nth(2)

		expect(await firstItem.getAttribute("data-active")).toBe("true")
		expect(await secondItem.getAttribute("data-active")).toBe("false")
		expect(await thirdItem.getAttribute("data-active")).toBe("false")
	})

	test("state styles are applied correctly", async ({ page }) => {
		const items = page.locator('[data-c="css-v2-product-item"]')

		/* Active item (first) should have highlight background */
		const firstItem = items.nth(0)
		const secondItem = items.nth(1)

		const firstBg = await firstItem.evaluate((el) => getComputedStyle(el).backgroundColor)
		const secondBg = await secondItem.evaluate((el) => getComputedStyle(el).backgroundColor)

		/* Active item has colored background (blue by default) */
		expect(firstBg).toContain("rgb(59, 130, 246)")
		/* Inactive item has transparent/no background */
		expect(secondBg).toMatch(/rgba?\(0, 0, 0, 0\)|transparent/)
	})

	test("clicking item changes active state", async ({ page }) => {
		const items = page.locator('[data-c="css-v2-product-item"]')
		const secondItem = items.nth(1)

		/* Initially second item is not active */
		expect(await secondItem.getAttribute("data-active")).toBe("false")

		/* Wait for hydration to complete before clicking */
		await page
			.waitForFunction(
				() => {
					return (
						document.querySelector('[data-c="css-v2-product-item"]')?.onclick !== null ||
						(window as unknown as { _$HY?: { completed?: WeakSet<Element> } })._$HY?.completed !==
							undefined
					)
				},
				{ timeout: 5000 },
			)
			.catch(() => {})
		await page.waitForTimeout(100)

		/* Click second item */
		await secondItem.click()

		/* Wait for state to update */
		await expect(secondItem).toHaveAttribute("data-active", "true", { timeout: 2000 })

		/* First item should no longer be active */
		const firstItem = items.nth(0)
		expect(await firstItem.getAttribute("data-active")).toBe("false")
	})
})

test.describe("CSS v2 - CSS Variables", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("elements have style attribute with CSS variables", async ({ page }) => {
		const title = page.locator('[data-c="css-v2-title"]')

		/* Title should have CSS variable for color */
		const style = await title.getAttribute("style")
		expect(style).toContain("--_")
	})

	test("CSS variables control dynamic values", async ({ page }) => {
		const title = page.locator('[data-c="css-v2-title"]')

		/* Default accent color is #3b82f6 (blue) */
		const color = await title.evaluate((el) => getComputedStyle(el).color)
		expect(color).toBe("rgb(59, 130, 246)")
	})

	test("changing color picker updates CSS variable", async ({ page }) => {
		const title = page.locator('[data-c="css-v2-title"]')
		const colorPicker = page.locator('input[type="color"]')

		/* Change color to red */
		await colorPicker.fill("#ff0000")

		/* Title color should update */
		const color = await title.evaluate((el) => getComputedStyle(el).color)
		expect(color).toBe("rgb(255, 0, 0)")
	})

	test("product items use CSS variable for highlight", async ({ page }) => {
		const items = page.locator('[data-c="css-v2-product-item"]')
		const firstItem = items.nth(0)

		/* First item should have the highlight color from CSS variable */
		const style = await firstItem.getAttribute("style")
		expect(style).toContain("--_")

		/* Verify the background uses a CSS variable */
		const bg = await firstItem.evaluate((el) => getComputedStyle(el).backgroundColor)
		/* Should have the default blue color */
		expect(bg).toBe("rgb(59, 130, 246)")
	})
})

test.describe("CSS v2 - Loading State", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("toggle loading changes opacity", async ({ page }) => {
		const demo = page.locator('[data-c="css-v2-demo"]')
		const toggleButton = page.getByRole("button", { name: /Toggle Loading/i })

		/* Initially not loading - opacity should be 1 */
		const initialOpacity = await demo.evaluate((el) => getComputedStyle(el).opacity)
		expect(initialOpacity).toBe("1")

		/* Click toggle */
		await toggleButton.click()

		/* Now loading - opacity should be 0.5 */
		const loadingOpacity = await demo.evaluate((el) => getComputedStyle(el).opacity)
		expect(loadingOpacity).toBe("0.5")

		/* Data attribute should also update */
		expect(await demo.getAttribute("data-loading")).toBe("true")
	})

	test("loading state disables pointer events", async ({ page }) => {
		const demo = page.locator('[data-c="css-v2-demo"]')
		const toggleButton = page.getByRole("button", { name: /Toggle Loading/i })

		/* Enable loading */
		await toggleButton.click()

		/* Pointer events should be disabled */
		const pointerEvents = await demo.evaluate((el) => getComputedStyle(el).pointerEvents)
		expect(pointerEvents).toBe("none")
	})
})

test.describe("CSS v2 - Scoped Styles in Head", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("scoped styles are injected in head", async ({ page }) => {
		const styleInfo = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return {
				content: styleTag?.textContent ?? "",
				exists: !!styleTag,
			}
		})

		expect(styleInfo.exists).toBe(true)
		expect(styleInfo.content.length).toBeGreaterThan(0)
	})

	test("style tag contains css-v2 selectors", async ({ page }) => {
		const content = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return styleTag?.textContent ?? ""
		})

		/* Should contain our component selectors */
		expect(content).toContain('[data-c="css-v2-page"]')
		expect(content).toContain('[data-c="css-v2-title"]')
		expect(content).toContain('[data-c="css-v2-simple-box"]')
	})

	test("style tag contains state selectors", async ({ page }) => {
		const content = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return styleTag?.textContent ?? ""
		})

		/* Should contain state-based selectors */
		expect(content).toContain('[data-active="true"]')
		expect(content).toContain('[data-active="false"]')
		expect(content).toContain('[data-loading="true"]')
	})
})

test.describe("CSS v2 - Client Navigation", () => {
	test("styles persist after client-side navigation", async ({ page }) => {
		/* Start at home */
		await page.goto("/")

		/* Navigate to CSS v2 test page via link */
		await page.click('a[href="/css-v2-test"]')
		await page.waitForURL("/css-v2-test")

		/* Verify styles are applied */
		const simpleBox = page.locator('[data-c="css-v2-simple-box"]')
		const bg = await simpleBox.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bg).toBe("rgb(224, 224, 224)")
	})

	test("state interaction works after client navigation", async ({ page }) => {
		/* Navigate to page */
		await page.goto("/")
		await page.click('a[href="/css-v2-test"]')
		await page.waitForURL("/css-v2-test")

		/* Click second product item */
		const items = page.locator('[data-c="css-v2-product-item"]')
		await items.nth(1).click()

		/* Verify state changed */
		expect(await items.nth(0).getAttribute("data-active")).toBe("false")
		expect(await items.nth(1).getAttribute("data-active")).toBe("true")
	})
})

test.describe("CSS v2 - Hover States", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("hover styles are defined in stylesheet", async ({ page }) => {
		/* Verify hover styles exist in the stylesheet */
		const content = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return styleTag?.textContent ?? ""
		})

		/* Should contain hover selector for inactive items */
		expect(content).toContain('[data-active="false"]:hover')
		expect(content).toContain("#f0f0f0")
	})
})

test.describe("CSS v2 - Tailwind Integration (tw option)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("tw-only element renders with correct styles", async ({ page }) => {
		const twOnly = page.locator('[data-c="css-v2-tw-only"]')
		await expect(twOnly).toBeVisible()

		const styles = await twOnly.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				display: computed.display,
				gap: computed.gap,
				padding: computed.padding,
			}
		})

		expect(styles.display).toBe("flex")
		expect(styles.gap).toBe("16px") // 1rem
		expect(styles.padding).toBe("16px")
	})

	test("tw + css element combines both styles", async ({ page }) => {
		const twCss = page.locator('[data-c="css-v2-tw-css"]')
		await expect(twCss).toBeVisible()

		const styles = await twCss.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				alignItems: computed.alignItems,
				background: computed.backgroundColor,
				borderColor: computed.borderColor,
				display: computed.display,
			}
		})

		// From tw
		expect(styles.display).toBe("flex")
		expect(styles.alignItems).toBe("center")
		// From css
		expect(styles.background).toBe("rgb(254, 243, 199)") // #fef3c7
		expect(styles.borderColor).toBe("rgb(245, 158, 11)") // #f59e0b
	})

	test("tw + state element has data-* attributes and state styles", async ({ page }) => {
		const twState = page.locator('[data-c="css-v2-tw-state"]')
		await expect(twState).toBeVisible()

		// Check data attribute exists
		const selectedAttr = await twState.getAttribute("data-selected")
		expect(selectedAttr).toBe("true") // Initially activeIndex is 0

		// Check it has styles from tw
		const padding = await twState.evaluate((el) => getComputedStyle(el).padding)
		expect(padding).toBe("16px") // 1rem from tw

		// Check state-based styles are applied
		const bgSelected = await twState.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bgSelected).toBe("rgb(219, 234, 254)") // #dbeafe when selected

		// Wait for hydration before clicking
		await page.waitForTimeout(100)

		// Click to toggle
		await twState.click()

		// Wait for state to update
		await expect(twState).toHaveAttribute("data-selected", "false", { timeout: 2000 })

		// Move mouse away to remove :hover state, then wait for transition
		await page.mouse.move(0, 0)
		await page.waitForTimeout(300)

		// Verify the background - should be white (from base CSS) when not selected
		const bgNotSelected = await twState.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bgNotSelected).toBe("rgb(255, 255, 255)") // white when not selected (not hovering)
	})

	test("tw + vars element has CSS variables and dynamic styles", async ({ page }) => {
		const twVars = page.locator('[data-c="css-v2-tw-vars"]')
		await expect(twVars).toBeVisible()

		// Check style attribute has CSS vars
		const styleAttr = await twVars.getAttribute("style")
		expect(styleAttr).toContain("--_")

		// Check tw styles (grid)
		const display = await twVars.evaluate((el) => getComputedStyle(el).display)
		expect(display).toBe("grid")

		// Check vars-based styles (background from accentColor)
		const bg = await twVars.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bg).toBe("rgb(59, 130, 246)") // default #3b82f6

		// Change color picker and verify update
		const colorPicker = page.locator('input[type="color"]')
		await colorPicker.fill("#ff0000")

		const bgAfter = await twVars.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bgAfter).toBe("rgb(255, 0, 0)")
	})

	test("tw + css + state + vars (full combo) works correctly", async ({ page }) => {
		const twFull = page.locator('[data-c="css-v2-tw-full"]')
		await expect(twFull).toBeVisible()

		// Check tw styles
		const padding = await twFull.evaluate((el) => getComputedStyle(el).padding)
		expect(padding).toBe("16px")

		// Check vars-based border
		const border = await twFull.evaluate((el) => getComputedStyle(el).borderColor)
		expect(border).toBe("rgb(59, 130, 246)") // default accent

		// Check state (initially not loading)
		expect(await twFull.getAttribute("data-active")).toBe("false")

		// Wait for hydration before clicking
		await page.waitForTimeout(100)

		// Toggle loading
		const toggleBtn = page.getByRole("button", { name: /Toggle Loading/i })
		await toggleBtn.click()

		// Wait for state to update
		await expect(twFull).toHaveAttribute("data-active", "true", { timeout: 2000 })

		// Wait for CSS to recompute with the new state
		await page
			.waitForFunction(
				() => {
					const el = document.querySelector('[data-c="css-v2-tw-full"]')
					// The background should be the accent color (blue) when active
					return el && getComputedStyle(el).backgroundColor === "rgb(59, 130, 246)"
				},
				{ timeout: 2000 },
			)
			.catch(() => {})

		// State styles should apply
		const bgActive = await twFull.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bgActive).toBe("rgb(59, 130, 246)") // accent color when active
	})

	test("tw styles are in the scoped stylesheet", async ({ page }) => {
		const content = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return styleTag?.textContent ?? ""
		})

		// Should contain tw element selectors
		expect(content).toContain('[data-c="css-v2-tw-only"]')
		expect(content).toContain('[data-c="css-v2-tw-css"]')
		expect(content).toContain('[data-c="css-v2-tw-state"]')
		expect(content).toContain('[data-c="css-v2-tw-vars"]')
		expect(content).toContain('[data-c="css-v2-tw-full"]')

		// Should contain styles from tw
		expect(content).toContain("display:flex")
		expect(content).toContain("display:grid")
	})
})

test.describe("CSS v2 - Outer CSS", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-v2-test")
	})

	test("outer CSS demo section exists", async ({ page }) => {
		const demo = page.locator('[data-c="css-v2-outer-demo"]')
		await expect(demo).toBeVisible()
	})

	test("cards are rendered in the demo section", async ({ page }) => {
		/* Cards have different data-c values when outer CSS is used (includes hash) */
		/* Find cards by their parent grid */
		const grid = page.locator('[data-c="css-v2-card-grid"]')
		const cards = grid.locator(":scope > div")
		await expect(cards).toHaveCount(3)
	})

	test("default card has base styles (white background)", async ({ page }) => {
		/* Default card has no outer CSS, so uses exact name "css-v2-card" */
		const defaultCard = page.locator('[data-c="css-v2-card"]')

		const bg = await defaultCard.evaluate((el) => getComputedStyle(el).backgroundColor)
		/* white = rgb(255, 255, 255) */
		expect(bg).toBe("rgb(255, 255, 255)")
	})

	test("styled card has outer CSS applied (blue background)", async ({ page }) => {
		/* Cards with outer CSS get a hashed name like "css-v2-card-xyz" */
		/* Find card by its h4 title, then get the parent card element */
		const styledCardTitle = page
			.locator('[data-c="css-v2-card-title"]')
			.filter({ hasText: "Styled Card" })
		const styledCard = styledCardTitle.locator("..")

		const bg = await styledCard.evaluate((el) => getComputedStyle(el).backgroundColor)
		/* #e8f4ff = rgb(232, 244, 255) - outer CSS overrides inner white */
		expect(bg).toBe("rgb(232, 244, 255)")
	})

	test("shadow card has outer CSS applied (box-shadow)", async ({ page }) => {
		/* Find card by its h4 title, then get the parent card element */
		const shadowCardTitle = page
			.locator('[data-c="css-v2-card-title"]')
			.filter({ hasText: "Shadow Card" })
		const shadowCard = shadowCardTitle.locator("..")

		const shadow = await shadowCard.evaluate((el) => getComputedStyle(el).boxShadow)
		/* Should have a shadow defined */
		expect(shadow).not.toBe("none")
		expect(shadow).toContain("rgba(0, 0, 0")
	})

	test("direct outer CSS works without component wrapper", async ({ page }) => {
		/* This tests outer CSS passed directly, not via props */
		const directOuter = page.locator('[data-c^="css-v2-direct-outer"]')

		await expect(directOuter).toBeVisible()

		/* Check the data-c attribute - should have hash if outer CSS works */
		const dataCValue = await directOuter.getAttribute("data-c")
		expect(dataCValue).toMatch(/css-v2-direct-outer-[a-z0-9]+/)

		/* Check background - should be pink (#ffcccc = rgb(255, 204, 204)) */
		const bg = await directOuter.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bg).toBe("rgb(255, 204, 204)")
	})

	test("style prop merges with CSS vars", async ({ page }) => {
		const styleMerge = page.locator('[data-c="css-v2-style-merge"]')

		await expect(styleMerge).toBeVisible()

		/* Check that style has both CSS vars and style props */
		const styleAttr = await styleMerge.getAttribute("style")
		expect(styleAttr).toContain("--_") /* CSS var from vars */
		expect(styleAttr).toContain("opacity") /* From style prop */

		/* Check computed styles */
		const computed = await styleMerge.evaluate((el) => {
			const cs = getComputedStyle(el)
			return {
				background: cs.backgroundColor,
				border: cs.border,
				opacity: cs.opacity,
			}
		})

		expect(computed.opacity).toBe("0.9")
		expect(computed.background).toBe("rgb(224, 255, 224)") /* #e0ffe0 */
		expect(computed.border).toContain("dashed")
	})

	test("outer CSS generates unique selector names", async ({ page }) => {
		/* Check that cards with outer CSS have hashed names */
		const content = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return styleTag?.textContent ?? ""
		})

		/* Should contain the base card selector */
		expect(content).toContain('[data-c="css-v2-card"]')
		/* Should contain hashed selectors for cards with outer CSS */
		expect(content).toMatch(/\[data-c="css-v2-card-[a-z0-9]+"\]/)
	})
})
