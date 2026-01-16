/**
 * Input Tests Layout
 *
 * Layout wrapper for input validation test pages.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import { Link } from "@ecomet/flare/router/link"

export const InputTestsLayout = createLayout({ virtualPath: "_root_/(input-tests)" }).render(
	(props) => (
		<div data-testid="input-tests-layout">
			<header>
				<h2>Input Validation Tests</h2>
				<nav>
					<Link to="/">Home</Link>
				</nav>
			</header>
			{props.children}
		</div>
	),
)
