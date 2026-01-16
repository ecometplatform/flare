/**
 * Pie Chart Component (Client-only)
 *
 * Simulates a charting library using SVG.
 * Needs browser for accurate rendering calculations.
 */

import { createSignal, onMount } from "solid-js"

interface PieChartProps {
	data: { label: string; value: number; color: string }[]
	title: string
}

export default function PieChart(props: PieChartProps) {
	const [mounted, setMounted] = createSignal(false)
	const [userAgent, setUserAgent] = createSignal("")

	onMount(() => {
		setMounted(true)
		setUserAgent(navigator.userAgent.slice(0, 50))
	})

	const total = () => props.data.reduce((sum, d) => sum + d.value, 0)

	/* Calculate pie slices */
	const slices = () => {
		let cumulative = 0
		return props.data.map((item) => {
			const start = cumulative
			const percent = item.value / total()
			cumulative += percent
			return { ...item, end: cumulative, percent, start }
		})
	}

	/* Convert percentage to SVG arc coordinates */
	const getArcPath = (startPercent: number, endPercent: number) => {
		const startAngle = startPercent * 2 * Math.PI - Math.PI / 2
		const endAngle = endPercent * 2 * Math.PI - Math.PI / 2
		const largeArc = endPercent - startPercent > 0.5 ? 1 : 0

		const x1 = 50 + 40 * Math.cos(startAngle)
		const y1 = 50 + 40 * Math.sin(startAngle)
		const x2 = 50 + 40 * Math.cos(endAngle)
		const y2 = 50 + 40 * Math.sin(endAngle)

		return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
	}

	return (
		<div data-testid="pie-chart-loaded" style={{ border: "1px solid #ccc", padding: "16px" }}>
			<h4>{props.title}</h4>
			<p data-testid="pie-chart-mounted">Mounted: {mounted() ? "yes" : "no"}</p>
			<p data-testid="pie-chart-browser" style={{ "font-size": "10px" }}>
				Browser: {userAgent()}...
			</p>
			<div style={{ display: "flex", gap: "16px" }}>
				<svg height="120" viewBox="0 0 100 100" width="120">
					{slices().map((slice) => (
						<path
							d={getArcPath(slice.start, slice.end)}
							data-testid={`slice-${slice.label}`}
							fill={slice.color}
						/>
					))}
				</svg>
				<div style={{ "font-size": "12px" }}>
					{props.data.map((item) => (
						<div style={{ "align-items": "center", display: "flex", gap: "8px" }}>
							<div style={{ background: item.color, height: "12px", width: "12px" }} />
							<span>
								{item.label}: {item.value}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
