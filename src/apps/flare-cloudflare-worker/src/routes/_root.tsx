/**
 * Root Layout
 *
 * Renders the HTML shell with AppRoot, HeadContent, and Scripts components.
 * Entry script is auto-injected by <Scripts /> when isDev: true in server config.
 */

import { AppRoot } from "@ecomet/flare/components/app-root"
import { HeadContent } from "@ecomet/flare/components/head-content"
import { Scripts } from "@ecomet/flare/components/scripts"
import { ResetCSS } from "@ecomet/flare/reset-css"
import { createRootLayout } from "@ecomet/flare/router/create-root-layout"
import { useLoaderData } from "@ecomet/flare/router/use-loader-data"
import { usePreloaderContext } from "@ecomet/flare/router/use-preloader-context"
import { ThemeScript } from "@ecomet/flare/theme-script"
import { ViewTransitionCSS } from "@ecomet/flare/view-transition-css"

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

export const RootLayout = createRootLayout({ virtualPath: "_root_" })
	.options({ authenticate: true })
	.preloader((props) => {
		const preloaderProps = props as Record<string, unknown>

		/* Root layout preloader does NOT have preloaderContext - it's the first in chain */
		const checks: PropCheck[] = [
			checkObjectProp(preloaderProps, "abortController"),
			checkProp(preloaderProps, "auth", "any"),
			checkProp(preloaderProps, "env", "object"),
			checkObjectProp(preloaderProps, "location"),
			checkProp(preloaderProps, "queryClient", "any"),
			checkObjectProp(preloaderProps, "request"),
		]

		const allValid = checks.every((c) => c.valid)
		const receivedKeys = Object.keys(preloaderProps).sort()

		/* Verify request is Request instance */
		const request = preloaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = preloaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		console.log("ROOT_PRELOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			receivedKeys,
			requestValid,
		})

		return {
			appName: "Flare v2 Test App",
			rootPreloaderChecks: checks,
			rootPreloaderValid: allValid && requestValid && abortControllerValid,
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

		/* Verify request is Request instance */
		const request = loaderProps.request as Request | undefined
		const requestValid = request instanceof Request

		/* Verify abortController has signal */
		const ac = loaderProps.abortController as AbortController | undefined
		const abortControllerValid = ac?.signal instanceof AbortSignal

		/* Verify defer is callable */
		const defer = loaderProps.defer as unknown
		const deferValid = typeof defer === "function"

		console.log("ROOT_LOADER_PROPS_CHECK", {
			abortControllerValid,
			allValid,
			checks,
			deferValid,
			receivedKeys,
			requestValid,
		})

		return {
			...props.preloaderContext,
			rootLoaderChecks: checks,
			rootLoaderValid: allValid && requestValid && abortControllerValid && deferValid,
		}
	})
	.head(() => ({
		title: "Flare v2 Tests",
	}))
	.render((props) => {
		const loaderData = useLoaderData({ virtualPath: "_root_" })
		const preloaderContext = usePreloaderContext({ virtualPath: "_root_" })

		console.log(loaderData(), preloaderContext())

		return (
			<html data-hydrated="false" lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta content="width=device-width, initial-scale=1.0" name="viewport" />
					<ResetCSS />
					<ViewTransitionCSS />
					<ThemeScript />
					<HeadContent />
				</head>
				<body>
					<AppRoot>{props.children}</AppRoot>
					<Scripts />
				</body>
			</html>
		)
	})
