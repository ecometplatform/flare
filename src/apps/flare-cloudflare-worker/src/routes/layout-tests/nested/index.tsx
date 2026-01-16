/**
 * Nested Layout Index Page
 *
 * Page inside nested layout to test two-level nesting.
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const NestedIndex = createPage({
	virtualPath: "_root_/(layout-tests)/(nested)/layout-tests/nested",
})
	.loader(async () => ({
		nestedPageData: "nested-page-value",
	}))
	.head(({ parentHead }) => ({
		title: `${parentHead?.title} - Nested`,
	}))
	.render((props) => (
		<article data-testid="nested-index">
			<h1>Nested Layout Page</h1>
			<p>This page is wrapped by two layouts:</p>
			<ol>
				<li>LayoutTestsLayout (level 1)</li>
				<li>NestedLayout (level 2)</li>
			</ol>
			<p data-testid="nested-page-data">Page data: {props.loaderData.nestedPageData}</p>
		</article>
	))
