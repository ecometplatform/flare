/**
 * FlareProvider Unit Tests
 *
 * Tests Solid.js integration for client-side hydration.
 * Verifies reactive state updates trigger re-renders.
 */

import { createRoot } from "solid-js"
import { describe, expect, it } from "vitest"
import { createFlareClient, type FlareState } from "../../../src/client/init"
import { createFlareProvider } from "../../../src/client/provider"

describe("createFlareProvider", () => {
	it("creates provider context from client", () => {
		const flareState: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [{ id: "_root_", loaderData: { user: "Alice" } }],
				params: { id: "123" },
				pathname: "/products/123",
			},
			s: null,
		}

		const client = createFlareClient({ flareState })
		const ctx = createFlareProvider(client)

		expect(ctx.location().pathname).toBe("/products/123")
		expect(ctx.params()).toEqual({ id: "123" })
		expect(ctx.matches()).toHaveLength(1)
	})

	it("provides reactive location signal", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: {}, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			expect(ctx.location().pathname).toBe("/")

			ctx.setLocation({ hash: "", pathname: "/products", search: "" })

			expect(ctx.location().pathname).toBe("/products")
			dispose()
		})
	})

	it("provides reactive matches signal", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: {
					matches: [{ id: "_root_", loaderData: {} }],
					params: {},
					pathname: "/",
				},
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			expect(ctx.matches()).toHaveLength(1)

			ctx.setMatches([
				{ loaderData: {}, render: () => null, virtualPath: "_root_" },
				{ loaderData: { products: [] }, render: () => null, virtualPath: "_root_/products" },
			])

			expect(ctx.matches()).toHaveLength(2)
			dispose()
		})
	})

	it("provides reactive params signal", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: { id: "1" }, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			expect(ctx.params()).toEqual({ id: "1" })

			ctx.setParams({ id: "2", slug: "widget" })

			expect(ctx.params()).toEqual({ id: "2", slug: "widget" })
			dispose()
		})
	})

	it("provides reactive isNavigating signal", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: {}, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			expect(ctx.isNavigating()).toBe(false)

			ctx.setIsNavigating(true)

			expect(ctx.isNavigating()).toBe(true)
			dispose()
		})
	})
})

describe("useFlareRouter", () => {
	it("returns router with navigate method", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: {}, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			const router = ctx.router

			expect(typeof router.navigate).toBe("function")
			expect(typeof router.prefetch).toBe("function")
			expect(typeof router.clearCache).toBe("function")
			expect(typeof router.invalidate).toBe("function")
			dispose()
		})
	})
})

describe("signal reactivity", () => {
	it("location signal updates correctly", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: {}, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			/* Initial value */
			const initial = ctx.location().pathname
			expect(initial).toBe("/")

			/* Update */
			ctx.setLocation({ hash: "", pathname: "/about", search: "" })
			const updated = ctx.location().pathname
			expect(updated).toBe("/about")

			dispose()
		})
	})

	it("matches signal updates correctly", () => {
		createRoot((dispose) => {
			const flareState: FlareState = {
				c: {},
				q: [],
				r: { matches: [], params: {}, pathname: "/" },
				s: null,
			}

			const client = createFlareClient({ flareState })
			const ctx = createFlareProvider(client)

			/* Initial value */
			const initial = ctx.matches().length
			expect(initial).toBe(0)

			/* Update */
			ctx.setMatches([{ loaderData: {}, render: () => null, virtualPath: "_root_" }])
			const updated = ctx.matches().length
			expect(updated).toBe(1)

			dispose()
		})
	})
})
