/**
 * Auto-generated route manifest - DO NOT EDIT
 *
 * FlareRouteData (D): e=exportName o=options p=page v=variablePath x=virtualPath
 * FlareTreeNode (N): s=static p=param c=catchAll o=optionalCatchAll r=route n=paramName
 */

import type { RouteMeta } from "@ecomet/flare/router/create-page"
import type { FlareRouteData, FlareTreeNode } from "@ecomet/flare/router/tree-types"

/*
 * INLINED TYPES - DO NOT IMPORT FROM SERVER
 *
 * These types are intentionally duplicated here instead of importing from
 * @ecomet/flare/server to prevent node:async_hooks from leaking into
 * the client bundle during Vite dev mode. See generator source for details.
 */
interface GeneratedBoundary {
	boundaryType: "error" | "forbidden" | "notFound" | "streaming" | "unauthorized"
	component: () => Promise<{ default: unknown }>
	exportName: string
	path: string
	target: "layout" | "page"
}

interface LayoutModule {
	default: unknown
}

const E: Map<string, FlareTreeNode> = new Map()

const O0: RouteMeta = {}
const O1: RouteMeta = {"authenticate":true}

const R0: FlareRouteData = { e: "DeepNestedPage", o: O0, p: () => import("../routes/layout-tests/nested/deep/index").then(m => ({ default: m.DeepNestedPage })), v: "/layout-tests/nested/deep", x: "_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep" }

const R1: FlareRouteData = { e: "DynamicDashboardPage", o: O0, p: () => import("../routes/layout-tests/dynamic/[orgId]/dashboard").then(m => ({ default: m.DynamicDashboardPage })), v: "/layout-tests/dynamic/[orgId]/dashboard", x: "_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard" }

const R2: FlareRouteData = { e: "MultiParamsPage", o: O0, p: () => import("../routes/input-tests/multi-params").then(m => ({ default: m.MultiParamsPage })), v: "/input-tests/store/[storeId]/product/[productId]", x: "_root_/input-tests/store/[storeId]/product/[productId]" }

const R3: FlareRouteData = { e: "HooksTestNestedPage", o: O0, p: () => import("../routes/hooks-test/nested/index").then(m => ({ default: m.HooksTestNestedPage })), v: "/hooks-test/nested", x: "_root_/(hooks-test)/(nested)/hooks-test/nested" }

const R4: FlareRouteData = { e: "NestedIndex", o: O0, p: () => import("../routes/layout-tests/nested/index").then(m => ({ default: m.NestedIndex })), v: "/layout-tests/nested", x: "_root_/(layout-tests)/(nested)/layout-tests/nested" }

const R5: FlareRouteData = { e: "SiblingPage", o: O0, p: () => import("../routes/layout-tests/sibling/index").then(m => ({ default: m.SiblingPage })), v: "/layout-tests/sibling", x: "_root_/(layout-tests)/(sibling)/layout-tests/sibling" }

const R6: FlareRouteData = { e: "CombinedInputPage", o: O0, p: () => import("../routes/input-tests/combined").then(m => ({ default: m.CombinedInputPage })), v: "/input-tests/shop/[category]/[itemId]", x: "_root_/input-tests/shop/[category]/[itemId]" }

const R7: FlareRouteData = { e: "HeadTestPageA", o: O0, p: () => import("../routes/head-test/page-a").then(m => ({ default: m.HeadTestPageA })), v: "/head-test/page-a", x: "_root_/(head-test)/head-test/page-a" }

const R8: FlareRouteData = { e: "HeadTestPageB", o: O0, p: () => import("../routes/head-test/page-b").then(m => ({ default: m.HeadTestPageB })), v: "/head-test/page-b", x: "_root_/(head-test)/head-test/page-b" }

const R9: FlareRouteData = { e: "HooksErrorTestPage", o: O0, p: () => import("../routes/hooks-test/error-test").then(m => ({ default: m.HooksErrorTestPage })), v: "/hooks-test/error-test", x: "_root_/(hooks-test)/hooks-test/error-test" }

const R10: FlareRouteData = { e: "AuthConflictPage", o: O0, p: () => import("../routes/layout-tests/auth-conflict").then(m => ({ default: m.AuthConflictPage })), v: "/layout-tests/auth-conflict", x: "_root_/(layout-tests)/layout-tests/auth-conflict" }

const R11: FlareRouteData = { e: "AuthInheritPage", o: O0, p: () => import("../routes/layout-tests/auth-inherit").then(m => ({ default: m.AuthInheritPage })), v: "/layout-tests/auth-inherit", x: "_root_/(layout-tests)/layout-tests/auth-inherit" }

const R12: FlareRouteData = { e: "AuthRedundantPage", o: O1, p: () => import("../routes/layout-tests/auth-redundant").then(m => ({ default: m.AuthRedundantPage })), v: "/layout-tests/auth-redundant", x: "_root_/(layout-tests)/layout-tests/auth-redundant" }

const R13: FlareRouteData = { e: "ParamsEnumPage", o: O0, p: () => import("../routes/input-tests/params-enum").then(m => ({ default: m.ParamsEnumPage })), v: "/input-tests/category/[type]", x: "_root_/input-tests/category/[type]" }

const R14: FlareRouteData = { e: "OptionalCatchAllPage", o: O0, p: () => import("../routes/input-tests/optional-catch-all").then(m => ({ default: m.OptionalCatchAllPage })), v: "/input-tests/files/[[...path]]", x: "_root_/input-tests/files/[[...path]]" }

const R15: FlareRouteData = { e: "CatchAllPage", o: O0, p: () => import("../routes/input-tests/catch-all").then(m => ({ default: m.CatchAllPage })), v: "/input-tests/docs/[...slug]", x: "_root_/input-tests/docs/[...slug]" }

const R16: FlareRouteData = { e: "AdminSettingsPage", o: O0, p: () => import("../routes/admin-pages/settings").then(m => ({ default: m.AdminSettingsPage })), v: "/admin/settings", x: "_admin_/admin/settings" }

const R17: FlareRouteData = { e: "AdminUsersPage", o: O0, p: () => import("../routes/admin-pages/users").then(m => ({ default: m.AdminUsersPage })), v: "/admin/users", x: "_admin_/admin/users" }

const R18: FlareRouteData = { e: "HeadTestIndex", o: O0, p: () => import("../routes/head-test/index").then(m => ({ default: m.HeadTestIndex })), v: "/head-test", x: "_root_/(head-test)/head-test" }

const R19: FlareRouteData = { e: "HooksTestIndexPage", o: O0, p: () => import("../routes/hooks-test/index").then(m => ({ default: m.HooksTestIndexPage })), v: "/hooks-test", x: "_root_/(hooks-test)/hooks-test" }

const R20: FlareRouteData = { e: "LayoutTestsIndex", o: O0, p: () => import("../routes/layout-tests/index").then(m => ({ default: m.LayoutTestsIndex })), v: "/layout-tests", x: "_root_/(layout-tests)/layout-tests" }

const R21: FlareRouteData = { e: "PropsTestPage", o: O0, p: () => import("../routes/props-test/index").then(m => ({ default: m.PropsTestPage })), v: "/props-test", x: "_root_/(props-test)/props-test" }

const R22: FlareRouteData = { e: "SearchParamsPage", o: O0, p: () => import("../routes/input-tests/search-params").then(m => ({ default: m.SearchParamsPage })), v: "/input-tests/search", x: "_root_/input-tests/search" }

const R23: FlareRouteData = { e: "HashPage", o: O0, p: () => import("../routes/input-tests/hash").then(m => ({ default: m.HashPage })), v: "/input-tests/sections", x: "_root_/input-tests/sections" }

const R24: FlareRouteData = { e: "LazyTestBasicPage", o: O0, p: () => import("../routes/lazy-test/basic").then(m => ({ default: m.LazyTestBasicPage })), v: "/lazy-test/basic", x: "_root_/lazy-test/basic" }

const R25: FlareRouteData = { e: "DashboardLazyPage", o: O0, p: () => import("../routes/lazy-test/dashboard").then(m => ({ default: m.DashboardLazyPage })), v: "/lazy-test/dashboard", x: "_root_/lazy-test/dashboard" }

const R26: FlareRouteData = { e: "DataExportLazyPage", o: O0, p: () => import("../routes/lazy-test/data-export").then(m => ({ default: m.DataExportLazyPage })), v: "/lazy-test/data-export", x: "_root_/lazy-test/data-export" }

const R27: FlareRouteData = { e: "EditorLazyPage", o: O0, p: () => import("../routes/lazy-test/editor").then(m => ({ default: m.EditorLazyPage })), v: "/lazy-test/editor", x: "_root_/lazy-test/editor" }

const R28: FlareRouteData = { e: "GalleryLazyPage", o: O0, p: () => import("../routes/lazy-test/gallery").then(m => ({ default: m.GalleryLazyPage })), v: "/lazy-test/gallery", x: "_root_/lazy-test/gallery" }

const R29: FlareRouteData = { e: "ModalLazyPage", o: O0, p: () => import("../routes/lazy-test/modal").then(m => ({ default: m.ModalLazyPage })), v: "/lazy-test/modal", x: "_root_/lazy-test/modal" }

const R30: FlareRouteData = { e: "ProductPage", o: O0, p: () => import("../routes/product").then(m => ({ default: m.ProductPage })), v: "/products/[id]", x: "_root_/products/[id]" }

const R31: FlareRouteData = { e: "AdminDashboardPage", o: O0, p: () => import("../routes/admin-pages/index").then(m => ({ default: m.AdminDashboardPage })), v: "/admin", x: "_admin_/admin" }

const R32: FlareRouteData = { e: "AboutPage", o: O0, p: () => import("../routes/about").then(m => ({ default: m.AboutPage })), v: "/about", x: "_root_/about" }

const R33: FlareRouteData = { e: "AwaitPage", o: O0, p: () => import("../routes/await").then(m => ({ default: m.AwaitPage })), v: "/await", x: "_root_/await" }

const R34: FlareRouteData = { e: "AwaitSsrPage", o: O0, p: () => import("../routes/await-ssr").then(m => ({ default: m.AwaitSsrPage })), v: "/await-ssr", x: "_root_/await-ssr" }

const R35: FlareRouteData = { e: "CssTestPage", o: O0, p: () => import("../routes/css-test").then(m => ({ default: m.CssTestPage })), v: "/css-test", x: "_root_/css-test" }

const R36: FlareRouteData = { e: "CssV2TestPage", o: O0, p: () => import("../routes/css-v2-test").then(m => ({ default: m.CssV2TestPage })), v: "/css-v2-test", x: "_root_/css-v2-test" }

const R37: FlareRouteData = { e: "DeferPage", o: O0, p: () => import("../routes/defer").then(m => ({ default: m.DeferPage })), v: "/defer", x: "_root_/defer" }

const R38: FlareRouteData = { e: "DeferAwaitPage", o: O0, p: () => import("../routes/defer-await").then(m => ({ default: m.DeferAwaitPage })), v: "/defer-await", x: "_root_/defer-await" }

const R39: FlareRouteData = { e: "HtmlNavTestPage", o: O0, p: () => import("../routes/html-nav-test").then(m => ({ default: m.HtmlNavTestPage })), v: "/html-nav-test", x: "_root_/html-nav-test" }

const R40: FlareRouteData = { e: "LazyTestIndexPage", o: O0, p: () => import("../routes/lazy-test/index").then(m => ({ default: m.LazyTestIndexPage })), v: "/lazy-test", x: "_root_/lazy-test" }

const R41: FlareRouteData = { e: "PrefetchPage", o: O0, p: () => import("../routes/prefetch").then(m => ({ default: m.PrefetchPage })), v: "/prefetch", x: "_root_/prefetch" }

const R42: FlareRouteData = { e: "QueryDeferTestPage", o: O0, p: () => import("../routes/query-defer-test").then(m => ({ default: m.QueryDeferTestPage })), v: "/query-defer-test", x: "_root_/query-defer-test" }

const R43: FlareRouteData = { e: "QueryTestPage", o: O0, p: () => import("../routes/query-test").then(m => ({ default: m.QueryTestPage })), v: "/query-test", x: "_root_/query-test" }

const R44: FlareRouteData = { e: "IndexPage", o: O0, p: () => import("../routes/index").then(m => ({ default: m.IndexPage })), v: "/", x: "_root_/" }

export const clientEntryPath = "/src/entry-client.tsx"

export const layouts: Record<string, () => Promise<LayoutModule>> = {
	"_admin_": () => import("../routes/_admin").then(m => ({ default: m.AdminRootLayout })),
	"_root_": () => import("../routes/_root").then(m => ({ default: m.RootLayout })),
	"_root_/(head-test)": () => import("../routes/head-test/_layout").then(m => ({ default: m.HeadTestLayout })),
	"_root_/(hooks-test)": () => import("../routes/hooks-test/_layout").then(m => ({ default: m.HooksTestLayout })),
	"_root_/(hooks-test)/(nested)": () => import("../routes/hooks-test/nested/_layout").then(m => ({ default: m.HooksTestNestedLayout })),
	"_root_/(input-tests)": () => import("../routes/input-tests/_layout").then(m => ({ default: m.InputTestsLayout })),
	"_root_/(layout-tests)": () => import("../routes/layout-tests/_layout").then(m => ({ default: m.LayoutTestsLayout })),
	"_root_/(layout-tests)/(org-layout)": () => import("../routes/layout-tests/dynamic/[orgId]/_layout").then(m => ({ default: m.DynamicParamsLayout })),
	"_root_/(layout-tests)/(nested)": () => import("../routes/layout-tests/nested/_layout").then(m => ({ default: m.NestedLayout })),
	"_root_/(layout-tests)/(nested)/(deep)": () => import("../routes/layout-tests/nested/deep/_layout").then(m => ({ default: m.DeepNestedLayout })),
	"_root_/(layout-tests)/(sibling)": () => import("../routes/layout-tests/sibling/_layout").then(m => ({ default: m.SiblingLayout })),
	"_root_/(props-test)": () => import("../routes/props-test/_layout").then(m => ({ default: m.PropsTestLayout }))
}

export const routeTree: FlareTreeNode = { s: new Map([
	["layout-tests", { s: new Map([
		["nested", { s: new Map([
			["deep", { s: E, r: R0 }]
		]), r: R4 }],
		["dynamic", { s: E, p: { s: new Map([
			["dashboard", { s: E, r: R1 }]
		]), n: "orgId" } }],
		["sibling", { s: E, r: R5 }],
		["auth-conflict", { s: E, r: R10 }],
		["auth-inherit", { s: E, r: R11 }],
		["auth-redundant", { s: E, r: R12 }]
	]), r: R20 }],
	["input-tests", { s: new Map([
		["store", { s: E, p: { s: new Map([
			["product", { s: E, p: { s: E, r: R2, n: "productId" } }]
		]), n: "storeId" } }],
		["shop", { s: E, p: { s: E, p: { s: E, r: R6, n: "itemId" }, n: "category" } }],
		["category", { s: E, p: { s: E, r: R13, n: "type" } }],
		["files", { s: E, o: { s: E, r: R14, n: "path" } }],
		["docs", { s: E, c: { s: E, r: R15, n: "slug" } }],
		["search", { s: E, r: R22 }],
		["sections", { s: E, r: R23 }]
	]) }],
	["hooks-test", { s: new Map([
		["nested", { s: E, r: R3 }],
		["error-test", { s: E, r: R9 }]
	]), r: R19 }],
	["head-test", { s: new Map([
		["page-a", { s: E, r: R7 }],
		["page-b", { s: E, r: R8 }]
	]), r: R18 }],
	["admin", { s: new Map([
		["settings", { s: E, r: R16 }],
		["users", { s: E, r: R17 }]
	]), r: R31 }],
	["props-test", { s: E, r: R21 }],
	["lazy-test", { s: new Map([
		["basic", { s: E, r: R24 }],
		["dashboard", { s: E, r: R25 }],
		["data-export", { s: E, r: R26 }],
		["editor", { s: E, r: R27 }],
		["gallery", { s: E, r: R28 }],
		["modal", { s: E, r: R29 }]
	]), r: R40 }],
	["products", { s: E, p: { s: E, r: R30, n: "id" } }],
	["about", { s: E, r: R32 }],
	["await", { s: E, r: R33 }],
	["await-ssr", { s: E, r: R34 }],
	["css-test", { s: E, r: R35 }],
	["css-v2-test", { s: E, r: R36 }],
	["defer", { s: E, r: R37 }],
	["defer-await", { s: E, r: R38 }],
	["html-nav-test", { s: E, r: R39 }],
	["prefetch", { s: E, r: R41 }],
	["query-defer-test", { s: E, r: R42 }],
	["query-test", { s: E, r: R43 }]
]), r: R44 }

export const boundaries: GeneratedBoundary[] = []
