/**
 * Dashboard Lazy Test
 *
 * WHAT THIS TESTS:
 * - clientLazy() for components that need browser APIs (charts)
 * - Multiple lazy components loading in parallel
 * - Each chart uses window/document/requestAnimationFrame
 *
 * EXPECTED BEHAVIOR:
 * 1. Server: Shows "Loading..." for all charts (no browser APIs on server)
 * 2. Client: Charts load and render with actual data
 * 3. Each chart shows "Mounted: yes" after hydration
 */

import { clientLazy } from "@ecomet/flare/client-lazy"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

/* ========================================
   LAZY CHART COMPONENTS
   ======================================== */

const BarChart = clientLazy({
	loader: () => import("../../components/lazy-demos/BarChart"),
	pending: () => (
		<div
			data-testid="bar-chart-pending"
			style={{ background: "#f0f0f0", height: "200px", padding: "16px" }}
		>
			<p>Loading Bar Chart...</p>
			<p style={{ color: "#666", "font-size": "12px" }}>
				Uses window.innerWidth for responsive sizing
			</p>
		</div>
	),
})

const PieChart = clientLazy({
	loader: () => import("../../components/lazy-demos/PieChart"),
	pending: () => (
		<div
			data-testid="pie-chart-pending"
			style={{ background: "#f0f0f0", height: "200px", padding: "16px" }}
		>
			<p>Loading Pie Chart...</p>
			<p style={{ color: "#666", "font-size": "12px" }}>
				Uses navigator.userAgent for browser detection
			</p>
		</div>
	),
})

const LineChart = clientLazy({
	loader: () => import("../../components/lazy-demos/LineChart"),
	pending: () => (
		<div
			data-testid="line-chart-pending"
			style={{ background: "#f0f0f0", height: "200px", padding: "16px" }}
		>
			<p>Loading Line Chart...</p>
			<p style={{ color: "#666", "font-size": "12px" }}>
				Uses requestAnimationFrame for smooth rendering
			</p>
		</div>
	),
})

/* ========================================
   TEST DATA
   ======================================== */

const barData = [
	{ label: "Jan", value: 120 },
	{ label: "Feb", value: 180 },
	{ label: "Mar", value: 150 },
	{ label: "Apr", value: 220 },
	{ label: "May", value: 190 },
]

const pieData = [
	{ color: "#e74c3c", label: "Desktop", value: 45 },
	{ color: "#3498db", label: "Mobile", value: 35 },
	{ color: "#2ecc71", label: "Tablet", value: 20 },
]

const lineData = [
	{ x: 1, y: 10 },
	{ x: 2, y: 25 },
	{ x: 3, y: 18 },
	{ x: 4, y: 32 },
	{ x: 5, y: 28 },
	{ x: 6, y: 45 },
]

/* ========================================
   PAGE
   ======================================== */

export const DashboardLazyPage = createPage({ virtualPath: "_root_/lazy-test/dashboard" })
	.head(() => ({ title: "Dashboard - Lazy Loading Test" }))
	.render(() => (
		<main data-testid="dashboard-lazy-page" style={{ "max-width": "800px", padding: "20px" }}>
			<Link to="/lazy-test">← Back to Lazy Tests</Link>

			<h1>Dashboard with Lazy Charts</h1>

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
						<strong>clientLazy()</strong> - Charts use browser APIs unavailable on server
					</li>
					<li>
						<strong>Parallel loading</strong> - All 3 charts load simultaneously
					</li>
					<li>
						<strong>Browser API usage</strong> - window, navigator, requestAnimationFrame
					</li>
				</ul>
				<h4>Expected:</h4>
				<ul>
					<li>SSR: 3 "Loading..." placeholders</li>
					<li>Client: All charts render with "Mounted: yes"</li>
				</ul>
			</section>

			<div style={{ display: "grid", gap: "24px" }}>
				{/* Bar Chart */}
				<section data-testid="bar-chart-section">
					<h2>Sales by Month (Bar Chart)</h2>
					<p style={{ color: "#666", "font-size": "14px" }}>
						Tests: <code>window.innerWidth</code> for responsive width
					</p>
					<BarChart data={barData} title="Monthly Sales" />
				</section>

				{/* Pie Chart */}
				<section data-testid="pie-chart-section">
					<h2>Traffic by Device (Pie Chart)</h2>
					<p style={{ color: "#666", "font-size": "14px" }}>
						Tests: <code>navigator.userAgent</code> for browser info
					</p>
					<PieChart data={pieData} title="Device Distribution" />
				</section>

				{/* Line Chart */}
				<section data-testid="line-chart-section">
					<h2>Growth Over Time (Line Chart)</h2>
					<p style={{ color: "#666", "font-size": "14px" }}>
						Tests: <code>requestAnimationFrame</code> for animation timing
					</p>
					<LineChart data={lineData} title="Weekly Growth" />
				</section>
			</div>
		</main>
	))
