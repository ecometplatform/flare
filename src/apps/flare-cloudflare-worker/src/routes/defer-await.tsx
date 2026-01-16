/**
 * Defer + Await Integration Route
 *
 * Tests full integration of defer() streaming with Await component rendering.
 * CSR navigation: pending shown while streaming, resolved when chunk arrives.
 * SSR: data awaited, rendered immediately without pending flash.
 */

import { Await } from "@ecomet/flare/components/await"
import { createPage } from "@ecomet/flare/router/create-page"

export const DeferAwaitPage = createPage({ virtualPath: "_root_/defer-await" })
	.loader(({ defer }) => {
		/* Immediate data - always available first */
		const immediate = {
			loadedAt: Date.now(),
			pageId: "defer-await-page",
		}

		/* Primary content - medium delay */
		const primaryContent = defer(
			() =>
				new Promise<{
					title: string
					body: string
					author: string
				}>((resolve) =>
					setTimeout(
						() =>
							resolve({
								author: "Test Author",
								body: "This is the primary content body that loads with medium delay.",
								title: "Primary Content Title",
							}),
						200,
					),
				),
			{ key: "primary" },
		)

		/* Secondary content - fast */
		const secondaryContent = defer(
			() =>
				new Promise<{ items: Array<{ id: number; label: string }> }>((resolve) =>
					setTimeout(
						() =>
							resolve({
								items: [
									{ id: 1, label: "Secondary Item 1" },
									{ id: 2, label: "Secondary Item 2" },
									{ id: 3, label: "Secondary Item 3" },
								],
							}),
						100,
					),
				),
			{ key: "secondary" },
		)

		/* Tertiary content - slow */
		const tertiaryContent = defer(
			() =>
				new Promise<{ stats: { views: number; likes: number; shares: number } }>((resolve) =>
					setTimeout(
						() =>
							resolve({
								stats: { likes: 42, shares: 7, views: 1234 },
							}),
						400,
					),
				),
			{ key: "tertiary" },
		)

		/* Racing data - multiple resolve at similar times */
		const raceA = defer(
			() =>
				new Promise<{ racer: string; position: number }>((resolve) =>
					setTimeout(() => resolve({ position: 1, racer: "A" }), 150),
				),
			{ key: "race-a" },
		)

		const raceB = defer(
			() =>
				new Promise<{ racer: string; position: number }>((resolve) =>
					setTimeout(() => resolve({ position: 2, racer: "B" }), 155),
				),
			{ key: "race-b" },
		)

		const raceC = defer(
			() =>
				new Promise<{ racer: string; position: number }>((resolve) =>
					setTimeout(() => resolve({ position: 3, racer: "C" }), 145),
				),
			{ key: "race-c" },
		)

		/* Error in integration context */
		const mayFail = defer(
			() =>
				new Promise<{ success: boolean }>((_, reject) =>
					setTimeout(() => reject(new Error("integration-error")), 180),
				),
			{ key: "may-fail" },
		)

		/* Very fast - tests rapid resolution */
		const veryFast = defer(
			() =>
				new Promise<{ instant: boolean }>((resolve) =>
					setTimeout(() => resolve({ instant: true }), 10),
				),
			{ key: "very-fast" },
		)

		/* Deeply nested data */
		const deepNested = defer(
			() =>
				new Promise<{
					level1: {
						level2: {
							level3: {
								value: string
								array: number[]
							}
						}
					}
				}>((resolve) =>
					setTimeout(
						() =>
							resolve({
								level1: {
									level2: {
										level3: {
											array: [1, 2, 3, 4, 5],
											value: "deeply-nested-value",
										},
									},
								},
							}),
						250,
					),
				),
			{ key: "deep-nested" },
		)

		return {
			deepNested,
			immediate,
			mayFail,
			primaryContent,
			raceA,
			raceB,
			raceC,
			secondaryContent,
			tertiaryContent,
			veryFast,
		}
	})
	.render(({ loaderData }) => (
		<main data-testid="defer-await-page">
			<h1>Defer + Await Integration</h1>

			{/* Immediate data */}
			<section data-testid="immediate-section">
				<h2>Immediate</h2>
				<p data-testid="page-id">{loaderData.immediate.pageId}</p>
				<p data-testid="loaded-at">{loaderData.immediate.loadedAt}</p>
			</section>

			{/* Primary content */}
			<section data-testid="primary-section">
				<h2>Primary Content</h2>
				<Await
					pending={<div data-testid="primary-pending">Loading primary...</div>}
					promise={loaderData.primaryContent}
				>
					{(data) => (
						<article data-testid="primary-resolved">
							<h3 data-testid="primary-title">{data.title}</h3>
							<p data-testid="primary-body">{data.body}</p>
							<p data-testid="primary-author">By: {data.author}</p>
						</article>
					)}
				</Await>
			</section>

			{/* Secondary content - faster */}
			<section data-testid="secondary-section">
				<h2>Secondary Content</h2>
				<Await
					pending={<div data-testid="secondary-pending">Loading secondary...</div>}
					promise={loaderData.secondaryContent}
				>
					{(data) => (
						<ul data-testid="secondary-resolved">
							{data.items.map((item) => (
								<li data-testid={`secondary-item-${item.id}`}>{item.label}</li>
							))}
						</ul>
					)}
				</Await>
			</section>

			{/* Tertiary content - slower */}
			<section data-testid="tertiary-section">
				<h2>Tertiary Content</h2>
				<Await
					pending={<div data-testid="tertiary-pending">Loading tertiary...</div>}
					promise={loaderData.tertiaryContent}
				>
					{(data) => (
						<div data-testid="tertiary-resolved">
							<span data-testid="tertiary-views">Views: {data.stats.views}</span>
							<span data-testid="tertiary-likes">Likes: {data.stats.likes}</span>
							<span data-testid="tertiary-shares">Shares: {data.stats.shares}</span>
						</div>
					)}
				</Await>
			</section>

			{/* Racing content */}
			<section data-testid="race-section">
				<h2>Racing Data</h2>
				<div data-testid="race-container">
					<Await pending={<span data-testid="race-a-pending">...</span>} promise={loaderData.raceA}>
						{(data) => (
							<span data-testid="race-a-resolved">
								{data.racer}:{data.position}
							</span>
						)}
					</Await>
					<Await pending={<span data-testid="race-b-pending">...</span>} promise={loaderData.raceB}>
						{(data) => (
							<span data-testid="race-b-resolved">
								{data.racer}:{data.position}
							</span>
						)}
					</Await>
					<Await pending={<span data-testid="race-c-pending">...</span>} promise={loaderData.raceC}>
						{(data) => (
							<span data-testid="race-c-resolved">
								{data.racer}:{data.position}
							</span>
						)}
					</Await>
				</div>
			</section>

			{/* Error case */}
			<section data-testid="error-section">
				<h2>Error Case</h2>
				<Await
					error={(err) => <div data-testid="error-boundary">Error: {err.message}</div>}
					pending={<div data-testid="error-pending">Loading...</div>}
					promise={loaderData.mayFail}
				>
					{(data) => <div data-testid="error-resolved">Success: {data.success}</div>}
				</Await>
			</section>

			{/* Very fast */}
			<section data-testid="very-fast-section">
				<h2>Very Fast</h2>
				<Await
					pending={<span data-testid="very-fast-pending">...</span>}
					promise={loaderData.veryFast}
				>
					{(data) => (
						<span data-testid="very-fast-resolved">{data.instant ? "instant" : "slow"}</span>
					)}
				</Await>
			</section>

			{/* Deep nested */}
			<section data-testid="deep-nested-section">
				<h2>Deep Nested</h2>
				<Await
					pending={<div data-testid="deep-nested-pending">Loading nested...</div>}
					promise={loaderData.deepNested}
				>
					{(data) => (
						<div data-testid="deep-nested-resolved">
							<p data-testid="deep-nested-value">{data.level1.level2.level3.value}</p>
							<p data-testid="deep-nested-array">{data.level1.level2.level3.array.join(",")}</p>
						</div>
					)}
				</Await>
			</section>
		</main>
	))
