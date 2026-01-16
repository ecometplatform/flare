/**
 * HTML Navigation Handler Unit Tests
 *
 * Tests HTML nav mode for CDN-cacheable content sites.
 */

import { describe, expect, it } from "vitest"
import { NAV_FORMAT } from "../../../src/server/handler/constants"
import { getNavFormat } from "../../../src/server/handler/data-request"

describe("getNavFormat", () => {
	it("returns null when x-d header missing", () => {
		const request = new Request("http://localhost/test")
		expect(getNavFormat(request)).toBeNull()
	})

	it("returns null when x-d header is not 1", () => {
		const request = new Request("http://localhost/test", {
			headers: { "x-d": "0" },
		})
		expect(getNavFormat(request)).toBeNull()
	})

	it("returns ndjson when x-d is 1 and no x-f header", () => {
		const request = new Request("http://localhost/test", {
			headers: { "x-d": "1" },
		})
		expect(getNavFormat(request)).toBe("ndjson")
	})

	it("returns ndjson when x-f is ndjson", () => {
		const request = new Request("http://localhost/test", {
			headers: { "x-d": "1", "x-f": NAV_FORMAT.NDJSON },
		})
		expect(getNavFormat(request)).toBe("ndjson")
	})

	it("returns html when x-f is html", () => {
		const request = new Request("http://localhost/test", {
			headers: { "x-d": "1", "x-f": NAV_FORMAT.HTML },
		})
		expect(getNavFormat(request)).toBe("html")
	})

	it("returns ndjson for unknown x-f value", () => {
		const request = new Request("http://localhost/test", {
			headers: { "x-d": "1", "x-f": "unknown" },
		})
		expect(getNavFormat(request)).toBe("ndjson")
	})
})

describe("NAV_FORMAT constants", () => {
	it("has html value", () => {
		expect(NAV_FORMAT.HTML).toBe("html")
	})

	it("has ndjson value", () => {
		expect(NAV_FORMAT.NDJSON).toBe("ndjson")
	})
})
