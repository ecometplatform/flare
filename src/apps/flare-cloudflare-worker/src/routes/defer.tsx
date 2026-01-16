/**
 * Defer Route
 *
 * Tests defer() streaming behavior in isolation.
 * No Await component - just raw deferred data for NDJSON protocol testing.
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const DeferPage = createPage({ virtualPath: "_root_/defer" })
	.loader(({ defer }) => {
		/* Immediate data - always available */
		const immediate = {
			loadedAt: Date.now(),
			message: "immediate-data",
		}

		/* Fast deferred - resolves quickly */
		const fast = defer(
			() =>
				new Promise<{ speed: string; value: number }>((resolve) =>
					setTimeout(() => resolve({ speed: "fast", value: 100 }), 50),
				),
			{ key: "fast" },
		)

		/* Slow deferred - takes longer */
		const slow = defer(
			() =>
				new Promise<{ speed: string; value: number }>((resolve) =>
					setTimeout(() => resolve({ speed: "slow", value: 200 }), 150),
				),
			{ key: "slow" },
		)

		/* Deferred with explicit stream: true */
		const explicitStream = defer(
			() =>
				new Promise<{ mode: string }>((resolve) =>
					setTimeout(() => resolve({ mode: "explicit-stream" }), 75),
				),
			{ key: "explicit-stream", stream: true },
		)

		/* Deferred that rejects - for error handling tests */
		const willFail = defer(
			() =>
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("intentional-defer-error")), 100),
				),
			{ key: "will-fail" },
		)

		/* Array data deferred */
		const items = defer(
			() =>
				new Promise<string[]>((resolve) =>
					setTimeout(() => resolve(["item-a", "item-b", "item-c"]), 80),
				),
			{ key: "items" },
		)

		/* Nested object deferred */
		const nested = defer(
			() =>
				new Promise<{ user: { id: string; name: string }; meta: { count: number } }>((resolve) =>
					setTimeout(
						() =>
							resolve({
								meta: { count: 42 },
								user: { id: "u1", name: "Alice" },
							}),
						90,
					),
				),
			{ key: "nested" },
		)

		return {
			explicitStream,
			fast,
			immediate,
			items,
			nested,
			slow,
			willFail,
		}
	})
	.render(({ loaderData }) => (
		<main data-testid="defer-page">
			<h1>Defer Tests</h1>

			<section data-testid="immediate-section">
				<h2>Immediate Data</h2>
				<p data-testid="immediate-message">{loaderData.immediate.message}</p>
				<p data-testid="immediate-timestamp">{loaderData.immediate.loadedAt}</p>
			</section>

			<section data-testid="deferred-section">
				<h2>Deferred Data (raw - no Await)</h2>
				<p data-testid="deferred-info">
					Deferred data is available but not rendered with Await. Check NDJSON response for chunks.
				</p>
			</section>
		</main>
	))
