/**
 * Lazy Test Index
 *
 * Hub page for all lazy loading test scenarios.
 * Links to specific test pages with clear descriptions.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

const testPages = [
	{
		description: "Original test page with lazy(), clientLazy(), and preload() basics",
		href: "/lazy-test/basic",
		tests: [
			"lazy() SSR component",
			"clientLazy() client-only",
			"preload() utility",
			"pending/error props",
		],
		title: "Basic Tests",
	},
	{
		description: "Multiple chart components using clientLazy() for browser APIs",
		href: "/lazy-test/dashboard",
		tests: ["window.innerWidth", "navigator.userAgent", "requestAnimationFrame"],
		title: "Dashboard (Charts)",
	},
	{
		description: "Modal with preload on hover for instant open",
		href: "/lazy-test/modal",
		tests: ["preload() on hover", "clientLazy() modal", "keyboard navigation"],
		title: "Modal (Preload)",
	},
	{
		description: "Rich text editor with browser-only APIs",
		href: "/lazy-test/editor",
		tests: ["contentEditable", "document.execCommand", "window.getSelection"],
		title: "Editor (Heavy)",
	},
	{
		description: "SSR gallery with client-only lightbox",
		href: "/lazy-test/gallery",
		tests: ["lazy() for SEO", "clientLazy() for lightbox", "mixed strategies"],
		title: "Gallery (SSR+Client)",
	},
	{
		description: "Data table with preloadable export utilities",
		href: "/lazy-test/data-export",
		tests: ["preload() for utils", "CSV exporter", "JSON exporter"],
		title: "Data Export (Utils)",
	},
]

export const LazyTestIndexPage = createPage({ virtualPath: "_root_/lazy-test" })
	.head(() => ({ title: "Lazy Loading Tests" }))
	.render(() => (
		<main data-testid="lazy-test-index" style={{ "max-width": "800px", padding: "20px" }}>
			<Link to="/">← Home</Link>

			<h1>Lazy Loading Test Suite</h1>

			<section
				style={{
					background: "#e3f2fd",
					border: "1px solid #2196f3",
					"margin-bottom": "24px",
					padding: "16px",
				}}
			>
				<h3>API Overview</h3>
				<ul style={{ "line-height": "1.8" }}>
					<li>
						<code>lazy()</code> - SSR-enabled lazy component. Renders on server, hydrates on client.
					</li>
					<li>
						<code>clientLazy()</code> - Client-only component. Shows pending on server, loads on
						client.
					</li>
					<li>
						<code>preload()</code> - Fire-and-forget preloading for utilities/modules.
					</li>
				</ul>
			</section>

			<div style={{ display: "grid", gap: "16px" }}>
				{testPages.map((page) => (
					<Link
						style={{
							border: "1px solid #ddd",
							display: "block",
							padding: "16px",
							"text-decoration": "none",
						}}
						to={page.href}
					>
						<h3 style={{ margin: "0 0 8px" }}>{page.title}</h3>
						<p style={{ color: "#666", margin: "0 0 12px" }}>{page.description}</p>
						<div style={{ display: "flex", "flex-wrap": "wrap", gap: "8px" }}>
							{page.tests.map((test) => (
								<span
									style={{
										background: "#f5f5f5",
										"border-radius": "4px",
										"font-size": "12px",
										padding: "4px 8px",
									}}
								>
									{test}
								</span>
							))}
						</div>
					</Link>
				))}
			</div>
		</main>
	))
