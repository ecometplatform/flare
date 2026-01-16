/**
 * Flare Router Context
 * Provides router state and navigation methods to components.
 */

import { createContext, useContext } from "solid-js"
import type { MatchedRoute } from "../outlet"

interface Location {
	hash: string
	pathname: string
	search: string
}

interface RouterState {
	isNavigating: boolean
	location: Location
	matches: MatchedRoute[]
}

interface NavigateOptions {
	hash?: string
	params?: Record<string, string | string[]>
	replace?: boolean
	search?: Record<string, unknown>
	shallow?: boolean
	to: string
	viewTransition?: boolean
}

interface PrefetchOptions {
	params?: Record<string, string | string[]>
	to: string
}

interface Router {
	clearCache: () => void
	navigate: (options: NavigateOptions) => void
	prefetch: (options: PrefetchOptions) => void
	refetch: () => void
	state: RouterState
}

function createRouterState(config?: Partial<RouterState>): RouterState {
	return {
		isNavigating: config?.isNavigating ?? false,
		location: config?.location ?? { hash: "", pathname: "/", search: "" },
		matches: config?.matches ?? [],
	}
}

function isRouterState(value: unknown): value is RouterState {
	if (typeof value !== "object" || value === null) {
		return false
	}

	const obj = value as Record<string, unknown>

	if (typeof obj.isNavigating !== "boolean") {
		return false
	}

	if (typeof obj.location !== "object" || obj.location === null) {
		return false
	}

	if (!Array.isArray(obj.matches)) {
		return false
	}

	return true
}

interface CreateRouterConfig {
	initialState?: RouterState
}

function createRouter(config?: CreateRouterConfig): Router {
	const state = config?.initialState ?? createRouterState()

	return {
		clearCache: () => {},
		navigate: () => {},
		prefetch: () => {},
		refetch: () => {},
		state,
	}
}

const RouterContext = createContext<Router | undefined>(undefined)

function useRouter(): Router {
	const router = useContext(RouterContext)
	if (!router) {
		throw new Error("[useRouter] Must be used within RouterContext.Provider")
	}
	return router
}

export type { CreateRouterConfig, Location, NavigateOptions, PrefetchOptions, Router, RouterState }

export { createRouter, createRouterState, isRouterState, RouterContext, useRouter }
