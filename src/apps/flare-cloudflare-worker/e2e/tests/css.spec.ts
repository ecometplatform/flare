/**
 * CSS Prop E2E Tests
 *
 * Tests the css prop functionality for scoped inline styles.
 */

import { expect, test } from "@playwright/test"

test.describe("CSS Prop", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-test")
	})

	test("renders page with css prop elements", async ({ page }) => {
		await expect(page.locator("h1")).toContainText("CSS Prop Tests")
	})

	test("applies basic CSS colors", async ({ page }) => {
		const redText = page.locator('[data-testid="red-text"]')
		const blueText = page.locator('[data-testid="blue-text"]')

		/* Check computed colors */
		const redColor = await redText.evaluate((el) => getComputedStyle(el).color)
		const blueColor = await blueText.evaluate((el) => getComputedStyle(el).color)

		/* RGB values for red and blue */
		expect(redColor).toBe("rgb(255, 0, 0)")
		expect(blueColor).toBe("rgb(0, 0, 255)")
	})

	test("applies multiple CSS properties", async ({ page }) => {
		const styledBox = page.locator('[data-testid="styled-box"]')

		const styles = await styledBox.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				backgroundColor: computed.backgroundColor,
				borderRadius: computed.borderRadius,
				fontWeight: computed.fontWeight,
				padding: computed.padding,
			}
		})

		/* Yellow background */
		expect(styles.backgroundColor).toBe("rgb(255, 255, 0)")
		/* 16px padding */
		expect(styles.padding).toBe("16px")
		/* 8px border radius */
		expect(styles.borderRadius).toBe("8px")
		/* Bold font weight (700 or "bold") */
		expect(["700", "bold"]).toContain(styles.fontWeight)
	})

	test("applies CSS to nested elements independently", async ({ page }) => {
		const outerBox = page.locator('[data-testid="outer-box"]')
		const innerText = page.locator('[data-testid="inner-text"]')

		/* Outer box should have green border */
		const outerBorder = await outerBox.evaluate((el) => getComputedStyle(el).borderColor)
		expect(outerBorder).toContain("rgb(0, 128, 0)") /* green */

		/* Inner text should be purple */
		const innerColor = await innerText.evaluate((el) => getComputedStyle(el).color)
		expect(innerColor).toBe("rgb(128, 0, 128)") /* purple */

		/* Inner text should be 20px */
		const innerFontSize = await innerText.evaluate((el) => getComputedStyle(el).fontSize)
		expect(innerFontSize).toBe("20px")
	})

	test("applies dynamic CSS values", async ({ page }) => {
		const dynamicElement = page.locator('[data-testid="dynamic-css"]')

		const styles = await dynamicElement.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				color: computed.color,
				fontSize: computed.fontSize,
			}
		})

		expect(styles.fontSize).toBe("24px")
		expect(styles.color).toBe("rgb(255, 165, 0)") /* orange */
	})

	test("elements have data-c attribute for scoping", async ({ page }) => {
		const redText = page.locator('[data-testid="red-text"]')

		/* Check element has data-c attribute */
		const dataC = await redText.getAttribute("data-c")
		expect(dataC).toBeTruthy()
		expect(dataC!.length).toBeGreaterThan(0)
	})

	test("scoped styles are injected in head", async ({ page }) => {
		/* Check for scoped style tag */
		const scopedStyleTag = await page.evaluate(() => {
			const styleTag = document.getElementById("__FLARE_SCOPED__")
			return {
				content: styleTag?.textContent ?? "",
				exists: !!styleTag,
			}
		})

		expect(scopedStyleTag.exists).toBe(true)
		expect(scopedStyleTag.content.length).toBeGreaterThan(0)
		/* Should contain data-c selectors */
		expect(scopedStyleTag.content).toContain("[data-c=")
	})

	test("reset CSS is injected in head", async ({ page }) => {
		/* Check that reset CSS rules are applied */
		const hasResetStyles = await page.evaluate(() => {
			/* Check box-sizing is border-box (from reset) */
			const div = document.createElement("div")
			document.body.appendChild(div)
			const boxSizing = getComputedStyle(div).boxSizing
			document.body.removeChild(div)
			return boxSizing === "border-box"
		})

		expect(hasResetStyles).toBe(true)
	})

	test("different elements get different hashes for different CSS", async ({ page }) => {
		const redText = page.locator('[data-testid="red-text"]')
		const blueText = page.locator('[data-testid="blue-text"]')

		const redHash = await redText.getAttribute("data-c")
		const blueHash = await blueText.getAttribute("data-c")

		/* Different CSS should produce different hashes */
		expect(redHash).not.toBe(blueHash)
	})
})

test.describe("Tailwind tw Prop", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-test")
	})

	test("applies Tailwind colors via tw prop", async ({ page }) => {
		const twRedText = page.locator('[data-testid="tw-red-text"]')
		const twBlueText = page.locator('[data-testid="tw-blue-text"]')

		/* tw prop should be transformed to css prop, resulting in data-c attribute */
		const redDataC = await twRedText.getAttribute("data-c")
		const blueDataC = await twBlueText.getAttribute("data-c")

		expect(redDataC).toBeTruthy()
		expect(blueDataC).toBeTruthy()

		/* Check computed colors (Tailwind v4 uses oklch color format) */
		const redColor = await twRedText.evaluate((el) => getComputedStyle(el).color)
		const blueColor = await twBlueText.evaluate((el) => getComputedStyle(el).color)

		/* Tailwind v4 red-500 is oklch(0.637 0.237 25.331) or rgb equivalent */
		expect(redColor).toMatch(/oklch\(0\.6[34]\d|rgb\(239, 68, 68\)/)
		/* Tailwind v4 blue-500 is oklch(0.623 0.214 259.815) or rgb equivalent */
		expect(blueColor).toMatch(/oklch\(0\.6[12]\d|rgb\(59, 130, 246\)/)
	})

	test("applies multiple Tailwind classes", async ({ page }) => {
		const styledBox = page.locator('[data-testid="tw-styled-box"]')

		const styles = await styledBox.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				backgroundColor: computed.backgroundColor,
				borderRadius: computed.borderRadius,
				fontWeight: computed.fontWeight,
				padding: computed.padding,
			}
		})

		/* bg-yellow-200 (Tailwind v4 uses oklch) - just verify it's a yellowish color */
		expect(styles.backgroundColor).toMatch(/oklch\(0\.9|rgb\(254, 240, 138\)/)
		/* p-4 = 1rem = 16px */
		expect(styles.padding).toBe("16px")
		/* rounded-lg = 0.5rem = 8px */
		expect(styles.borderRadius).toBe("8px")
		/* font-bold = 700 */
		expect(["700", "bold"]).toContain(styles.fontWeight)
	})

	test("applies Tailwind flex layout", async ({ page }) => {
		const flexContainer = page.locator('[data-testid="tw-flex-container"]')

		const display = await flexContainer.evaluate((el) => getComputedStyle(el).display)
		expect(display).toBe("flex")

		/* Check gap (gap-4 = 1rem = 16px) */
		const gap = await flexContainer.evaluate((el) => getComputedStyle(el).gap)
		expect(gap).toBe("16px")
	})

	test("applies Tailwind font sizes", async ({ page }) => {
		const fontSizes = await page.evaluate(() => {
			const sizes: Record<string, string> = {}
			for (const size of ["xs", "sm", "base", "lg", "xl"]) {
				const el = document.querySelector(`[data-testid="tw-text-${size}"]`)
				if (el) {
					sizes[size] = getComputedStyle(el).fontSize
				}
			}
			return sizes
		})

		/* Tailwind v4 font sizes */
		expect(fontSizes.xs).toBe("12px") /* text-xs = 0.75rem */
		expect(fontSizes.sm).toBe("14px") /* text-sm = 0.875rem */
		expect(fontSizes.base).toBe("16px") /* text-base = 1rem */
		expect(fontSizes.lg).toBe("18px") /* text-lg = 1.125rem */
		expect(fontSizes.xl).toBe("20px") /* text-xl = 1.25rem */
	})

	test("tw prop elements have data-c attribute (transformed through css-scope)", async ({
		page,
	}) => {
		/* All tw elements should have data-c attribute after transform pipeline */
		const twElements = [
			'[data-testid="tw-red-text"]',
			'[data-testid="tw-blue-text"]',
			'[data-testid="tw-styled-box"]',
			'[data-testid="tw-flex-container"]',
		]

		for (const selector of twElements) {
			const el = page.locator(selector)
			const dataC = await el.getAttribute("data-c")
			expect(dataC, `${selector} should have data-c attribute`).toBeTruthy()
		}
	})
})

test.describe("Tailwind tw Prop - Dynamic Expressions", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/css-test")
	})

	test('tw={"..."} curly braces with string literal', async ({ page }) => {
		const el = page.locator('[data-testid="tw-curly-string"]')

		/* Should have data-c attribute (transformed) */
		const dataC = await el.getAttribute("data-c")
		expect(dataC).toBeTruthy()

		/* Should have green color and semibold font */
		const styles = await el.evaluate((el) => {
			const computed = getComputedStyle(el)
			return {
				color: computed.color,
				fontWeight: computed.fontWeight,
			}
		})

		/* text-green-500 */
		expect(styles.color).toMatch(/oklch|rgb/)
		/* font-semibold = 600 */
		expect(["600", "semi-bold"]).toContain(styles.fontWeight)
	})

	test("tw={ternary ? 'a' : 'b'} conditional expressions", async ({ page }) => {
		const trueEl = page.locator('[data-testid="tw-ternary-true"]')
		const falseEl = page.locator('[data-testid="tw-ternary-false"]')

		/* Both should have data-c attribute */
		expect(await trueEl.getAttribute("data-c")).toBeTruthy()
		expect(await falseEl.getAttribute("data-c")).toBeTruthy()

		/* Get background colors */
		const trueBg = await trueEl.evaluate((el) => getComputedStyle(el).backgroundColor)
		const falseBg = await falseEl.evaluate((el) => getComputedStyle(el).backgroundColor)

		/* Both should have background colors applied (emerald-200 and rose-200) */
		expect(trueBg).toMatch(/oklch|rgb/)
		expect(falseBg).toMatch(/oklch|rgb/)

		/* They should be different colors */
		expect(trueBg).not.toBe(falseBg)
	})

	test("tw={'' || 'fallback'} logical OR expressions", async ({ page }) => {
		const el = page.locator('[data-testid="tw-logical-or"]')

		/* Should have data-c attribute */
		const dataC = await el.getAttribute("data-c")
		expect(dataC).toBeTruthy()

		/* Should have indigo color (text-indigo-600) */
		const color = await el.evaluate((el) => getComputedStyle(el).color)
		expect(color).toMatch(/oklch|rgb/)
	})

	test("all dynamic tw expressions have data-c attributes", async ({ page }) => {
		const dynamicElements = [
			'[data-testid="tw-curly-string"]',
			'[data-testid="tw-ternary-true"]',
			'[data-testid="tw-ternary-false"]',
			'[data-testid="tw-logical-or"]',
		]

		for (const selector of dynamicElements) {
			const el = page.locator(selector)
			const dataC = await el.getAttribute("data-c")
			expect(dataC, `${selector} should have data-c attribute`).toBeTruthy()
		}
	})
})

test.describe("CSS Prop - Client Navigation", () => {
	test("styles persist after client-side navigation", async ({ page }) => {
		/* Start at home */
		await page.goto("/")

		/* Navigate to CSS test page via link */
		await page.click('a[href="/css-test"]')
		await page.waitForURL("/css-test")

		/* Verify styles are applied after client navigation */
		const redText = page.locator('[data-testid="red-text"]')
		const redColor = await redText.evaluate((el) => getComputedStyle(el).color)
		expect(redColor).toBe("rgb(255, 0, 0)")
	})

	test("styles work after navigating away and back", async ({ page }) => {
		/* Start at CSS test page */
		await page.goto("/css-test")

		/* Navigate away */
		await page.click('a[href="/"]')
		await page.waitForURL("/")

		/* Navigate back */
		await page.click('a[href="/css-test"]')
		await page.waitForURL("/css-test")

		/* Verify styles still work */
		const styledBox = page.locator('[data-testid="styled-box"]')
		const bgColor = await styledBox.evaluate((el) => getComputedStyle(el).backgroundColor)
		expect(bgColor).toBe("rgb(255, 255, 0)")
	})
})
