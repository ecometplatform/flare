/**
 * Props Test Layout
 *
 * Tests that layout preloader and loader receive all expected props.
 */

import { createLayout } from "@ecomet/flare/router/create-layout"
import { Link } from "@ecomet/flare/router/link"

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

export const PropsTestLayout = createLayout({ virtualPath: "_root_/(props-test)" })
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

		/* Verify specific nested props - FlareLocation has url, variablePath, virtualPath too */
		const location = preloaderProps.location as Record<string, unknown> | undefined
		const locationChecks = location
			? [
					checkProp(location, "params", "object"),
					checkProp(location, "pathname", "string"),
					checkProp(location, "search", "object"),
					checkObjectProp(location, "url"),
					checkProp(location, "variablePath", "string"),
					checkProp(location, "virtualPath", "string"),
				]
			: []

		const locationFullyValid = locationChecks.every((c) => c.valid)
		const urlValid = location?.url instanceof URL

		/* Verify request has expected methods */
		const request = preloaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = preloaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		console.log("LAYOUT_PRELOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			locationChecks,
			locationFullyValid,
			receivedKeys,
			requestValid,
			urlValid,
		})

		return {
			layoutPreloaderChecks: checks,
			layoutPreloaderValid:
				allValid && requestValid && abortControllerValid && locationFullyValid && urlValid,
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

		/* Verify FlareLocation has all properties */
		const location = loaderProps.location as Record<string, unknown> | undefined
		const locationChecks = location
			? [
					checkProp(location, "params", "object"),
					checkProp(location, "pathname", "string"),
					checkProp(location, "search", "object"),
					checkObjectProp(location, "url"),
					checkProp(location, "variablePath", "string"),
					checkProp(location, "virtualPath", "string"),
				]
			: []

		const locationFullyValid = locationChecks.every((c) => c.valid)
		const urlValid = location?.url instanceof URL

		/* Verify request has expected methods */
		const request = loaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = loaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		/* Verify defer is callable */
		const defer = loaderProps.defer as unknown
		const deferValid = typeof defer === "function"

		console.log("LAYOUT_LOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			deferValid,
			locationChecks,
			locationFullyValid,
			receivedKeys,
			requestValid,
			urlValid,
		})

		return {
			layoutLoaderChecks: checks,
			layoutLoaderValid:
				allValid &&
				requestValid &&
				abortControllerValid &&
				deferValid &&
				locationFullyValid &&
				urlValid,
		}
	})
	.render((props) => (
		<div data-testid="props-test-layout">
			<header>
				<h2>Props Test Layout</h2>
				<nav>
					<Link to="/">Home</Link>
					{" | "}
					<Link to="/props-test">Props Test Index</Link>
				</nav>
			</header>
			<main>
				<div data-testid="layout-preloader-valid">
					Layout Preloader Valid:{" "}
					{String((props.preloaderContext as Record<string, unknown>).layoutPreloaderValid)}
				</div>
				<div data-testid="layout-loader-valid">
					Layout Loader Valid: {String(props.loaderData.layoutLoaderValid)}
				</div>
				{props.children}
			</main>
		</div>
	))
