/**
 * Admin Settings Page
 *
 * Settings page under _admin_ root layout.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const AdminSettingsPage = createPage({ virtualPath: "_admin_/admin/settings" })
	.loader(() => ({
		settings: {
			emailNotifications: true,
			language: "en",
			maintenanceMode: false,
			theme: "dark",
		},
	}))
	.head(() => ({
		description: "System settings",
		title: "Settings - Admin Panel",
	}))
	.render(({ loaderData }) => (
		<div data-testid="admin-settings">
			<h1>Settings</h1>

			<dl data-testid="settings-list">
				<dt>Theme</dt>
				<dd data-testid="setting-theme">{loaderData.settings.theme}</dd>

				<dt>Language</dt>
				<dd data-testid="setting-language">{loaderData.settings.language}</dd>

				<dt>Email Notifications</dt>
				<dd data-testid="setting-email">
					{loaderData.settings.emailNotifications ? "Enabled" : "Disabled"}
				</dd>

				<dt>Maintenance Mode</dt>
				<dd data-testid="setting-maintenance">
					{loaderData.settings.maintenanceMode ? "On" : "Off"}
				</dd>
			</dl>

			<nav>
				<ul>
					<li>
						<Link to="/admin">Back to Dashboard</Link>
					</li>
					<li>
						<Link to="/admin/users">Users</Link>
					</li>
					<li>
						<Link data-testid="link-to-public-home" to="/">
							Go to Public Home (_root_)
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	))
