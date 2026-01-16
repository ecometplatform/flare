/**
 * Sibling Layout
 *
 * Alternative layout at the same level as nested layout.
 * Tests switching between sibling layouts.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"

export const SiblingLayout = createLayout({ virtualPath: "_root_/(layout-tests)/(sibling)" })
	.loader(async () => ({
		siblingData: "sibling-layout-value",
	}))
	.head(() => ({
		custom: {
			meta: [
				{ content: "2", name: "layout-level" },
				{ content: "true", name: "sibling-marker" },
			],
		},
	}))
	.render((props) => (
		<div data-sibling-marker="true" data-testid="sibling-layout-wrapper">
			<div data-testid="sibling-layout-banner">Sibling Layout - Different from Nested Layout</div>
			<div data-testid="sibling-layout-content">{props.children}</div>
		</div>
	))
