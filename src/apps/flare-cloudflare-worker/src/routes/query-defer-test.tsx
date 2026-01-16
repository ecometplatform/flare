/**
 * Query + Defer Test Page
 *
 * Tests query client sync with defer streaming.
 * Uses both queryClient.ensureQueryData AND ctx.defer() to verify
 * queries are properly synced even when deferred chunks are streaming.
 *
 * Also tests that useQuery components get cached data without fetching.
 */

import { Await } from "@ecomet/flare/components/await"
import type { TrackedQueryClient } from "@ecomet/flare/query-client/tracked-client"
import { useQuery } from "@ecomet/flare/query-client/use-query"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { createSignal, onMount, Show } from "solid-js"

interface QueryClient {
	ensureQueryData: <T>(opts: {
		queryFn: () => Promise<T>
		queryKey: unknown[]
		staleTime?: number
	}) => Promise<T>
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Component that uses useQuery with same key as server's ensureQueryData.
 * Should get cached data immediately without fetching.
 */
function UserQueryComponent() {
	const [fetchCount, setFetchCount] = createSignal(0)
	const [mounted, setMounted] = createSignal(false)

	onMount(() => setMounted(true))

	const query = useQuery(() => ({
		queryFn: async () => {
			/* Track fetch calls - should NOT be called if cache is hydrated */
			setFetchCount((c) => c + 1)
			await sleep(100)
			return { id: "fetched", name: "Fetched User" }
		},
		queryKey: ["query-defer", "user"],
	}))

	return (
		<div data-testid="user-query-component">
			<p data-testid="query-status">Status: {query.status}</p>
			<p data-testid="query-fetch-count">Fetch Count: {fetchCount()}</p>
			<Show when={query.data}>
				<p data-testid="query-data-id">ID: {query.data?.id}</p>
				<p data-testid="query-data-name">Name: {query.data?.name}</p>
			</Show>
			<p data-testid="query-is-fetching">Is Fetching: {String(query.isFetching)}</p>
			<p data-testid="query-mounted">Mounted: {String(mounted())}</p>
		</div>
	)
}

interface JsonPlaceholderPost {
	body: string
	id: number
	title: string
	userId: number
}

/**
 * Component that uses useQuery to "fetch" from jsonplaceholder.
 * Server pre-fetches the data, so this component should NOT make a network request.
 * The queryFn includes a real fetch call, but it should never execute if cache is hydrated.
 */
function JsonPlaceholderComponent() {
	const [networkCallMade, setNetworkCallMade] = createSignal(false)

	const query = useQuery(() => ({
		queryFn: async (): Promise<JsonPlaceholderPost> => {
			/* This should NEVER be called if server cache is hydrated */
			setNetworkCallMade(true)
			const res = await fetch("https://jsonplaceholder.typicode.com/posts/1")
			return res.json() as Promise<JsonPlaceholderPost>
		},
		queryKey: ["jsonplaceholder", "post", 1],
		staleTime: 60000,
	}))

	return (
		<div data-testid="jsonplaceholder-component">
			<p data-testid="jp-status">Status: {query.status}</p>
			<p data-testid="jp-network-call">Network Call Made: {String(networkCallMade())}</p>
			<Show when={query.data}>
				<p data-testid="jp-post-id">Post ID: {query.data?.id}</p>
				<p data-testid="jp-post-title">Title: {query.data?.title}</p>
			</Show>
			<p data-testid="jp-is-fetching">Is Fetching: {String(query.isFetching)}</p>
		</div>
	)
}

export const QueryDeferTestPage = createPage({ virtualPath: "_root_/query-defer-test" })
	.loader(async ({ defer, queryClient }) => {
		const qc = queryClient as TrackedQueryClient<QueryClient> | undefined

		/* Sync query - tracked immediately */
		const user = qc
			? await qc.ensureQueryData({
					queryFn: () => Promise.resolve({ id: "qd-1", name: "Query Defer User" }),
					queryKey: ["query-defer", "user"],
					staleTime: 60000,
				})
			: { id: "fallback", name: "No QueryClient" }

		/* Deferred data - streams after initial response */
		const deferredStats = defer(
			async () => {
				await sleep(100)
				return { downloads: 1234, views: 5678 }
			},
			{ key: "stats", stream: true },
		)

		/* Another sync query */
		const config = qc
			? await qc.ensureQueryData({
					queryFn: () => Promise.resolve({ feature: "enabled", version: "2.0" }),
					queryKey: ["query-defer", "config"],
				})
			: { feature: "disabled", version: "0.0" }

		/* Pre-fetch jsonplaceholder data on server - component should use this cache */
		const jsonPlaceholderPost = qc
			? await qc.ensureQueryData({
					queryFn: async () => {
						const res = await fetch("https://jsonplaceholder.typicode.com/posts/1")
						return res.json() as Promise<{
							body: string
							id: number
							title: string
							userId: number
						}>
					},
					queryKey: ["jsonplaceholder", "post", 1],
					staleTime: 60000,
				})
			: { body: "No QueryClient", id: 0, title: "Fallback", userId: 0 }

		return { config, deferredStats, jsonPlaceholderPost, user }
	})
	.head(() => ({
		description: "Query + Defer test page",
		title: "Query Defer Test - Flare v2",
	}))
	.render(({ loaderData }) => (
		<main>
			<h1 data-testid="query-defer-title">Query + Defer Test</h1>

			<section data-testid="sync-user">
				<h2>Sync User (Loader Data)</h2>
				<p data-testid="user-id">ID: {loaderData.user.id}</p>
				<p data-testid="user-name">Name: {loaderData.user.name}</p>
			</section>

			<section data-testid="query-component-section">
				<h2>User (useQuery Component)</h2>
				<UserQueryComponent />
			</section>

			<section data-testid="sync-config">
				<h2>Sync Config (Query)</h2>
				<p data-testid="config-version">Version: {loaderData.config.version}</p>
				<p data-testid="config-feature">Feature: {loaderData.config.feature}</p>
			</section>

			<section data-testid="jsonplaceholder-section">
				<h2>JsonPlaceholder Post (Pre-fetched)</h2>
				<p data-testid="loader-jp-id">Loader Post ID: {loaderData.jsonPlaceholderPost.id}</p>
				<p data-testid="loader-jp-title">Loader Title: {loaderData.jsonPlaceholderPost.title}</p>
				<h3>useQuery Component (should use cache, no network)</h3>
				<JsonPlaceholderComponent />
			</section>

			<section data-testid="deferred-stats">
				<h2>Deferred Stats</h2>
				<Await
					pending={<p data-testid="stats-loading">Loading stats...</p>}
					promise={loaderData.deferredStats}
				>
					{(stats) => (
						<div data-testid="stats-loaded">
							<p data-testid="stats-views">Views: {stats.views}</p>
							<p data-testid="stats-downloads">Downloads: {stats.downloads}</p>
						</div>
					)}
				</Await>
			</section>

			<nav>
				<Link to="/">Back to Home</Link>
			</nav>
		</main>
	))
