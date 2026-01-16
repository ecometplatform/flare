/**
 * Dynamic Layout Dashboard Page
 *
 * Page inside dynamic layout with params.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"

export const DynamicDashboardPage = createPage({
	virtualPath: "_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard",
})
	.input({
		params: (raw: Record<string, string>) => ({
			orgId: raw.orgId ?? "",
		}),
	})
	.loader(async ({ location }) => ({
		orgId: location.params.orgId,
		stats: { projects: 7, users: 42 },
	}))
	.head(({ loaderData, parentHead }) => ({
		title: `${parentHead?.title} - Dashboard`,
	}))
	.render((props) => (
		<article data-testid="dynamic-dashboard-page">
			<h1>Dashboard for {props.loaderData.orgId}</h1>
			<div data-testid="org-stats">
				<p>Users: {props.loaderData.stats.users}</p>
				<p>Projects: {props.loaderData.stats.projects}</p>
			</div>
			<nav>
				<Link params={{ orgId: "acme" }} to="/layout-tests/dynamic/[orgId]/dashboard">
					Switch to Acme
				</Link>
				{" | "}
				<Link params={{ orgId: "globex" }} to="/layout-tests/dynamic/[orgId]/dashboard">
					Switch to Globex
				</Link>
			</nav>
		</article>
	))
