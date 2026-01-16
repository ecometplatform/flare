/**
 * Defer Helper Unit Tests
 *
 * Tests deferred streaming for SSR/CSR.
 * defer() wraps promises for streaming after shell renders.
 */

import { describe, expect, it, vi } from "vitest"
import { createDeferContext, type DeferredPromise } from "../../../src/server/handler/defer"

describe("createDeferContext", () => {
	it("creates context with defaults", () => {
		const ctx = createDeferContext({})

		expect(ctx.initialLoad).toBe(true)
		expect(ctx.disableDefer).toBe(false)
	})

	it("respects initialLoad option", () => {
		const ctx = createDeferContext({ initialLoad: false })

		expect(ctx.initialLoad).toBe(false)
	})

	it("respects disableDefer option", () => {
		const ctx = createDeferContext({ disableDefer: true })

		expect(ctx.disableDefer).toBe(true)
	})

	it("tracks deferred promises", () => {
		const ctx = createDeferContext({})
		const promise = Promise.resolve("data")

		ctx.defer(() => promise)

		expect(ctx.getDeferred()).toHaveLength(1)
	})
})

describe("defer", () => {
	it("returns Deferred wrapper with promise", async () => {
		const ctx = createDeferContext({})
		const result = ctx.defer(() => Promise.resolve("data"))

		expect(result.__deferred).toBe(true)
		expect(result.promise).toBeInstanceOf(Promise)
		expect(await result.promise).toBe("data")
	})

	it("tracks key when provided", () => {
		const ctx = createDeferContext({})
		ctx.defer(() => Promise.resolve("data"), { key: "reviews" })

		const deferred = ctx.getDeferred()
		expect(deferred[0]?.key).toBe("reviews")
	})

	it("generates key from index when not provided", () => {
		const ctx = createDeferContext({})
		ctx.defer(() => Promise.resolve("first"))
		ctx.defer(() => Promise.resolve("second"))

		const deferred = ctx.getDeferred()
		expect(deferred[0]?.key).toBe("d0")
		expect(deferred[1]?.key).toBe("d1")
	})

	it("tracks matchId when provided", () => {
		const ctx = createDeferContext({ matchId: "_root_/products/[id]" })
		ctx.defer(() => Promise.resolve("data"))

		const deferred = ctx.getDeferred()
		expect(deferred[0]?.matchId).toBe("_root_/products/[id]")
	})
})

describe("defer stream behavior", () => {
	describe("initial load with disableDefer: false (default)", () => {
		it("awaits deferred by default (stream: undefined)", () => {
			const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn)

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(false)
		})

		it("streams when explicit stream: true", () => {
			const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn, { stream: true })

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(true)
		})

		it("awaits when explicit stream: false", () => {
			const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn, { stream: false })

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(false)
		})
	})

	describe("initial load with disableDefer: true", () => {
		it("streams by default (stream: undefined)", () => {
			const ctx = createDeferContext({ disableDefer: true, initialLoad: true })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn)

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(true)
		})

		it("awaits when explicit stream: false", () => {
			const ctx = createDeferContext({ disableDefer: true, initialLoad: true })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn, { stream: false })

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(false)
		})
	})

	describe("CSR navigation (initialLoad: false)", () => {
		it("always streams regardless of disableDefer", () => {
			const ctx = createDeferContext({ disableDefer: false, initialLoad: false })
			const fn = vi.fn().mockResolvedValue("data")

			ctx.defer(fn)

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(true)
		})

		it("respects explicit stream: false on CSR", () => {
			const ctx = createDeferContext({ disableDefer: false, initialLoad: false })
			const fn = vi.fn().mockResolvedValue("data")

			/* Explicit stream option always takes precedence */
			ctx.defer(fn, { stream: false })

			const deferred = ctx.getDeferred()
			expect(deferred[0]?.stream).toBe(false)
		})
	})
})

describe("getDeferred", () => {
	it("returns empty array when no deferred", () => {
		const ctx = createDeferContext({})

		expect(ctx.getDeferred()).toEqual([])
	})

	it("returns all deferred promises in order", () => {
		const ctx = createDeferContext({})
		ctx.defer(() => Promise.resolve("first"), { key: "a" })
		ctx.defer(() => Promise.resolve("second"), { key: "b" })
		ctx.defer(() => Promise.resolve("third"), { key: "c" })

		const deferred = ctx.getDeferred()
		expect(deferred).toHaveLength(3)
		expect(deferred.map((d) => d.key)).toEqual(["a", "b", "c"])
	})
})

describe("awaitDeferred", () => {
	it("waits for all non-streaming deferred", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		let resolved = false

		ctx.defer(async () => {
			await new Promise((r) => setTimeout(r, 10))
			resolved = true
			return "data"
		})

		await ctx.awaitDeferred()
		expect(resolved).toBe(true)
	})

	it("does not wait for streaming deferred", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		let resolved = false

		ctx.defer(
			async () => {
				await new Promise((r) => setTimeout(r, 50))
				resolved = true
				return "data"
			},
			{ stream: true },
		)

		await ctx.awaitDeferred()
		expect(resolved).toBe(false)
	})

	it("returns resolved data for non-streaming", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		ctx.defer(() => Promise.resolve("first"), { key: "a" })
		ctx.defer(() => Promise.resolve("second"), { key: "b" })

		const results = await ctx.awaitDeferred()

		expect(results.get("a")).toBe("first")
		expect(results.get("b")).toBe("second")
	})
})

describe("DeferredPromise", () => {
	it("includes promise, key, matchId, stream", async () => {
		const ctx = createDeferContext({ matchId: "test-match" })
		const fn = () => Promise.resolve("data")

		ctx.defer(fn, { key: "reviews", stream: true })

		const deferred = ctx.getDeferred()[0] as DeferredPromise<string>
		expect(deferred.key).toBe("reviews")
		expect(deferred.matchId).toBe("test-match")
		expect(deferred.stream).toBe(true)
		expect(await deferred.promise).toBe("data")
	})
})

describe("Deferred ref tracking", () => {
	it("returns Deferred with __deferred marker", () => {
		const ctx = createDeferContext({})
		const result = ctx.defer(() => Promise.resolve("data"))

		expect(result.__deferred).toBe(true)
	})

	it("Deferred ref has __key property", () => {
		const ctx = createDeferContext({})
		const result = ctx.defer(() => Promise.resolve("data"), { key: "my-key" })

		expect(result.__key).toBe("my-key")
	})

	it("Deferred ref promise resolves to same value", async () => {
		const ctx = createDeferContext({})
		const expectedData = { reviews: [1, 2, 3] }
		const result = ctx.defer(() => Promise.resolve(expectedData))

		expect(await result.promise).toEqual(expectedData)
	})

	it("internal DeferredPromise tracks same ref", () => {
		const ctx = createDeferContext({})
		const result = ctx.defer(() => Promise.resolve("data"), { key: "test" })
		const deferred = ctx.getDeferred()[0]

		expect(deferred?.ref).toBe(result)
	})
})

describe("awaitDeferred __resolved tracking", () => {
	it("populates __resolved on Deferred ref after awaitDeferred", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		const result = ctx.defer(() => Promise.resolve("resolved-data"))

		await ctx.awaitDeferred()

		expect(result.__resolved).toBe("resolved-data")
	})

	it("does not populate __resolved for streaming deferred", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		const result = ctx.defer(() => Promise.resolve("data"), { stream: true })

		await ctx.awaitDeferred()

		expect(result.__resolved).toBeUndefined()
	})

	it("populates __resolved with complex objects", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		const expectedData = { items: [1, 2], meta: { total: 2 } }
		const result = ctx.defer(() => Promise.resolve(expectedData))

		await ctx.awaitDeferred()

		expect(result.__resolved).toEqual(expectedData)
	})
})

describe("error handling in defer", () => {
	it("rejected promise does not block awaitDeferred", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		ctx.defer(() => Promise.reject(new Error("fail")))

		await expect(ctx.awaitDeferred()).resolves.toBeDefined()
	})

	it("awaitDeferred does not include rejected values in results", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		ctx.defer(() => Promise.reject(new Error("fail")), { key: "broken" })

		const results = await ctx.awaitDeferred()

		expect(results.has("broken")).toBe(false)
	})

	it("successful deferred still resolves alongside rejected", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })
		ctx.defer(() => Promise.resolve("good"), { key: "good" })
		ctx.defer(() => Promise.reject(new Error("bad")), { key: "bad" })

		const results = await ctx.awaitDeferred()

		expect(results.get("good")).toBe("good")
		expect(results.has("bad")).toBe(false)
	})
})

describe("multiple deferrals", () => {
	it("handles many concurrent deferred calls", async () => {
		const ctx = createDeferContext({ disableDefer: false, initialLoad: true })

		for (let i = 0; i < 10; i++) {
			ctx.defer(() => Promise.resolve(i), { key: `item-${i}` })
		}

		const results = await ctx.awaitDeferred()

		expect(results.size).toBe(10)
		for (let i = 0; i < 10; i++) {
			expect(results.get(`item-${i}`)).toBe(i)
		}
	})

	it("preserves order in getDeferred", () => {
		const ctx = createDeferContext({})
		ctx.defer(() => Promise.resolve("a"), { key: "first" })
		ctx.defer(() => Promise.resolve("b"), { key: "second" })
		ctx.defer(() => Promise.resolve("c"), { key: "third" })

		const keys = ctx.getDeferred().map((d) => d.key)
		expect(keys).toEqual(["first", "second", "third"])
	})
})

describe("matchId inheritance", () => {
	it("all deferred inherit matchId from context", () => {
		const ctx = createDeferContext({ matchId: "_root_/products/[id]" })
		ctx.defer(() => Promise.resolve("a"))
		ctx.defer(() => Promise.resolve("b"))

		const deferred = ctx.getDeferred()
		expect(deferred[0]?.matchId).toBe("_root_/products/[id]")
		expect(deferred[1]?.matchId).toBe("_root_/products/[id]")
	})

	it("uses null matchId when not provided", () => {
		const ctx = createDeferContext({})
		ctx.defer(() => Promise.resolve("a"))

		expect(ctx.getDeferred()[0]?.matchId).toBeNull()
	})
})
