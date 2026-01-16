/**
 * Hooks Test Index Page
 *
 * Tests useLoaderData and usePreloaderContext with basic usage.
 * Displays data from this page and the parent layout.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"

export const HooksTestIndexPage = createPage({ virtualPath: "_root_/(hooks-test)/hooks-test" })
	.preloader(() => ({
		pageId: "hooks-test-index",
		pagePreloaded: true,
	}))
	.loader(() => ({
		features: ["useLoaderData", "usePreloaderContext", "type-safe virtualPath"],
		pageLoadedAt: Date.now(),
		pageTitle: "Hooks Test Hub",
	}))
	.head(() => ({
		description: "Test useLoaderData and usePreloaderContext hooks",
		title: "Hooks Test - Flare v2",
	}))
	.render(() => {
		/* Access page's own loader data */
		const pageData = useLoaderData({ virtualPath: "_root_/(hooks-test)/hooks-test" })

		/* Access page's preloader context (accumulated from all ancestors + this page) */
		const pagePreloader = usePreloaderContext({ virtualPath: "_root_/(hooks-test)/hooks-test" })

		/* Access root layout's preloader context */
		const rootPreloader = usePreloaderContext({ virtualPath: "_root_" })

		/* Access parent layout's loader data */
		const layoutData = useLoaderData({ virtualPath: "_root_/(hooks-test)" })

		/* Access parent layout's preloader context */
		const layoutPreloader = usePreloaderContext({ virtualPath: "_root_/(hooks-test)" })

		return (
			<main data-testid="hooks-test-index">
				<h1>{pageData()?.pageTitle}</h1>

				<section style={{ "margin-bottom": "2rem" }}>
					<h3>Page Loader Data</h3>
					<pre data-testid="page-loader-data">{JSON.stringify(pageData(), null, 2)}</pre>
				</section>

				<section style={{ "margin-bottom": "2rem" }}>
					<h3>Page Preloader Context (Accumulated)</h3>
					<pre data-testid="page-preloader-context">{JSON.stringify(pagePreloader(), null, 2)}</pre>
				</section>

				<section style={{ "margin-bottom": "2rem" }}>
					<h3>Layout Loader Data</h3>
					<pre data-testid="layout-loader-data">{JSON.stringify(layoutData(), null, 2)}</pre>
				</section>

				<section style={{ "margin-bottom": "2rem" }}>
					<h3>Layout Preloader Context</h3>
					<pre data-testid="layout-preloader-context">
						{JSON.stringify(layoutPreloader(), null, 2)}
					</pre>
				</section>

				<section style={{ "margin-bottom": "2rem" }}>
					<h3>Root Layout Preloader Context</h3>
					<pre data-testid="root-preloader-context">{JSON.stringify(rootPreloader(), null, 2)}</pre>
				</section>

				<nav style={{ "margin-top": "2rem" }}>
					<h3>More Hook Tests</h3>
					<ul>
						<li>
							<Link to="/hooks-test/nested">Nested Layout Test</Link> - Multi-level hook access
						</li>
						<li>
							<Link to="/hooks-test/error-test">Error Handling Test</Link> - Invalid virtualPath
							errors
						</li>
						<li>
							<Link to="/">Back to Home</Link>
						</li>
					</ul>
				</nav>
			</main>
		)
	})
