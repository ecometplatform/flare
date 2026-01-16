/**
 * Test: Params with Zod Enum Validation
 *
 * Tests that params can be validated with zod enum and type narrows correctly.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const ParamsEnumPage = createPage({ virtualPath: "_root_/input-tests/category/[type]" })
	.input({
		params: z.object({
			type: z.enum(["electronics", "clothing", "books"]),
		}),
	})
	.loader(({ location }) => {
		return { category: location.params.type }
	})
	.render(({ loaderData }) => (
		<div data-testid="params-enum">
			<h1>Category: {loaderData.category}</h1>
		</div>
	))
