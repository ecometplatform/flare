/**
 * Deep Nested Layout
 *
 * Third-level nested layout to test deep nesting.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"

export const DeepNestedLayout = createLayout({
	virtualPath: "_root_/(layout-tests)/(nested)/(deep)",
})
	.loader(async () => ({
		deepLayoutData: "deep-layout-value",
		depth: 3,
	}))
	.head(() => ({
		custom: {
			meta: [{ content: "3", name: "layout-level" }],
		},
	}))
	.render((props) => (
		<div data-depth={props.loaderData.depth} data-testid="deep-layout-wrapper">
			<span data-testid="deep-layout-marker">Deep Layout (Level 3)</span>
			<div data-testid="deep-layout-content">{props.children}</div>
		</div>
	))
