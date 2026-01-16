/**
 * Server Entry
 *
 * Cloudflare Worker fetch handler using Flare server handler.
 */

import { createServerHandler } from "@ecomet/flare/server"
import { boundaries, clientEntryPath, layouts, routeTree } from "./_gen/routes.gen"
import { getQueryClient } from "./query-client"

/**
 * Auth function - exported for type inference by route generator.
 * Return type becomes the `Auth` type in FlareRegister.
 */
export const authenticateFn = async (_ctx: { env: unknown; request: Request; url: URL }) => {
	/* Return actual auth object for proper type inference */
	return { role: "admin" as const, userId: "test-user" }
}

const handler = createServerHandler({
	authenticateFn,
	boundaries,
	csp: {
		connectSrc: ["'self'"],
		fontSrc: ["'self'", "https://fonts.gstatic.com"],
		imgSrc: ["'self'", "data:", "blob:"],
		styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
	},
	entryScript: clientEntryPath,
	isDev: true,
	layouts,
	queryClientGetter: getQueryClient,
	routerDefaults: {
		navFormat: "ndjson",
		viewTransitions: true,
	},
	routeTree,
})

export default {
	fetch(request: Request, env: unknown) {
		return handler.fetch(request, env)
	},
}
