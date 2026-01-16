/**
 * Auth Conflict Test - authenticate: false with parent having authenticate: true
 * This should trigger a warning - parent already requires auth, setting false is confusing
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const AuthConflictPage = createPage({
	virtualPath: "_root_/(layout-tests)/layout-tests/auth-conflict",
})
	.options({ authenticate: false })
	.preloader(({ auth }) => {
		/* auth should still be { userId: string; role: "admin" } because parent requires it */
		return { userId: auth.userId }
	})
	.render(({ preloaderContext }) => (
		<div>
			<h1>Auth Conflict Test</h1>
			<p>Page has authenticate: false but parent layout has authenticate: true</p>
			<p>Auth is still available due to parent: {preloaderContext.userId}</p>
		</div>
	))
