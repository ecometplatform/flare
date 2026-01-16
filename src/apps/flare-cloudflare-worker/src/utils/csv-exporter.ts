/**
 * CSV Exporter Utility
 *
 * Heavy utility for exporting data to CSV.
 * Simulates a real export library with formatting options.
 */

interface ExportOptions {
	delimiter?: string
	filename?: string
	includeHeaders?: boolean
}

function exportToCsv<T extends Record<string, unknown>>(
	data: T[],
	options: ExportOptions = {},
): string {
	const { delimiter = ",", includeHeaders = true } = options

	if (data.length === 0) return ""

	const headers = Object.keys(data[0])
	const rows: string[] = []

	if (includeHeaders) {
		rows.push(headers.join(delimiter))
	}

	for (const row of data) {
		const values = headers.map((h) => {
			const val = row[h]
			const str = String(val ?? "")
			/* Escape quotes and wrap if contains delimiter */
			if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
				return `"${str.replace(/"/g, '""')}"`
			}
			return str
		})
		rows.push(values.join(delimiter))
	}

	return rows.join("\n")
}

function downloadCsv(content: string, filename: string): void {
	const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
	const url = URL.createObjectURL(blob)
	const link = document.createElement("a")
	link.href = url
	link.download = filename
	link.click()
	URL.revokeObjectURL(url)
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default { downloadCsv, exportToCsv, formatFileSize }
