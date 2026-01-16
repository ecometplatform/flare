/**
 * Nested Hooks Test Page
 *
 * Tests accessing data from multiple levels of the route hierarchy:
 * - Root layout (_root_)
 * - HooksTestLayout (_root_/(hooks-test))
 * - HooksTestNestedLayout (_root_/(hooks-test)/(nested))
 * - This page (_root_/(hooks-test)/(nested)/hooks-test/nested)
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"

export const HooksTestNestedPage = createPage({
	virtualPath: "_root_/(hooks-test)/(nested)/hooks-test/nested",
})
	.preloader(() => ({
		nestedPagePreloaded: true,
		preloaderChainComplete: true,
	}))
	.loader(() => ({
		accessibleRoutes: [
			"_root_",
			"_root_/(hooks-test)",
			"_root_/(hooks-test)/(nested)",
			"_root_/(hooks-test)/(nested)/hooks-test/nested",
		],
		nestedPageTitle: "Nested Page",
	}))
	.head(() => ({
		description: "Test hooks with deeply nested routes",
		title: "Nested Hooks Test - Flare v2",
	}))
	.render(() => {
		/* Access all levels of the hierarchy */
		const rootPreloader = usePreloaderContext({ virtualPath: "_root_" })
		const hooksLayoutData = useLoaderData({ virtualPath: "_root_/(hooks-test)" })
		const hooksLayoutPreloader = usePreloaderContext({ virtualPath: "_root_/(hooks-test)" })
		const nestedLayoutData = useLoaderData({ virtualPath: "_root_/(hooks-test)/(nested)" })
		const nestedLayoutPreloader = usePreloaderContext({
			virtualPath: "_root_/(hooks-test)/(nested)",
		})
		const pageData = useLoaderData({
			virtualPath: "_root_/(hooks-test)/(nested)/hooks-test/nested",
		})
		const pagePreloader = usePreloaderContext({
			virtualPath: "_root_/(hooks-test)/(nested)/hooks-test/nested",
		})

		return (
			<main data-testid="hooks-test-nested-page">
				<h1>Multi-Level Hook Access Test</h1>
				<p>
					This page demonstrates accessing loader data and preloader context from all levels of the
					route hierarchy.
				</p>

				<div style={{ display: "grid", gap: "1rem", "grid-template-columns": "1fr 1fr" }}>
					<section>
						<h3>1. Root Layout</h3>
						<h4>Preloader Context</h4>
						<pre data-testid="nested-root-preloader">
							{JSON.stringify(rootPreloader(), null, 2)}
						</pre>
					</section>

					<section>
						<h3>2. HooksTestLayout</h3>
						<h4>Loader Data</h4>
						<pre data-testid="nested-hooks-layout-loader">
							{JSON.stringify(hooksLayoutData(), null, 2)}
						</pre>
						<h4>Preloader Context</h4>
						<pre data-testid="nested-hooks-layout-preloader">
							{JSON.stringify(hooksLayoutPreloader(), null, 2)}
						</pre>
					</section>

					<section>
						<h3>3. NestedLayout</h3>
						<h4>Loader Data</h4>
						<pre data-testid="nested-nested-layout-loader">
							{JSON.stringify(nestedLayoutData(), null, 2)}
						</pre>
						<h4>Preloader Context</h4>
						<pre data-testid="nested-nested-layout-preloader">
							{JSON.stringify(nestedLayoutPreloader(), null, 2)}
						</pre>
					</section>

					<section>
						<h3>4. This Page</h3>
						<h4>Loader Data</h4>
						<pre data-testid="nested-page-loader">{JSON.stringify(pageData(), null, 2)}</pre>
						<h4>Preloader Context (Accumulated)</h4>
						<pre data-testid="nested-page-preloader">
							{JSON.stringify(pagePreloader(), null, 2)}
						</pre>
					</section>
				</div>

				<nav style={{ "margin-top": "2rem" }}>
					<Link to="/hooks-test">Back to Hooks Test Index</Link>
				</nav>
			</main>
		)
	})
