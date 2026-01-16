/**
 * Query Client Configuration
 *
 * Creates a configured QueryClient getter for both SSR and CSR.
 */

import { createQueryClientGetter } from "@ecomet/flare/query-client/create-query-client-getter"

export const getQueryClient = createQueryClientGetter({
	defaultOptions: {
		queries: {
			gcTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 60 * 1000, // 1 minute
		},
	},
})
