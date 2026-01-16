/**
 * Hooks Test Layout
 *
 * Provides loader data and preloader context for hook testing.
 * Child pages can access this data via useLoaderData/usePreloaderContext.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import type { JSX } from "solid-js"

interface LayoutLoaderData {
	layoutTimestamp: number
	layoutVersion: string
}

export const HooksTestLayout = createLayout({ virtualPath: "_root_/(hooks-test)" })
	.preloader(() => ({
		layoutLoadedAt: Date.now(),
		layoutName: "HooksTestLayout",
	}))
	.loader(
		(): LayoutLoaderData => ({
			layoutTimestamp: Date.now(),
			layoutVersion: "1.0.0",
		}),
	)
	.render((props: { children: JSX.Element }) => {
		return (
			<div data-testid="hooks-test-layout">
				<header style={{ "background-color": "#e0f7fa", "margin-bottom": "1rem", padding: "1rem" }}>
					<h2>Hooks Test Layout</h2>
					<p>This layout provides data for hook testing</p>
				</header>
				{props.children}
			</div>
		)
	})
