#!/usr/bin/env bun
/// <reference types="bun-types" />

/** Deletes .turbo, .wrangler, .vite, dist, node_modules folders and bun.lock, tsconfig.tsbuildinfo files recursively from the root */

import { execSync } from "node:child_process"

try {
	/** Use Windows-compatible commands */
	if (process.platform === "win32") {
		execSync(
			'powershell -Command "Get-ChildItem -Path . -Include .turbo,.wrangler,.vite,dist,node_modules,bun.lock,tsconfig.tsbuildinfo -Recurse | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"',
			{ stdio: "inherit" },
		)
	} else {
		/** Unix commands for non-Windows systems */
		execSync(
			'find . \\( -type d \\( -name ".turbo" -o -name ".wrangler" -o -name ".vite" -o -name "dist" -o -name "node_modules" \\) -o -type f \\( -name "bun.lock" -o -name "tsconfig.tsbuildinfo" \\) \\) -exec rm -rf {} \\; 2>/dev/null || true',
			{ stdio: "inherit" },
		)
	}

	console.log("Cleanup completed successfully!")
} catch (error) {
	const errorMessage = error instanceof Error ? error.message : String(error)
	console.error(`Error: ${errorMessage}`)
	process.exit(1)
}
