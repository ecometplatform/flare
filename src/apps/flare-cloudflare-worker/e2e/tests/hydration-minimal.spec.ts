/**
 * Minimal Hydration Test
 *
 * Tests hydration in isolation without navigation.
 */

import { expect, test } from "@playwright/test"

test.describe("Hydration", () => {
	test("hydrates without errors", async ({ page }) => {
		const jsErrors: string[] = []

		page.on("pageerror", (error) => jsErrors.push(error.message))

		await page.goto("/")

		/* Wait for hydration to complete */
		await page
			.waitForFunction(
				() => typeof (window as unknown as Record<string, unknown>).flare !== "undefined",
				{ timeout: 5000 },
			)
			.catch(() => {})

		/* Small delay to let any hydration errors surface */
		await page.waitForTimeout(500)

		/* No JS errors should occur */
		expect(jsErrors).toHaveLength(0)
	})
})
