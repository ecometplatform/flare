/**
 * Test: Search Params Validation
 *
 * Tests searchParams validation with zod.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const SearchParamsPage = createPage({ virtualPath: "_root_/input-tests/search" })
	.input({
		searchParams: z.object({
			page: z.coerce.number().min(1).default(1),
			q: z.string().optional(),
			sort: z.enum(["asc", "desc"]).default("asc"),
		}),
	})
	.loader(({ location }) => {
		return {
			page: location.search.page,
			query: location.search.q,
			sort: location.search.sort,
		}
	})
	.render(({ loaderData }) => (
		<div data-testid="search-params">
			<h1>Search Results</h1>
			<p>Query: {loaderData.query ?? "none"}</p>
			<p>Page: {loaderData.page}</p>
			<p>Sort: {loaderData.sort}</p>
		</div>
	))
