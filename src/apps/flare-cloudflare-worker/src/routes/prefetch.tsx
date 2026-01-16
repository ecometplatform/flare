/**
 * Prefetch Test Page
 *
 * Page with various prefetch configurations for E2E testing.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const PrefetchPage = createPage({ virtualPath: "_root_/prefetch" })
	.loader(async () => {
		return { loadedAt: Date.now() }
	})
	.render(({ loaderData }) => (
		<main>
			<h1>Prefetch Tests</h1>
			<p data-testid="loaded-at">Loaded at: {loaderData.loadedAt}</p>

			<section>
				<h2>Hover Prefetch</h2>
				<Link data-testid="link-hover-ndjson" prefetch="hover" to="/about">
					NDJSON Hover
				</Link>
				<Link data-testid="link-hover-html" navFormat="html" prefetch="hover" to="/about">
					HTML Hover
				</Link>
			</section>

			<section>
				<h2>Viewport Prefetch</h2>
				<Link data-testid="link-viewport-ndjson" prefetch="viewport" to="/products/111">
					NDJSON Viewport
				</Link>
				<Link
					data-testid="link-viewport-html"
					navFormat="html"
					prefetch="viewport"
					to="/products/222"
				>
					HTML Viewport
				</Link>
			</section>

			<section>
				<h2>No Prefetch</h2>
				<Link data-testid="link-no-prefetch" prefetch={false} to="/products/333">
					No Prefetch
				</Link>
			</section>

			<section>
				<h2>Prefetch Cache Test</h2>
				<p>These links point to same URL to test cache deduplication:</p>
				<Link data-testid="link-cache-1" prefetch="hover" to="/products/444">
					Link 1 to /products/444
				</Link>
				<Link data-testid="link-cache-2" prefetch="hover" to="/products/444">
					Link 2 to /products/444
				</Link>
			</section>

			<section style={{ "margin-top": "200vh" }}>
				<h2>Below Fold (for viewport test)</h2>
				<Link data-testid="link-below-fold" prefetch="viewport" to="/products/555">
					Below Fold Link
				</Link>
			</section>
		</main>
	))
