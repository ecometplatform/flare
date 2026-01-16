/**
 * Playwright E2E Test Config
 *
 * Runs against the local Vite dev server.
 */

import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	expect: {
		timeout: 10000,
	},
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	outputDir: "./results",
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	reporter: process.env.CI ? "github" : "list",
	retries: process.env.CI ? 2 : 0,
	testDir: "./tests",
	timeout: 30000,
	use: {
		baseURL: "http://localhost:5191",
		screenshot: "only-on-failure",
		trace: "on-first-retry",
		video: "retain-on-failure",
	},
	webServer: {
		command: "cd .. && vite dev --port 5191",
		port: 5191,
		reuseExistingServer: true,
		timeout: 60000,
	},
})
