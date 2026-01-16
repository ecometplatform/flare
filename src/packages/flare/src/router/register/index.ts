/**
 * Flare Type Registration
 *
 * Type utilities for module augmentation in generated types.
 * Pattern matches v1 exactly for proper type resolution.
 */

/**
 * FlareRegister interface - augmented by generated types.gen.d.ts
 * Apps extend this to provide type-safe route information.
 *
 * Must be empty - apps augment via declare module to add properties.
 */
/* biome-ignore lint/complexity/noBannedTypes: intentionally empty for module augmentation */
export type FlareRegister = {}

/**
 * Extract valid virtual paths from FlareRegister.preloaderContext.
 * Returns string union of all registered preloader context paths.
 */
export type RegisteredPreloaderPaths = FlareRegister extends {
	preloaderContext: infer TMap
}
	? TMap extends Record<string, unknown>
		? keyof TMap & string
		: string
	: string

/**
 * Extract valid virtual paths from FlareRegister.loaderData.
 * Returns string union of all registered loader data paths.
 */
export type RegisteredLoaderPaths = FlareRegister extends {
	loaderData: infer TMap
}
	? TMap extends Record<string, unknown>
		? keyof TMap & string
		: string
	: string

/**
 * Resolve preloader context for a path from Register.
 * TPath must be a valid key from FlareRegister.preloaderContext.
 * Same pattern as ResolvedLoaderData for consistency.
 */
export type ResolvedPreloaderContext<TPath extends RegisteredPreloaderPaths> =
	FlareRegister extends { preloaderContext: infer TMap }
		? TMap extends Record<string, unknown>
			? TPath extends keyof TMap
				? TMap[TPath]
				: Record<string, never>
			: Record<string, never>
		: Record<string, never>

/**
 * Extract valid virtual paths from FlareRegister.parentPreloaderContext.
 */
export type RegisteredParentPreloaderPaths = FlareRegister extends {
	parentPreloaderContext: infer TMap
}
	? TMap extends Record<string, unknown>
		? keyof TMap & string
		: string
	: string

/**
 * Resolve PARENT preloader context for a path from Register.
 * Only includes parent layouts, NOT self - for builders to avoid circular dependency.
 */
export type ResolvedParentPreloaderContext<TPath extends RegisteredParentPreloaderPaths> =
	FlareRegister extends {
		parentPreloaderContext: infer TMap
	}
		? TMap extends Record<string, unknown>
			? TPath extends keyof TMap
				? TMap[TPath]
				: Record<string, never>
			: Record<string, never>
		: Record<string, never>

/**
 * Resolve loader data for a path from Register.
 * TPath must be a valid key from FlareRegister.loaderData.
 * Returns { layout: ...; page: ... } structure.
 */
export type ResolvedLoaderData<TPath extends RegisteredLoaderPaths> = FlareRegister extends {
	loaderData: infer TMap
}
	? TMap extends Record<string, unknown>
		? TPath extends keyof TMap
			? TMap[TPath]
			: unknown
		: unknown
	: unknown

/**
 * Extract preloader context type from a route's render props.
 * The render function receives props with `preloaderContext: TPreloaderContext`.
 * This extracts TPreloaderContext directly from the generic, not from function return.
 */
/* biome-ignore lint/suspicious/noExplicitAny: Required for props inference */
export type ExtractPreloaderData<T> = T extends { render: (props: infer P) => any }
	? P extends { preloaderContext: infer C }
		? C
		: Record<string, never>
	: Record<string, never>

/**
 * Extract loader data type from a route's loader function return type.
 */
export type ExtractLoaderData<T> = T extends { loader?: infer L }
	? /* biome-ignore lint/suspicious/noExplicitAny: required for function contravariance */
		NonNullable<L> extends (...args: any[]) => infer R
		? Awaited<R>
		: undefined
	: undefined

/**
 * Extract search params type from a route factory result
 */
export type ExtractSearchParams<T> = T extends { inputConfig: { searchParams: infer S } }
	? S extends { _output: infer O }
		? O
		: Record<string, string>
	: Record<string, string>

/**
 * Extract params type from a route factory result.
 * Returns Record<string, never> when no params defined, allowing intersection with path-derived params.
 */
export type ExtractParams<T> = T extends { inputConfig: { params: infer P } }
	? P extends { _output: infer O }
		? O
		: Record<string, never>
	: Record<string, never>

/**
 * Extract authenticate mode from route options.
 * Returns true | "optional" | false based on route's .options({ authenticate }).
 *
 * Handles optional properties by using NonNullable to unwrap.
 */
export type ExtractAuthMode<T> = T extends { options?: infer O }
	? NonNullable<O> extends { authenticate?: infer A }
		? NonNullable<A> extends true
			? true
			: NonNullable<A> extends "optional"
				? "optional"
				: false
		: false
	: false

/**
 * Check if any element in tuple is true
 */
type HasRequiredAuth<T extends unknown[]> = T extends [infer Head, ...infer Tail]
	? Head extends true
		? true
		: HasRequiredAuth<Tail>
	: false

/**
 * Check if any element in tuple is "optional"
 */
type HasOptionalAuth<T extends unknown[]> = T extends [infer Head, ...infer Tail]
	? Head extends "optional"
		? true
		: HasOptionalAuth<Tail>
	: false

/**
 * Get the Auth type from FlareRegister, or null if not defined
 */
type RegisteredAuth = FlareRegister extends { auth: infer A } ? A : null

/**
 * Resolve auth type from a chain of auth modes.
 * If any is true → Auth (required)
 * Else if any is "optional" → Auth | null
 * Else → null
 */
export type ResolveAuthChain<TModes extends unknown[]> =
	HasRequiredAuth<TModes> extends true
		? RegisteredAuth
		: HasOptionalAuth<TModes> extends true
			? RegisteredAuth | null
			: null

/**
 * Resolve auth type for a path from Register.
 * Returns Auth (required), Auth | null (optional), or null (no auth).
 */
export type ResolvedAuth<TPath extends string> = FlareRegister extends {
	authContext: infer TMap
}
	? TMap extends Record<string, unknown>
		? TPath extends keyof TMap
			? TMap[TPath]
			: null
		: null
	: null
