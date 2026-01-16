/**
 * Hooks Error Test Page
 *
 * Tests error handling when accessing data from routes not in the current chain.
 * Demonstrates proper error messages for invalid virtualPath access.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"
import { createSignal, onMount } from "solid-js"

export const HooksErrorTestPage = createPage({
	virtualPath: "_root_/(hooks-test)/hooks-test/error-test",
})
	.preloader(() => ({
		errorTestPage: true,
	}))
	.loader(() => ({
		pageTitle: "Hook Error Handling Test",
		testCases: ["sibling-access", "child-access", "unrelated-access"],
	}))
	.head(() => ({
		description: "Test error handling for invalid virtualPath access",
		title: "Hook Errors - Flare v2",
	}))
	.render(() => {
		/* Valid accesses - these should work */
		const pageData = useLoaderData({ virtualPath: "_root_/(hooks-test)/hooks-test/error-test" })
		const layoutData = useLoaderData({ virtualPath: "_root_/(hooks-test)" })
		const rootData = useLoaderData({ virtualPath: "_root_" })

		/* State for error test results */
		const [siblingError, setSiblingError] = createSignal<string | null>(null)
		const [childError, setChildError] = createSignal<string | null>(null)
		const [unrelatedError, setUnrelatedError] = createSignal<string | null>(null)

		/* Run error tests on mount (client-side only) */
		onMount(() => {
			/* Test 1: Try to access sibling route (nested page - not ancestor) */
			useLoaderData({ virtualPath: "_root_/(hooks-test)/(nested)/hooks-test/nested" })
			setSiblingError("ERROR: Should have thrown but didn't!")

			/* Test 2: Try to access child route that doesn't exist in chain */
			useLoaderData({ virtualPath: "_root_/about" })
			setChildError("ERROR: Should have thrown but didn't!")

			/* Test 3: Try to access completely unrelated route */
			usePreloaderContext({ virtualPath: "_admin_/admin" })
			setUnrelatedError("ERROR: Should have thrown but didn't!")
		})

		return (
			<main data-testid="hooks-error-test">
				<h1>{pageData()?.pageTitle}</h1>

				<section style="background:#e8f5e9;margin-bottom:2rem;padding:1rem">
					<h2>Valid Accesses (Should Work)</h2>

					<h3>Own Page Data</h3>
					<pre data-testid="own-data">{JSON.stringify(pageData(), null, 2)}</pre>

					<h3>Parent Layout Data</h3>
					<pre data-testid="layout-data">{JSON.stringify(layoutData(), null, 2)}</pre>

					<h3>Root Layout Data</h3>
					<pre data-testid="root-data">{JSON.stringify(rootData(), null, 2)}</pre>
				</section>

				<section style="background:#ffebee;margin-bottom:2rem;padding:1rem">
					<h2>Invalid Accesses (Should Error)</h2>

					<h3>Test 1: Sibling Route Access</h3>
					<p>
						Trying to access: <code>_root_/(hooks-test)/(nested)/hooks-test/nested</code>
					</p>
					<pre data-testid="sibling-error" style={siblingError() ? "color:#c62828" : "color:#666"}>
						{siblingError() ?? "Testing..."}
					</pre>

					<h3>Test 2: Unrelated Page Access</h3>
					<p>
						Trying to access: <code>_root_/about</code>
					</p>
					<pre data-testid="child-error" style={childError() ? "color:#c62828" : "color:#666"}>
						{childError() ?? "Testing..."}
					</pre>

					<h3>Test 3: Different Root Access</h3>
					<p>
						Trying to access: <code>_admin_/admin</code>
					</p>
					<pre
						data-testid="unrelated-error"
						style={unrelatedError() ? "color:#c62828" : "color:#666"}
					>
						{unrelatedError() ?? "Testing..."}
					</pre>
				</section>

				<section style="background:#e3f2fd;margin-bottom:2rem;padding:1rem">
					<h2>Current Route Chain</h2>
					<p>These are the routes you CAN access from this page:</p>
					<ul>
						<li>
							<code>_root_</code> - Root layout (ancestor)
						</li>
						<li>
							<code>_root_/(hooks-test)</code> - Hooks test layout (parent)
						</li>
						<li>
							<code>_root_/(hooks-test)/hooks-test/error-test</code> - This page
						</li>
					</ul>
				</section>

				<nav style="margin-top:2rem">
					<h3>Navigation</h3>
					<ul>
						<li>
							<Link to="/hooks-test">Back to Hooks Test Index</Link>
						</li>
						<li>
							<Link to="/hooks-test/nested">Nested Layout Test</Link>
						</li>
						<li>
							<Link to="/">Back to Home</Link>
						</li>
					</ul>
				</nav>
			</main>
		)
	})
