/**
 * NDJSON Message Builders
 *
 * Create NDJSON messages for testing navigation and data fetching.
 * Message format matches Flare's streaming protocol.
 */

/** Loader message - route data loaded */
interface LoaderMessage {
	d: unknown
	m: string
	t: "l"
}

/** Chunk message - deferred data resolved */
interface ChunkMessage {
	d: unknown
	k: string
	m: string
	t: "c"
}

/** Error message - loader error */
interface ErrorMessage {
	e: { message: string; name?: string; stack?: string }
	m: string
	t: "e"
}

/** Ready message - initial loaders complete, streaming chunks */
interface ReadyMessage {
	t: "r"
}

/** Done message - navigation complete */
interface DoneMessage {
	t: "d"
}

/** Head message - per-route head config */
interface HeadMessage {
	h: { description?: string; title?: string }
	m: string
	t: "h"
}

/** All NDJSON message types */
type NdjsonMessage =
	| LoaderMessage
	| ChunkMessage
	| ErrorMessage
	| ReadyMessage
	| DoneMessage
	| HeadMessage

/**
 * NDJSON message builder helpers
 *
 * @example
 * const messages = [
 *   ndjson.loader("_root_/products", { products: [] }),
 *   ndjson.chunk("_root_/products", "reviews", []),
 *   ndjson.done(),
 * ]
 */
const ndjson = {
	/**
	 * Create a chunk message for deferred data
	 */
	chunk(matchId: string, key: string, data: unknown): ChunkMessage {
		return { d: data, k: key, m: matchId, t: "c" }
	},

	/**
	 * Create a done message (navigation complete)
	 */
	done(): DoneMessage {
		return { t: "d" }
	},

	/**
	 * Create an error message
	 */
	error(
		matchId: string,
		error: Error | { message: string; name?: string; stack?: string },
	): ErrorMessage {
		return {
			e: {
				message: error.message,
				name: error.name,
				stack: error instanceof Error ? error.stack : error.stack,
			},
			m: matchId,
			t: "e",
		}
	},

	/**
	 * Create a head message for per-route head config
	 */
	head(matchId: string, config: { description?: string; title?: string }): HeadMessage {
		return { h: config, m: matchId, t: "h" }
	},

	/**
	 * Create a loader message
	 */
	loader(matchId: string, data: unknown): LoaderMessage {
		return { d: data, m: matchId, t: "l" }
	},

	/**
	 * Create a ready message (initial loaders complete)
	 */
	ready(): ReadyMessage {
		return { t: "r" }
	},
}

/**
 * Serialize messages to NDJSON string
 */
function toNdjsonString(messages: NdjsonMessage[]): string {
	return messages.map((m) => JSON.stringify(m)).join("\n")
}

/**
 * Parse NDJSON string to messages
 */
function parseNdjsonString(body: string): NdjsonMessage[] {
	return body
		.trim()
		.split("\n")
		.filter(Boolean)
		.map((line) => JSON.parse(line) as NdjsonMessage)
}

/**
 * Create an NDJSON Response
 */
function createNDJSONResponse(
	messages: NdjsonMessage[],
	options?: { headers?: Record<string, string>; status?: number },
): Response {
	const body = toNdjsonString(messages)
	return new Response(body, {
		headers: {
			"Content-Type": "application/x-ndjson",
			...options?.headers,
		},
		status: options?.status ?? 200,
	})
}

export type {
	ChunkMessage,
	DoneMessage,
	ErrorMessage,
	HeadMessage,
	LoaderMessage,
	NdjsonMessage,
	ReadyMessage,
}

export { createNDJSONResponse, ndjson, parseNdjsonString, toNdjsonString }
