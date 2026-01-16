/**
 * Product Page
 *
 * Dynamic route with [id] param for testing route params.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const ProductPage = createPage({ virtualPath: "_root_/products/[id]" })
	.loader(({ location }) => {
		const id = location.params.id
		return Promise.resolve({
			description: `This is product ${id}`,
			id,
			name: `Product ${id}`,
			price: Number(id) * 10,
		})
	})
	.head(({ loaderData }) => ({
		description: `Buy ${loaderData.name} for $${loaderData.price}`,
		title: `${loaderData.name} - Flare v2`,
	}))
	.render(({ loaderData }) => (
		<main>
			<h1>{loaderData.name}</h1>

			<dl>
				<dt>ID</dt>
				<dd>{loaderData.id}</dd>

				<dt>Description</dt>
				<dd>{loaderData.description}</dd>

				<dt>Price</dt>
				<dd>${loaderData.price}</dd>
			</dl>

			<nav>
				<Link to="/">Back to Home</Link>
				{" | "}
				<Link params={{ id: "999" }} to="/products/[id]">
					Product 999
				</Link>
			</nav>
		</main>
	))
