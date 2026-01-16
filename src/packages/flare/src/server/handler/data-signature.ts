/**
 * Data Signature
 *
 * HMAC signature for CSR data request protection.
 * Prevents bots from scraping loader data directly.
 *
 * Format: {hash}.{timestamp}
 * - hash: HMAC-SHA256 of timestamp using secret
 * - timestamp: Unix seconds when signature was created
 */

interface ParsedSignature {
	hash: string
	timestamp: number
}

interface ValidationResult {
	reason?: "expired" | "invalid" | "malformed"
	valid: boolean
}

/**
 * Create HMAC signature for data protection
 */
async function createSignature(secret: string, timestamp?: number): Promise<string> {
	const ts = timestamp ?? Math.floor(Date.now() / 1000)
	const hash = await computeHmac(secret, String(ts))
	return `${hash}.${ts}`
}

/**
 * Parse signature into components
 */
function parseSignature(signature: string): ParsedSignature | null {
	if (!signature) return null

	const dotIndex = signature.indexOf(".")
	if (dotIndex === -1) return null

	const hash = signature.slice(0, dotIndex)
	const timestampStr = signature.slice(dotIndex + 1)

	if (!hash || !timestampStr) return null

	const timestamp = Number.parseInt(timestampStr, 10)
	if (Number.isNaN(timestamp)) return null

	return { hash, timestamp }
}

/**
 * Validate signature against secret and time window
 */
async function validateSignature(
	signature: string,
	secret: string,
	windowSeconds = 60,
): Promise<ValidationResult> {
	const parsed = parseSignature(signature)
	if (!parsed) {
		return { reason: "malformed", valid: false }
	}

	const now = Math.floor(Date.now() / 1000)
	const age = Math.abs(now - parsed.timestamp)

	if (age > windowSeconds) {
		return { reason: "expired", valid: false }
	}

	const expectedHash = await computeHmac(secret, String(parsed.timestamp))
	if (expectedHash !== parsed.hash) {
		return { reason: "invalid", valid: false }
	}

	return { valid: true }
}

/**
 * Compute HMAC-SHA256 hash
 */
async function computeHmac(secret: string, message: string): Promise<string> {
	const encoder = new TextEncoder()
	const keyData = encoder.encode(secret)
	const messageData = encoder.encode(message)

	const key = await crypto.subtle.importKey(
		"raw",
		keyData,
		{ hash: "SHA-256", name: "HMAC" },
		false,
		["sign"],
	)

	const signature = await crypto.subtle.sign("HMAC", key, messageData)
	const hashArray = new Uint8Array(signature)

	let result = ""
	for (let i = 0; i < hashArray.length; i++) {
		const byte = hashArray[i]
		if (byte !== undefined) {
			result += byte.toString(16).padStart(2, "0")
		}
	}
	return result
}

export type { ParsedSignature, ValidationResult }

export { createSignature, parseSignature, validateSignature }
