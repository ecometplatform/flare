/**
 * Data Export Lazy Test
 *
 * WHAT THIS TESTS:
 * - preload() for utility modules (not components)
 * - Fire-and-forget preloading on user intent
 * - Multiple preloadable utilities (CSV, JSON)
 *
 * EXPECTED BEHAVIOR:
 * 1. Hover export button → Preload starts
 * 2. Click export → Instant (already loaded)
 * 3. Download triggers with correct format
 */

import { preload } from "@ecomet/flare/preload"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { createSignal, For } from "solid-js"

/* ========================================
   PRELOADABLE UTILITIES
   ======================================== */

const csvExporter = preload({
	loader: () => import("../../utils/csv-exporter"),
	throws: false,
})

const jsonExporter = preload({
	loader: () => import("../../utils/json-exporter"),
	throws: false,
})

/* ========================================
   TEST DATA
   ======================================== */

const tableData = [
	{ category: "Electronics", id: 1, name: "Laptop", price: 999.99, stock: 50 },
	{ category: "Electronics", id: 2, name: "Smartphone", price: 699.99, stock: 120 },
	{ category: "Clothing", id: 3, name: "T-Shirt", price: 29.99, stock: 200 },
	{ category: "Clothing", id: 4, name: "Jeans", price: 79.99, stock: 80 },
	{ category: "Books", id: 5, name: "TypeScript Guide", price: 49.99, stock: 30 },
	{ category: "Books", id: 6, name: "React Patterns", price: 39.99, stock: 45 },
]

/* ========================================
   PAGE
   ======================================== */

export const DataExportLazyPage = createPage({ virtualPath: "_root_/lazy-test/data-export" })
	.head(() => ({ title: "Data Export - Lazy Loading Test" }))
	.render(() => {
		const [csvStatus, setCsvStatus] = createSignal("Not loaded")
		const [jsonStatus, setJsonStatus] = createSignal("Not loaded")
		const [exportResult, setExportResult] = createSignal("")
		const [lastExport, setLastExport] = createSignal<{
			content: string
			format: string
			size: number
		} | null>(null)

		/* Preload handlers - skip if already ready */
		const preloadCsv = () => {
			if (csvStatus() === "Ready!") return
			setCsvStatus("Preloading...")
			csvExporter.preload()
			setTimeout(() => setCsvStatus("Ready!"), 50)
		}

		const preloadJson = () => {
			if (jsonStatus() === "Ready!") return
			setJsonStatus("Preloading...")
			jsonExporter.preload()
			setTimeout(() => setJsonStatus("Ready!"), 50)
		}

		/* Export handlers */
		const handleExportCsv = async () => {
			try {
				setExportResult("Exporting CSV...")
				const mod = await csvExporter.load()
				const content = mod.exportToCsv(tableData)
				const size = new Blob([content]).size

				setLastExport({ content, format: "CSV", size })
				setExportResult(`CSV exported! ${mod.formatFileSize(size)}`)

				/* Trigger download */
				mod.downloadCsv(content, "products.csv")
			} catch (e) {
				setExportResult(`Error: ${e instanceof Error ? e.message : "Unknown"}`)
			}
		}

		const handleExportJson = async () => {
			try {
				setExportResult("Exporting JSON...")
				const mod = await jsonExporter.load()
				const content = mod.exportToJson(tableData, { indent: 2, sortKeys: true })
				const validation = mod.validateJsonSize(content)

				setLastExport({ content, format: "JSON", size: validation.size })
				setExportResult(`JSON exported! ${validation.message}`)

				/* Trigger download */
				mod.downloadJson(content, "products.json")
			} catch (e) {
				setExportResult(`Error: ${e instanceof Error ? e.message : "Unknown"}`)
			}
		}

		return (
			<main data-testid="data-export-lazy-page" style={{ "max-width": "900px", padding: "20px" }}>
				<Link to="/lazy-test">← Back to Lazy Tests</Link>

				<h1>Data Table with Lazy Export</h1>

				<section
					data-testid="test-explanation"
					style={{
						background: "#fffde7",
						border: "1px solid #ffc107",
						"margin-bottom": "24px",
						padding: "16px",
					}}
				>
					<h3>What This Tests</h3>
					<ul>
						<li>
							<strong>preload()</strong> - Utility modules (not components)
						</li>
						<li>
							<strong>Fire-and-forget</strong> - Preload on hover, use on click
						</li>
						<li>
							<strong>Multiple utilities</strong> - CSV and JSON exporters
						</li>
					</ul>
					<h4>Expected:</h4>
					<ul>
						<li>Hover button → Status shows "Ready!"</li>
						<li>Click → Export runs instantly</li>
						<li>File downloads with correct format</li>
					</ul>
				</section>

				{/* Preload Status */}
				<section data-testid="preload-status-section" style={{ "margin-bottom": "16px" }}>
					<div style={{ display: "flex", gap: "24px" }}>
						<div>
							<strong>CSV Exporter:</strong> <span data-testid="csv-status">{csvStatus()}</span>
						</div>
						<div>
							<strong>JSON Exporter:</strong> <span data-testid="json-status">{jsonStatus()}</span>
						</div>
					</div>
				</section>

				{/* Export Buttons */}
				<section
					data-testid="export-buttons"
					style={{ display: "flex", gap: "12px", "margin-bottom": "24px" }}
				>
					<button
						data-testid="export-csv-btn"
						onClick={handleExportCsv}
						onMouseEnter={preloadCsv}
						style={{
							background: "#4caf50",
							border: "none",
							color: "white",
							cursor: "pointer",
							padding: "12px 24px",
						}}
						type="button"
					>
						Export CSV
					</button>
					<button
						data-testid="export-json-btn"
						onClick={handleExportJson}
						onMouseEnter={preloadJson}
						style={{
							background: "#2196f3",
							border: "none",
							color: "white",
							cursor: "pointer",
							padding: "12px 24px",
						}}
						type="button"
					>
						Export JSON
					</button>
				</section>

				{/* Export Result */}
				{exportResult() && (
					<div
						data-testid="export-result"
						style={{
							background: "#e3f2fd",
							border: "1px solid #2196f3",
							"margin-bottom": "24px",
							padding: "12px",
						}}
					>
						{exportResult()}
					</div>
				)}

				{/* Data Table */}
				<section data-testid="data-table-section">
					<h2>Product Inventory</h2>
					<table style={{ "border-collapse": "collapse", width: "100%" }}>
						<thead>
							<tr style={{ background: "#f5f5f5" }}>
								<th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
								<th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
								<th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
								<th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
								<th style={{ border: "1px solid #ddd", padding: "8px" }}>Stock</th>
							</tr>
						</thead>
						<tbody>
							<For each={tableData}>
								{(row) => (
									<tr data-testid={`row-${row.id}`}>
										<td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.id}</td>
										<td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.name}</td>
										<td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.category}</td>
										<td style={{ border: "1px solid #ddd", padding: "8px" }}>
											${row.price.toFixed(2)}
										</td>
										<td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.stock}</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
				</section>

				{/* Last Export Preview */}
				{lastExport() && (
					<section data-testid="export-preview" style={{ "margin-top": "24px" }}>
						<h3>Last Export Preview ({lastExport()!.format})</h3>
						<pre
							data-testid="export-content"
							style={{
								background: "#f5f5f5",
								"font-size": "11px",
								"max-height": "200px",
								overflow: "auto",
								padding: "12px",
							}}
						>
							{lastExport()!.content}
						</pre>
					</section>
				)}
			</main>
		)
	})
