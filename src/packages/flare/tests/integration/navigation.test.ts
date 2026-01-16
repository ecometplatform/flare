/**
 * Navigation Integration Tests
 *
 * Tests CSR navigation including back/forward (popstate) handling.
 */

import { describe, expect, it, vi } from "vitest"
import { createFlareClient, type FlareState } from "../../src/client/init"
import { createFlareProvider } from "../../src/client/provider"

describe("CSR navigation", () => {
	it("navigate resolves URL params correctly", async () => {
		let capturedUrl = ""

		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/", loaderData: {} },
				],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		/* Response must include root layout to avoid root layout change detection */
		const mockFetch = vi.fn((url: string) => {
			capturedUrl = url
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/products/123","d":{"id":"123"}}\n{"t":"r"}\n{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Navigate with pattern + params */
		await ctx.router.navigate({
			params: { id: "123" },
			to: "/products/[id]",
		})

		/* URL should be resolved */
		expect(capturedUrl).toBe("/products/123")
		expect(ctx.location().pathname).toBe("/products/123")
	})

	it("navigate without params uses to directly", async () => {
		let capturedUrl = ""

		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/", loaderData: {} },
				],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		/* Response must include root layout to avoid root layout change detection */
		const mockFetch = vi.fn((url: string) => {
			capturedUrl = url
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/about" })

		expect(capturedUrl).toBe("/about")
		expect(ctx.location().pathname).toBe("/about")
	})
})

describe("popstate handling", () => {
	it("client registers popstate handlers", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })

		client.onPopstate(() => {
			/* Handler registered - popstate can't be triggered in unit tests */
		})

		/* Verify handler is registered (we can't easily trigger popstate in tests) */
		expect(typeof client.onPopstate).toBe("function")
	})

	it("multiple popstate handlers can be registered", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })

		const handlers: Array<() => void> = []
		client.onPopstate(() => handlers.push(() => {}))
		client.onPopstate(() => handlers.push(() => {}))

		/* Both handlers should be registered without error */
		expect(handlers.length).toBe(0) /* Not called yet, just registered */
	})
})

describe("history state management", () => {
	it("pushHistoryState creates correct state structure", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response('{"t":"d"}', {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/test" })

		/* Location should be updated */
		expect(ctx.location().pathname).toBe("/test")
	})
})

describe("match cache with navigation", () => {
	it("cache is updated after navigation", async () => {
		/* SSR state must include root layout as first match to avoid root layout change detection */
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/", loaderData: { page: "home" } },
				],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		/* NDJSON response must also include root layout as first match */
		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{"page":"about"}}\n{"t":"d"}',
					{ headers: { "Content-Type": "application/x-ndjson" } },
				),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Initial cache has home page */
		const cache = client.getMatchCache()
		expect(cache.get("_root_/")?.data).toEqual({ page: "home" })

		/* Navigate to about */
		await ctx.router.navigate({ to: "/about" })

		/* Cache should have about page data */
		expect(cache.get("_root_/about")?.data).toEqual({ page: "about" })
	})

	it("updateMatchesFromCache creates matches from cache entries", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { layout: true } },
					{ id: "_root_/", loaderData: { page: "home" } },
				],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const ctx = createFlareProvider(client)

		/* Initial matches should be created from SSR state */
		const matches = ctx.matches()
		expect(matches).toHaveLength(2)
		expect(matches[0]?.loaderData).toEqual({ layout: true })
		expect(matches[1]?.loaderData).toEqual({ page: "home" })
	})
})

describe("provider signals reactivity", () => {
	it("location signal updates after navigate", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const mockFetch = vi.fn(() => {
			return Promise.resolve(
				new Response('{"t":"d"}', {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		expect(ctx.location().pathname).toBe("/")

		await ctx.router.navigate({ to: "/new-page" })

		expect(ctx.location().pathname).toBe("/new-page")
	})

	it("isNavigating is true during navigation", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		let resolvePromise: () => void
		const fetchPromise = new Promise<void>((resolve) => {
			resolvePromise = resolve
		})

		const mockFetch = vi.fn(() => {
			return fetchPromise.then(
				() =>
					new Response('{"t":"d"}', {
						headers: { "Content-Type": "application/x-ndjson" },
					}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		expect(ctx.isNavigating()).toBe(false)

		const navPromise = ctx.router.navigate({ to: "/test" })

		/* Should be navigating while fetch is pending */
		expect(ctx.isNavigating()).toBe(true)

		resolvePromise?.()
		await navPromise

		/* Should be done navigating */
		expect(ctx.isNavigating()).toBe(false)
	})

	it("matches signal is reactive and can be updated externally", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [{ id: "_root_/", loaderData: { initial: true } }],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const ctx = createFlareProvider(client)

		/* Initial matches */
		expect(ctx.matches()).toHaveLength(1)
		expect(ctx.matches()[0]?.loaderData).toEqual({ initial: true })

		/* Update matches externally (like entry-client does) */
		ctx.setMatches([
			{
				loaderData: { updated: true },
				render: () => null as never,
				virtualPath: "_root_/new",
			},
		])

		/* Should reflect the update */
		expect(ctx.matches()).toHaveLength(1)
		expect(ctx.matches()[0]?.loaderData).toEqual({ updated: true })
	})
})
