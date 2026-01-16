/**
 * Client Initialization Unit Tests
 *
 * Tests flareClient() initialization for client-side hydration.
 * Reads self.flare state and sets up router.
 */

import { describe, expect, it, vi } from "vitest"
import {
	createFlareClient,
	type FlareClientConfig,
	type FlareState,
	parseFlareState,
} from "../../../src/client/init"

describe("parseFlareState", () => {
	it("parses valid flare state", () => {
		const raw: FlareState = {
			c: { locale: "en-US" },
			q: [{ data: { name: "Widget" }, key: ["product", "123"] }],
			r: {
				matches: [{ id: "_root_", loaderData: {} }],
				params: {},
				pathname: "/",
			},
			s: "abc123.1704067200",
		}

		const state = parseFlareState(raw)

		expect(state).toEqual(raw)
	})

	it("returns null for invalid state", () => {
		expect(parseFlareState(null)).toBeNull()
		expect(parseFlareState(undefined)).toBeNull()
		expect(parseFlareState("invalid")).toBeNull()
		expect(parseFlareState({})).toBeNull()
	})

	it("returns null when missing required fields", () => {
		expect(parseFlareState({ c: {}, q: [], r: {} })).toBeNull()
		expect(parseFlareState({ c: {}, q: [], s: null })).toBeNull()
	})
})

describe("createFlareClient", () => {
	it("creates client with empty config", () => {
		const client = createFlareClient({})

		expect(client).toBeDefined()
		expect(typeof client.getMatchCache).toBe("function")
		expect(typeof client.getRouter).toBe("function")
	})

	it("initializes match cache from flare state", () => {
		const flareState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { user: { name: "Alice" } } },
					{ id: "_root_/products", loaderData: { products: [] } },
				],
				params: { id: "123" },
				pathname: "/products/123",
			},
			s: null,
		}

		const client = createFlareClient({ flareState })
		const cache = client.getMatchCache()

		expect(cache.size()).toBe(2)
	})

	it("initializes router with location from flare state", () => {
		const flareState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [],
				params: {},
				pathname: "/products/123",
			},
			s: null,
		}

		const client = createFlareClient({ flareState })
		const router = client.getRouter()

		expect(router.state.location.pathname).toBe("/products/123")
	})

	it("stores signature for CSR data requests", () => {
		const flareState: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: "abc123.1704067200",
		}

		const client = createFlareClient({ flareState })

		expect(client.getSignature()).toBe("abc123.1704067200")
	})

	it("stores context from flare state", () => {
		const flareState: FlareState = {
			c: {
				dir: "ltr",
				locale: "en-US",
				routerDefaults: { prefetchIntent: "viewport", staleTime: 30000 },
				theme: "light",
			},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const client = createFlareClient({ flareState })
		const ctx = client.getContext()

		expect(ctx.locale).toBe("en-US")
		expect(ctx.routerDefaults?.staleTime).toBe(30000)
	})
})

describe("client router", () => {
	it("provides navigate method", () => {
		const client = createFlareClient({})
		const router = client.getRouter()

		expect(typeof router.navigate).toBe("function")
	})

	it("provides prefetch method", () => {
		const client = createFlareClient({})
		const router = client.getRouter()

		expect(typeof router.prefetch).toBe("function")
	})

	it("provides refetch method", () => {
		const client = createFlareClient({})
		const router = client.getRouter()

		expect(typeof router.refetch).toBe("function")
	})

	it("provides clearCache method", () => {
		const client = createFlareClient({})
		const router = client.getRouter()

		expect(typeof router.clearCache).toBe("function")
	})

	it("provides invalidate method", () => {
		const client = createFlareClient({})
		const router = client.getRouter()

		expect(typeof router.invalidate).toBe("function")
	})
})

describe("query hydration", () => {
	it("hydrates queries from flare state", () => {
		const flareState: FlareState = {
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
			flareState,
			queryClient: mockQueryClient as unknown as FlareClientConfig["queryClient"],
		})

		expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(2)
		expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
			["product", "123"],
			{ name: "Widget" },
			expect.any(Object),
		)
	})
})
