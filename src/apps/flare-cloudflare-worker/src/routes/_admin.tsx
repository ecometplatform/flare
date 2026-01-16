/**
 * Admin Root Layout
 *
 * Separate root layout for testing cross-root navigation.
 * Has different HTML structure than _root_ to verify full document swap.
 */

import { AppRoot } from "@ecomet/flare/components/app-root"
import { HeadContent } from "@ecomet/flare/components/head-content"
import { Scripts } from "@ecomet/flare/components/scripts"
import { createRootLayout } from "@ecomet/flare/router/create-root-layout"

export const AdminRootLayout = createRootLayout({ virtualPath: "_admin_" })
	.options({ authenticate: true })
	.preloader(() => ({
		adminVersion: "1.0.0",
		rootLayoutName: "admin",
	}))
	.loader(({ preloaderContext }) => ({
		...preloaderContext,
		loadedAt: Date.now(),
	}))
	.head(() => ({
		title: "Admin Panel",
	}))
	.render((props) => (
		<html data-root-layout="admin" lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
				<meta content="admin-root" name="root-layout-marker" />
				<style>
					{`@view-transition { navigation: auto; }
::view-transition-old(*),::view-transition-new(*){animation-duration:175ms}`}
				</style>
				<HeadContent />
			</head>
			<body data-testid="admin-body">
				<div data-testid="admin-shell">
					<header data-testid="admin-header">
						<span data-testid="admin-version">
							Admin Panel v{props.loaderData?.adminVersion ?? "unknown"}
						</span>
						<span data-testid="admin-root-marker">ROOT: admin</span>
					</header>
					<main data-testid="admin-main">
						<AppRoot>{props.children}</AppRoot>
					</main>
					<footer data-testid="admin-footer">
						<span>Admin Footer</span>
						<span data-testid="admin-loaded-at">Loaded at {props.loaderData?.loadedAt ?? 0}</span>
					</footer>
				</div>
				<Scripts />
			</body>
		</html>
	))
