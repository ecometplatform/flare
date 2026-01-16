/**
 * HTML Nav Test Page
 *
 * Tests HTML navigation mode with head updates.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const HtmlNavTestPage = createPage({ virtualPath: "_root_/html-nav-test" })
	.head(() => ({
		description: "HTML nav test page description",
		keywords: "html, nav, test",
		openGraph: {
			description: "OG description for HTML nav test",
			title: "OG Title - HTML Nav Test",
			type: "website",
		},
		title: "HTML Nav Test - Flare v2",
	}))
	.render(() => (
		<main>
			<h1 data-testid="html-nav-title">HTML Nav Test</h1>
			<p data-testid="html-nav-description">Testing HTML navigation mode</p>

			<nav>
				<h2>HTML Nav Links</h2>
				<ul>
					<li>
						<Link navFormat="html" to="/about">
							About (HTML nav)
						</Link>
					</li>
					<li>
						<Link navFormat="html" to="/products/123">
							Product 123 (HTML nav)
						</Link>
					</li>
					<li>
						<Link navFormat="html" to="/defer">
							Defer (HTML nav)
						</Link>
					</li>
					<li>
						<Link navFormat="html" to="/">
							Home (HTML nav)
						</Link>
					</li>
				</ul>

				<h2>NDJSON Nav Links (default)</h2>
				<ul>
					<li>
						<Link to="/about">About (NDJSON)</Link>
					</li>
					<li>
						<Link to="/products/123">Product 123 (NDJSON)</Link>
					</li>
				</ul>
			</nav>
		</main>
	))
