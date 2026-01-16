import { styles } from "@ecomet/flare/styles"
import { For, mergeProps } from "solid-js"

// Demo component
export function Products(props: {
	activeIndex?: number
	highlightColor?: string
	padding?: string
}) {
	const merged = mergeProps({ activeIndex: 0, highlightColor: "#3b82f6", padding: "1rem" }, props)

	return (
		<ul
			{...styles("products", {
				css: (_, v) => `
					list-style: none;
					padding: ${v.padding};
					margin: 0;

					& li {
						padding: 0.5rem;
						border-bottom: 1px solid #eee;
					}
				`,
				vars: { padding: merged.padding },
			})}
		>
			<For each={[1, 2, 3]}>
				{(item, index) => (
					<li
						{...styles("product-item", {
							css: (s, v) => `
								background: white;
								transition: background 0.2s;

								${s.active(true)} {
									background: ${v.highlight};
									color: white;
									font-weight: bold;
								}

								${s.active(false)}:hover {
									background: #f5f5f5;
								}
							`,
							state: { active: index() === merged.activeIndex },
							vars: { highlight: merged.highlightColor },
						})}
					>
						Product {item}
					</li>
				)}
			</For>
		</ul>
	)
}

// Example usage showing all features
export function ProductsDemo() {
	const isLoading = false
	const accentColor = "#10b981"
	const spacing = "2rem"

	return (
		<section
			{...styles("products-demo", {
				css: (s, v) => `
					padding: ${v.spacing};
					background: #fafafa;

					${s.loading(true)} {
						opacity: 0.5;
						pointer-events: none;
					}
				`,
				state: { loading: isLoading },
				vars: { spacing },
			})}
		>
			<h2
				{...styles("demo-title", {
					css: (_, v) => `
						font-size: 1.5rem;
						color: ${v.color};
					`,
					vars: { color: accentColor },
				})}
			>
				Products
			</h2>
			<Products activeIndex={1} highlightColor={accentColor} padding="0.5rem" />
		</section>
	)
}

// Simple example - just styles, no state or vars
export function SimpleBox() {
	return (
		<div
			{...styles(
				"simple-box",
				`
					padding: 1rem;
					background: #e0e0e0;
					border-radius: 8px;
				`,
			)}
		>
			Simple box with just CSS
		</div>
	)
}
