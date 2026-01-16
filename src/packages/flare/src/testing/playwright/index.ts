/**
 * Flare Playwright E2E Test Utilities
 *
 * Page object pattern for E2E tests with Flare applications.
 * Captures console errors, warnings, and page errors for verification.
 *
 * @example
 * import { test, expect, FlarePage } from "@ecomet/flare/testing/playwright"
 *
 * test("hydration works", async ({ flare }) => {
 *   await flare.goto("/")
 *   flare.assertNoHydrationErrors()
 *   const state = await flare.getFlareState()
 *   expect(state).toBeDefined()
 * })
 */

import { test as base, expect, type Locator, type Page } from "@playwright/test"

interface ConsoleMessage {
	type: "error" | "warning" | "log"
	text: string
}

interface PageError {
	message: string
	stack?: string
}

/**
 * Flare page object for E2E testing.
 * Provides utilities for navigation, state inspection, and error detection.
 */
class FlarePage {
	readonly page: Page

	/** Body element locator */
	readonly body: Locator

	/** Script containing self.flare state */
	readonly flareStateScript: Locator

	private consoleMessages: ConsoleMessage[] = []
	private pageErrors: PageError[] = []
	private listening = false

	constructor(page: Page) {
		this.page = page
		this.body = page.locator("body")
		this.flareStateScript = page.locator("script:has-text('self.flare')")
	}

	/**
	 * Start listening for console messages and page errors.
	 * Called automatically by goto(), but can be called manually for custom flows.
	 */
	startCapturing(): void {
		if (this.listening) return
		this.listening = true
		this.consoleMessages = []
		this.pageErrors = []

		this.page.on("console", (msg) => {
			const type = msg.type()
			if (type === "error" || type === "warning" || type === "log") {
				this.consoleMessages.push({
					text: msg.text(),
					type: type as "error" | "warning" | "log",
				})
			}
		})

		this.page.on("pageerror", (error) => {
			this.pageErrors.push({
				message: error.message,
				stack: error.stack,
			})
		})
	}

	/**
	 * Clear captured messages (call between navigation actions if needed)
	 */
	clearCaptures(): void {
		this.consoleMessages = []
		this.pageErrors = []
	}

	/**
	 * Navigate to a path and wait for body to be attached
	 */
	async goto(path: string = "/"): Promise<void> {
		this.startCapturing()
		await this.page.goto(path)
		await this.body.waitFor({ state: "attached", timeout: 15000 })
	}

	/**
	 * Get the FlareState object from the browser (self.flare)
	 */
	getFlareState(): Promise<unknown> {
		return this.page.evaluate(() => {
			return (window as unknown as { flare: unknown }).flare
		})
	}

	/**
	 * Wait for navigation to complete to a specific path
	 */
	async waitForNavigation(path: string): Promise<void> {
		await this.page.waitForURL(`**${path}`)
	}

	/**
	 * Click a link by its text content
	 */
	async clickLink(text: string): Promise<void> {
		await this.page.getByRole("link", { name: text }).click()
	}

	/**
	 * Get all captured console logs
	 */
	getConsoleLogs(): string[] {
		return this.consoleMessages.filter((m) => m.type === "log").map((m) => m.text)
	}

	/**
	 * Get all captured console errors
	 */
	getConsoleErrors(): string[] {
		return this.consoleMessages.filter((m) => m.type === "error").map((m) => m.text)
	}

	/**
	 * Get all captured console warnings
	 */
	getConsoleWarnings(): string[] {
		return this.consoleMessages.filter((m) => m.type === "warning").map((m) => m.text)
	}

	/**
	 * Get all captured page errors (uncaught exceptions)
	 */
	getPageErrors(): PageError[] {
		return this.pageErrors
	}

	/**
	 * Check if any hydration errors were captured.
	 * Detects common Solid.js hydration error patterns.
	 */
	hasHydrationErrors(): boolean {
		const allErrors = [...this.getConsoleErrors(), ...this.pageErrors.map((e) => e.message)]
		return allErrors.some(
			(e) =>
				e.toLowerCase().includes("hydration") ||
				e.toLowerCase().includes("mismatch") ||
				e.includes("Unable to find DOM nodes"),
		)
	}

	/**
	 * Get hydration error details if any
	 */
	getHydrationErrors(): string[] {
		const allErrors = [...this.getConsoleErrors(), ...this.pageErrors.map((e) => e.message)]
		return allErrors.filter(
			(e) =>
				e.toLowerCase().includes("hydration") ||
				e.toLowerCase().includes("mismatch") ||
				e.includes("Unable to find DOM nodes"),
		)
	}

	/**
	 * Assert no console errors occurred.
	 * @param ignorePatterns - RegExp patterns to ignore
	 */
	assertNoConsoleErrors(ignorePatterns: RegExp[] = []): void {
		const errors = this.getConsoleErrors().filter((e) => !ignorePatterns.some((p) => p.test(e)))
		if (errors.length > 0) {
			throw new Error(`Unexpected console errors:\n${errors.join("\n")}`)
		}
	}

	/**
	 * Assert no page errors (uncaught exceptions) occurred.
	 */
	assertNoPageErrors(): void {
		if (this.pageErrors.length > 0) {
			throw new Error(
				`Unexpected page errors:\n${this.pageErrors.map((e) => e.message).join("\n")}`,
			)
		}
	}

	/**
	 * Assert no hydration errors occurred.
	 */
	assertNoHydrationErrors(): void {
		const hydrationErrors = this.getHydrationErrors()
		if (hydrationErrors.length > 0) {
			const logs = this.getConsoleLogs()
			const logSection = logs.length > 0 ? `\n\nConsole logs:\n${logs.join("\n")}` : ""
			throw new Error(`Hydration errors detected:\n${hydrationErrors.join("\n")}${logSection}`)
		}
	}

	/**
	 * Assert page is healthy - no errors of any kind.
	 */
	assertHealthy(): void {
		this.assertNoHydrationErrors()
		this.assertNoPageErrors()
		this.assertNoConsoleErrors()
	}
}

/**
 * Extended Playwright test with Flare fixture.
 *
 * @example
 * import { test, expect } from "@ecomet/flare/testing/playwright"
 *
 * test("page loads", async ({ flare }) => {
 *   await flare.goto("/")
 *   flare.assertHealthy()
 * })
 */
const test = base.extend<{ flare: FlarePage }>({
	flare: async ({ page }, use) => {
		const flarePage = new FlarePage(page)
		flarePage.startCapturing()
		await use(flarePage)
	},
})

export type { ConsoleMessage, PageError }

export { expect, FlarePage, test }
