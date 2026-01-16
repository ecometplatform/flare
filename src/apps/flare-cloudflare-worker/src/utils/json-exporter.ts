/**
 * JSON Exporter Utility
 *
 * Heavy utility for exporting data to formatted JSON.
 * Includes schema validation simulation.
 */

interface JsonExportOptions {
	filename?: string
	indent?: number
	sortKeys?: boolean
}

function sortObjectKeys<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map(sortObjectKeys) as T
	}
	if (obj !== null && typeof obj === "object") {
		const sorted: Record<string, unknown> = {}
		const keys = Object.keys(obj as object).sort()
		for (const key of keys) {
			sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
		}
		return sorted as T
	}
	return obj
}

function exportToJson<T>(data: T, options: JsonExportOptions = {}): string {
	const { indent = 2, sortKeys = false } = options

	if (sortKeys && typeof data === "object" && data !== null) {
		data = sortObjectKeys(data) as T
	}

	return JSON.stringify(data, null, indent)
}

function downloadJson(content: string, filename: string): void {
	const blob = new Blob([content], { type: "application/json;charset=utf-8;" })
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")
	link.href = url
	link.download = filename
	link.click()
	URL.revokeObjectURL(url)
}

function validateJsonSize(content: string): { isValid: boolean; message: string; size: number } {
	const size = new Blob([content]).size
	const maxSize = 10 * 1024 * 1024 /* 10MB */

	return {
		isValid: size <= maxSize,
		message: size <= maxSize ? "Size OK" : "File too large (max 10MB)",
		size,
	}
}

export default { downloadJson, exportToJson, validateJsonSize }
