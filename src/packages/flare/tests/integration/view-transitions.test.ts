/**
 * View Transitions Integration Tests
 *
 * Tests view transitions integration with navigation.
 * Verifies that view transitions are triggered correctly during CSR navigation.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createFlareClient, type FlareState } from "../../src/client/init"
import { createFlareProvider } from "../../src/client/provider"
import { getHistoryIndex, initHistoryIndex } from "../../src/client/view-transitions"

interface MockDocument {
	documentElement: { dataset: Record<string, string | undefined> }
	startViewTransition: ReturnType<typeof vi.fn>
}

/* Mock document with startViewTransition support */
function createMockDocument(startViewTransition?: ReturnType<typeof vi.fn>): MockDocument {
	return {
		documentElement: { dataset: {} },
		startViewTransition:
			startViewTransition ??
			vi.fn().mockImplementation((callbackOrOptions) => {
				const callback =
					typeof callbackOrOptions === "function" ? callbackOrOptions : callbackOrOptions.update
				callback()
				return {
					finished: Promise.resolve(),
					ready: Promise.resolve(),
					updateCallbackDone: Promise.resolve(),
				}
			}),
	}
}

describe("view transitions with navigation", () => {
	let originalDocument: typeof document | undefined
	let originalWindow: typeof globalThis.window | undefined
	let mockDoc: ReturnType<typeof createMockDocument>

	beforeEach(() => {
		originalDocument = globalThis.document
		originalWindow = (globalThis as Record<string, unknown>).window as typeof window | undefined

		mockDoc = createMockDocument()
		Object.defineProperty(globalThis, "document", {
			configurable: true,
			value: mockDoc,
		})
		;(globalThis as Record<string, unknown>).window = {
			location: { href: "" },
			matchMedia: vi.fn().mockReturnValue({ matches: false }),
		}

		initHistoryIndex(0)
	})

	afterEach(() => {
		if (originalDocument) {
			Object.defineProperty(globalThis, "document", {
				configurable: true,
				value: originalDocument,
			})
		}
		if (originalWindow !== undefined) {
			;(globalThis as Record<string, unknown>).window = originalWindow
		} else {
			delete (globalThis as Record<string, unknown>).window
		}
	})

	it("triggers view transition when viewTransitions is enabled globally", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		/* Response keeps the same root layout ID */
		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/about" })

		expect(mockDoc.startViewTransition).toHaveBeenCalled()
	})

	it("does not trigger view transition when disabled globally", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: false,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/about" })

		expect(mockDoc.startViewTransition).not.toHaveBeenCalled()
	})

	it("allows per-navigation viewTransition override", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: false,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Override with viewTransition enabled */
		await ctx.router.navigate({
			to: "/about",
			viewTransition: true,
		})

		expect(mockDoc.startViewTransition).toHaveBeenCalled()
	})

	it("supports viewTransition with custom types", async () => {
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({
			to: "/about",
			viewTransition: { types: ["fade", "slide"] },
		})

		expect(mockDoc.startViewTransition).toHaveBeenCalled()
	})

	it("skips view transition when types function returns false", async () => {
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Navigate to same path - types function returns false */
		await ctx.router.navigate({
			to: "/",
			viewTransition: {
				types: (info) => (info.pathChanged ? ["fade"] : false),
			},
		})

		/* pathChanged is false, so transition should be skipped */
		expect(mockDoc.startViewTransition).not.toHaveBeenCalled()
	})

	it("increments history index on forward navigation", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		const initialIndex = getHistoryIndex()
		await ctx.router.navigate({ to: "/about" })

		expect(getHistoryIndex()).toBe(initialIndex + 1)
	})

	it("respects prefers-reduced-motion", async () => {
		/* Mock reduced motion preference */
		;(globalThis as Record<string, unknown>).window = {
			location: { href: "" },
			matchMedia: vi.fn().mockReturnValue({ matches: true }),
		}

		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/about" })

		/* View transition should not be called due to reduced motion */
		expect(mockDoc.startViewTransition).not.toHaveBeenCalled()
	})
})

describe("scroll restoration with view transitions", () => {
	let originalDocument: typeof document | undefined
	let originalWindow: typeof globalThis.window | undefined
	let mockDoc: ReturnType<typeof createMockDocument>
	let scrollToCalledInsideTransition: boolean
	let scrollToArgs: { x: number; y: number } | null

	beforeEach(() => {
		originalDocument = globalThis.document
		originalWindow = (globalThis as Record<string, unknown>).window as typeof window | undefined
		scrollToCalledInsideTransition = false
		scrollToArgs = null

		/* Track whether scrollTo is called inside view transition callback */
		let insideTransition = false
		mockDoc = {
			documentElement: { dataset: {} },
			startViewTransition: vi.fn().mockImplementation((callbackOrOptions) => {
				const callback =
					typeof callbackOrOptions === "function" ? callbackOrOptions : callbackOrOptions.update
				insideTransition = true
				callback()
				insideTransition = false
				return {
					finished: Promise.resolve(),
					ready: Promise.resolve(),
					updateCallbackDone: Promise.resolve(),
				}
			}),
		}

		Object.defineProperty(globalThis, "document", {
			configurable: true,
			value: mockDoc,
		})

		/* Mock scrollTo to track when it's called */
		;(globalThis as Record<string, unknown>).window = {
			location: { href: "" },
			matchMedia: vi.fn().mockReturnValue({ matches: false }),
		}
		;(globalThis as Record<string, unknown>).scrollX = 0
		;(globalThis as Record<string, unknown>).scrollY = 0
		;(globalThis as Record<string, unknown>).scrollTo = vi.fn((x: number, y: number) => {
			scrollToArgs = { x, y }
			if (insideTransition) {
				scrollToCalledInsideTransition = true
			}
		})

		initHistoryIndex(0)
	})

	afterEach(() => {
		if (originalDocument) {
			Object.defineProperty(globalThis, "document", {
				configurable: true,
				value: originalDocument,
			})
		}
		if (originalWindow !== undefined) {
			;(globalThis as Record<string, unknown>).window = originalWindow
		} else {
			delete (globalThis as Record<string, unknown>).window
		}
		delete (globalThis as Record<string, unknown>).scrollX
		delete (globalThis as Record<string, unknown>).scrollY
		delete (globalThis as Record<string, unknown>).scrollTo
	})

	it("restores scroll position inside view transition callback on popstate", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		/* Simulate popstate navigation with _restoreScroll */
		await ctx.router.navigate({
			_popstate: true,
			_popstateHistoryIndex: 0,
			_restoreScroll: { x: 0, y: 500 },
			scroll: false,
			to: "/",
		})

		/* Scroll should be restored inside view transition for smoothness */
		expect(scrollToCalledInsideTransition).toBe(true)
		expect(scrollToArgs).toEqual({ x: 0, y: 500 })
	})

	it("scrolls to top inside view transition on forward navigation", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ to: "/about" })

		/* Scroll to top should happen inside view transition */
		expect(scrollToCalledInsideTransition).toBe(true)
		expect(scrollToArgs).toEqual({ x: 0, y: 0 })
	})

	it("does not scroll when scroll: false", async () => {
		const ssrState: FlareState = {
			c: {
				routerDefaults: {
					viewTransitions: true,
				},
			},
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

		const mockFetch = vi.fn(() =>
			Promise.resolve(
				new Response(
					'{"t":"l","m":"_root_","d":{}}\n{"t":"l","m":"_root_/about","d":{}}\n{"t":"r"}\n{"t":"d"}',
					{
						headers: { "Content-Type": "application/x-ndjson" },
					},
				),
			),
		)

		const client = createFlareClient({
			fetch: mockFetch as unknown as typeof fetch,
			flareState: ssrState,
		})
		const ctx = createFlareProvider(client)

		await ctx.router.navigate({ scroll: false, to: "/about" })

		/* No scroll should happen */
		expect(scrollToArgs).toBeNull()
	})
})
