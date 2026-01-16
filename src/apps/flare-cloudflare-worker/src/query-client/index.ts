import { createQueryClientGetter } from "@ecomet/flare/query-client/create-query-client-getter"

export const getQueryClient = createQueryClientGetter({
	defaultOptions: {
		queries: {
			gcTime: 30 * 1000 * 1000,
			staleTime: 3 * 1000 * 1000,
		},
	},
})
