/**
 * Defer E2E Tests
 *
 * Tests defer() streaming behavior via NDJSON protocol.
 * Validates chunk messages, ordering, error handling, and data integrity.
 */

import { expect, test } from "@playwright/test"

const ROUTE = "/defer"

test.describe("Defer NDJSON Protocol", () => {
	test("returns NDJSON content type for data requests", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		expect(response.status()).toBe(200)
		expect(response.headers()["content-type"]).toBe("application/x-ndjson")
	})

	test("uses chunked transfer encoding for streaming", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		expect(response.headers()["transfer-encoding"]).toBe("chunked")
	})

	test("each line is valid JSON", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const lines = body.trim().split("\n")

		for (const line of lines) {
			expect(() => JSON.parse(line)).not.toThrow()
		}
	})

	test("ends with done message", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const lines = body.trim().split("\n")
		const lastLine = lines[lines.length - 1]

		expect(lastLine).toBeDefined()
		expect(JSON.parse(lastLine).t).toBe("d")
	})

	test("contains loader message for route", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const loaderMsg = messages.find((m) => m.t === "l" && m.m?.includes("defer"))
		expect(loaderMsg).toBeDefined()
	})

	test("loader message contains immediate data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const loaderMsg = messages.find((m) => m.t === "l" && m.m?.includes("defer"))
		expect(loaderMsg?.d?.immediate?.message).toBe("immediate-data")
	})

	test("contains ready message before chunks", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const readyIdx = messages.findIndex((m) => m.t === "r")
		const firstChunkIdx = messages.findIndex((m) => m.t === "c")

		expect(readyIdx).toBeGreaterThan(-1)
		expect(readyIdx).toBeLessThan(firstChunkIdx)
	})
})

test.describe("Defer Chunk Messages", () => {
	test("streams multiple chunk messages", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		expect(chunks.length).toBeGreaterThan(1)
	})

	test("chunk messages have required fields", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		for (const chunk of chunks) {
			expect(chunk.t).toBe("c")
			expect(chunk.m).toBeDefined() /* matchId */
			expect(chunk.k).toBeDefined() /* key */
			expect(chunk.d).toBeDefined() /* data */
		}
	})

	test("chunk keys match deferred keys", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const keys = chunks.map((c) => c.k)

		expect(keys).toContain("fast")
		expect(keys).toContain("slow")
		expect(keys).toContain("explicit-stream")
		expect(keys).toContain("items")
		expect(keys).toContain("nested")
	})

	test("fast chunk contains correct data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const fastChunk = chunks.find((c) => c.k === "fast")
		expect(fastChunk?.d?.speed).toBe("fast")
		expect(fastChunk?.d?.value).toBe(100)
	})

	test("slow chunk contains correct data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const slowChunk = chunks.find((c) => c.k === "slow")
		expect(slowChunk?.d?.speed).toBe("slow")
		expect(slowChunk?.d?.value).toBe(200)
	})

	test("items chunk contains array data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const itemsChunk = chunks.find((c) => c.k === "items")
		expect(itemsChunk?.d).toEqual(["item-a", "item-b", "item-c"])
	})

	test("nested chunk contains nested object data", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const nestedChunk = chunks.find((c) => c.k === "nested")
		expect(nestedChunk?.d?.user?.id).toBe("u1")
		expect(nestedChunk?.d?.user?.name).toBe("Alice")
		expect(nestedChunk?.d?.meta?.count).toBe(42)
	})

	test("explicit-stream chunk present", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		const explicitChunk = chunks.find((c) => c.k === "explicit-stream")
		expect(explicitChunk?.d?.mode).toBe("explicit-stream")
	})
})

test.describe("Defer Error Handling", () => {
	test("rejected defer sends error message", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const errorMsg = messages.find((m) => m.t === "e")
		expect(errorMsg).toBeDefined()
	})

	test("error message contains error details", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const errorMsg = messages.find((m) => m.t === "e" && m.k === "will-fail")
		expect(errorMsg?.e).toBeDefined()
		expect(errorMsg?.e?.message || errorMsg?.e).toContain("intentional-defer-error")
	})

	test("error does not prevent other chunks from streaming", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const hasError = messages.some((m) => m.t === "e")
		const hasChunks = messages.some((m) => m.t === "c")
		const hasDone = messages.some((m) => m.t === "d")

		expect(hasError).toBe(true)
		expect(hasChunks).toBe(true)
		expect(hasDone).toBe(true)
	})

	test("done message comes after error", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const errorIdx = messages.findIndex((m) => m.t === "e")
		const doneIdx = messages.findIndex((m) => m.t === "d")

		expect(doneIdx).toBeGreaterThan(errorIdx)
	})
})

test.describe("Defer Message Ordering", () => {
	test("loader messages come before ready", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const loaderIdx = messages.findIndex((m) => m.t === "l")
		const readyIdx = messages.findIndex((m) => m.t === "r")

		expect(loaderIdx).toBeLessThan(readyIdx)
	})

	test("ready message comes before all chunks", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const readyIdx = messages.findIndex((m) => m.t === "r")
		const chunkIndices = messages.map((m, i) => (m.t === "c" ? i : -1)).filter((i) => i !== -1)

		for (const chunkIdx of chunkIndices) {
			expect(readyIdx).toBeLessThan(chunkIdx)
		}
	})

	test("done message is always last", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const messages = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))

		const lastMsg = messages[messages.length - 1]
		expect(lastMsg?.t).toBe("d")
	})

	test("chunk matchIds reference correct route", async ({ request }) => {
		const response = await request.get(ROUTE, {
			headers: { "x-d": "1" },
		})

		const body = await response.text()
		const chunks = body
			.trim()
			.split("\n")
			.map((l) => JSON.parse(l))
			.filter((m) => m.t === "c")

		for (const chunk of chunks) {
			expect(chunk.m).toContain("defer")
		}
	})
})

test.describe("Defer SSR Rendering", () => {
	test("page renders with immediate data", async ({ page }) => {
		await page.goto(ROUTE)

		const message = page.getByTestId("immediate-message")
		await expect(message).toHaveText("immediate-data")
	})

	test("page has correct structure", async ({ page }) => {
		await page.goto(ROUTE)

		await expect(page.getByTestId("defer-page")).toBeVisible()
		await expect(page.getByTestId("immediate-section")).toBeVisible()
		await expect(page.getByTestId("deferred-section")).toBeVisible()
	})

	test("immediate timestamp is present", async ({ page }) => {
		await page.goto(ROUTE)

		const timestamp = page.getByTestId("immediate-timestamp")
		await expect(timestamp).toBeVisible()

		const text = await timestamp.textContent()
		expect(Number(text)).toBeGreaterThan(0)
	})
})
