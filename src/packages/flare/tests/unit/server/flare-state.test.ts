/**
 * Flare State Unit Tests
 *
 * Tests self.flare state serialization for SSR hydration.
 * State includes signature, route data, query states, context.
 */

import { describe, expect, it } from "vitest"
import {
	buildFlareStateScript,
	type FlareState,
	serializeFlareState,
} from "../../../src/server/handler/flare-state"

describe("serializeFlareState", () => {
	it("serializes minimal state", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const json = serializeFlareState(state)
		const parsed = JSON.parse(json)

		expect(parsed.s).toBeNull()
		expect(parsed.r.pathname).toBe("/")
		expect(parsed.q).toEqual([])
		expect(parsed.c).toEqual({})
	})

	it("includes signature when provided", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: "abc123.1704067200",
		}

		const json = serializeFlareState(state)
		const parsed = JSON.parse(json)

		expect(parsed.s).toBe("abc123.1704067200")
	})

	it("serializes route matches", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [
					{ id: "_root_", loaderData: { user: "alice" } },
					{ id: "_root_/products/[id]", loaderData: { product: { name: "Widget" } } },
				],
				params: { id: "123" },
				pathname: "/products/123",
			},
			s: null,
		}

		const json = serializeFlareState(state)
		const parsed = JSON.parse(json)

		expect(parsed.r.pathname).toBe("/products/123")
		expect(parsed.r.params).toEqual({ id: "123" })
		expect(parsed.r.matches).toHaveLength(2)
		expect(parsed.r.matches[0].loaderData.user).toBe("alice")
	})

	it("serializes query states", () => {
		const state: FlareState = {
			c: {},
			q: [
				{ data: { name: "Widget" }, key: ["product", "123"], staleTime: 60000 },
				{ data: ["cat1", "cat2"], key: ["categories"] },
			],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const json = serializeFlareState(state)
		const parsed = JSON.parse(json)

		expect(parsed.q).toHaveLength(2)
		expect(parsed.q[0].key).toEqual(["product", "123"])
		expect(parsed.q[0].data).toEqual({ name: "Widget" })
	})

	it("serializes context", () => {
		const state: FlareState = {
			c: {
				dir: "ltr",
				locale: "en-US",
				routerDefaults: { gcTime: 1800000, prefetchIntent: "viewport", staleTime: 30000 },
				theme: "light",
			},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const json = serializeFlareState(state)
		const parsed = JSON.parse(json)

		expect(parsed.c.locale).toBe("en-US")
		expect(parsed.c.routerDefaults.staleTime).toBe(30000)
	})

	it("escapes script tags in data", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: {
				matches: [{ id: "_root_", loaderData: { html: "</script><script>alert(1)" } }],
				params: {},
				pathname: "/",
			},
			s: null,
		}

		const json = serializeFlareState(state)

		expect(json).not.toContain("</script>")
		expect(json).toContain("<\\/script>")
	})
})

describe("buildFlareStateScript", () => {
	it("builds self.flare assignment script", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: "sig.123",
		}

		const script = buildFlareStateScript(state)

		expect(script).toContain("self.flare=")
		expect(script).toContain('"s":"sig.123"')
	})

	it("produces valid JavaScript", () => {
		const state: FlareState = {
			c: { locale: "en" },
			q: [{ data: { x: 1 }, key: ["test"] }],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const script = buildFlareStateScript(state)

		expect(() => {
			new Function(script)
		}).not.toThrow()
	})

	it("minimizes whitespace", () => {
		const state: FlareState = {
			c: {},
			q: [],
			r: { matches: [], params: {}, pathname: "/" },
			s: null,
		}

		const script = buildFlareStateScript(state)

		expect(script).not.toContain("\n")
		expect(script).not.toContain("  ")
	})
})
