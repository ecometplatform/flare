/**
 * Test: Sections Page (former hash test)
 *
 * Simple page for sections navigation testing.
 * Note: Hash fragments are handled client-side only (browsers don't send them to servers).
 */

import { createPage } from "@ecomet/flare/router/create-page"

export const HashPage = createPage({ virtualPath: "_root_/input-tests/sections" })
	.loader(() => {
		return { sections: ["overview", "details", "reviews", "specs"] }
	})
	.render(({ loaderData }) => (
		<div data-testid="hash">
			<h1>Sections</h1>
			<ul>
				{loaderData.sections.map((section) => (
					<li id={section}>{section}</li>
				))}
			</ul>
		</div>
	))
