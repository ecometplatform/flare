/**
 * Test: Optional Catch-All Params
 *
 * Tests [[...path]] optional catch-all route params.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const OptionalCatchAllPage = createPage({
	virtualPath: "_root_/input-tests/files/[[...path]]",
})
	.input({
		params: z.object({
			path: z.array(z.string()).optional(),
		}),
	})
	.loader(({ location }) => {
		const pathParts = location.params.path ?? []
		return {
			isRoot: pathParts.length === 0,
			path: pathParts.join("/") || "/",
		}
	})
	.render(({ loaderData }) => (
		<div data-testid="optional-catch-all">
			<h1>Files: {loaderData.path}</h1>
			<p>{loaderData.isRoot ? "At root" : "In subdirectory"}</p>
		</div>
	))
