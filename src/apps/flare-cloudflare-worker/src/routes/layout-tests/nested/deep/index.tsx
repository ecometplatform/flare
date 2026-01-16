/**
 * Deep Nested Page
 *
 * Page wrapped by three levels of layouts.
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const DeepNestedPage = createPage({
	virtualPath: "_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep",
})
	.loader(async () => ({
		deepPageData: "deep-page-value",
	}))
	.head(({ parentHead }) => ({
		title: `${parentHead?.title} - Deep`,
	}))
	.render((props) => (
		<article data-testid="deep-nested-page">
			<h1>Deep Nested Page</h1>
			<p>This page is wrapped by three layouts:</p>
			<ol>
				<li>LayoutTestsLayout (level 1) - has header/footer</li>
				<li>NestedLayout (level 2) - has sidebar</li>
				<li>DeepNestedLayout (level 3) - has marker</li>
			</ol>
			<p data-testid="deep-page-data">Deep page data: {props.loaderData.deepPageData}</p>
		</article>
	))
