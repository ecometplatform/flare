/**
 * Admin Dashboard Page
 *
 * Index page under _admin_ root layout.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const AdminDashboardPage = createPage({ virtualPath: "_admin_/admin" })
	.loader(() => ({
		stats: {
			activeUsers: 42,
			pendingOrders: 7,
			totalRevenue: 125000,
		},
	}))
	.head(() => ({
		description: "Admin dashboard overview",
		title: "Dashboard - Admin Panel",
	}))
	.render(({ loaderData }) => (
		<div data-testid="admin-dashboard">
			<h1>Admin Dashboard</h1>
			<p data-testid="admin-page-marker">This is the admin root layout</p>

			<div data-testid="admin-stats">
				<div>Active Users: {loaderData.stats.activeUsers}</div>
				<div>Pending Orders: {loaderData.stats.pendingOrders}</div>
				<div>Total Revenue: ${loaderData.stats.totalRevenue}</div>
			</div>

			<nav data-testid="admin-nav">
				<h2>Admin Navigation</h2>
				<ul>
					<li>
						<Link to="/admin/users">Users Management</Link>
					</li>
					<li>
						<Link to="/admin/settings">Settings</Link>
					</li>
				</ul>

				<h2>Cross-Root Navigation</h2>
				<ul>
					<li>
						<Link data-testid="link-to-public-home" to="/">
							Go to Public Home (_root_)
						</Link>
					</li>
					<li>
						<Link data-testid="link-to-public-about" to="/about">
							Go to Public About (_root_)
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	))
