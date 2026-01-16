/**
 * NDJSON Navigation Client Unit Tests
 *
 * Tests client-side NDJSON parsing.
 */

import { describe, expect, it } from "vitest"
import { parseNdjsonLine } from "../../../src/client/ndjson-nav"

describe("parseNdjsonLine", () => {
	it("returns null for empty line", () => {
		expect(parseNdjsonLine("")).toBeNull()
	})

	it("returns null for whitespace-only line", () => {
		expect(parseNdjsonLine("   ")).toBeNull()
	})

	it("returns null for invalid JSON", () => {
		expect(parseNdjsonLine("not json")).toBeNull()
	})

	it("parses loader message", () => {
		const line = '{"t":"l","m":"_root_","d":{"user":"alice"}}'
		const msg = parseNdjsonLine(line)
		expect(msg).not.toBeNull()
		expect(msg?.t).toBe("l")
		if (msg?.t === "l") {
			expect(msg.m).toBe("_root_")
			expect(msg.d).toEqual({ user: "alice" })
		}
	})

	it("parses chunk message", () => {
		const line = '{"t":"c","m":"_root_/page","k":"reviews","d":[1,2,3]}'
		const msg = parseNdjsonLine(line)
		expect(msg).not.toBeNull()
		expect(msg?.t).toBe("c")
		if (msg?.t === "c") {
			expect(msg.m).toBe("_root_/page")
			expect(msg.k).toBe("reviews")
			expect(msg.d).toEqual([1, 2, 3])
		}
	})

	it("parses error message", () => {
		const line = '{"t":"e","m":"_root_/fail","e":{"message":"Load failed"}}'
		const msg = parseNdjsonLine(line)
		expect(msg).not.toBeNull()
		expect(msg?.t).toBe("e")
		if (msg?.t === "e") {
			expect(msg.m).toBe("_root_/fail")
			expect(msg.e.message).toBe("Load failed")
		}
	})

	it("parses done message", () => {
		const line = '{"t":"d"}'
		const msg = parseNdjsonLine(line)
		expect(msg).not.toBeNull()
		expect(msg?.t).toBe("d")
	})

	it("handles complex loader data", () => {
		const data = { items: [1, 2], nested: { a: { b: "c" } } }
		const line = JSON.stringify({ d: data, m: "test", t: "l" })
		const msg = parseNdjsonLine(line)
		if (msg?.t === "l") {
			expect(msg.d).toEqual(data)
		}
	})

	it("handles null loader data", () => {
		const line = '{"t":"l","m":"test","d":null}'
		const msg = parseNdjsonLine(line)
		if (msg?.t === "l") {
			expect(msg.d).toBeNull()
		}
	})
})
