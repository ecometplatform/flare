/**
 * Lazy Loading Basic Tests
 *
 * Tests lazy(), clientLazy(), and preload() utilities in isolation.
 * All states: pending, success, error, retry.
 */

import { clientLazy } from "@ecomet/flare/client-lazy"
import { lazy } from "@ecomet/flare/lazy"
import { preload } from "@ecomet/flare/preload"
import { createPage } from "@ecomet/flare/router/create-page"
import { createSignal, Show } from "solid-js"

/**
 * SSR Lazy Component - loads with SSR
 */
const SSRLazyComponent = lazy({
	error: (err, retry) => (
		<div data-testid="ssr-lazy-error">
			<p>Error: {err.message}</p>
			<button data-testid="ssr-lazy-retry" onClick={retry} type="button">
				Retry
			</button>
		</div>
	),
	loader: () => import("../../components/lazy/ssr-component"),
	pending: () => <p data-testid="ssr-lazy-pending">Loading SSR component...</p>,
})

/**
 * Client-only Lazy Component - never SSR
 */
const ClientOnlyComponent = clientLazy({
	error: (err, retry) => (
		<div data-testid="client-lazy-error">
			<p>Error: {err.message}</p>
			<button data-testid="client-lazy-retry" onClick={retry} type="button">
				Retry
			</button>
		</div>
	),
	loader: () => import("../../components/lazy/client-only-component"),
	pending: () => <p data-testid="client-lazy-pending">Loading client component...</p>,
})

/**
 * Client-only with eager loading
 */
const EagerClientComponent = clientLazy({
	eager: true,
	loader: () => import("../../components/lazy/eager-component"),
	pending: () => <p data-testid="eager-lazy-pending">Loading eager component...</p>,
})

/**
 * Preloadable utility
 */
const heavyUtil = preload({
	loader: () => import("../../utils/heavy-util"),
	throws: true,
})

export const LazyTestBasicPage = createPage({ virtualPath: "_root_/lazy-test/basic" })
	.head(() => ({
		title: "Lazy Loading Basic Tests",
	}))
	.render(() => {
		const [preloadResult, setPreloadResult] = createSignal<string | null>(null)
		const [preloadError, setPreloadError] = createSignal<string | null>(null)

		const handlePreload = () => {
			heavyUtil.preload()
			setPreloadResult("Preload started")
		}

		const handleLoad = async () => {
			try {
				const mod = await heavyUtil.load()
				setPreloadResult(mod.compute(5, 3))
				setPreloadError(null)
			} catch (e) {
				setPreloadError(e instanceof Error ? e.message : "Unknown error")
			}
		}

		return (
			<main data-testid="lazy-test-page">
				<h1>Lazy Loading Basic Tests</h1>

				{/* SSR Lazy Component */}
				<section data-testid="ssr-lazy-section">
					<h2>SSR Lazy Component</h2>
					<p>This component loads with SSR - HTML should be present on initial load.</p>
					<SSRLazyComponent name="SSR Test" />
				</section>

				{/* Client-only Lazy Component */}
				<section data-testid="client-lazy-section">
					<h2>Client-only Lazy Component</h2>
					<p>This component never renders on server - shows pending on SSR, loads on client.</p>
					<ClientOnlyComponent name="Client Test" />
				</section>

				{/* Eager Client Component */}
				<section data-testid="eager-lazy-section">
					<h2>Eager Client Component</h2>
					<p>This component starts loading on module evaluation (client only).</p>
					<EagerClientComponent />
				</section>

				{/* Preload Utility */}
				<section data-testid="preload-section">
					<h2>Preload Utility</h2>
					<p>Test fire-and-forget preloading of utilities.</p>
					<div>
						<button data-testid="preload-trigger" onClick={handlePreload} type="button">
							Preload
						</button>
						<button data-testid="preload-load" onClick={handleLoad} type="button">
							Load & Use
						</button>
					</div>
					<Show when={preloadResult()}>
						<p data-testid="preload-result">{preloadResult()}</p>
					</Show>
					<Show when={preloadError()}>
						<p data-testid="preload-error">Error: {preloadError()}</p>
					</Show>
				</section>

				{/* Override Props Test */}
				<section data-testid="override-section">
					<h2>Override Props</h2>
					<p>Client component with pending prop override.</p>
					<ClientOnlyComponent
						name="Override Test"
						pending={<p data-testid="override-pending">Custom pending override...</p>}
					/>
				</section>
			</main>
		)
	})
