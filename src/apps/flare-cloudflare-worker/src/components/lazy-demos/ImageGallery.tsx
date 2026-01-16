/**
 * Image Gallery Component (SSR-safe)
 *
 * This component CAN render on the server - good for SEO.
 * No browser APIs used in render.
 */

interface ImageGalleryProps {
	images: { alt: string; id: string; src: string; thumbnail: string }[]
	onImageClick: (index: number) => void
}

export default function ImageGallery(props: ImageGalleryProps) {
	return (
		<div
			data-testid="gallery-loaded"
			style={{
				display: "grid",
				gap: "12px",
				"grid-template-columns": "repeat(auto-fill, minmax(150px, 1fr))",
			}}
		>
			{props.images.map((img, index) => (
				<button
					data-testid={`gallery-item-${img.id}`}
					onClick={() => props.onImageClick(index)}
					style={{
						background: "none",
						border: "2px solid transparent",
						cursor: "pointer",
						padding: "0",
						transition: "border-color 0.2s",
					}}
					type="button"
				>
					<img
						alt={img.alt}
						src={img.thumbnail}
						style={{
							display: "block",
							height: "120px",
							"object-fit": "cover",
							width: "100%",
						}}
					/>
					<p style={{ "font-size": "12px", margin: "4px 0 0", "text-align": "center" }}>
						{img.alt}
					</p>
				</button>
			))}
		</div>
	)
}
