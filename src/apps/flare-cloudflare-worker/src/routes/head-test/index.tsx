/**
 * Head Test Index
 *
 * Landing page for head test routes.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const HeadTestIndex = createPage({ virtualPath: "_root_/(head-test)/head-test" })
	.head(() => ({
		description: "Test per-route head cleanup",
		title: "Head Test Index",
	}))
	.render(() => (
		<main data-testid="head-test-index">
			<h1>Head Test Routes</h1>
			<p>These routes test per-route head element cleanup on navigation.</p>

			<nav>
				<ul>
					<li>
						<Link to="/head-test/page-a">Page A (OG, Twitter, JSON-LD, robots, hreflang)</Link>
					</li>
					<li>
						<Link to="/head-test/page-b">Page B (Different OG, Twitter, JSON-LD)</Link>
					</li>
				</ul>
			</nav>
		</main>
	))
