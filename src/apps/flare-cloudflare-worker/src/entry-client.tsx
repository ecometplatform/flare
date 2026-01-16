/**
 * Client Entry
 *
 * Hydrates the SSR output and sets up CSR navigation.
 */

import { hydrate } from "@ecomet/flare/client/hydrate"
import { layouts, routeTree } from "./_gen/routes.gen"
import { getQueryClient } from "./query-client"

hydrate({
	layouts,
	queryClientGetter: getQueryClient,
	routeTree,
})
