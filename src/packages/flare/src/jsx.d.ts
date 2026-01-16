/**
 * Flare JSX Type Extensions
 *
 * Extends Solid's JSX types with flare-specific props:
 * - css: Scoped inline CSS (transforms to data-c attribute)
 * - tw: Tailwind classes (transforms to css at build time)
 */

import "solid-js"

declare module "solid-js" {
	namespace JSX {
		/* biome-ignore lint/correctness/noUnusedVariables: required for module augmentation */
		interface HTMLAttributes<T> {
			/** Scoped inline CSS - transformed to data-c={registerCSS(...)} */
			css?: string
			/** Tailwind classes - transformed to css at build time */
			tw?: string
		}

		/* biome-ignore lint/correctness/noUnusedVariables: required for module augmentation */
		interface SVGAttributes<T> {
			/** Scoped inline CSS - transformed to data-c={registerCSS(...)} */
			css?: string
			/** Tailwind classes - transformed to css at build time */
			tw?: string
		}

		/* biome-ignore lint/correctness/noUnusedVariables: required for module augmentation */
		interface DOMAttributes<T> {
			/** Scoped inline CSS - transformed to data-c={registerCSS(...)} */
			css?: string
			/** Tailwind classes - transformed to css at build time */
			tw?: string
		}
	}
}

export { JSX } from "solid-js"
