/**
 * Gallery Lazy Test
 *
 * WHAT THIS TESTS:
 * - lazy() for SSR-rendered gallery (good for SEO)
 * - clientLazy() for lightbox (needs keyboard/scroll lock)
 * - Mix of SSR and client-only components
 *
 * EXPECTED BEHAVIOR:
 * 1. Server: Gallery grid renders with images (SEO-friendly)
 * 2. Client: Click image → Lightbox opens
 * 3. Lightbox has keyboard nav (arrows, escape)
 * 4. Body scroll is locked when lightbox open
 */

import { clientLazy } from "@ecomet/flare/client-lazy"
import { lazy } from "@ecomet/flare/lazy"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { createSignal, Show } from "solid-js"

/* ========================================
   LAZY COMPONENTS
   ======================================== */

/* SSR Gallery - renders on server for SEO */
const ImageGallery = lazy({
	loader: () => import("../../components/lazy-demos/ImageGallery"),
	pending: () => (
		<div
			data-testid="gallery-pending"
			style={{ display: "grid", gap: "12px", "grid-template-columns": "repeat(3, 1fr)" }}
		>
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					data-testid={`gallery-skeleton-${i}`}
					style={{ background: "#eee", height: "120px" }}
				/>
			))}
		</div>
	),
})

/* Client-only Lightbox - needs keyboard/scroll APIs */
const ImageLightbox = clientLazy({
	loader: () => import("../../components/lazy-demos/ImageLightbox"),
	pending: () => (
		<div
			data-testid="lightbox-pending"
			style={{
				"align-items": "center",
				background: "rgba(0,0,0,0.9)",
				color: "white",
				display: "flex",
				inset: "0",
				"justify-content": "center",
				position: "fixed",
				"z-index": "1000",
			}}
		>
			Loading lightbox...
		</div>
	),
})

/* ========================================
   TEST DATA
   ======================================== */

const images = [
	{
		alt: "Mountain Landscape",
		id: "1",
		src: "https://picsum.photos/800/600?random=1",
		thumbnail: "https://picsum.photos/200/150?random=1",
	},
	{
		alt: "Ocean Sunset",
		id: "2",
		src: "https://picsum.photos/800/600?random=2",
		thumbnail: "https://picsum.photos/200/150?random=2",
	},
	{
		alt: "Forest Path",
		id: "3",
		src: "https://picsum.photos/800/600?random=3",
		thumbnail: "https://picsum.photos/200/150?random=3",
	},
	{
		alt: "City Skyline",
		id: "4",
		src: "https://picsum.photos/800/600?random=4",
		thumbnail: "https://picsum.photos/200/150?random=4",
	},
	{
		alt: "Desert Dunes",
		id: "5",
		src: "https://picsum.photos/800/600?random=5",
		thumbnail: "https://picsum.photos/200/150?random=5",
	},
	{
		alt: "Snowy Peaks",
		id: "6",
		src: "https://picsum.photos/800/600?random=6",
		thumbnail: "https://picsum.photos/200/150?random=6",
	},
]

/* ========================================
   PAGE
   ======================================== */

export const GalleryLazyPage = createPage({ virtualPath: "_root_/lazy-test/gallery" })
	.head(() => ({ title: "Gallery - Lazy Loading Test" }))
	.render(() => {
		const [lightboxIndex, setLightboxIndex] = createSignal<number | null>(null)

		const openLightbox = (index: number) => {
			setLightboxIndex(index)
		}

		const closeLightbox = () => {
			setLightboxIndex(null)
		}

		return (
			<main data-testid="gallery-lazy-page" style={{ "max-width": "800px", padding: "20px" }}>
				<Link to="/lazy-test">← Back to Lazy Tests</Link>

				<h1>Image Gallery with Lightbox</h1>

				<section
					data-testid="test-explanation"
					style={{
						background: "#fffde7",
						border: "1px solid #ffc107",
						"margin-bottom": "24px",
						padding: "16px",
					}}
				>
					<h3>What This Tests</h3>
					<ul>
						<li>
							<strong>lazy()</strong> - Gallery renders on server (SEO)
						</li>
						<li>
							<strong>clientLazy()</strong> - Lightbox is client-only
						</li>
						<li>
							<strong>SSR + Client mix</strong> - Different lazy strategies together
						</li>
					</ul>
					<h4>Expected:</h4>
					<ul>
						<li>SSR: Gallery grid visible in page source</li>
						<li>Click image → Lightbox opens</li>
						<li>Arrow keys navigate, Escape closes</li>
						<li>Body scroll locked when lightbox open</li>
					</ul>
				</section>

				{/* Gallery Section */}
				<section data-testid="gallery-section">
					<h2>Photo Gallery</h2>
					<p style={{ color: "#666", "font-size": "14px", "margin-bottom": "12px" }}>
						Click any image to open the lightbox. Use arrow keys to navigate.
					</p>
					<ImageGallery images={images} onImageClick={openLightbox} />
				</section>

				{/* Lightbox */}
				<Show when={lightboxIndex() !== null}>
					<ImageLightbox
						currentIndex={lightboxIndex()!}
						images={images}
						onClose={closeLightbox}
						onNavigate={setLightboxIndex}
					/>
				</Show>

				{/* Info */}
				<section data-testid="info-section" style={{ "margin-top": "24px" }}>
					<h3>Component Types</h3>
					<table style={{ "border-collapse": "collapse", width: "100%" }}>
						<thead>
							<tr style={{ background: "#f5f5f5" }}>
								<th style={{ border: "1px solid #ddd", padding: "8px", "text-align": "left" }}>
									Component
								</th>
								<th style={{ border: "1px solid #ddd", padding: "8px", "text-align": "left" }}>
									Type
								</th>
								<th style={{ border: "1px solid #ddd", padding: "8px", "text-align": "left" }}>
									Why
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>ImageGallery</td>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>
									<code>lazy()</code>
								</td>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>
									SEO - images in page source
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>ImageLightbox</td>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>
									<code>clientLazy()</code>
								</td>
								<td style={{ border: "1px solid #ddd", padding: "8px" }}>
									Needs window events, scroll lock
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			</main>
		)
	})
