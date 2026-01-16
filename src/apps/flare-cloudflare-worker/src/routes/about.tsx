/**
 * About Page
 *
 * Simple static page for navigation testing.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"

export const AboutPage = createPage({ virtualPath: "_root_/about" })
	.preloader(({ auth }) => ({ a: 1 }))
	.loader(({ preloaderContext }) => {
		/* preloaderContext has accumulated types: { appName: string; a: number } */
		/* Handle case where preloaderContext might not be fully populated */
		const appName = preloaderContext?.appName ?? "Unknown"
		console.log(appName, preloaderContext?.a ?? 0)
		return Promise.resolve({ version: "2.0.0" })
	})
	.head(() => ({
		description: "Learn more about Flare v2 framework",
		title: "About - Flare v2",
	}))
	.render(() => {
		const loaderData = useLoaderData({ virtualPath: "_root_/about" })
		const preloaderContext = usePreloaderContext({ virtualPath: "_root_/about" })

		console.log(loaderData(), preloaderContext())

		return (
			<main>
				<h1>About Flare v2</h1>

				<p>Version: {loaderData().version}</p>

				<p>Flare is a lightweight SSR/SPA framework for Cloudflare Workers built on SolidJS.</p>

				<Link to="/">Back to Home</Link>
			</main>
		)
	})
