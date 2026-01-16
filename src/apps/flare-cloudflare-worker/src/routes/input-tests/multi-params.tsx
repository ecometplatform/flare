/**
 * Test: Multiple Params
 *
 * Tests routes with multiple dynamic params.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import * as z from "zod"

export const MultiParamsPage = createPage({
	virtualPath: "_root_/input-tests/store/[storeId]/product/[productId]",
})
	.input({
		params: z.object({
			productId: z.string().uuid(),
			storeId: z.coerce.number().positive(),
		}),
	})
	.loader(({ location }) => {
		return {
			productId: location.params.productId,
			storeId: location.params.storeId,
		}
	})
	.render(({ loaderData }) => (
		<div data-testid="multi-params">
			<h1>Store {loaderData.storeId}</h1>
			<p>Product: {loaderData.productId}</p>
		</div>
	))
