/**
 * Layout Tests Layout
 *
 * Top-level layout for layout testing scenarios.
 * Tests basic layout rendering and children prop.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import { Link } from "@ecomet/flare/router/link"

export const LayoutTestsLayout = createLayout({ virtualPath: "_root_/(layout-tests)" })
	.options({ authenticate: true })
	// .authorize(({}) => ({}))
	// .preloader(({}) => ({}))
	.loader(async ({ auth }) => ({
		layoutName: "LayoutTestsLayout",
		timestamp: Date.now(),
	}))
	.head(({ loaderData }) => ({
		custom: {
			meta: [{ content: "1", name: "layout-level" }],
		},
		title: `Layout Tests - ${loaderData.layoutName}`,
	}))
	.render((props) => (
		<div data-layout-name={props.loaderData.layoutName} data-testid="layout-tests-wrapper">
			<header data-testid="layout-tests-header">
				<h2>Layout Tests</h2>
				<nav>
					<Link to="/">Home</Link>
					{" | "}
					<Link to="/layout-tests">Index</Link>
					{" | "}
					<Link to="/layout-tests/nested">Nested</Link>
					{" | "}
					<Link to="/layout-tests/nested/deep">Deep</Link>
					{" | "}
					<Link to="/layout-tests/sibling">Sibling</Link>
				</nav>
			</header>
			<main data-testid="layout-tests-content">{props.children}</main>
			<footer data-testid="layout-tests-footer">
				Layout loader timestamp:{" "}
				<span data-testid="layout-timestamp">{props.loaderData.timestamp}</span>
			</footer>
		</div>
	))
