/**
 * Head Test Page A
 *
 * Page with distinctive head elements for testing per-route head cleanup.
 * Has OG tags, Twitter card, JSON-LD, and custom meta that should be
 * REMOVED when navigating to Page B or outside the layout.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const HeadTestPageA = createPage({ virtualPath: "_root_/(head-test)/head-test/page-a" })
	.head(() => ({
		canonical: "https://example.com/head-test/page-a",
		custom: {
			meta: [
				{ content: "page-a-value", name: "page-specific-meta" },
				{ content: "Page A Author", property: "article:author" },
			],
		},
		description: "Testing head cleanup for Page A",
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "Article",
			author: { "@type": "Person", name: "Page A Author" },
			headline: "Page A Article",
		},
		keywords: "page-a, testing, head",
		languages: {
			en: "https://example.com/en/page-a",
			fr: "https://example.com/fr/page-a",
		},
		openGraph: {
			description: "Page A OG Description",
			images: [
				{
					alt: "Page A Image",
					height: 630,
					url: "https://example.com/page-a-og.jpg",
					width: 1200,
				},
			],
			siteName: "Head Test Site",
			title: "Page A OG Title",
			type: "article",
			url: "https://example.com/head-test/page-a",
		},
		robots: {
			follow: true,
			index: true,
			noarchive: true,
		},
		title: "Page A - Head Test",
		twitter: {
			card: "summary_large_image",
			creator: "@pagea_author",
			description: "Page A Twitter Description",
			images: [{ alt: "Page A", url: "https://example.com/page-a-twitter.jpg" }],
			site: "@pagea",
			title: "Page A Twitter Title",
		},
	}))
	.render(() => (
		<main data-testid="page-a">
			<h1>Page A</h1>
			<p>
				This page has OG tags, Twitter cards, JSON-LD, robots, keywords, canonical, hreflang, and
				custom meta.
			</p>
			<p>Navigate away and check that these are removed from &lt;head&gt;.</p>

			<nav>
				<Link to="/head-test/page-b">Go to Page B</Link>
				{" | "}
				<Link to="/about">Go to About (outside layout)</Link>
				{" | "}
				<Link to="/">Go to Home</Link>
			</nav>
		</main>
	))
