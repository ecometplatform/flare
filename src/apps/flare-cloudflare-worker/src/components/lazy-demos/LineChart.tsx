/**
 * Line Chart Component (Client-only)
 *
 * Simulates time-series chart.
 * Uses requestAnimationFrame for smooth rendering.
 */

import { createSignal, onMount } from "solid-js"

interface LineChartProps {
	data: { x: number; y: number }[]
	title: string
}

export default function LineChart(props: LineChartProps) {
	const [mounted, setMounted] = createSignal(false)
	const [frameTime, setFrameTime] = createSignal(0)

	onMount(() => {
		setMounted(true)
		/* Use rAF to prove we're in browser */
		requestAnimationFrame((time) => {
			setFrameTime(Math.round(time))
		})
	})

	const minY = () => Math.min(...props.data.map((d) => d.y))
	const maxY = () => Math.max(...props.data.map((d) => d.y))
	const minX = () => Math.min(...props.data.map((d) => d.x))
	const maxX = () => Math.max(...props.data.map((d) => d.x))

	/* Convert data to SVG path */
	const pathD = () => {
		const scaleX = (x: number) => ((x - minX()) / (maxX() - minX())) * 280 + 10
		const scaleY = (y: number) => 90 - ((y - minY()) / (maxY() - minY())) * 80

		return props.data
			.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.x)} ${scaleY(p.y)}`)
			.join(" ")
	}

	return (
		<div data-testid="line-chart-loaded" style={{ border: "1px solid #ccc", padding: "16px" }}>
			<h4>{props.title}</h4>
			<p data-testid="line-chart-mounted">Mounted: {mounted() ? "yes" : "no"}</p>
			<p data-testid="line-chart-raf">requestAnimationFrame: {frameTime()}ms</p>
			<svg height="100" style={{ background: "#f9f9f9" }} viewBox="0 0 300 100" width="300">
				{/* Grid lines */}
				<line stroke="#ddd" x1="10" x2="290" y1="50" y2="50" />
				<line stroke="#ddd" x1="150" x2="150" y1="10" y2="90" />
				{/* Data line */}
				<path d={pathD()} data-testid="line-path" fill="none" stroke="#e74c3c" stroke-width="2" />
				{/* Data points */}
				{props.data.map((p, i) => {
					const scaleX = (x: number) => ((x - minX()) / (maxX() - minX())) * 280 + 10
					const scaleY = (y: number) => 90 - ((y - minY()) / (maxY() - minY())) * 80
					return (
						<circle
							cx={scaleX(p.x)}
							cy={scaleY(p.y)}
							data-testid={`point-${i}`}
							fill="#e74c3c"
							r="4"
						/>
					)
				})}
			</svg>
		</div>
	)
}
