/**
 * Flare Router Hooks
 * Reactive hooks for accessing router state in components.
 */

import { type Accessor, createSignal } from "solid-js"
import type { MatchedRoute } from "../outlet"
import type { Location } from "../router-context"

interface UseMatchOptions {
	virtualPath: string
}

function createLocationSignal(
	initial: Location,
): [Accessor<Location>, (location: Location) => void] {
	const [location, setLocation] = createSignal(initial)
	return [location, setLocation]
}

function createParamsSignal<T extends Record<string, string>>(
	initial: T,
): [Accessor<T>, (params: T) => void] {
	const [params, setParams] = createSignal(initial)
	return [params, setParams]
}

function createSearchSignal<T extends Record<string, unknown>>(
	initial: T,
): [Accessor<T>, (search: T) => void] {
	const [search, setSearch] = createSignal(initial)
	return [search, setSearch]
}

function useLocation(): Accessor<Location> {
	throw new Error("[useLocation] Must be used within RouterContext.Provider")
}

function useParams<T extends Record<string, string>>(): Accessor<T> {
	throw new Error("[useParams] Must be used within RouterContext.Provider")
}

function useSearch<T extends Record<string, unknown>>(): Accessor<T> {
	throw new Error("[useSearch] Must be used within RouterContext.Provider")
}

function useMatch(_options: UseMatchOptions): Accessor<MatchedRoute | undefined> {
	throw new Error("[useMatch] Must be used within RouterContext.Provider")
}

function useMatches(): Accessor<MatchedRoute[]> {
	throw new Error("[useMatches] Must be used within RouterContext.Provider")
}

function useHydrated(): Accessor<boolean> {
	throw new Error("[useHydrated] Must be used within RouterContext.Provider")
}

/* Re-export from dedicated modules */
export { useLoaderData } from "../use-loader-data"
export { usePreloaderContext } from "../use-preloader-context"

export type { UseMatchOptions }

export {
	createLocationSignal,
	createParamsSignal,
	createSearchSignal,
	useHydrated,
	useLocation,
	useMatch,
	useMatches,
	useParams,
	useSearch,
}
