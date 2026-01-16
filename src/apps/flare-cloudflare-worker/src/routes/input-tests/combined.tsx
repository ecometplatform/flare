/**
 * Test: Combined Input Validation
 *
 * Tests params and searchParams input validation together.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const CombinedInputPage = createPage({
	virtualPath: "_root_/input-tests/shop/[category]/[itemId]",
})
	.input({
		params: z.object({
			category: z.enum(["electronics", "clothing", "home"]),
			itemId: z.string().regex(/^[A-Z]{2}-\d{4}$/),
		}),
		searchParams: z.object({
			color: z.string().optional(),
			size: z.enum(["s", "m", "l", "xl"]).optional(),
		}),
	})
	.loader(({ location }) => {
		return {
			category: location.params.category,
			color: location.search.color,
			itemId: location.params.itemId,
			size: location.search.size,
		}
	})
	.render(({ loaderData }) => (
		<div data-testid="combined-input">
			<h1>
				{loaderData.category} - {loaderData.itemId}
			</h1>
			{loaderData.color && <p>Color: {loaderData.color}</p>}
			{loaderData.size && <p>Size: {loaderData.size}</p>}
		</div>
	))
