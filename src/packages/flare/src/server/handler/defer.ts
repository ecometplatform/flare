/**
 * Defer Helper
 *
 * Deferred streaming for SSR/CSR.
 * Wraps promises to stream after shell renders.
 *
 * Behavior by context:
 * - Initial load + disableDefer: false → await by default
 * - Initial load + disableDefer: true → stream by default
 * - CSR nav → always stream
 */

interface DeferredPromise<T = unknown> {
	key: string
	matchId: string | null
	promise: Promise<T>
	ref: Deferred<T>
	stream: boolean
}

interface Deferred<T> {
	__deferred: true
	__error?: { message: string }
	__key?: string
	__resolved?: T
	promise: Promise<T>
}

interface DeferOptions {
	key?: string
	stream?: boolean
}

interface DeferContextOptions {
	disableDefer?: boolean
	initialLoad?: boolean
	matchId?: string
}

interface AwaitDeferredOptions {
	awaitAll?: boolean
}

interface DeferContext {
	awaitDeferred: (opts?: AwaitDeferredOptions) => Promise<Map<string, unknown>>
	defer: <T>(fn: () => Promise<T>, options?: DeferOptions) => Deferred<T>
	disableDefer: boolean
	getDeferred: () => DeferredPromise[]
	initialLoad: boolean
}

function createDeferContext(options: DeferContextOptions): DeferContext {
	const initialLoad = options.initialLoad ?? true
	const disableDefer = options.disableDefer ?? false
	const matchId = options.matchId ?? null
	const deferred: DeferredPromise[] = []
	let deferIndex = 0

	function defer<T>(fn: () => Promise<T>, opts?: DeferOptions): Deferred<T> {
		const key = opts?.key ?? `d${deferIndex++}`
		const promise = fn()

		/* Determine stream behavior - explicit override takes precedence */
		let stream: boolean
		if (opts?.stream !== undefined) {
			stream = opts.stream
		} else if (!initialLoad) {
			/* CSR nav streams by default */
			stream = true
		} else {
			/* Initial load - default based on disableDefer */
			stream = disableDefer
		}

		const ref: Deferred<T> = {
			__deferred: true as const,
			__key: key,
			promise,
		}

		deferred.push({
			key,
			matchId,
			promise: promise as Promise<unknown>,
			ref: ref as Deferred<unknown>,
			stream,
		})

		return ref
	}

	function getDeferred(): DeferredPromise[] {
		return deferred
	}

	async function awaitDeferred(opts?: AwaitDeferredOptions): Promise<Map<string, unknown>> {
		const results = new Map<string, unknown>()
		/* SSR should await ALL deferred (awaitAll: true), CSR nav only awaits non-streaming */
		const toAwait = opts?.awaitAll ? deferred : deferred.filter((d) => !d.stream)

		const settled = await Promise.allSettled(toAwait.map((d) => d.promise))

		for (let i = 0; i < toAwait.length; i++) {
			const d = toAwait[i]
			const result = settled[i]
			if (d && result?.status === "fulfilled") {
				results.set(d.key, result.value)
				/* Store resolved value in the Deferred ref for SSR */
				d.ref.__resolved = result.value
			} else if (d && result?.status === "rejected") {
				/* Store error as serializable object for SSR hydration */
				const error =
					result.reason instanceof Error ? result.reason : new Error(String(result.reason))
				d.ref.__error = { message: error.message }
			}
		}

		return results
	}

	return {
		awaitDeferred,
		defer,
		disableDefer,
		getDeferred,
		initialLoad,
	}
}

export type { DeferContext, DeferContextOptions, DeferOptions, Deferred, DeferredPromise }

export { createDeferContext }
