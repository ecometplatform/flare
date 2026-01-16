/**
 * Image Lightbox Component (Client-only)
 *
 * Full-screen image viewer with keyboard navigation.
 * Uses window for key events, document for scroll lock.
 */

import { createSignal, onCleanup, onMount } from "solid-js"

interface ImageLightboxProps {
	currentIndex: number
	images: { alt: string; src: string }[]
	onClose: () => void
	onNavigate: (index: number) => void
}

export default function ImageLightbox(props: ImageLightboxProps) {
	const [mounted, setMounted] = createSignal(false)
	const [viewportSize, setViewportSize] = createSignal({ height: 0, width: 0 })

	onMount(() => {
		setMounted(true)
		setViewportSize({ height: window.innerHeight, width: window.innerWidth })

		/* Lock body scroll */
		const originalOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		/* Keyboard navigation */
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") props.onClose()
			if (e.key === "ArrowLeft") props.onNavigate(Math.max(0, props.currentIndex - 1))
			if (e.key === "ArrowRight")
				props.onNavigate(Math.min(props.images.length - 1, props.currentIndex + 1))
		}
		window.addEventListener("keydown", handleKeyDown)

		onCleanup(() => {
			document.body.style.overflow = originalOverflow
			window.removeEventListener("keydown", handleKeyDown)
		})
	})

	const currentImage = () => props.images[props.currentIndex]
	const hasPrev = () => props.currentIndex > 0
	const hasNext = () => props.currentIndex < props.images.length - 1

	return (
		<div
			data-testid="lightbox-loaded"
			onClick={(e) => e.target === e.currentTarget && props.onClose()}
			style={{
				"align-items": "center",
				background: "rgba(0,0,0,0.9)",
				display: "flex",
				inset: "0",
				"justify-content": "center",
				position: "fixed",
				"z-index": "1000",
			}}
		>
			{/* Close button */}
			<button
				data-testid="lightbox-close"
				onClick={props.onClose}
				style={{
					background: "transparent",
					border: "none",
					color: "white",
					cursor: "pointer",
					"font-size": "24px",
					position: "absolute",
					right: "20px",
					top: "20px",
				}}
				type="button"
			>
				✕
			</button>

			{/* Previous button */}
			<button
				data-testid="lightbox-prev"
				disabled={!hasPrev()}
				onClick={() => props.onNavigate(props.currentIndex - 1)}
				style={{
					background: "rgba(255,255,255,0.2)",
					border: "none",
					color: "white",
					cursor: hasPrev() ? "pointer" : "not-allowed",
					"font-size": "24px",
					left: "20px",
					opacity: hasPrev() ? 1 : 0.3,
					padding: "16px",
					position: "absolute",
				}}
				type="button"
			>
				←
			</button>

			{/* Image */}
			<img
				alt={currentImage()?.alt}
				data-testid="lightbox-image"
				src={currentImage()?.src}
				style={{ "max-height": "80vh", "max-width": "80vw", "object-fit": "contain" }}
			/>

			{/* Next button */}
			<button
				data-testid="lightbox-next"
				disabled={!hasNext()}
				onClick={() => props.onNavigate(props.currentIndex + 1)}
				style={{
					background: "rgba(255,255,255,0.2)",
					border: "none",
					color: "white",
					cursor: hasNext() ? "pointer" : "not-allowed",
					"font-size": "24px",
					opacity: hasNext() ? 1 : 0.3,
					padding: "16px",
					position: "absolute",
					right: "20px",
				}}
				type="button"
			>
				→
			</button>

			{/* Info bar */}
			<div
				data-testid="lightbox-info"
				style={{
					background: "rgba(0,0,0,0.5)",
					bottom: "0",
					color: "white",
					"font-size": "14px",
					left: "0",
					padding: "12px",
					position: "absolute",
					right: "0",
					"text-align": "center",
				}}
			>
				<span data-testid="lightbox-counter">
					{props.currentIndex + 1} / {props.images.length}
				</span>
				<span style={{ margin: "0 16px" }}>|</span>
				<span data-testid="lightbox-mounted">Mounted: {mounted() ? "yes" : "no"}</span>
				<span style={{ margin: "0 16px" }}>|</span>
				<span data-testid="lightbox-viewport">
					Viewport: {viewportSize().width}x{viewportSize().height}
				</span>
			</div>
		</div>
	)
}
