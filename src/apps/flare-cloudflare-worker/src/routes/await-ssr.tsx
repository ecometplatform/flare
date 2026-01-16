/**
 * Await SSR Route
 *
 * Tests Await component with SSR pre-resolved data.
 * On SSR (initial load with disableDefer: false), deferred data is awaited
 * and __resolved is populated - Await skips pending state entirely.
 *
 * This route uses stream: false explicitly to ensure SSR awaits the data.
 */

import { Await } from "@ecomet/flare/components/await"
import { createPage } from "@ecomet/flare/router/create-page"

export const AwaitSsrPage = createPage({ virtualPath: "_root_/await-ssr" })
	.loader(({ defer }) => {
		/* SSR-awaited data - explicit stream: false ensures it's awaited */
		const ssrData = defer(
			() =>
				new Promise<{ message: string; timestamp: number }>((resolve) =>
					setTimeout(
						() =>
							resolve({
								message: "ssr-pre-resolved",
								timestamp: Date.now(),
							}),
						100,
					),
				),
			{ key: "ssr-data", stream: false },
		)

		/* Multiple SSR-awaited items */
		const ssrList = defer(
			() =>
				new Promise<string[]>((resolve) =>
					setTimeout(() => resolve(["ssr-item-1", "ssr-item-2", "ssr-item-3"]), 80),
				),
			{ key: "ssr-list", stream: false },
		)

		/* SSR-awaited nested object */
		const ssrNested = defer(
			() =>
				new Promise<{
					user: { id: string; name: string }
					permissions: string[]
				}>((resolve) =>
					setTimeout(
						() =>
							resolve({
								permissions: ["read", "write", "admin"],
								user: { id: "ssr-1", name: "SSR User" },
							}),
						90,
					),
				),
			{ key: "ssr-nested", stream: false },
		)

		/* SSR error case - should show error on initial load */
		const ssrError = defer(
			() =>
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("ssr-error-message")), 70),
				),
			{ key: "ssr-error", stream: false },
		)

		/* Immediate data for comparison */
		const immediate = {
			loadedAt: Date.now(),
			source: "immediate",
		}

		return {
			immediate,
			ssrData,
			ssrError,
			ssrList,
			ssrNested,
		}
	})
	.render(({ loaderData }) => (
		<main data-testid="await-ssr-page">
			<h1>Await SSR Pre-resolved Tests</h1>

			{/* Immediate data reference */}
			<section data-testid="immediate-section">
				<h2>Immediate Data</h2>
				<p data-testid="immediate-source">{loaderData.immediate.source}</p>
				<p data-testid="immediate-timestamp">{loaderData.immediate.loadedAt}</p>
			</section>

			{/* SSR pre-resolved - should render immediately without pending */}
			<section data-testid="ssr-data-section">
				<h2>SSR Pre-resolved Data</h2>
				<Await
					pending={<p data-testid="ssr-data-pending">SHOULD NOT SEE THIS ON SSR</p>}
					promise={loaderData.ssrData}
				>
					{(data) => (
						<div data-testid="ssr-data-resolved">
							<p data-testid="ssr-data-message">{data.message}</p>
							<p data-testid="ssr-data-timestamp">{data.timestamp}</p>
						</div>
					)}
				</Await>
			</section>

			{/* SSR pre-resolved list */}
			<section data-testid="ssr-list-section">
				<h2>SSR Pre-resolved List</h2>
				<Await
					pending={<p data-testid="ssr-list-pending">SHOULD NOT SEE THIS ON SSR</p>}
					promise={loaderData.ssrList}
				>
					{(items) => (
						<ul data-testid="ssr-list-resolved">
							{items.map((item, idx) => (
								<li data-testid={`ssr-list-item-${idx}`}>{item}</li>
							))}
						</ul>
					)}
				</Await>
			</section>

			{/* SSR pre-resolved nested */}
			<section data-testid="ssr-nested-section">
				<h2>SSR Pre-resolved Nested</h2>
				<Await
					pending={<p data-testid="ssr-nested-pending">SHOULD NOT SEE THIS ON SSR</p>}
					promise={loaderData.ssrNested}
				>
					{(data) => (
						<div data-testid="ssr-nested-resolved">
							<p data-testid="ssr-nested-user">
								{data.user.name} (ID: {data.user.id})
							</p>
							<p data-testid="ssr-nested-permissions">{data.permissions.join(", ")}</p>
						</div>
					)}
				</Await>
			</section>

			{/* SSR error case */}
			<section data-testid="ssr-error-section">
				<h2>SSR Error Case</h2>
				<Await
					error={(err) => (
						<div data-testid="ssr-error-boundary">
							<p data-testid="ssr-error-message">{err.message}</p>
						</div>
					)}
					pending={<p data-testid="ssr-error-pending">SHOULD NOT SEE THIS ON SSR</p>}
					promise={loaderData.ssrError}
				>
					{() => <p data-testid="ssr-error-resolved">Should not render</p>}
				</Await>
			</section>
		</main>
	))
