/**
 * CSS Test Page
 *
 * Tests the css prop and tw prop functionality:
 * - Basic inline CSS
 * - Multiple CSS properties
 * - CSS specificity via data-c attribute
 * - SSR style injection
 * - Client-side style hydration
 * - Tailwind tw prop transformation
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const CssTestPage = createPage({ virtualPath: "_root_/css-test" }).render(() => (
	<main>
		<h1>CSS Prop Tests</h1>

		<section data-testid="basic-css">
			<h2>Basic CSS</h2>
			<div css="color: red;" data-testid="red-text">
				This text should be red
			</div>
			<div css="color: blue;" data-testid="blue-text">
				This text should be blue
			</div>
		</section>

		<section data-testid="multiple-props">
			<h2>Multiple CSS Properties</h2>
			<div
				css="background-color: yellow; padding: 16px; border-radius: 8px; font-weight: bold;"
				data-testid="styled-box"
			>
				Yellow box with padding and bold text
			</div>
		</section>

		<section data-testid="nested-elements">
			<h2>Nested Elements</h2>
			<div css="border: 2px solid green; padding: 8px;" data-testid="outer-box">
				<span css="color: purple; font-size: 20px;" data-testid="inner-text">
					Purple text inside green border
				</span>
			</div>
		</section>

		<section data-testid="dynamic-values">
			<h2>Dynamic CSS Values</h2>
			<div css={`font-size: ${24}px; color: orange;`} data-testid="dynamic-css">
				Dynamic 24px orange text
			</div>
		</section>

		<section data-testid="specificity-test">
			<h2>CSS Specificity</h2>
			<div
				class="should-be-overridden"
				css="color: teal;"
				data-testid="specificity-element"
				style={{ color: "gray" }}
			>
				Should be teal (css prop) not gray (inline style) or inherited
			</div>
		</section>

		<section data-testid="tw-basic">
			<h2>Tailwind tw Prop - Basic</h2>
			<div data-testid="tw-red-text" tw="text-red-500">
				This text should be red (via tw)
			</div>
			<div data-testid="tw-blue-text" tw="text-blue-500">
				This text should be blue (via tw)
			</div>
		</section>

		<section data-testid="tw-multiple">
			<h2>Tailwind tw Prop - Multiple Classes</h2>
			<div data-testid="tw-styled-box" tw="bg-yellow-200 p-4 rounded-lg font-bold">
				Yellow box with padding and bold text (via tw)
			</div>
		</section>

		<section data-testid="tw-layout">
			<h2>Tailwind tw Prop - Layout</h2>
			<div data-testid="tw-flex-container" tw="flex gap-4">
				<div data-testid="tw-flex-item-1" tw="bg-green-200 p-2">
					Flex Item 1
				</div>
				<div data-testid="tw-flex-item-2" tw="bg-blue-200 p-2">
					Flex Item 2
				</div>
				<div data-testid="tw-flex-item-3" tw="bg-purple-200 p-2">
					Flex Item 3
				</div>
			</div>
		</section>

		<section data-testid="tw-responsive">
			<h2>Tailwind tw Prop - Font Sizes</h2>
			<div data-testid="tw-text-xs" tw="text-xs">
				Extra small text
			</div>
			<div data-testid="tw-text-sm" tw="text-sm">
				Small text
			</div>
			<div data-testid="tw-text-base" tw="text-base">
				Base text
			</div>
			<div data-testid="tw-text-lg" tw="text-lg">
				Large text
			</div>
			<div data-testid="tw-text-xl" tw="text-xl">
				Extra large text
			</div>
		</section>

		<section data-testid="tw-dynamic">
			<h2>Tailwind - Dynamic Expressions</h2>
			{/* Curly braces with string literal */}
			<div data-testid="tw-curly-string" tw={"text-green-500 font-semibold"}>
				Green semibold text (curly string)
			</div>
			{/* Conditional expression with extractable strings */}
			<div data-testid="tw-ternary-true" tw={true ? "bg-emerald-200" : "bg-rose-200"}>
				Emerald background (ternary true)
			</div>
			<div data-testid="tw-ternary-false" tw={false ? "bg-emerald-200" : "bg-rose-200"}>
				Rose background (ternary false)
			</div>
			{/* Logical OR with extractable strings */}
			<div data-testid="tw-logical-or" tw={"" || "text-indigo-600"}>
				Indigo text (logical OR fallback)
			</div>
		</section>

		<nav css="margin-top: 32px;">
			<Link to="/">Back to Home</Link>
		</nav>
	</main>
))
