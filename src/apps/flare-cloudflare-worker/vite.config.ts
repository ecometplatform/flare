/**
 * Flare v2 Test App - Vite Config
 */

import { cloudflare } from "@cloudflare/vite-plugin"
import { flare } from "@ecomet/flare/plugins"
import { defineConfig } from "vite"
import build from "./flare.build"

export default defineConfig({
	/*
	 * Force Vite to use the pre-built dist files for @ecomet/flare.
	 * This ensures consistent module resolution and shared contexts.
	 */
	optimizeDeps: {
		include: ["@ecomet/flare/query-client/query-client-provider"],
	},
	plugins: [
		flare(build),
		cloudflare({
			configPath: "./wrangler.jsonc",
			viteEnvironment: { name: "ssr" },
		}),
	],
	publicDir: "./public",
	/*
	 * Dedupe solid-js to ensure a single instance is used throughout.
	 * Critical for SSR context propagation via sharedConfig.
	 */
	resolve: {
		dedupe: ["solid-js", "solid-js/web", "solid-js/store"],
	},
})
