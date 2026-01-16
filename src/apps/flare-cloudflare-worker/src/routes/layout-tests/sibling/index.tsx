/**
 * Sibling Layout Page
 *
 * Page inside sibling layout to test layout switching.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const SiblingPage = createPage({
	virtualPath: "_root_/(layout-tests)/(sibling)/layout-tests/sibling",
})
	.loader(async () => ({
		siblingPageData: "sibling-page-value",
	}))
	.head(({ parentHead }) => ({
		title: `${parentHead?.title} - Sibling`,
	}))
	.render((props) => (
		<article data-testid="sibling-page">
			<h1>Sibling Layout Page</h1>
			<p>This page uses a different layout than the nested pages:</p>
			<ul>
				<li>LayoutTestsLayout (level 1) - shared</li>
				<li>SiblingLayout (level 2) - NOT NestedLayout</li>
			</ul>
			<p>Navigate to test layout switching:</p>
			<ul>
				<li>
					<Link to="/layout-tests/nested">Go to Nested Layout</Link> - switches to NestedLayout
				</li>
				<li>
					<Link to="/layout-tests">Go to Index</Link> - no level 2 layout
				</li>
			</ul>
			<p data-testid="sibling-page-data">Sibling page data: {props.loaderData.siblingPageData}</p>
		</article>
	))
