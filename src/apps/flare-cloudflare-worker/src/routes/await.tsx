/**
 * Await Route
 *
 * Tests Await component rendering states in isolation.
 * All states: pending, success, error, error={null}, reset.
 */

import { Await } from "@ecomet/flare/components/await"
import { createPage } from "@ecomet/flare/router/create-page"

export const AwaitPage = createPage({ virtualPath: "_root_/await" })
	.loader(({ auth, defer }) => {
		/* Success case - resolves with data */
		const successData = defer(
			() =>
				new Promise<{ result: string; items: number[] }>((resolve) =>
					setTimeout(() => resolve({ items: [1, 2, 3], result: "success-value" }), 100),
				),
			{ key: "success" },
		)

		/* Error case - rejects with error */
		const errorData = defer(
			() =>
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("await-error-message")), 100),
				),
			{ key: "error" },
		)

		/* Swallowed error case - error={null} */
		const swallowedError = defer(
			() =>
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("swallowed-error")), 100),
				),
			{ key: "swallowed" },
		)

		/* Fast resolve for pending visibility test */
		const fastResolve = defer(
			() =>
				new Promise<{ fast: boolean }>((resolve) => setTimeout(() => resolve({ fast: true }), 50)),
			{ key: "fast" },
		)

		/* Slow resolve for pending duration test */
		const slowResolve = defer(
			() =>
				new Promise<{ slow: boolean }>((resolve) => setTimeout(() => resolve({ slow: true }), 500)),
			{ key: "slow" },
		)

		/* No pending prop test */
		const noPending = defer(
			() =>
				new Promise<{ value: string }>((resolve) =>
					setTimeout(() => resolve({ value: "no-pending-result" }), 100),
				),
			{ key: "no-pending" },
		)

		/* Complex nested data */
		const complexData = defer(
			() =>
				new Promise<{
					users: Array<{ id: string; name: string; active: boolean }>
					meta: { total: number; page: number }
				}>((resolve) =>
					setTimeout(
						() =>
							resolve({
								meta: { page: 1, total: 3 },
								users: [
									{ active: true, id: "1", name: "Alice" },
									{ active: false, id: "2", name: "Bob" },
									{ active: true, id: "3", name: "Charlie" },
								],
							}),
						150,
					),
				),
			{ key: "complex" },
		)

		return {
			complexData,
			errorData,
			fastResolve,
			noPending,
			slowResolve,
			successData,
			swallowedError,
		}
	})
	.render(({ loaderData }) => (
		<main data-testid="await-page">
			<h1>Await Component Tests</h1>

			{/* Success case with pending */}
			<section data-testid="success-section">
				<h2>Success Case</h2>
				<Await
					pending={<p data-testid="success-pending">Loading success...</p>}
					promise={loaderData.successData}
				>
					{(data) => (
						<div data-testid="success-resolved">
							<p data-testid="success-result">{data.result}</p>
							<ul data-testid="success-items">
								{data.items.map((item) => (
									<li data-testid={`success-item-${item}`}>{item}</li>
								))}
							</ul>
						</div>
					)}
				</Await>
			</section>

			{/* Error case with error handler */}
			<section data-testid="error-section">
				<h2>Error Case</h2>
				<Await
					error={(err, reset) => (
						<div data-testid="error-boundary">
							<p data-testid="error-message">{err.message}</p>
							<button data-testid="error-reset" onClick={reset} type="button">
								Reset
							</button>
						</div>
					)}
					pending={<p data-testid="error-pending">Loading error case...</p>}
					promise={loaderData.errorData}
				>
					{() => <p data-testid="error-resolved">Should not render</p>}
				</Await>
			</section>

			{/* Swallowed error case with error={null} */}
			<section data-testid="swallowed-section">
				<h2>Swallowed Error Case</h2>
				<Await
					error={null}
					pending={<p data-testid="swallowed-pending">Loading swallowed...</p>}
					promise={loaderData.swallowedError}
				>
					{() => <p data-testid="swallowed-resolved">Should not render</p>}
				</Await>
				<p data-testid="swallowed-after">Content after swallowed Await</p>
			</section>

			{/* Fast resolve */}
			<section data-testid="fast-section">
				<h2>Fast Resolve</h2>
				<Await
					pending={<p data-testid="fast-pending">Loading fast...</p>}
					promise={loaderData.fastResolve}
				>
					{(data) => <p data-testid="fast-resolved">Fast: {data.fast ? "yes" : "no"}</p>}
				</Await>
			</section>

			{/* Slow resolve */}
			<section data-testid="slow-section">
				<h2>Slow Resolve</h2>
				<Await
					pending={<p data-testid="slow-pending">Loading slow...</p>}
					promise={loaderData.slowResolve}
				>
					{(data) => <p data-testid="slow-resolved">Slow: {data.slow ? "yes" : "no"}</p>}
				</Await>
			</section>

			{/* No pending prop */}
			<section data-testid="no-pending-section">
				<h2>No Pending Prop</h2>
				<Await promise={loaderData.noPending}>
					{(data) => <p data-testid="no-pending-resolved">{data.value}</p>}
				</Await>
			</section>

			{/* Complex nested data */}
			<section data-testid="complex-section">
				<h2>Complex Data</h2>
				<Await
					pending={<p data-testid="complex-pending">Loading complex...</p>}
					promise={loaderData.complexData}
				>
					{(data) => (
						<div data-testid="complex-resolved">
							<p data-testid="complex-meta">
								Total: {data.meta.total}, Page: {data.meta.page}
							</p>
							<ul data-testid="complex-users">
								{data.users.map((user) => (
									<li data-testid={`complex-user-${user.id}`}>
										{user.name} ({user.active ? "active" : "inactive"})
									</li>
								))}
							</ul>
						</div>
					)}
				</Await>
			</section>
		</main>
	))
