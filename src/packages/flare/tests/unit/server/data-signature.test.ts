/**
 * Data Signature Unit Tests
 *
 * Tests HMAC signature for CSR data request protection.
 * Prevents bots from scraping loader data directly.
 */

import { describe, expect, it } from "vitest"
import {
	createSignature,
	parseSignature,
	validateSignature,
} from "../../../src/server/handler/data-signature"

describe("createSignature", () => {
	it("generates signature in format hash.timestamp", async () => {
		const sig = await createSignature("test-secret")
		expect(sig).toMatch(/^[a-f0-9]+\.\d+$/)
	})

	it("signature contains current timestamp", async () => {
		const before = Math.floor(Date.now() / 1000)
		const sig = await createSignature("test-secret")
		const after = Math.floor(Date.now() / 1000)

		const parts = sig.split(".")
		const timestamp = Number.parseInt(parts[1] ?? "0", 10)

		expect(timestamp).toBeGreaterThanOrEqual(before)
		expect(timestamp).toBeLessThanOrEqual(after)
	})

	it("generates unique signatures for same secret (different timestamps)", async () => {
		const sig1 = await createSignature("test-secret")
		await new Promise((r) => setTimeout(r, 1100))
		const sig2 = await createSignature("test-secret")

		expect(sig1).not.toBe(sig2)
	})

	it("generates different signatures for different secrets", async () => {
		const timestamp = Math.floor(Date.now() / 1000)
		const sig1 = await createSignature("secret1", timestamp)
		const sig2 = await createSignature("secret2", timestamp)

		expect(sig1).not.toBe(sig2)
	})
})

describe("parseSignature", () => {
	it("parses valid signature", () => {
		const result = parseSignature("abc123.1704067200")

		expect(result).not.toBeNull()
		expect(result?.hash).toBe("abc123")
		expect(result?.timestamp).toBe(1704067200)
	})

	it("returns null for invalid format", () => {
		expect(parseSignature("invalid")).toBeNull()
		expect(parseSignature("no-dot-separator")).toBeNull()
		expect(parseSignature("")).toBeNull()
	})

	it("returns null for non-numeric timestamp", () => {
		expect(parseSignature("abc.notanumber")).toBeNull()
	})

	it("returns null for missing parts", () => {
		expect(parseSignature(".123")).toBeNull()
		expect(parseSignature("abc.")).toBeNull()
	})
})

describe("validateSignature", () => {
	it("validates correct signature within window", async () => {
		const sig = await createSignature("test-secret")
		const result = await validateSignature(sig, "test-secret", 60)

		expect(result.valid).toBe(true)
	})

	it("rejects expired signature", async () => {
		const oldTimestamp = Math.floor(Date.now() / 1000) - 120
		const sig = await createSignature("test-secret", oldTimestamp)
		const result = await validateSignature(sig, "test-secret", 60)

		expect(result.valid).toBe(false)
		expect(result.reason).toBe("expired")
	})

	it("rejects signature with wrong secret", async () => {
		const sig = await createSignature("correct-secret")
		const result = await validateSignature(sig, "wrong-secret", 60)

		expect(result.valid).toBe(false)
		expect(result.reason).toBe("invalid")
	})

	it("rejects malformed signature", async () => {
		const result = await validateSignature("malformed", "test-secret", 60)

		expect(result.valid).toBe(false)
		expect(result.reason).toBe("malformed")
	})

	it("uses default window of 60 seconds", async () => {
		const sig = await createSignature("test-secret")
		const result = await validateSignature(sig, "test-secret")

		expect(result.valid).toBe(true)
	})

	it("rejects future timestamp outside window", async () => {
		const futureTimestamp = Math.floor(Date.now() / 1000) + 120
		const sig = await createSignature("test-secret", futureTimestamp)
		const result = await validateSignature(sig, "test-secret", 60)

		expect(result.valid).toBe(false)
		expect(result.reason).toBe("expired")
	})
})
