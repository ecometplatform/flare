/**
 * Type declarations for @cloudflare/vitest-pool-workers/config
 * Fixes moduleResolution: bundler incompatibility with .cjs exports
 */
declare module "@cloudflare/vitest-pool-workers/config" {
	export * from "@cloudflare/vitest-pool-workers/dist/config/index"
}
