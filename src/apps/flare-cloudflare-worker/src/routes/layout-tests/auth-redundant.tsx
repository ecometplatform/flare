/**
 * Auth Redundant Test - authenticate: true when parent already has authenticate: true
 * This should trigger a warning - redundant auth option
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const AuthRedundantPage = createPage({
	virtualPath: "_root_/(layout-tests)/layout-tests/auth-redundant",
})
	.options({ authenticate: true })
	.preloader(({ auth }) => {
		/* auth should be { userId: string; role: "admin" } */
		return { userId: auth.userId }
	})
	.render(({ preloaderContext }) => (
		<div>
			<h1>Auth Redundant Test</h1>
			<p>Page has authenticate: true but parent layout already has authenticate: true</p>
			<p>User ID: {preloaderContext.userId}</p>
		</div>
	))
