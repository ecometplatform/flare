/**
 * Nested Layout
 *
 * Second-level nested layout to test layout hierarchy.
 * Demonstrates layout nesting and loader data cascading.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"

export const NestedLayout = createLayout({ virtualPath: "_root_/(layout-tests)/(nested)" })
	.loader(async () => ({
		nestedLayoutData: "nested-layout-value",
		nestedTimestamp: Date.now(),
	}))
	.head(() => ({
		custom: {
			meta: [{ content: "2", name: "layout-level" }],
		},
	}))
	.render((props) => (
		<div data-nested-data={props.loaderData.nestedLayoutData} data-testid="nested-layout-wrapper">
			<aside data-testid="nested-layout-sidebar">
				<h3>Nested Layout</h3>
				<p>
					Nested timestamp:{" "}
					<span data-testid="nested-timestamp">{props.loaderData.nestedTimestamp}</span>
				</p>
			</aside>
			<div data-testid="nested-layout-content">{props.children}</div>
		</div>
	))
