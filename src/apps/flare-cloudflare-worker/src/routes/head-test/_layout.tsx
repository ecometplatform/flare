/**
 * Head Test Layout
 *
 * Layout with distinctive head elements for testing per-route head cleanup.
 * Adds a custom meta tag and script that should persist for all child routes.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import { Link } from "@ecomet/flare/router/link"

export const HeadTestLayout = createLayout({ virtualPath: "_root_/(head-test)" })
	.head(() => ({
		custom: {
			meta: [{ content: "head-test-layout", name: "layout-meta" }],
		},
	}))
	.render((props) => (
		<div data-testid="head-test-layout">
			<nav>
				<Link to="/head-test/page-a">Page A</Link>
				{" | "}
				<Link to="/head-test/page-b">Page B</Link>
				{" | "}
				<Link to="/about">About (outside layout)</Link>
			</nav>
			{props.children}
		</div>
	))
