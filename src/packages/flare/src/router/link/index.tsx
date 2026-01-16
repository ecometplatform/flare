/* biome-ignore-all lint/a11y/useSemanticElements: Disabled links use span+role="link" intentionally */

/**
 * Flare Link Component
 * SPA navigation with prefetch strategies and active state detection.
 * Same component runs on server AND client - structure must match for hydration.
 */

import { createEffect, createMemo, createSignal, type JSX, onCleanup, splitProps } from "solid-js"
import type { ViewTransitionConfig } from "../../client/view-transitions/types"
import type { NavFormat } from "../../server/handler/constants"
import type { PrefetchStrategy } from "../_internal/types"
import { buildUrl } from "../build-url"

export interface LinkProps {
	activeClass?: string
	children?: JSX.Element
	class?: string
	disabled?: boolean
	force?: boolean
	hash?: string
	inactiveClass?: string
	navFormat?: NavFormat
	params?: Record<string, string | string[]>
	prefetch?: PrefetchStrategy
	replace?: boolean
	scroll?: boolean
	search?: Record<string, unknown>
	shallow?: boolean
	to: string
	/** View transition configuration. true = use direction, object = custom types */
	viewTransition?: ViewTransitionConfig
}

export function isLinkProps(value: unknown): value is LinkProps {
	if (typeof value !== "object" || value === null) {
		return false
	}

	const obj = value as Record<string, unknown>

	if (typeof obj.to !== "string") {
		return false
	}

	return true
}

export function createLinkProps(props: LinkProps): LinkProps & { prefetch: PrefetchStrategy } {
	return {
		...props,
		prefetch: props.prefetch ?? "hover",
	}
}

/**
 * Router interface for Link component.
 * Optional to allow standalone usage without full router.
 */
interface LinkRouter {
	navigate: (options: {
		hash?: string
		navFormat?: NavFormat
		params?: Record<string, string | string[]>
		replace?: boolean
		scroll?: boolean
		search?: Record<string, unknown>
		shallow?: boolean
		to: string
		viewTransition?: ViewTransitionConfig
	}) => Promise<void>
	prefetch: (options: { navFormat?: NavFormat; to: string }) => Promise<void>
	state: {
		location: {
			pathname: string
		}
	}
}

/**
 * Router context for Link.
 * Uses globalThis singleton so SSR and client builds share the same instance.
 * Set via setLinkRouter() during client initialization.
 */
const LINK_ROUTER_KEY = "__FLARE_LINK_ROUTER__"

function getLinkRouterInternal(): LinkRouter | null {
	return (globalThis as Record<string, unknown>)[LINK_ROUTER_KEY] as LinkRouter | null
}

export function setLinkRouter(router: LinkRouter | null): void {
	;(globalThis as Record<string, unknown>)[LINK_ROUTER_KEY] = router
}

export function getLinkRouter(): LinkRouter | null {
	return getLinkRouterInternal()
}

/**
 * Link component - unified for SSR and client hydration.
 * Same structure on both sides for correct hydration.
 */
export function Link(props: LinkProps): JSX.Element {
	const linkRouter = getLinkRouterInternal()

	const [local, anchorProps] = splitProps(props, [
		"activeClass",
		"children",
		"disabled",
		"force",
		"hash",
		"inactiveClass",
		"navFormat",
		"params",
		"prefetch",
		"replace",
		"scroll",
		"search",
		"shallow",
		"to",
		"viewTransition",
	])

	const href = createMemo(() =>
		buildUrl({
			hash: local.hash,
			params: local.params,
			search: local.search,
			to: local.to,
		}),
	)

	const isActive = createMemo(() => {
		if (!linkRouter) return false
		const currentPath = linkRouter.state.location.pathname
		const resolvedHref = href()
		return currentPath === resolvedHref || currentPath.startsWith(`${resolvedHref}/`)
	})

	const computedClass = createMemo(() => {
		const classes: string[] = []
		if (anchorProps.class) classes.push(anchorProps.class)
		if (isActive() && local.activeClass) {
			classes.push(local.activeClass)
		} else if (!isActive() && local.inactiveClass) {
			classes.push(local.inactiveClass)
		}
		/* Always return string to ensure SSR/client parity - undefined would cause hydration mismatch */
		return classes.join(" ")
	})

	const [hasPrefetched, setHasPrefetched] = createSignal(false)

	let elementRef: HTMLAnchorElement | undefined

	createEffect(() => {
		if (local.prefetch !== "viewport" || !elementRef || !linkRouter || hasPrefetched()) {
			return
		}
		if (typeof IntersectionObserver === "undefined") {
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry?.isIntersecting && !hasPrefetched()) {
					setHasPrefetched(true)
					linkRouter?.prefetch({ navFormat: local.navFormat, to: local.to }).catch(() => {})
					observer.disconnect()
				}
			},
			{ rootMargin: "100px" },
		)

		observer.observe(elementRef)
		onCleanup(() => observer.disconnect())
	})

	const handleMouseEnter = () => {
		if (local.prefetch === "hover" && linkRouter && !hasPrefetched()) {
			setHasPrefetched(true)
			linkRouter.prefetch({ navFormat: local.navFormat, to: local.to }).catch(() => {})
		}
	}

	const handleClick: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = (e) => {
		if (local.disabled) {
			e.preventDefault()
			return
		}
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
			return
		}

		e.preventDefault()

		if (linkRouter && !local.force) {
			const resolvedHref = href()
			const currentFull =
				typeof window !== "undefined"
					? window.location.pathname + window.location.search + window.location.hash
					: linkRouter.state.location.pathname
			if (currentFull === resolvedHref) {
				return
			}
		}

		if (linkRouter) {
			linkRouter
				.navigate({
					hash: local.hash,
					navFormat: local.navFormat,
					params: local.params,
					replace: local.replace,
					scroll: local.scroll,
					search: local.search,
					shallow: local.shallow,
					to: local.to,
					viewTransition: local.viewTransition,
				})
				.catch(() => {})
		}
	}

	if (local.disabled) {
		return (
			<span
				aria-disabled="true"
				class={computedClass()}
				role="link"
				style="cursor:not-allowed"
				tabIndex={-1}
			>
				{local.children}
			</span>
		)
	}

	return (
		<a
			{...anchorProps}
			class={computedClass()}
			href={href()}
			onClick={handleClick}
			onMouseEnter={handleMouseEnter}
			ref={elementRef}
		>
			{local.children}
		</a>
	)
}

export type { PrefetchStrategy }
