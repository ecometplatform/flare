/**
 * Nested Hooks Test Layout
 *
 * Second level of nesting to test accessing data from multiple ancestors.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import type { JSX } from "solid-js"

export const HooksTestNestedLayout = createLayout({ virtualPath: "_root_/(hooks-test)/(nested)" })
	.preloader(() => ({
		nestedLayoutName: "HooksTestNestedLayout",
		nestingLevel: 2,
	}))
	.loader(() => ({
		nestedLayoutData: "from-nested-layout",
		nestedTimestamp: Date.now(),
	}))
	.render((props: { children: JSX.Element }) => {
		return (
			<div
				data-testid="hooks-test-nested-layout"
				style={{ border: "2px dashed #9c27b0", margin: "1rem 0", padding: "1rem" }}
			>
				<div style={{ "background-color": "#f3e5f5", "margin-bottom": "1rem", padding: "0.5rem" }}>
					<strong>Nested Layout (Level 2)</strong>
				</div>
				{props.children}
			</div>
		)
	})
