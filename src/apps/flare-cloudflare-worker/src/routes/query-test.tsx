/**
 * Query Test Page
 *
 * Tests query client sync - uses queryClient.ensureQueryData for testing
 * that queries are properly tracked and synced during SSR and CSR navigation.
 */

import type { TrackedQueryClient } from "@ecomet/flare/query-client/tracked-client"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

interface QueryClient {
	ensureQueryData: <T>(opts: {
		queryFn: () => Promise<T>
		queryKey: unknown[]
		staleTime?: number
	}) => Promise<T>
}

export const QueryTestPage = createPage({ virtualPath: "_root_/query-test" })
	.loader(async ({ queryClient }) => {
		const qc = queryClient as TrackedQueryClient<QueryClient> | undefined
		if (!qc) {
			return {
				settings: { locale: "en", theme: "light" },
				user: { id: "fallback", name: "No QueryClient" },
			}
		}

		/* Use queryClient to fetch data - this should be tracked */
		const user = await qc.ensureQueryData({
			queryFn: () => Promise.resolve({ id: "1", name: "Test User" }),
			queryKey: ["user", "1"],
			staleTime: 60000,
		})

		const settings = await qc.ensureQueryData({
			queryFn: () => Promise.resolve({ locale: "en", theme: "dark" }),
			queryKey: ["settings"],
			staleTime: 30000,
		})

		return { settings, user }
	})
	.head(() => ({
		description: "Query client sync test page",
		title: "Query Test - Flare v2",
	}))
	.render(({ loaderData }) => (
		<main>
			<h1 data-testid="query-test-title">Query Test Page</h1>

			<section data-testid="user-data">
				<h2>User Data</h2>
				<p data-testid="user-id">ID: {loaderData.user.id}</p>
				<p data-testid="user-name">Name: {loaderData.user.name}</p>
			</section>

			<section data-testid="settings-data">
				<h2>Settings</h2>
				<p data-testid="settings-theme">Theme: {loaderData.settings.theme}</p>
				<p data-testid="settings-locale">Locale: {loaderData.settings.locale}</p>
			</section>

			<nav>
				<Link to="/">Back to Home</Link>
			</nav>
		</main>
	))
