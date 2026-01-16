/**
 * Index Page
 *
 * Home page with links to all test pages.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const IndexPage = createPage({ virtualPath: "_root_/" }).render(() => (
	<main>
		<h1>Flare v2 Test Pages</h1>

		<nav>
			<h2>Core Features</h2>
			<ul>
				<li>
					<Link to="/about">About</Link> - Basic page test
				</li>
				<li>
					<Link params={{ id: "123" }} to="/products/[id]">
						Product 123
					</Link>{" "}
					- Dynamic route with params
				</li>
			</ul>

			<h2>Streaming &amp; Async</h2>
			<ul>
				<li>
					<Link to="/defer">Defer</Link> - NDJSON streaming protocol tests
				</li>
				<li>
					<Link to="/await">Await</Link> - Await component states (pending, success, error)
				</li>
				<li>
					<Link to="/await-ssr">Await SSR</Link> - SSR pre-resolved data (no pending flash)
				</li>
				<li>
					<Link to="/defer-await">Defer + Await</Link> - Full integration tests
				</li>
			</ul>

			<h2>Query Client</h2>
			<ul>
				<li>
					<Link to="/query-test">Query Test</Link> - Query client sync (SSR/HTML/NDJSON)
				</li>
				<li>
					<Link to="/query-defer-test">Query + Defer Test</Link> - Query sync with defer streaming
				</li>
			</ul>

			<h2>Navigation</h2>
			<ul>
				<li>
					<Link to="/prefetch">Prefetch Tests</Link> - Prefetch behavior testing
				</li>
				<li>
					<Link navFormat="html" to="/html-nav-test">
						HTML Nav Test
					</Link>{" "}
					- HTML navigation mode with head updates
				</li>
			</ul>

			<h2>Head Management</h2>
			<ul>
				<li>
					<Link to="/head-test">Head Test Index</Link> - Head test landing page
				</li>
				<li>
					<Link to="/head-test/page-a">Head Test Page A</Link> - OG, Twitter, JSON-LD, robots,
					hreflang
				</li>
				<li>
					<Link to="/head-test/page-b">Head Test Page B</Link> - Different head elements for cleanup
					test
				</li>
			</ul>

			<h2>Styling</h2>
			<ul>
				<li>
					<Link to="/css-test">CSS Test</Link> - Scoped inline CSS via css prop
				</li>
				<li>
					<Link to="/css-v2-test">CSS v2 Test</Link> - css() function with state and variables
				</li>
			</ul>

			<h2>Lazy Loading</h2>
			<ul>
				<li>
					<Link to="/lazy-test">Lazy Test</Link> - Test suite hub for lazy loading
				</li>
				<li>
					<Link to="/lazy-test/basic">Lazy Basic</Link> - lazy(), clientLazy(), preload() basics
				</li>
				<li>
					<Link to="/lazy-test/dashboard">Dashboard</Link> - Charts with clientLazy() (browser APIs)
				</li>
				<li>
					<Link to="/lazy-test/modal">Modal</Link> - Preload on hover, instant open
				</li>
				<li>
					<Link to="/lazy-test/editor">Editor</Link> - Rich text editor (clientLazy heavy)
				</li>
				<li>
					<Link to="/lazy-test/gallery">Gallery</Link> - SSR gallery + clientLazy lightbox
				</li>
				<li>
					<Link to="/lazy-test/data-export">Data Export</Link> - preload() for utility modules
				</li>
			</ul>

			<h2>Hook Tests</h2>
			<ul>
				<li>
					<Link to="/hooks-test">Hooks Test Index</Link> - useLoaderData & usePreloaderContext
				</li>
				<li>
					<Link to="/hooks-test/nested">Nested Layout Hooks</Link> - Multi-level hook access
				</li>
				<li>
					<Link to="/hooks-test/error-test">Hook Error Handling</Link> - Invalid virtualPath errors
				</li>
			</ul>

			<h2>Layout Tests</h2>
			<ul>
				<li>
					<Link to="/layout-tests">Layout Tests Index</Link> - Single layout
				</li>
				<li>
					<Link to="/layout-tests/nested">Nested Layout</Link> - Two-level nesting
				</li>
				<li>
					<Link to="/layout-tests/nested/deep">Deep Nested</Link> - Three-level nesting
				</li>
				<li>
					<Link to="/layout-tests/sibling">Sibling Layout</Link> - Alternative sibling layout
				</li>
				<li>
					<Link params={{ orgId: "acme" }} to="/layout-tests/dynamic/[orgId]/dashboard">
						Dynamic Layout (acme)
					</Link>{" "}
					- Layout with params
				</li>
				<li>
					<Link params={{ orgId: "globex" }} to="/layout-tests/dynamic/[orgId]/dashboard">
						Dynamic Layout (globex)
					</Link>
				</li>
				<li>
					<Link to="/layout-tests/auth-inherit">Auth Inherit</Link> - Inherits auth from parent
				</li>
				<li>
					<Link to="/layout-tests/auth-conflict">Auth Conflict</Link> - Child tries to disable auth
				</li>
				<li>
					<Link to="/layout-tests/auth-redundant">Auth Redundant</Link> - Redundant auth declaration
				</li>
			</ul>

			<h2>Cross-Root Layout Navigation</h2>
			<ul>
				<li>
					<Link data-testid="link-to-admin" to="/admin">
						Admin Dashboard (_admin_)
					</Link>{" "}
					- Navigate to different root layout
				</li>
				<li>
					<Link data-testid="link-to-admin-users" to="/admin/users">
						Admin Users (_admin_)
					</Link>{" "}
					- Admin users page
				</li>
				<li>
					<Link data-testid="link-to-admin-settings" to="/admin/settings">
						Admin Settings (_admin_)
					</Link>{" "}
					- Admin settings page
				</li>
			</ul>

			<h2>Input Validation</h2>
			<ul>
				<li>
					<Link to="/input-tests/search">Search Params</Link> - ?q=test&amp;page=1&amp;sort=asc
				</li>
				<li>
					<Link search={{ page: 2, q: "hello", sort: "desc" }} to="/input-tests/search">
						Search Params (prefilled)
					</Link>{" "}
					- With search params
				</li>
				<li>
					<Link params={{ type: "electronics" }} to="/input-tests/category/[type]">
						Params Enum (electronics)
					</Link>{" "}
					- Zod enum validation
				</li>
				<li>
					<Link params={{ type: "clothing" }} to="/input-tests/category/[type]">
						Params Enum (clothing)
					</Link>
				</li>
				<li>
					<Link params={{ type: "books" }} to="/input-tests/category/[type]">
						Params Enum (books)
					</Link>
				</li>
				<li>
					<Link
						params={{ category: "electronics", itemId: "AB-1234" }}
						search={{ color: "red", size: "m" }}
						to="/input-tests/shop/[category]/[itemId]"
					>
						Combined Input
					</Link>{" "}
					- Params + search params together
				</li>
				<li>
					<Link to="/input-tests/sections">Sections</Link> - Hash fragment navigation
				</li>
				<li>
					<Link hash="details" to="/input-tests/sections">
						Sections #details
					</Link>{" "}
					- With hash
				</li>
				<li>
					<Link params={{ slug: ["guide", "getting-started"] }} to="/input-tests/docs/[...slug]">
						Catch-All (docs/guide/getting-started)
					</Link>{" "}
					- [...slug] route
				</li>
				<li>
					<Link params={{ slug: ["api", "reference", "v2"] }} to="/input-tests/docs/[...slug]">
						Catch-All (docs/api/reference/v2)
					</Link>
				</li>
				<li>
					<Link to="/input-tests/files">Optional Catch-All (root)</Link> - [[...path]] at root
				</li>
				<li>
					<Link params={{ path: ["src", "components"] }} to="/input-tests/files/[[...path]]">
						Optional Catch-All (src/components)
					</Link>
				</li>
				<li>
					<Link
						params={{ productId: "550e8400-e29b-41d4-a716-446655440000", storeId: "42" }}
						to="/input-tests/store/[storeId]/product/[productId]"
					>
						Multi Params (store 42, product UUID)
					</Link>{" "}
					- Multiple validated params
				</li>
			</ul>
		</nav>
	</main>
))
