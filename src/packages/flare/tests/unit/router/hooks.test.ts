/**
 * Router Hooks Unit Tests
 *
 * Tests navigation hooks: useLocation, useParams, useSearch, useMatch, useMatches.
 */

import { describe, expect, it } from "vitest"
import {
	createLocationSignal,
	createParamsSignal,
	createSearchSignal,
	type UseLoaderDataOptions,
	type UseMatchOptions,
	useHydrated,
	useLoaderData,
	useLocation,
	useMatch,
	useMatches,
	useParams,
	useSearch,
} from "../../../src/router/hooks"

describe("hooks", () => {
	describe("createLocationSignal", () => {
		it("creates signal with pathname", () => {
			const [location] = createLocationSignal({
				hash: "",
				pathname: "/products",
				search: "",
			})
			expect(location().pathname).toBe("/products")
		})

		it("creates signal with search", () => {
			const [location] = createLocationSignal({
				hash: "",
				pathname: "/",
				search: "?page=2",
			})
			expect(location().search).toBe("?page=2")
		})

		it("creates signal with hash", () => {
			const [location] = createLocationSignal({
				hash: "#top",
				pathname: "/",
				search: "",
			})
			expect(location().hash).toBe("#top")
		})
	})

	describe("createParamsSignal", () => {
		it("creates signal with params", () => {
			const [params] = createParamsSignal({ id: "123", slug: "hello" })
			expect(params().id).toBe("123")
			expect(params().slug).toBe("hello")
		})

		it("creates signal with empty params", () => {
			const [params] = createParamsSignal({})
			expect(params()).toEqual({})
		})
	})

	describe("createSearchSignal", () => {
		it("creates signal with search params", () => {
			const [search] = createSearchSignal({ page: 2, sort: "name" })
			expect(search().page).toBe(2)
			expect(search().sort).toBe("name")
		})

		it("creates signal with empty search", () => {
			const [search] = createSearchSignal({})
			expect(search()).toEqual({})
		})
	})

	describe("useLocation", () => {
		it("is defined", () => {
			expect(useLocation).toBeDefined()
			expect(typeof useLocation).toBe("function")
		})
	})

	describe("useParams", () => {
		it("is defined", () => {
			expect(useParams).toBeDefined()
			expect(typeof useParams).toBe("function")
		})
	})

	describe("useSearch", () => {
		it("is defined", () => {
			expect(useSearch).toBeDefined()
			expect(typeof useSearch).toBe("function")
		})
	})

	describe("UseMatchOptions", () => {
		it("requires virtualPath", () => {
			const options: UseMatchOptions = { virtualPath: "/products/[id]" }
			expect(options.virtualPath).toBe("/products/[id]")
		})
	})

	describe("useMatch", () => {
		it("is defined", () => {
			expect(useMatch).toBeDefined()
			expect(typeof useMatch).toBe("function")
		})
	})

	describe("useMatches", () => {
		it("is defined", () => {
			expect(useMatches).toBeDefined()
			expect(typeof useMatches).toBe("function")
		})
	})

	describe("UseLoaderDataOptions", () => {
		it("requires virtualPath", () => {
			const options: UseLoaderDataOptions = { virtualPath: "/products/[id]" }
			expect(options.virtualPath).toBe("/products/[id]")
		})
	})

	describe("useLoaderData", () => {
		it("is defined", () => {
			expect(useLoaderData).toBeDefined()
			expect(typeof useLoaderData).toBe("function")
		})
	})

	describe("useHydrated", () => {
		it("is defined", () => {
			expect(useHydrated).toBeDefined()
			expect(typeof useHydrated).toBe("function")
		})
	})
})
