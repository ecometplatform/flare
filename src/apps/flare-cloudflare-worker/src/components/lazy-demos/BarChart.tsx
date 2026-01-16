/**
 * Bar Chart Component (Client-only)
 *
 * Simulates a charting library that needs browser APIs.
 * Uses canvas dimensions from window.
 */

import { createSignal, onMount } from "solid-js"

interface BarChartProps {
	data: { label: string; value: number }[]
	title: string
}

export default function BarChart(props: BarChartProps) {
	const [dimensions, setDimensions] = createSignal({ height: 0, width: 0 })
	const [mounted, setMounted] = createSignal(false)

	onMount(() => {
		setDimensions({ height: 200, width: window.innerWidth > 600 ? 400 : 300 })
		setMounted(true)
	})

	const maxValue = () => Math.max(...props.data.map((d) => d.value))

	return (
		<div data-testid="bar-chart-loaded" style={{ border: "1px solid #ccc", padding: "16px" }}>
			<h4>{props.title}</h4>
			<p data-testid="bar-chart-mounted">Mounted: {mounted() ? "yes" : "no"}</p>
			<p data-testid="bar-chart-dimensions">
				Canvas: {dimensions().width}x{dimensions().height}
			</p>
			<div style={{ "align-items": "flex-end", display: "flex", gap: "8px", height: "150px" }}>
				{props.data.map((item) => (
					<div style={{ "text-align": "center" }}>
						<div
							data-testid={`bar-${item.label}`}
							style={{
								background: "#4a90d9",
								height: `${(item.value / maxValue()) * 120}px`,
								width: "40px",
							}}
						/>
						<div style={{ "font-size": "12px" }}>{item.label}</div>
						<div style={{ "font-size": "10px" }}>{item.value}</div>
					</div>
				))}
			</div>
		</div>
	)
}
