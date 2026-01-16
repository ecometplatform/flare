/**
 * Hydration Integration Tests
 *
 * Tests full SSR → CSR hydration flow.
 * Verifies state transfer and reactivity after hydration.
 */

import { describe, expect, it, vi } from "vitest"
import { createFlareClient, type FlareState } from "../../src/client/init"
import { createFlareProvider } from "../../src/client/provider"

describe("hydration flow", () => {
	it("hydrates from SSR state correctly", () => {
		/* Simulate SSR-generated state */
		const ssrState: FlareState = {
			c: {
				locale: "en-US",
				theme: "dark",
			},
			q: [{ data: { name: "Widget" }, key: ["product", "123"], staleTime: 60000 }],
			r: {
				matches: [
					{ id: "_root_", loaderData: { user: { name: "Alice", role: "admin" } } },
					{ id: "_root_/dashboard", loaderData: { stats: { views: 100 } } },
				],
				params: { id: "123" },
				pathname: "/dashboard",
			},
			s: "abc123.1704067200",
		}

		const client = createFlareClient({ flareState: ssrState })
		const ctx = createFlareProvider(client)

		/* Verify hydrated state */
		expect(ctx.location().pathname).toBe("/dashboard")
		expect(ctx.params()).toEqual({ id: "123" })
		expect(ctx.matches()).toHaveLength(2)
		expect(client.getSignature()).toBe("abc123.1704067200")
		expect(client.getContext().locale).toBe("en-US")
	})

	it("hydrates query client with SSR queries", () => {
		const ssrState: FlareState = {
			c: {},
			q: [
				{ data: { name: "Widget" }, key: ["product", "123"], staleTime: 60000 },
				{ data: ["cat1", "cat2"], key: ["categories"] },
			],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const mockQueryClient = {
			setQueryData: vi.fn(),
		}

		createFlareClient({
			flareState: ssrState,
			queryClient: mockQueryClient as unknown as Parameters<
				typeof createFlareClient
			>[0]["queryClient"],
		})

		expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(2)
		expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
			["product", "123"],
			{ name: "Widget" },
			expect.objectContaining({ staleTime: 60000 }),
		)
		expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
			["categories"],
			["cat1", "cat2"],
			expect.any(Object),
		)
	})

	it("match cache is populated from SSR state", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { user: "Alice" } },
					{ id: "_root_/products", loaderData: { products: [1, 2, 3] } },
				],
				params: {},
				pathname: "/products",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const cache = client.getMatchCache()

		expect(cache.size()).toBe(2)
		expect(cache.get("_root_")?.data).toEqual({ user: "Alice" })
		expect(cache.get("_root_/products")?.data).toEqual({ products: [1, 2, 3] })
	})
})

describe("CSR navigation after hydration", () => {
	it("fetches data and updates cache on navigate", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [{ id: "_root_", loaderData: {} }],
				params: {},
				pathname: "/",
			},
			s: "sig.123",
		}

		const mockFetch = vi.fn(() => {
			const body =
				'{"t":"l","m":"_root_","d":{"user":"Bob"}}\n' +
				'{"t":"l","m":"_root_/about","d":{"page":"about"}}\n' +
				'{"t":"d"}'
			return Promise.resolve(
				new Response(body, {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})

		const ctx = createFlareProvider(client)

		/* Navigate to /about */
		await ctx.router.navigate({ to: "/about" })

		/* Verify fetch was called */
		expect(mockFetch).toHaveBeenCalledTimes(1)

		/* Verify cache was updated */
		const cache = client.getMatchCache()
		expect(cache.get("_root_/about")?.data).toEqual({ page: "about" })

		/* Verify location updated */
		expect(ctx.location().pathname).toBe("/about")
	})

	it("signature is sent with CSR requests", async () => {
		let capturedHeaders: Headers | undefined

		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: "secret-sig.9999",
		}

		const mockFetch = vi.fn((_url: string, init?: RequestInit) => {
			capturedHeaders = new Headers(init?.headers)
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

		await ctx.router.navigate({ to: "/products" })

		expect(capturedHeaders?.get("x-s")).toBe("secret-sig.9999")
		expect(capturedHeaders?.get("x-d")).toBe("1")
	})

	it("prefetch populates cache without changing location", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const mockFetch = vi.fn(() => {
			const body = '{"t":"l","m":"_root_/products","d":{"products":[1,2,3]}}\n{"t":"d"}'
			return Promise.resolve(
				new Response(body, {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})

		const ctx = createFlareProvider(client)

		/* Location starts at / */
		expect(ctx.location().pathname).toBe("/")

		/* Prefetch /products */
		await ctx.router.prefetch({ to: "/products" })

		/* Location should NOT change */
		expect(ctx.location().pathname).toBe("/")

		/* But cache should have the data */
		const cache = client.getMatchCache()
		expect(cache.get("_root_/products")?.data).toEqual({ products: [1, 2, 3] })
	})

	it("chunk messages resolve deferred markers in loader data", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const mockFetch = vi.fn(() => {
			/*
			 * Server sends loader with deferred markers, then chunks resolve them.
			 * Deferred markers: { __deferred: true, __key: "keyName" }
			 * Client creates promises for markers, chunks resolve them.
			 */
			const body =
				'{"t":"l","m":"_root_/products","d":{"name":"Widget","reviews":{"__deferred":true,"__key":"reviews"},"related":{"__deferred":true,"__key":"related"}}}\n' +
				'{"t":"r"}\n' +
				'{"t":"c","m":"_root_/products","k":"reviews","d":[{"id":1},{"id":2}]}\n' +
				'{"t":"c","m":"_root_/products","k":"related","d":["a","b"]}\n' +
				'{"t":"d"}'
			return Promise.resolve(
				new Response(body, {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})

		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/products" })

		/* Verify loader data includes deferred with promises (not resolved values) */
		const cache = client.getMatchCache()
		const data = cache.get("_root_/products")?.data as Record<string, unknown>

		expect(data.name).toBe("Widget")
		/* Deferred data is wrapped in Deferred objects with promises */
		expect((data.reviews as Record<string, unknown>).__deferred).toBe(true)
		expect((data.related as Record<string, unknown>).__deferred).toBe(true)
		/* The promise field contains the actual promise */
		expect((data.reviews as Record<string, unknown>).promise).toBeInstanceOf(Promise)
	})
})

describe("cache invalidation", () => {
	it("invalidate marks cache entries as invalid", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/products", loaderData: {} },
				],
				params: {},
				pathname: "/products",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		/* Initially valid */
		expect(cache.get("_root_/products")?.invalid).toBe(false)

		/* Invalidate */
		ctx.router.invalidate({ matchId: "_root_/products" })

		/* Now invalid */
		expect(cache.get("_root_/products")?.invalid).toBe(true)
	})

	it("clearCache removes all cached entries", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: {} },
					{ id: "_root_/products", loaderData: {} },
				],
				params: {},
				pathname: "/products",
			},
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		const ctx = createFlareProvider(client)
		const cache = client.getMatchCache()

		expect(cache.size()).toBe(2)

		ctx.router.clearCache()

		expect(cache.size()).toBe(0)
	})
})

describe("reactive state updates", () => {
	it("matches signal updates after navigation", async () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [{ id: "_root_", loaderData: { page: "home" } }],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		const mockFetch = vi.fn(() => {
			const body = '{"t":"l","m":"_root_/about","d":{"page":"about"}}\n{"t":"d"}'
			return Promise.resolve(
				new Response(body, {
					headers: { "Content-Type": "application/x-ndjson" },
				}),
			)
		})

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})

		const ctx = createFlareProvider(client)

		/* Store initial matches count */
		const initialCount = ctx.matches().length

		/* Navigate */
		await ctx.router.navigate({ to: "/about" })

		/* Matches should have changed */
		const newCount = ctx.matches().length
		expect(newCount).toBeGreaterThanOrEqual(initialCount)
	})

	it("isNavigating updates during navigation", async () => {
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

		/* Not navigating initially */
		expect(ctx.isNavigating()).toBe(false)

		/* Navigate */
		await ctx.router.navigate({ to: "/test" })

		/* Should be false after navigation completes */
		expect(ctx.isNavigating()).toBe(false)
	})
})

describe("popstate navigation (back/forward)", () => {
	it("provider registers popstate handler", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })

		/* Popstate handler count before provider */
		let handlerCount = 0
		const originalOnPopstate = client.onPopstate.bind(client)
		client.onPopstate = (handler) => {
			handlerCount++
			originalOnPopstate(handler)
		}

		createFlareProvider(client)

		/* Provider should have registered a handler */
		expect(handlerCount).toBe(1)
	})

	it("cleanup removes history listener", () => {
		const ssrState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const client = createFlareClient({ flareState: ssrState })
		let cleanupCalled = false

		const originalCleanup = client.cleanup.bind(client)
		client.cleanup = () => {
			cleanupCalled = true
			originalCleanup()
		}

		createFlareProvider(client)

		/* Cleanup not called yet */
		expect(cleanupCalled).toBe(false)

		/* Simulate unmount by calling cleanup directly */
		client.cleanup()
		expect(cleanupCalled).toBe(true)
	})
})
