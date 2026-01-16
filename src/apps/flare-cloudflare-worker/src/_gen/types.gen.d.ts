/// <reference types="@ecomet/flare/globals" />
/**
 * Flare Module Augmentation
 * Auto-generated - DO NOT EDIT
 *
 * This file augments @ecomet/flare with your app's types.
 */

import type { ExtractAuthMode, ExtractLoaderData, ExtractParams, ExtractPreloaderData, ExtractSearchParams, ResolveAuthChain } from "@ecomet/flare/router/register"

declare module "@ecomet/flare/router/register" {
	interface FlareRegister {
		auth: Awaited<ReturnType<typeof import("../server").authenticateFn>>

		authContext: {
		"_admin_": null
		"_admin_/admin": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_admin").AdminRootLayout>]>
		"_admin_/admin/settings": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_admin").AdminRootLayout>]>
		"_admin_/admin/users": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_admin").AdminRootLayout>]>
		"_root_": null
		"_root_/": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(head-test)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(head-test)/head-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/head-test/_layout").HeadTestLayout>]>
		"_root_/(head-test)/head-test/page-a": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/head-test/_layout").HeadTestLayout>]>
		"_root_/(head-test)/head-test/page-b": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/head-test/_layout").HeadTestLayout>]>
		"_root_/(hooks-test)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(hooks-test)/(nested)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/hooks-test/_layout").HooksTestLayout>]>
		"_root_/(hooks-test)/(nested)/hooks-test/nested": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/hooks-test/_layout").HooksTestLayout>, ExtractAuthMode<typeof import("../routes/hooks-test/nested/_layout").HooksTestNestedLayout>]>
		"_root_/(hooks-test)/hooks-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/hooks-test/_layout").HooksTestLayout>]>
		"_root_/(hooks-test)/hooks-test/error-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/hooks-test/_layout").HooksTestLayout>]>
		"_root_/(input-tests)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(layout-tests)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(layout-tests)/(nested)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/(nested)/(deep)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>]>
		"_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/nested/deep/_layout").DeepNestedLayout>]>
		"_root_/(layout-tests)/(nested)/layout-tests/nested": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>]>
		"_root_/(layout-tests)/(org-layout)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/dynamic/[orgId]/_layout").DynamicParamsLayout>]>
		"_root_/(layout-tests)/(sibling)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/(sibling)/layout-tests/sibling": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/sibling/_layout").SiblingLayout>]>
		"_root_/(layout-tests)/layout-tests": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/layout-tests/auth-conflict": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/layout-tests/auth-inherit": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(layout-tests)/layout-tests/auth-redundant": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>]>
		"_root_/(props-test)": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/(props-test)/props-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>, ExtractAuthMode<typeof import("../routes/props-test/_layout").PropsTestLayout>]>
		"_root_/about": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/await": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/await-ssr": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/css-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/css-v2-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/defer": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/defer-await": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/html-nav-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/category/[type]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/docs/[...slug]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/files/[[...path]]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/search": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/sections": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/shop/[category]/[itemId]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/input-tests/store/[storeId]/product/[productId]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/basic": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/dashboard": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/data-export": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/editor": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/gallery": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/lazy-test/modal": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/prefetch": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/products/[id]": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/query-defer-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		"_root_/query-test": ResolveAuthChain<[ExtractAuthMode<typeof import("../routes/_root").RootLayout>]>
		}

		parentPreloaderContext: {
		"_admin_": Record<string, never>
		"_admin_/admin": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout>
		"_admin_/admin/settings": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout>
		"_admin_/admin/users": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout>
		"_root_": Record<string, never>
		"_root_/": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(head-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(head-test)/head-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout>
		"_root_/(head-test)/head-test/page-a": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout>
		"_root_/(head-test)/head-test/page-b": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout>
		"_root_/(hooks-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(hooks-test)/(nested)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout>
		"_root_/(hooks-test)/(nested)/hooks-test/nested": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/nested/_layout").HooksTestNestedLayout>
		"_root_/(hooks-test)/hooks-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout>
		"_root_/(hooks-test)/hooks-test/error-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout>
		"_root_/(input-tests)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(layout-tests)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(layout-tests)/(nested)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/(nested)/(deep)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>
		"_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/deep/_layout").DeepNestedLayout>
		"_root_/(layout-tests)/(nested)/layout-tests/nested": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>
		"_root_/(layout-tests)/(org-layout)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/_layout").DynamicParamsLayout>
		"_root_/(layout-tests)/(sibling)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/(sibling)/layout-tests/sibling": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/sibling/_layout").SiblingLayout>
		"_root_/(layout-tests)/layout-tests": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/layout-tests/auth-conflict": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/layout-tests/auth-inherit": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/layout-tests/auth-redundant": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(props-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/(props-test)/props-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/props-test/_layout").PropsTestLayout>
		"_root_/about": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/await": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/await-ssr": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/css-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/css-v2-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/defer": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/defer-await": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/html-nav-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/category/[type]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/docs/[...slug]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/files/[[...path]]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/search": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/sections": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/shop/[category]/[itemId]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/input-tests/store/[storeId]/product/[productId]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/basic": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/dashboard": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/data-export": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/editor": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/gallery": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/lazy-test/modal": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/prefetch": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/products/[id]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/query-defer-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/query-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		}

		preloaderContext: {
		"_admin_": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout>
		"_admin_/admin": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout> & ExtractPreloaderData<typeof import("../routes/admin-pages/index").AdminDashboardPage>
		"_admin_/admin/settings": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout> & ExtractPreloaderData<typeof import("../routes/admin-pages/settings").AdminSettingsPage>
		"_admin_/admin/users": ExtractPreloaderData<typeof import("../routes/_admin").AdminRootLayout> & ExtractPreloaderData<typeof import("../routes/admin-pages/users").AdminUsersPage>
		"_root_": ExtractPreloaderData<typeof import("../routes/_root").RootLayout>
		"_root_/": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/index").IndexPage>
		"_root_/(head-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout>
		"_root_/(head-test)/head-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout> & ExtractPreloaderData<typeof import("../routes/head-test/index").HeadTestIndex>
		"_root_/(head-test)/head-test/page-a": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout> & ExtractPreloaderData<typeof import("../routes/head-test/page-a").HeadTestPageA>
		"_root_/(head-test)/head-test/page-b": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/head-test/_layout").HeadTestLayout> & ExtractPreloaderData<typeof import("../routes/head-test/page-b").HeadTestPageB>
		"_root_/(hooks-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout>
		"_root_/(hooks-test)/(nested)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/nested/_layout").HooksTestNestedLayout>
		"_root_/(hooks-test)/(nested)/hooks-test/nested": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/nested/_layout").HooksTestNestedLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/nested/index").HooksTestNestedPage>
		"_root_/(hooks-test)/hooks-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/index").HooksTestIndexPage>
		"_root_/(hooks-test)/hooks-test/error-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout> & ExtractPreloaderData<typeof import("../routes/hooks-test/error-test").HooksErrorTestPage>
		"_root_/(input-tests)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/_layout").InputTestsLayout>
		"_root_/(layout-tests)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/(nested)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>
		"_root_/(layout-tests)/(nested)/(deep)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/deep/_layout").DeepNestedLayout>
		"_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/deep/_layout").DeepNestedLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/deep/index").DeepNestedPage>
		"_root_/(layout-tests)/(nested)/layout-tests/nested": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/nested/index").NestedIndex>
		"_root_/(layout-tests)/(org-layout)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/_layout").DynamicParamsLayout>
		"_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/_layout").DynamicParamsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/dashboard").DynamicDashboardPage>
		"_root_/(layout-tests)/(sibling)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/sibling/_layout").SiblingLayout>
		"_root_/(layout-tests)/(sibling)/layout-tests/sibling": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/sibling/_layout").SiblingLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/sibling/index").SiblingPage>
		"_root_/(layout-tests)/layout-tests": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/index").LayoutTestsIndex>
		"_root_/(layout-tests)/layout-tests/auth-conflict": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/auth-conflict").AuthConflictPage>
		"_root_/(layout-tests)/layout-tests/auth-inherit": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/auth-inherit").AuthInheritPage>
		"_root_/(layout-tests)/layout-tests/auth-redundant": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout> & ExtractPreloaderData<typeof import("../routes/layout-tests/auth-redundant").AuthRedundantPage>
		"_root_/(props-test)": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/props-test/_layout").PropsTestLayout>
		"_root_/(props-test)/props-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/props-test/_layout").PropsTestLayout> & ExtractPreloaderData<typeof import("../routes/props-test/index").PropsTestPage>
		"_root_/about": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/about").AboutPage>
		"_root_/await": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/await").AwaitPage>
		"_root_/await-ssr": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/await-ssr").AwaitSsrPage>
		"_root_/css-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/css-test").CssTestPage>
		"_root_/css-v2-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/css-v2-test").CssV2TestPage>
		"_root_/defer": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/defer").DeferPage>
		"_root_/defer-await": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/defer-await").DeferAwaitPage>
		"_root_/html-nav-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/html-nav-test").HtmlNavTestPage>
		"_root_/input-tests/category/[type]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/params-enum").ParamsEnumPage>
		"_root_/input-tests/docs/[...slug]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/catch-all").CatchAllPage>
		"_root_/input-tests/files/[[...path]]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/optional-catch-all").OptionalCatchAllPage>
		"_root_/input-tests/search": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/search-params").SearchParamsPage>
		"_root_/input-tests/sections": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/hash").HashPage>
		"_root_/input-tests/shop/[category]/[itemId]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/combined").CombinedInputPage>
		"_root_/input-tests/store/[storeId]/product/[productId]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/input-tests/multi-params").MultiParamsPage>
		"_root_/lazy-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/index").LazyTestIndexPage>
		"_root_/lazy-test/basic": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/basic").LazyTestBasicPage>
		"_root_/lazy-test/dashboard": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/dashboard").DashboardLazyPage>
		"_root_/lazy-test/data-export": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/data-export").DataExportLazyPage>
		"_root_/lazy-test/editor": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/editor").EditorLazyPage>
		"_root_/lazy-test/gallery": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/gallery").GalleryLazyPage>
		"_root_/lazy-test/modal": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/lazy-test/modal").ModalLazyPage>
		"_root_/prefetch": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/prefetch").PrefetchPage>
		"_root_/products/[id]": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/product").ProductPage>
		"_root_/query-defer-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/query-defer-test").QueryDeferTestPage>
		"_root_/query-test": ExtractPreloaderData<typeof import("../routes/_root").RootLayout> & ExtractPreloaderData<typeof import("../routes/query-test").QueryTestPage>
		}

		loaderData: {
		"_admin_": ExtractLoaderData<typeof import("../routes/_admin").AdminRootLayout>
		"_root_": ExtractLoaderData<typeof import("../routes/_root").RootLayout>
		"_root_/about": ExtractLoaderData<typeof import("../routes/about").AboutPage>
		"_admin_/admin": ExtractLoaderData<typeof import("../routes/admin-pages/index").AdminDashboardPage>
		"_admin_/admin/settings": ExtractLoaderData<typeof import("../routes/admin-pages/settings").AdminSettingsPage>
		"_admin_/admin/users": ExtractLoaderData<typeof import("../routes/admin-pages/users").AdminUsersPage>
		"_root_/await-ssr": ExtractLoaderData<typeof import("../routes/await-ssr").AwaitSsrPage>
		"_root_/await": ExtractLoaderData<typeof import("../routes/await").AwaitPage>
		"_root_/css-test": ExtractLoaderData<typeof import("../routes/css-test").CssTestPage>
		"_root_/css-v2-test": ExtractLoaderData<typeof import("../routes/css-v2-test").CssV2TestPage>
		"_root_/defer-await": ExtractLoaderData<typeof import("../routes/defer-await").DeferAwaitPage>
		"_root_/defer": ExtractLoaderData<typeof import("../routes/defer").DeferPage>
		"_root_/(head-test)": ExtractLoaderData<typeof import("../routes/head-test/_layout").HeadTestLayout>
		"_root_/(head-test)/head-test": ExtractLoaderData<typeof import("../routes/head-test/index").HeadTestIndex>
		"_root_/(head-test)/head-test/page-a": ExtractLoaderData<typeof import("../routes/head-test/page-a").HeadTestPageA>
		"_root_/(head-test)/head-test/page-b": ExtractLoaderData<typeof import("../routes/head-test/page-b").HeadTestPageB>
		"_root_/(hooks-test)": ExtractLoaderData<typeof import("../routes/hooks-test/_layout").HooksTestLayout>
		"_root_/(hooks-test)/hooks-test/error-test": ExtractLoaderData<typeof import("../routes/hooks-test/error-test").HooksErrorTestPage>
		"_root_/(hooks-test)/hooks-test": ExtractLoaderData<typeof import("../routes/hooks-test/index").HooksTestIndexPage>
		"_root_/(hooks-test)/(nested)": ExtractLoaderData<typeof import("../routes/hooks-test/nested/_layout").HooksTestNestedLayout>
		"_root_/(hooks-test)/(nested)/hooks-test/nested": ExtractLoaderData<typeof import("../routes/hooks-test/nested/index").HooksTestNestedPage>
		"_root_/html-nav-test": ExtractLoaderData<typeof import("../routes/html-nav-test").HtmlNavTestPage>
		"_root_/": ExtractLoaderData<typeof import("../routes/index").IndexPage>
		"_root_/(input-tests)": ExtractLoaderData<typeof import("../routes/input-tests/_layout").InputTestsLayout>
		"_root_/input-tests/docs/[...slug]": ExtractLoaderData<typeof import("../routes/input-tests/catch-all").CatchAllPage>
		"_root_/input-tests/shop/[category]/[itemId]": ExtractLoaderData<typeof import("../routes/input-tests/combined").CombinedInputPage>
		"_root_/input-tests/sections": ExtractLoaderData<typeof import("../routes/input-tests/hash").HashPage>
		"_root_/input-tests/store/[storeId]/product/[productId]": ExtractLoaderData<typeof import("../routes/input-tests/multi-params").MultiParamsPage>
		"_root_/input-tests/files/[[...path]]": ExtractLoaderData<typeof import("../routes/input-tests/optional-catch-all").OptionalCatchAllPage>
		"_root_/input-tests/category/[type]": ExtractLoaderData<typeof import("../routes/input-tests/params-enum").ParamsEnumPage>
		"_root_/input-tests/search": ExtractLoaderData<typeof import("../routes/input-tests/search-params").SearchParamsPage>
		"_root_/(layout-tests)": ExtractLoaderData<typeof import("../routes/layout-tests/_layout").LayoutTestsLayout>
		"_root_/(layout-tests)/layout-tests/auth-conflict": ExtractLoaderData<typeof import("../routes/layout-tests/auth-conflict").AuthConflictPage>
		"_root_/(layout-tests)/layout-tests/auth-inherit": ExtractLoaderData<typeof import("../routes/layout-tests/auth-inherit").AuthInheritPage>
		"_root_/(layout-tests)/layout-tests/auth-redundant": ExtractLoaderData<typeof import("../routes/layout-tests/auth-redundant").AuthRedundantPage>
		"_root_/(layout-tests)/(org-layout)": ExtractLoaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/_layout").DynamicParamsLayout>
		"_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard": ExtractLoaderData<typeof import("../routes/layout-tests/dynamic/[orgId]/dashboard").DynamicDashboardPage>
		"_root_/(layout-tests)/layout-tests": ExtractLoaderData<typeof import("../routes/layout-tests/index").LayoutTestsIndex>
		"_root_/(layout-tests)/(nested)": ExtractLoaderData<typeof import("../routes/layout-tests/nested/_layout").NestedLayout>
		"_root_/(layout-tests)/(nested)/(deep)": ExtractLoaderData<typeof import("../routes/layout-tests/nested/deep/_layout").DeepNestedLayout>
		"_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep": ExtractLoaderData<typeof import("../routes/layout-tests/nested/deep/index").DeepNestedPage>
		"_root_/(layout-tests)/(nested)/layout-tests/nested": ExtractLoaderData<typeof import("../routes/layout-tests/nested/index").NestedIndex>
		"_root_/(layout-tests)/(sibling)": ExtractLoaderData<typeof import("../routes/layout-tests/sibling/_layout").SiblingLayout>
		"_root_/(layout-tests)/(sibling)/layout-tests/sibling": ExtractLoaderData<typeof import("../routes/layout-tests/sibling/index").SiblingPage>
		"_root_/lazy-test/basic": ExtractLoaderData<typeof import("../routes/lazy-test/basic").LazyTestBasicPage>
		"_root_/lazy-test/dashboard": ExtractLoaderData<typeof import("../routes/lazy-test/dashboard").DashboardLazyPage>
		"_root_/lazy-test/data-export": ExtractLoaderData<typeof import("../routes/lazy-test/data-export").DataExportLazyPage>
		"_root_/lazy-test/editor": ExtractLoaderData<typeof import("../routes/lazy-test/editor").EditorLazyPage>
		"_root_/lazy-test/gallery": ExtractLoaderData<typeof import("../routes/lazy-test/gallery").GalleryLazyPage>
		"_root_/lazy-test": ExtractLoaderData<typeof import("../routes/lazy-test/index").LazyTestIndexPage>
		"_root_/lazy-test/modal": ExtractLoaderData<typeof import("../routes/lazy-test/modal").ModalLazyPage>
		"_root_/prefetch": ExtractLoaderData<typeof import("../routes/prefetch").PrefetchPage>
		"_root_/products/[id]": ExtractLoaderData<typeof import("../routes/product").ProductPage>
		"_root_/(props-test)": ExtractLoaderData<typeof import("../routes/props-test/_layout").PropsTestLayout>
		"_root_/(props-test)/props-test": ExtractLoaderData<typeof import("../routes/props-test/index").PropsTestPage>
		"_root_/query-defer-test": ExtractLoaderData<typeof import("../routes/query-defer-test").QueryDeferTestPage>
		"_root_/query-test": ExtractLoaderData<typeof import("../routes/query-test").QueryTestPage>
		}

		routeInfo: {
		"/about": { params: {} & ExtractParams<typeof import("../routes/about").AboutPage>; searchParams: ExtractSearchParams<typeof import("../routes/about").AboutPage>; virtualPath: "_root_/about" }
		"/admin": { params: {} & ExtractParams<typeof import("../routes/admin-pages/index").AdminDashboardPage>; searchParams: ExtractSearchParams<typeof import("../routes/admin-pages/index").AdminDashboardPage>; virtualPath: "_admin_/admin" }
		"/admin/settings": { params: {} & ExtractParams<typeof import("../routes/admin-pages/settings").AdminSettingsPage>; searchParams: ExtractSearchParams<typeof import("../routes/admin-pages/settings").AdminSettingsPage>; virtualPath: "_admin_/admin/settings" }
		"/admin/users": { params: {} & ExtractParams<typeof import("../routes/admin-pages/users").AdminUsersPage>; searchParams: ExtractSearchParams<typeof import("../routes/admin-pages/users").AdminUsersPage>; virtualPath: "_admin_/admin/users" }
		"/await-ssr": { params: {} & ExtractParams<typeof import("../routes/await-ssr").AwaitSsrPage>; searchParams: ExtractSearchParams<typeof import("../routes/await-ssr").AwaitSsrPage>; virtualPath: "_root_/await-ssr" }
		"/await": { params: {} & ExtractParams<typeof import("../routes/await").AwaitPage>; searchParams: ExtractSearchParams<typeof import("../routes/await").AwaitPage>; virtualPath: "_root_/await" }
		"/css-test": { params: {} & ExtractParams<typeof import("../routes/css-test").CssTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/css-test").CssTestPage>; virtualPath: "_root_/css-test" }
		"/css-v2-test": { params: {} & ExtractParams<typeof import("../routes/css-v2-test").CssV2TestPage>; searchParams: ExtractSearchParams<typeof import("../routes/css-v2-test").CssV2TestPage>; virtualPath: "_root_/css-v2-test" }
		"/defer-await": { params: {} & ExtractParams<typeof import("../routes/defer-await").DeferAwaitPage>; searchParams: ExtractSearchParams<typeof import("../routes/defer-await").DeferAwaitPage>; virtualPath: "_root_/defer-await" }
		"/defer": { params: {} & ExtractParams<typeof import("../routes/defer").DeferPage>; searchParams: ExtractSearchParams<typeof import("../routes/defer").DeferPage>; virtualPath: "_root_/defer" }
		"/head-test": { params: {} & ExtractParams<typeof import("../routes/head-test/index").HeadTestIndex>; searchParams: ExtractSearchParams<typeof import("../routes/head-test/index").HeadTestIndex>; virtualPath: "_root_/(head-test)/head-test" }
		"/head-test/page-a": { params: {} & ExtractParams<typeof import("../routes/head-test/page-a").HeadTestPageA>; searchParams: ExtractSearchParams<typeof import("../routes/head-test/page-a").HeadTestPageA>; virtualPath: "_root_/(head-test)/head-test/page-a" }
		"/head-test/page-b": { params: {} & ExtractParams<typeof import("../routes/head-test/page-b").HeadTestPageB>; searchParams: ExtractSearchParams<typeof import("../routes/head-test/page-b").HeadTestPageB>; virtualPath: "_root_/(head-test)/head-test/page-b" }
		"/hooks-test/error-test": { params: {} & ExtractParams<typeof import("../routes/hooks-test/error-test").HooksErrorTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/hooks-test/error-test").HooksErrorTestPage>; virtualPath: "_root_/(hooks-test)/hooks-test/error-test" }
		"/hooks-test": { params: {} & ExtractParams<typeof import("../routes/hooks-test/index").HooksTestIndexPage>; searchParams: ExtractSearchParams<typeof import("../routes/hooks-test/index").HooksTestIndexPage>; virtualPath: "_root_/(hooks-test)/hooks-test" }
		"/hooks-test/nested": { params: {} & ExtractParams<typeof import("../routes/hooks-test/nested/index").HooksTestNestedPage>; searchParams: ExtractSearchParams<typeof import("../routes/hooks-test/nested/index").HooksTestNestedPage>; virtualPath: "_root_/(hooks-test)/(nested)/hooks-test/nested" }
		"/html-nav-test": { params: {} & ExtractParams<typeof import("../routes/html-nav-test").HtmlNavTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/html-nav-test").HtmlNavTestPage>; virtualPath: "_root_/html-nav-test" }
		"/": { params: {} & ExtractParams<typeof import("../routes/index").IndexPage>; searchParams: ExtractSearchParams<typeof import("../routes/index").IndexPage>; virtualPath: "_root_/" }
		"/input-tests/docs/[...slug]": { params: { slug: string[] } & ExtractParams<typeof import("../routes/input-tests/catch-all").CatchAllPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/catch-all").CatchAllPage>; virtualPath: "_root_/input-tests/docs/[...slug]" }
		"/input-tests/shop/[category]/[itemId]": { params: { category: string; itemId: string } & ExtractParams<typeof import("../routes/input-tests/combined").CombinedInputPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/combined").CombinedInputPage>; virtualPath: "_root_/input-tests/shop/[category]/[itemId]" }
		"/input-tests/sections": { params: {} & ExtractParams<typeof import("../routes/input-tests/hash").HashPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/hash").HashPage>; virtualPath: "_root_/input-tests/sections" }
		"/input-tests/store/[storeId]/product/[productId]": { params: { storeId: string; productId: string } & ExtractParams<typeof import("../routes/input-tests/multi-params").MultiParamsPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/multi-params").MultiParamsPage>; virtualPath: "_root_/input-tests/store/[storeId]/product/[productId]" }
		"/input-tests/files/[[...path]]": { params: { path?: string[] } & ExtractParams<typeof import("../routes/input-tests/optional-catch-all").OptionalCatchAllPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/optional-catch-all").OptionalCatchAllPage>; virtualPath: "_root_/input-tests/files/[[...path]]" }
		"/input-tests/category/[type]": { params: { type: string } & ExtractParams<typeof import("../routes/input-tests/params-enum").ParamsEnumPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/params-enum").ParamsEnumPage>; virtualPath: "_root_/input-tests/category/[type]" }
		"/input-tests/search": { params: {} & ExtractParams<typeof import("../routes/input-tests/search-params").SearchParamsPage>; searchParams: ExtractSearchParams<typeof import("../routes/input-tests/search-params").SearchParamsPage>; virtualPath: "_root_/input-tests/search" }
		"/layout-tests/auth-conflict": { params: {} & ExtractParams<typeof import("../routes/layout-tests/auth-conflict").AuthConflictPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/auth-conflict").AuthConflictPage>; virtualPath: "_root_/(layout-tests)/layout-tests/auth-conflict" }
		"/layout-tests/auth-inherit": { params: {} & ExtractParams<typeof import("../routes/layout-tests/auth-inherit").AuthInheritPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/auth-inherit").AuthInheritPage>; virtualPath: "_root_/(layout-tests)/layout-tests/auth-inherit" }
		"/layout-tests/auth-redundant": { params: {} & ExtractParams<typeof import("../routes/layout-tests/auth-redundant").AuthRedundantPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/auth-redundant").AuthRedundantPage>; virtualPath: "_root_/(layout-tests)/layout-tests/auth-redundant" }
		"/layout-tests/dynamic/[orgId]/dashboard": { params: { orgId: string } & ExtractParams<typeof import("../routes/layout-tests/dynamic/[orgId]/dashboard").DynamicDashboardPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/dynamic/[orgId]/dashboard").DynamicDashboardPage>; virtualPath: "_root_/(layout-tests)/(org-layout)/layout-tests/dynamic/[orgId]/dashboard" }
		"/layout-tests": { params: {} & ExtractParams<typeof import("../routes/layout-tests/index").LayoutTestsIndex>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/index").LayoutTestsIndex>; virtualPath: "_root_/(layout-tests)/layout-tests" }
		"/layout-tests/nested/deep": { params: {} & ExtractParams<typeof import("../routes/layout-tests/nested/deep/index").DeepNestedPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/nested/deep/index").DeepNestedPage>; virtualPath: "_root_/(layout-tests)/(nested)/(deep)/layout-tests/nested/deep" }
		"/layout-tests/nested": { params: {} & ExtractParams<typeof import("../routes/layout-tests/nested/index").NestedIndex>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/nested/index").NestedIndex>; virtualPath: "_root_/(layout-tests)/(nested)/layout-tests/nested" }
		"/layout-tests/sibling": { params: {} & ExtractParams<typeof import("../routes/layout-tests/sibling/index").SiblingPage>; searchParams: ExtractSearchParams<typeof import("../routes/layout-tests/sibling/index").SiblingPage>; virtualPath: "_root_/(layout-tests)/(sibling)/layout-tests/sibling" }
		"/lazy-test/basic": { params: {} & ExtractParams<typeof import("../routes/lazy-test/basic").LazyTestBasicPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/basic").LazyTestBasicPage>; virtualPath: "_root_/lazy-test/basic" }
		"/lazy-test/dashboard": { params: {} & ExtractParams<typeof import("../routes/lazy-test/dashboard").DashboardLazyPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/dashboard").DashboardLazyPage>; virtualPath: "_root_/lazy-test/dashboard" }
		"/lazy-test/data-export": { params: {} & ExtractParams<typeof import("../routes/lazy-test/data-export").DataExportLazyPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/data-export").DataExportLazyPage>; virtualPath: "_root_/lazy-test/data-export" }
		"/lazy-test/editor": { params: {} & ExtractParams<typeof import("../routes/lazy-test/editor").EditorLazyPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/editor").EditorLazyPage>; virtualPath: "_root_/lazy-test/editor" }
		"/lazy-test/gallery": { params: {} & ExtractParams<typeof import("../routes/lazy-test/gallery").GalleryLazyPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/gallery").GalleryLazyPage>; virtualPath: "_root_/lazy-test/gallery" }
		"/lazy-test": { params: {} & ExtractParams<typeof import("../routes/lazy-test/index").LazyTestIndexPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/index").LazyTestIndexPage>; virtualPath: "_root_/lazy-test" }
		"/lazy-test/modal": { params: {} & ExtractParams<typeof import("../routes/lazy-test/modal").ModalLazyPage>; searchParams: ExtractSearchParams<typeof import("../routes/lazy-test/modal").ModalLazyPage>; virtualPath: "_root_/lazy-test/modal" }
		"/prefetch": { params: {} & ExtractParams<typeof import("../routes/prefetch").PrefetchPage>; searchParams: ExtractSearchParams<typeof import("../routes/prefetch").PrefetchPage>; virtualPath: "_root_/prefetch" }
		"/products/[id]": { params: { id: string } & ExtractParams<typeof import("../routes/product").ProductPage>; searchParams: ExtractSearchParams<typeof import("../routes/product").ProductPage>; virtualPath: "_root_/products/[id]" }
		"/props-test": { params: {} & ExtractParams<typeof import("../routes/props-test/index").PropsTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/props-test/index").PropsTestPage>; virtualPath: "_root_/(props-test)/props-test" }
		"/query-defer-test": { params: {} & ExtractParams<typeof import("../routes/query-defer-test").QueryDeferTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/query-defer-test").QueryDeferTestPage>; virtualPath: "_root_/query-defer-test" }
		"/query-test": { params: {} & ExtractParams<typeof import("../routes/query-test").QueryTestPage>; searchParams: ExtractSearchParams<typeof import("../routes/query-test").QueryTestPage>; virtualPath: "_root_/query-test" }
		}
	}
}

declare module "@ecomet/flare/query-client/registry" {
	interface FlareQueryClientRegistry {
		queryClient: import("@tanstack/query-core").QueryClient
	}
}

export {}
