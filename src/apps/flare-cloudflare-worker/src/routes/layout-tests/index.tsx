/**
 * Layout Tests Index Page
 *
 * Landing page for layout tests.
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const LayoutTestsIndex = createPage({ virtualPath: "_root_/(layout-tests)/layout-tests" })
	.loader(async () => ({
		pageName: "LayoutTestsIndex",
	}))
	.head(({ loaderData, parentHead }) => ({
		title: `${parentHead?.title} - Index`,
	}))
	.render((props) => (
		<article data-testid="layout-tests-index">
			<h1>Layout Tests Index</h1>
			<p>This page tests basic layout + page composition.</p>
			<ul>
				<li>Parent layout should wrap this content</li>
				<li>Layout loader data should be available in footer</li>
				<li>Head should merge with layout head</li>
			</ul>
			<p data-testid="page-name">Page: {props.loaderData.pageName}</p>
		</article>
	))
