/**
 * Layout Integration Tests
 *
 * Tests layout hierarchy, loader data flow, and match caching.
 */

import { describe, expect, it, vi } from "vitest"
import { createFlareClient, type FlareState } from "../../src/client/init"
import { createFlareProvider } from "../../src/client/provider"

describe("Layout hierarchy with match cache", () => {
	it("maintains parent layout when navigating between child pages", async () => {
		/* SSR state with root layout and home page */
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { app: "test" } },
					{ id: "_root_/(layout)", loaderData: { layoutData: "from-layout" } },
					{ id: "_root_/(layout)/page-a", loaderData: { pageData: "page-a" } },
				],
				params: {},
				pathname: "/page-a",
			},
			s: null,
		}

		/* Mock fetch returns only changed matches (page-b) */
		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response(
					/* Root layout and group layout stay the same, only page changes */
					'{"t":"l","m":"_root_","d":{"app":"test"}}\n' +
						'{"t":"l","m":"_root_/(layout)","d":{"layoutData":"from-layout"}}\n' +
						'{"t":"l","m":"_root_/(layout)/page-b","d":{"pageData":"page-b"}}\n' +
						'{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		/* Initial state has 3 matches */
		expect(ctx.matches()).toHaveLength(3)
		expect(ctx.matches()[1]?.loaderData).toEqual({ layoutData: "from-layout" })
		expect(ctx.matches()[2]?.loaderData).toEqual({ pageData: "page-a" })

		/* Navigate to page-b */
		await ctx.router.navigate({ to: "/page-b" })

		/* After navigation, verify that cache contains the updated data
		 * The match cache is keyed by match ID and contains loader data */
		expect(cache.get("_root_/(layout)")?.data).toEqual({ layoutData: "from-layout" })
		expect(cache.get("_root_/(layout)/page-b")?.data).toEqual({ pageData: "page-b" })
	})

	it("replaces nested layouts when switching layout groups", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/(auth)", loaderData: { auth: true } },
					{ id: "_root_/(auth)/login", loaderData: {} },
				],
				params: {},
				pathname: "/login",
			},
			s: null,
		}

		/* Navigate from auth layout to public layout */
		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n' +
						'{"t":"l","m":"_root_/(public)","d":{"public":true}}\n' +
						'{"t":"l","m":"_root_/(public)/about","d":{}}\n' +
						'{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		/* Initial: auth layout in cache */
		expect(cache.get("_root_/(auth)")?.data).toEqual({ auth: true })

		/* Navigate to public layout */
		await ctx.router.navigate({ to: "/about" })

		/* After navigation, verify that cache contains the public layout data */
		expect(cache.get("_root_/(public)")?.data).toEqual({ public: true })
		expect(cache.get("_root_/(public)/about")?.data).toEqual({})
	})

	it("deep nested layouts all update on navigation", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { level: 0 } },
					{ id: "_root_/(group-a)", loaderData: { level: 1 } },
					{ id: "_root_/(group-a)/(sub-a)", loaderData: { level: 2 } },
					{ id: "_root_/(group-a)/(sub-a)/page", loaderData: { level: 3 } },
				],
				params: {},
				pathname: "/page",
			},
			s: null,
		}

		/* Navigate to completely different path */
		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{"level":0}}\n' +
						'{"t":"l","m":"_root_/(group-b)","d":{"level":1,"group":"b"}}\n' +
						'{"t":"l","m":"_root_/(group-b)/(sub-b)","d":{"level":2,"sub":"b"}}\n' +
						'{"t":"l","m":"_root_/(group-b)/(sub-b)/(deep)","d":{"level":3,"deep":true}}\n' +
						'{"t":"l","m":"_root_/(group-b)/(sub-b)/(deep)/other","d":{"level":4}}\n' +
						'{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		expect(ctx.matches()).toHaveLength(4)

		await ctx.router.navigate({ to: "/other" })

		/* After navigation, verify that cache contains the group-b layout hierarchy */
		expect(cache.get("_root_/(group-b)")?.data).toEqual({ group: "b", level: 1 })
		expect(cache.get("_root_/(group-b)/(sub-b)")?.data).toEqual({ level: 2, sub: "b" })
		expect(cache.get("_root_/(group-b)/(sub-b)/(deep)")?.data).toEqual({ deep: true, level: 3 })
		expect(cache.get("_root_/(group-b)/(sub-b)/(deep)/other")?.data).toEqual({ level: 4 })
	})
})

describe("Layout loader data in cache", () => {
	it("cache stores layout loader data by match id", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { root: true } },
					{ id: "_root_/(dashboard)", loaderData: { dashboard: true, user: "test-user" } },
					{ id: "_root_/(dashboard)/home", loaderData: { page: "home" } },
				],
				params: {},
				pathname: "/home",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const cache = client.getMatchCache()

		/* All three should be in cache */
		expect(cache.get("_root_")?.data).toEqual({ root: true })
		expect(cache.get("_root_/(dashboard)")?.data).toEqual({ dashboard: true, user: "test-user" })
		expect(cache.get("_root_/(dashboard)/home")?.data).toEqual({ page: "home" })
	})

	it("cache updates layout data after navigation", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/(layout)", loaderData: { version: 1 } },
					{ id: "_root_/(layout)/page", loaderData: {} },
				],
				params: {},
				pathname: "/page",
			},
			s: null,
		}

		/* Server returns updated layout data */
		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n' +
						'{"t":"l","m":"_root_/(layout)","d":{"version":2,"reloaded":true}}\n' +
						'{"t":"l","m":"_root_/(layout)/other","d":{}}\n' +
						'{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		/* Initial layout data */
		expect(cache.get("_root_/(layout)")?.data).toEqual({ version: 1 })

		await ctx.router.navigate({ to: "/other" })

		/* Layout data should be updated */
		expect(cache.get("_root_/(layout)")?.data).toEqual({ reloaded: true, version: 2 })
	})
})

describe("Layout with params", () => {
	it("layout receives params in loader context", async () => {
		let capturedUrl = ""
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/(org)/[orgId]", loaderData: { orgId: "acme", orgName: "Acme Corp" } },
					{ id: "_root_/(org)/[orgId]/dashboard", loaderData: {} },
				],
				params: { orgId: "acme" },
				pathname: "/acme/dashboard",
			},
			s: null,
		}

		const mockFetch = vi.fn((url: string) => {
			capturedUrl = url
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n' +
						'{"t":"l","m":"_root_/(org)/[orgId]","d":{"orgId":"globex","orgName":"Globex Inc"}}\n' +
						'{"t":"l","m":"_root_/(org)/[orgId]/dashboard","d":{}}\n' +
						'{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({
			params: { orgId: "globex" },
			to: "/[orgId]/dashboard",
		})

		/* URL should be resolved with params */
		expect(capturedUrl).toBe("/globex/dashboard")

		/* Layout data should reflect new org */
		expect(ctx.matches()[1]?.loaderData).toEqual({ orgId: "globex", orgName: "Globex Inc" })
	})
})

describe("Layout navigation optimization", () => {
	it("superseded navigation is ignored", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/", loaderData: { initial: true } },
				],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		const resolvers: Array<() => void> = []

		/* Slow fetch that we control */
		const mockFetch = vi.fn(() => {
			return new Promise<Response>((resolve) => {
				resolvers.push(() => {
					resolve(
						new Response(
							'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/slow","d":{}}\n{"t":"d"}',
							{
								headers: { "Content-Type": "application/x-ndjson" },
							},
						),
					)
				})
			})
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Start first navigation */
		const nav1 = ctx.router.navigate({ to: "/slow" })

		/* Start second navigation before first completes */
		const mockFetch2 = vi.fn(() => {
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/fast","d":{"fast":true}}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			)
		})

		/* Replace fetch for second navigation - must call onUpdate to simulate normal behavior */
		client.getRouter().navigate = async (opts) => {
			await mockFetch2(opts.to as string)
			/* Call onUpdate if provided (new API) */
			if (typeof opts === "object" && opts !== null && "onUpdate" in opts) {
				;(opts as { onUpdate?: () => void }).onUpdate?.()
			}
		}

		const nav2 = ctx.router.navigate({ to: "/fast" })

		/* Resolve first navigation */
		resolvers[0]?.()

		await Promise.all([nav1, nav2])

		/* Location should be /fast (second navigation won) */
		expect(ctx.location().pathname).toBe("/fast")
	})
})

describe("Layout match ID generation", () => {
	it("layout match IDs include group paths", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/(auth)/(admin)", loaderData: { admin: true } },
					{ id: "_root_/(auth)/(admin)/users", loaderData: {} },
				],
				params: {},
				pathname: "/users",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const cache = client.getMatchCache()

		/* Groups should be in match ID */
		expect(cache.get("_root_/(auth)/(admin)")?.data).toEqual({ admin: true })
	})

	it("parameterized layout match IDs use bracket notation", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/(tenant)/[tenantId]", loaderData: { tenantId: "t1" } },
					{ id: "_root_/(tenant)/[tenantId]/settings", loaderData: {} },
				],
				params: { tenantId: "t1" },
				pathname: "/t1/settings",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const cache = client.getMatchCache()

		/* Parameterized layout should use bracket notation in ID */
		expect(cache.get("_root_/(tenant)/[tenantId]")?.data).toEqual({ tenantId: "t1" })
	})
})
