/**
 * useLoaderData Hook
 *
 * Type-safe hook for accessing loader data by virtualPath.
 * Local type definition allows proper module augmentation resolution.
 */

import { FlareContext, getGlobalFlareContext } from "@ecomet/flare/client/flare-context"
import { type Accessor, useContext } from "solid-js"
import type { FlareRegister } from "../register"

/**
 * Local map type - evaluated at call site where augmentation is visible
 */
type LoaderDataMap = FlareRegister extends { loaderData: infer TMap }
	? TMap extends Record<string, unknown>
		? TMap
		: Record<string, never>
	: Record<string, never>

interface MatchesContext {
	matches: () => Array<{ loaderData?: unknown; virtualPath: string }>
}

/**
 * Type-safe hook - only accepts valid virtualPaths from FlareRegister.loaderData
 *
 * Uses solid-js context on client, falls back to global SSR value during SSR
 * due to module identity issues with Vite's SSR environment.
 */
export function useLoaderData<TPath extends keyof LoaderDataMap>(options: {
	virtualPath: TPath
}): Accessor<LoaderDataMap[TPath]> {
	/* Try solid-js context first (works on client) */
	let ctx = useContext(FlareContext) as MatchesContext | undefined

	/* Fall back to global (works during SSR and client with module identity issues) */
	if (!ctx) {
		ctx = getGlobalFlareContext() as MatchesContext | undefined
	}

	if (!ctx) {
		throw new Error("[useLoaderData] Must be used within FlareProvider")
	}

	/* Validate virtualPath is in current route chain */
	const matches = ctx.matches()
	const match = matches.find((m) => m.virtualPath === options.virtualPath)

	if (!match) {
		const availablePaths = matches.map((m) => m.virtualPath).join(", ")
		throw new Error(
			`[useLoaderData] virtualPath "${options.virtualPath}" is not in the current route chain. ` +
				`Available paths: [${availablePaths}]. ` +
				"You can only access loader data from routes that are ancestors of or the current route.",
		)
	}

	return (() => match.loaderData) as Accessor<LoaderDataMap[TPath]>
}
