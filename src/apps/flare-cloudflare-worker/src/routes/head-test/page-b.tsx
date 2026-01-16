/**
 * Head Test Page B
 *
 * Page with DIFFERENT head elements than Page A.
 * When navigating from Page A to Page B:
 * - Layout meta should PERSIST (layout-meta)
 * - Page A specific elements should be REMOVED
 * - Page B specific elements should be ADDED
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const HeadTestPageB = createPage({ virtualPath: "_root_/(head-test)/head-test/page-b" })
	.head(() => ({
		canonical: "https://example.com/head-test/page-b",
		custom: {
			meta: [
				{ content: "page-b-value", name: "page-specific-meta" },
				{ content: "99.99", property: "product:price" },
			],
		},
		description: "Testing head cleanup for Page B",
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "Product",
			description: "A different structured data type",
			name: "Page B Product",
		},
		keywords: "page-b, different, head",
		languages: {
			de: "https://example.com/de/page-b",
			en: "https://example.com/en/page-b",
		},
		openGraph: {
			description: "Page B OG Description",
			images: [
				{
					alt: "Page B Image",
					height: 600,
					url: "https://example.com/page-b-og.jpg",
					width: 800,
				},
			],
			siteName: "Different Site Name",
			title: "Page B OG Title",
			type: "product",
			url: "https://example.com/head-test/page-b",
		},
		robots: {
			follow: false,
			index: false,
		},
		title: "Page B - Head Test",
		twitter: {
			card: "summary",
			creator: "@pageb_author",
			description: "Page B Twitter Description",
			site: "@pageb",
			title: "Page B Twitter Title",
		},
	}))
	.render(() => (
		<main data-testid="page-b">
			<h1>Page B</h1>
			<p>This page has DIFFERENT OG tags, Twitter cards, JSON-LD, etc.</p>
			<p>Page A elements should be gone, Page B elements should be present.</p>

			<nav>
				<Link to="/head-test/page-a">Go to Page A</Link>
				{" | "}
				<Link to="/about">Go to About (outside layout)</Link>
				{" | "}
				<Link to="/">Go to Home</Link>
			</nav>
		</main>
	))
