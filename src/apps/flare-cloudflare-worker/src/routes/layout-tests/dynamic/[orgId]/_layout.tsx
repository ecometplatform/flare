/**
 * Dynamic Params Layout
 *
 * Layout with dynamic route parameter.
 * Tests layout loaders with params.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"

export const DynamicParamsLayout = createLayout({
	virtualPath: "_root_/(layout-tests)/(org-layout)",
})
	.input({
		params: (raw: Record<string, string>) => ({
			orgId: raw.orgId ?? "",
		}),
	})
	.loader(async ({ location }) => ({
		orgId: location.params.orgId,
		orgName: `Organization ${location.params.orgId}`,
	}))
	.head(({ loaderData }) => ({
		title: `Org: ${loaderData.orgName}`,
	}))
	.render((props) => (
		<div data-org-id={props.loaderData.orgId} data-testid="dynamic-layout-wrapper">
			<header data-testid="dynamic-layout-header">
				<h3>Organization: {props.loaderData.orgName}</h3>
			</header>
			<div data-testid="dynamic-layout-content">{props.children}</div>
		</div>
	))
