/**
 * Auth Inherit Test - No explicit auth option
 * Should inherit auth from parent LayoutTestsLayout (authenticate: true)
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const AuthInheritPage = createPage({
	virtualPath: "_root_/(layout-tests)/layout-tests/auth-inherit",
})
	.preloader(({ auth }) => {
		/* auth should be typed as { userId: string; role: "admin" } from inheritance */
		return { inheritedUserId: auth.userId }
	})
	.render(({ preloaderContext }) => (
		<div>
			<h1>Auth Inherit Test</h1>
			<p>No explicit auth option - inherits from parent layout</p>
			<p>User ID: {preloaderContext.inheritedUserId}</p>
		</div>
	))
