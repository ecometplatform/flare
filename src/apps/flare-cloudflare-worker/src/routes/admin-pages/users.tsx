/**
 * Admin Users Page
 *
 * Users management page under _admin_ root layout.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const AdminUsersPage = createPage({ virtualPath: "_admin_/admin/users" })
	.loader(() => ({
		users: [
			{ email: "alice@example.com", id: 1, role: "admin" },
			{ email: "bob@example.com", id: 2, role: "editor" },
			{ email: "charlie@example.com", id: 3, role: "viewer" },
		],
	}))
	.head(() => ({
		description: "Manage system users",
		title: "Users - Admin Panel",
	}))
	.render(({ loaderData }) => (
		<div data-testid="admin-users">
			<h1>Users Management</h1>
			<p data-testid="users-count">Total users: {loaderData.users.length}</p>

			<table data-testid="users-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Email</th>
						<th>Role</th>
					</tr>
				</thead>
				<tbody>
					{loaderData.users.map((user) => (
						<tr data-testid={`user-row-${user.id}`} key={user.id}>
							<td>{user.id}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
						</tr>
					))}
				</tbody>
			</table>

			<nav>
				<ul>
					<li>
						<Link to="/admin">Back to Dashboard</Link>
					</li>
					<li>
						<Link to="/admin/settings">Settings</Link>
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
