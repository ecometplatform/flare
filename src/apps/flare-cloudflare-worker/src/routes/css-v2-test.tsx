/**
 * Styles API Test Route
 *
 * Tests the styles() function with state, variables, and outerCss
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { styles } from "@ecomet/flare/styles"
import { createSignal, For, type ParentProps, splitProps } from "solid-js"

/**
 * Card component that accepts outer CSS string
 * Demonstrates the outerCss pattern for parent customization
 */
function Card(props: ParentProps<{ outerCss?: string; title: string }>) {
	const [local] = splitProps(props, ["outerCss", "title", "children"])

	return (
		<div
			{...styles("css-v2-card", {
				css: `
					padding: 1rem;
					background: white;
					border: 1px solid #ddd;
					border-radius: 6px;
				`,
				outerCss: local.outerCss,
			})}
		>
			<h4
				{...styles("css-v2-card-title", {
					css: `
						margin: 0 0 0.5rem 0;
						font-size: 1rem;
						color: #333;
					`,
				})}
			>
				{local.title}
			</h4>
			<div>{local.children}</div>
		</div>
	)
}

export const CssV2TestPage = createPage({ virtualPath: "_root_/css-v2-test" }).render(() => {
	const [activeIndex, setActiveIndex] = createSignal(0)
	const [accentColor, setAccentColor] = createSignal("#3b82f6")
	const [isLoading, setIsLoading] = createSignal(false)

	return (
		<div
			{...styles("css-v2-page", {
				css: `
					padding: 2rem;
					max-width: 800px;
					margin: 0 auto;
					font-family: system-ui, sans-serif;
				`,
			})}
		>
			<h1
				{...styles("css-v2-title", {
					css: (_, v) => `
						font-size: 2rem;
						margin-bottom: 1rem;
						color: ${v.color};
					`,
					vars: { color: accentColor() },
				})}
			>
				CSS v2 API Test
			</h1>

			{/* Controls */}
			<div
				{...styles("css-v2-controls", {
					css: `
						display: flex;
						gap: 1rem;
						margin-bottom: 2rem;
						flex-wrap: wrap;
					`,
				})}
			>
				<label>
					Active Index:
					<input
						max="2"
						min="0"
						onInput={(e) => setActiveIndex(Number(e.currentTarget.value))}
						type="number"
						value={activeIndex()}
					/>
				</label>
				<label>
					Accent Color:
					<input
						onInput={(e) => setAccentColor(e.currentTarget.value)}
						type="color"
						value={accentColor()}
					/>
				</label>
				<button onClick={() => setIsLoading(!isLoading())} type="button">
					Toggle Loading: {isLoading() ? "ON" : "OFF"}
				</button>
			</div>

			{/* Products Demo */}
			<section
				{...styles("css-v2-demo", {
					css: (s) => `
						padding: 1rem;
						background: #fafafa;
						border-radius: 8px;

						${s.loading(true)} {
							opacity: 0.5;
							pointer-events: none;
						}
					`,
					state: { loading: isLoading() },
				})}
			>
				<h2>Products</h2>
				<ul
					{...styles("css-v2-products", {
						css: `
							list-style: none;
							padding: 0;
							margin: 0;
						`,
					})}
				>
					<For each={["Product A", "Product B", "Product C"]}>
						{(item, index) => (
							<li
								{...styles("css-v2-product-item", {
									css: (s, v) => `
										padding: 0.75rem 1rem;
										border-bottom: 1px solid #eee;
										cursor: pointer;
										transition: all 0.2s;

										${s.active(true)} {
											background: ${v.highlight};
											color: white;
											font-weight: bold;
										}

										${s.active(false)}:hover {
											background: #f0f0f0;
										}
									`,
									state: { active: index() === activeIndex() },
									vars: { highlight: accentColor() },
								})}
								onClick={() => setActiveIndex(index())}
							>
								{item}
							</li>
						)}
					</For>
				</ul>
			</section>

			{/* Simple Box - string only */}
			<div
				{...styles(
					"css-v2-simple-box",
					`
					margin-top: 2rem;
					padding: 1rem;
					background: #e0e0e0;
					border-radius: 8px;
					text-align: center;
				`,
				)}
			>
				Simple box (string-only syntax)
			</div>

			{/* Outer CSS Demo */}
			<section
				{...styles("css-v2-outer-demo", {
					css: `
						margin-top: 2rem;
						padding: 1rem;
						background: #f5f5f5;
						border-radius: 8px;
					`,
				})}
			>
				<h3>Outer CSS Demo</h3>
				<p>Cards below demonstrate parent-to-child CSS customization via outerCss prop.</p>
				<div
					{...styles("css-v2-card-grid", {
						css: `
							display: grid;
							grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
							gap: 1rem;
							margin-top: 1rem;
						`,
					})}
				>
					{/* Card without outer CSS */}
					<Card title="Default Card">This card uses default styles from the Card component.</Card>

					{/* Card with outer CSS - overrides background */}
					<Card outerCss="background: #e8f4ff; border-color: #3b82f6;" title="Styled Card">
						This card has outer CSS that overrides the background.
					</Card>

					{/* Card with outer CSS - adds shadow */}
					<Card
						outerCss="box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-color: #10b981; border-width: 2px;"
						title="Shadow Card"
					>
						This card has outer CSS with shadow and green border.
					</Card>
				</div>

				{/* Direct outer CSS test - no component wrapper */}
				<div
					{...styles("css-v2-direct-outer", {
						css: `
							padding: 1rem;
							background: white;
							border: 1px solid #ddd;
							margin-top: 1rem;
						`,
						outerCss: "background: #ffcccc; border-color: red;",
					})}
				>
					Direct outer CSS test (should have pink background)
				</div>

				{/* Style prop merge test */}
				<div
					{...styles("css-v2-style-merge", {
						css: (_, v) => `
							padding: 1rem;
							background: ${v.bg};
							margin-top: 1rem;
						`,
						style: { border: "2px dashed green", opacity: 0.9 },
						vars: { bg: "#e0ffe0" },
					})}
				>
					Style prop merge test (green bg + opacity + dashed border)
				</div>
			</section>

			{/* Tailwind Integration Demo */}
			<section
				{...styles("css-v2-tw-demo", {
					tw: "mt-8 p-4 bg-sky-50 rounded-lg",
				})}
			>
				<h3>Tailwind Integration Demo</h3>
				<p>Elements below demonstrate tw option in styles() (transformed at build time).</p>

				{/* tw only */}
				<div
					{...styles("css-v2-tw-only", {
						tw: "flex gap-4 p-4 bg-white rounded mt-4",
					})}
				>
					<span>tw only:</span>
					<span>flex layout with gap</span>
				</div>

				{/* tw + css combined */}
				<div
					{...styles("css-v2-tw-css", {
						css: "background: #fef3c7; border: 2px solid #f59e0b; border-radius: 4px; margin-top: 1rem;",
						tw: "flex items-center gap-2 p-3",
					})}
				>
					<span>tw + css:</span>
					<span>tw provides flex, css adds border/bg</span>
				</div>

				{/* tw + state */}
				<div
					{...styles("css-v2-tw-state", {
						css: (s) => `
							background: white;
							margin-top: 1rem;
							${s.selected(true)} {
								background: #dbeafe;
								border: 2px solid #3b82f6;
							}
							${s.selected(false)} {
								border: 1px solid #ddd;
							}
							${s.selected(false)}:hover {
								background: #f5f5f5;
							}
						`,
						state: { selected: activeIndex() === 0 },
						tw: "p-4 rounded cursor-pointer transition-all duration-200",
					})}
					onClick={() => setActiveIndex(activeIndex() === 0 ? 1 : 0)}
				>
					tw + state: Click me (selected: {activeIndex() === 0 ? "yes" : "no"})
				</div>

				{/* tw + vars */}
				<div
					{...styles("css-v2-tw-vars", {
						css: (_, v) => `
							background: ${v.bg};
							color: ${v.text};
							border-radius: 4px;
						`,
						tw: "grid grid-cols-2 gap-4 p-4 mt-4",
						vars: { bg: accentColor(), text: "white" },
					})}
				>
					<div>tw + vars:</div>
					<div>Grid with dynamic bg color</div>
				</div>

				{/* tw + css + state + vars (full combo) */}
				<div
					{...styles("css-v2-tw-full", {
						css: (s, v) => `
							background: white;
							border: 2px solid ${v.accent};
							margin-top: 1rem;

							${s.active(true)} {
								background: ${v.accent};
								color: white;
								transform: scale(1.02);
							}
						`,
						state: { active: isLoading() },
						tw: "p-4 rounded-lg transition-all duration-300",
						vars: { accent: accentColor() },
					})}
				>
					Full combo (tw + css + state + vars) - Loading: {isLoading() ? "ON" : "OFF"}
				</div>
			</section>
		</div>
	)
})

export default CssV2TestPage
