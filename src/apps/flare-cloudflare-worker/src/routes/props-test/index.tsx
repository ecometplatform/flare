/**
 * Props Test Page
 *
 * Tests that page preloader and loader receive all expected props.
 * Displays verification results for root layout, layout, and page props.
 */

import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"

interface PropCheck {
	exists: boolean
	name: string
	type: string
	valid: boolean
}

function checkProp(obj: Record<string, unknown>, name: string, expectedType: string): PropCheck {
	const exists = name in obj
	const value = obj[name]
	const actualType = value === null ? "null" : typeof value
	const valid = exists && (expectedType === "any" || actualType === expectedType)
	return { exists, name, type: actualType, valid }
}

function checkObjectProp(obj: Record<string, unknown>, name: string): PropCheck {
	const exists = name in obj
	const value = obj[name]
	const isObject = value !== null && typeof value === "object"
	return { exists, name, type: typeof value, valid: exists && isObject }
}

export const PropsTestPage = createPage({ virtualPath: "_root_/(props-test)/props-test" })
	.preloader((props) => {
		const preloaderProps = props as Record<string, unknown>
		const checks: PropCheck[] = [
			checkObjectProp(preloaderProps, "abortController"),
			checkProp(preloaderProps, "auth", "any"),
			checkProp(preloaderProps, "env", "object"),
			checkObjectProp(preloaderProps, "location"),
			checkObjectProp(preloaderProps, "preloaderContext"),
			checkProp(preloaderProps, "queryClient", "any"),
			checkObjectProp(preloaderProps, "request"),
		]

		const allValid = checks.every((c) => c.valid)
		const receivedKeys = Object.keys(preloaderProps).sort()

		/* Verify specific nested props */
		const location = preloaderProps.location as Record<string, unknown> | undefined
		const locationChecks = location
			? [
					checkProp(location, "params", "object"),
					checkProp(location, "pathname", "string"),
					checkProp(location, "search", "object"),
				]
			: []

		/* Verify request has expected methods */
		const request = preloaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = preloaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		/* Verify preloaderContext has accumulated layout data */
		const preloaderContext = preloaderProps.preloaderContext as Record<string, unknown> | undefined
		const hasLayoutPreloaderData =
			preloaderContext !== undefined && "layoutPreloaderValid" in preloaderContext

		console.log("PAGE_PRELOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			hasLayoutPreloaderData,
			locationChecks,
			receivedKeys,
			requestValid,
		})

		return {
			pagePreloaderChecks: checks,
			pagePreloaderValid: allValid && requestValid && abortControllerValid,
		}
	})
	.loader((props) => {
		const loaderProps = props as Record<string, unknown>
		const checks: PropCheck[] = [
			checkObjectProp(loaderProps, "abortController"),
			checkProp(loaderProps, "auth", "any"),
			checkProp(loaderProps, "cause", "string"),
			checkProp(loaderProps, "defer", "function"),
			checkProp(loaderProps, "deps", "object"),
			checkProp(loaderProps, "env", "object"),
			checkObjectProp(loaderProps, "location"),
			checkProp(loaderProps, "prefetch", "boolean"),
			checkObjectProp(loaderProps, "preloaderContext"),
			checkProp(loaderProps, "queryClient", "any"),
			checkObjectProp(loaderProps, "request"),
		]

		const allValid = checks.every((c) => c.valid)
		const receivedKeys = Object.keys(loaderProps).sort()

		/* Verify request has expected methods */
		const request = loaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = loaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		/* Verify defer is callable */
		const defer = loaderProps.defer as unknown
		const deferValid = typeof defer === "function"

		/* Verify preloaderContext has accumulated data */
		const preloaderContext = loaderProps.preloaderContext as Record<string, unknown> | undefined
		const hasPagePreloaderData =
			preloaderContext !== undefined && "pagePreloaderValid" in preloaderContext

		console.log("PAGE_LOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			deferValid,
			hasPagePreloaderData,
			receivedKeys,
			requestValid,
		})

		return {
			pageLoaderChecks: checks,
			pageLoaderValid: allValid && requestValid && abortControllerValid && deferValid,
		}
	})
	.render(() => {
		const loaderData = useLoaderData({ virtualPath: "_root_/(props-test)/props-test" })
		const preloaderContext = usePreloaderContext({ virtualPath: "_root_/(props-test)/props-test" })

		const ctx = preloaderContext()
		const data = loaderData()

		return (
			<div data-testid="props-test-page">
				<h1>Props Verification Test</h1>

				<section>
					<h2>Summary</h2>
					<table style={{ "border-collapse": "collapse", width: "100%" }}>
						<thead>
							<tr>
								<th style={{ border: "1px solid #ccc", padding: "8px" }}>Builder</th>
								<th style={{ border: "1px solid #ccc", padding: "8px" }}>Hook</th>
								<th style={{ border: "1px solid #ccc", padding: "8px" }}>Valid</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Root Layout</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>preloader</td>
								<td
									data-testid="root-preloader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(ctx.rootPreloaderValid)}
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Root Layout</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>loader</td>
								<td
									data-testid="root-loader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(ctx.rootLoaderValid)}
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Layout</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>preloader</td>
								<td
									data-testid="layout-preloader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(ctx.layoutPreloaderValid)}
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Layout</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>loader</td>
								<td
									data-testid="layout-loader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(ctx.layoutLoaderValid)}
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Page</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>preloader</td>
								<td
									data-testid="page-preloader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(ctx.pagePreloaderValid)}
								</td>
							</tr>
							<tr>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>Page</td>
								<td style={{ border: "1px solid #ccc", padding: "8px" }}>loader</td>
								<td
									data-testid="page-loader-result"
									style={{ border: "1px solid #ccc", padding: "8px" }}
								>
									{String(data.pageLoaderValid)}
								</td>
							</tr>
						</tbody>
					</table>
				</section>

				<section style={{ "margin-top": "20px" }}>
					<h2>Expected Props</h2>

					<h3>Preloader Context Props</h3>
					<ul>
						<li>abortController: AbortController</li>
						<li>auth: resolved auth or undefined</li>
						<li>env: object</li>
						<li>location: {"{ params, pathname, search }"}</li>
						<li>preloaderContext: accumulated from parents (layout only for pages)</li>
						<li>queryClient: query client instance or undefined</li>
						<li>request: Request</li>
					</ul>

					<h3>Loader Context Props</h3>
					<ul>
						<li>abortController: AbortController</li>
						<li>auth: resolved auth or undefined</li>
						<li>cause: "enter" | "stay" | "leave"</li>
						<li>defer: function</li>
						<li>deps: array</li>
						<li>env: object</li>
						<li>location: {"{ params, pathname, search }"}</li>
						<li>prefetch: boolean</li>
						<li>preloaderContext: accumulated context</li>
						<li>queryClient: query client instance or undefined</li>
						<li>request: Request</li>
					</ul>
				</section>

				<Link to="/">Back to Home</Link>
			</div>
		)
	})
