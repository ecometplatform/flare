/**
 * Test: Catch-All Params
 *
 * Tests [...slug] catch-all route params.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const CatchAllPage = createPage({ virtualPath: "_root_/input-tests/docs/[...slug]" })
	.input({
		params: z.object({
			slug: z.array(z.string()).min(1),
		}),
	})
	.loader(({ location }) => {
		return {
			breadcrumbs: location.params.slug,
			path: location.params.slug.join("/"),
		}
	})
	.render(({ loaderData }) => (
		<div data-testid="catch-all">
			<h1>Docs: {loaderData.path}</h1>
			<nav>
				{loaderData.breadcrumbs.map((crumb: string, i: number) => (
					<span>
						{i > 0 && " / "}
						{crumb}
					</span>
				))}
			</nav>
		</div>
	))
