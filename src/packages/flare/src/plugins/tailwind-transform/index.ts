/**
 * Vite Plugin: Tailwind Transform
 *
 * Transforms tw="..." to css="..." at build time using Tailwind CSS v4.
 * Zero runtime cost - all resolution happens during compilation.
 *
 * Static:  tw="p-4 bg-red-500" → css="padding:1rem;background-color:#ef4444"
 * Dynamic: tw={a ? "x" : "y"} → css={({"x":"...","y":"..."})[a ? "x" : "y"] ?? ""}
 * Merge:   tw="p-4" css="color:red" → css="padding:1rem;color:red"
 *
 * Supports Tailwind v4 CSS-first configuration via @theme directive.
 */

import { readFileSync } from "node:fs"
import { dirname, isAbsolute, resolve } from "node:path"
import { compile } from "tailwindcss"
import type { Plugin } from "vite"

export interface TailwindTransformOptions {
	/** Path to CSS file containing @import "tailwindcss" and @theme config */
	css?: string
	/** Error on unresolvable dynamic expressions @default false */
	strict?: boolean
}

/** Cache resolved classes to avoid repeated Tailwind calls */
const resolveCache = new Map<string, string>()

/** Tailwind compiler instance */
let compiler: Awaited<ReturnType<typeof compile>> | null = null

/** CSS file path for HMR (absolute) */
let cssPath: string | null = null

/** Vite root directory */
let viteRoot: string = process.cwd()

/** Set of files that use tw= for HMR invalidation */
const twFiles = new Set<string>()

/**
 * Initialize Tailwind compiler with CSS config
 */
async function getCompiler(
	options: TailwindTransformOptions,
): Promise<NonNullable<typeof compiler>> {
	if (!compiler) {
		let cssContent = '@import "tailwindcss";'
		let basePath = viteRoot

		if (options.css) {
			/* Resolve relative paths against Vite root */
			const resolvedPath = isAbsolute(options.css) ? options.css : resolve(viteRoot, options.css)
			try {
				cssContent = readFileSync(resolvedPath, "utf-8")
				cssPath = resolvedPath
				basePath = dirname(resolvedPath)
			} catch {
				console.warn(`[tailwind] Could not read CSS file: ${resolvedPath}, using defaults`)
			}
		}

		compiler = await compile(cssContent, {
			/* biome-ignore lint/suspicious/useAwait: tailwind API expects async callback, uses sync fs for build-time perf */
			loadStylesheet: async (id, base) => {
				/* Resolve the import path */
				let resolvedId: string
				if (id === "tailwindcss" || id.startsWith("tailwindcss/")) {
					/* Handle tailwindcss imports - try multiple resolution strategies */
					/* Bare "tailwindcss" resolves to package's style field: index.css */
					const cssPath = id === "tailwindcss" ? "tailwindcss/index.css" : id
					const possiblePaths = [
						/* Try import.meta.resolve style lookup */
						resolve(viteRoot, "node_modules", cssPath),
						/* Try from base path */
						resolve(basePath, "node_modules", cssPath),
						/* Walk up to find node_modules (monorepo support) */
						resolve(viteRoot, "..", "node_modules", cssPath),
						resolve(viteRoot, "..", "..", "node_modules", cssPath),
						resolve(viteRoot, "..", "..", "..", "node_modules", cssPath),
						resolve(viteRoot, "..", "..", "..", "..", "node_modules", cssPath),
						resolve(viteRoot, "..", "..", "..", "..", "..", "node_modules", cssPath),
						resolve(viteRoot, "..", "..", "..", "..", "..", "..", "node_modules", cssPath),
					]

					resolvedId = ""
					for (const p of possiblePaths) {
						try {
							readFileSync(p, "utf-8")
							resolvedId = p
							break
						} catch {
							/* Try next path */
						}
					}

					if (!resolvedId) {
						/* Last resort: require.resolve */
						try {
							resolvedId = require.resolve(id, { paths: [basePath, viteRoot] })
						} catch {
							const firstPath = possiblePaths[0]
							resolvedId = firstPath ?? resolve(viteRoot, "node_modules", cssPath)
						}
					}
				} else if (id.startsWith(".") || id.startsWith("/")) {
					resolvedId = resolve(base, id)
				} else {
					resolvedId = resolve(basePath, id)
				}

				try {
					const content = readFileSync(resolvedId, "utf-8")
					return { base: dirname(resolvedId), content, path: resolvedId }
				} catch {
					console.warn(`[tailwind] Could not load stylesheet: ${id} (resolved: ${resolvedId})`)
					return { base: basePath, content: "", path: resolvedId }
				}
			},
		})
	}
	return compiler
}

/**
 * Invalidate compiler cache (called on CSS file change)
 */
function invalidateCompiler(): void {
	compiler = null
	resolveCache.clear()
}

/**
 * Resolve Tailwind classes to CSS declarations
 * Returns semicolon-separated declarations without selector
 */
async function resolveClasses(classes: string, options: TailwindTransformOptions): Promise<string> {
	const cached = resolveCache.get(classes)
	if (cached !== undefined) {
		return cached
	}

	const tw = await getCompiler(options)

	/* Split classes and filter empty */
	const classArray = classes.split(/\s+/).filter(Boolean)

	/* Build CSS from classes */
	const css = tw.build(classArray)

	/* Extract declarations from generated CSS */
	const declarations = extractDeclarations(css)

	resolveCache.set(classes, declarations)
	return declarations
}

/**
 * Extract CSS declarations from Tailwind v4 output
 * - Parses :root/:host variable definitions
 * - Extracts only utility class declarations
 * - Resolves var() references to actual values
 * - Skips @property, @supports, @keyframes, etc.
 */
function extractDeclarations(css: string): string {
	/* Step 1: Extract CSS variable definitions from :root/:host blocks */
	const cssVars = new Map<string, string>()
	const rootRegex = /:root\s*,?\s*:host\s*\{([^}]+)\}/g
	let rootMatch = rootRegex.exec(css)
	while (rootMatch !== null) {
		const content = rootMatch[1]
		if (content) {
			/* Parse variable declarations: --name: value */
			const varRegex = /--([\w-]+)\s*:\s*([^;]+)/g
			let varMatch = varRegex.exec(content)
			while (varMatch !== null) {
				const varName = varMatch[1]
				const varValue = varMatch[2]
				if (varName && varValue) {
					const name = `--${varName}`
					const value = varValue.trim()
					cssVars.set(name, value)
				}
				varMatch = varRegex.exec(content)
			}
		}
		rootMatch = rootRegex.exec(css)
	}

	/* Step 2: Extract declarations from utility class rules only */
	/* Match .class-name { declarations } - skip :root, @rules, etc. */
	const declarations: string[] = []
	const classRegex = /\.([\w-]+)\s*\{([^}]+)\}/g
	let classMatch = classRegex.exec(css)
	while (classMatch !== null) {
		const decl = classMatch[2]
		if (decl) {
			const trimmed = decl.trim()
			if (trimmed) {
				declarations.push(trimmed)
			}
		}
		classMatch = classRegex.exec(css)
	}

	/* Step 3: Join declarations */
	let result = declarations.join(";")

	/* Step 4: Resolve var() references with fallbacks */
	/* Handle: var(--name), var(--name, fallback), nested var() */
	const resolveVars = (str: string, depth = 0): string => {
		if (depth > 10) return str /* Prevent infinite recursion */
		return str.replace(/var\(([^()]+(?:\([^()]*\))?[^()]*)\)/g, (_, content) => {
			/* Parse var name and optional fallback */
			const commaIdx = content.indexOf(",")
			let varName: string
			let fallback: string | undefined
			if (commaIdx !== -1) {
				varName = content.slice(0, commaIdx).trim()
				fallback = content.slice(commaIdx + 1).trim()
			} else {
				varName = content.trim()
			}
			/* Look up value */
			const value = cssVars.get(varName)
			if (value !== undefined) {
				/* Recursively resolve if value contains var() */
				return resolveVars(value, depth + 1)
			}
			/* Use fallback if available */
			if (fallback !== undefined) {
				return resolveVars(fallback, depth + 1)
			}
			/* Keep original var() if unresolvable */
			return `var(${content})`
		})
	}
	result = resolveVars(result)

	/* Step 5: Resolve calc() expressions where possible */
	result = result.replace(/calc\(([^)]+)\)/g, (match, expr) => {
		/* Simple calc with numbers: calc(0.25rem * 4) → 1rem */
		const simpleCalc = expr.match(/^([\d.]+)(rem|px|em|%)\s*\*\s*([\d.]+)$/)
		if (simpleCalc) {
			const num = parseFloat(simpleCalc[1]) * parseFloat(simpleCalc[3])
			return `${num}${simpleCalc[2]}`
		}
		const reverseCalc = expr.match(/^([\d.]+)\s*\*\s*([\d.]+)(rem|px|em|%)$/)
		if (reverseCalc) {
			const num = parseFloat(reverseCalc[1]) * parseFloat(reverseCalc[2])
			return `${num}${reverseCalc[3]}`
		}
		/* Division: calc(1.75 / 1.25) → 1.4 */
		const divCalc = expr.match(/^([\d.]+)\s*\/\s*([\d.]+)$/)
		if (divCalc) {
			const num = parseFloat(divCalc[1]) / parseFloat(divCalc[2])
			return String(Math.round(num * 1000) / 1000)
		}
		return match
	})

	/* Step 6: Minify */
	result = result
		.replace(/\s*\n\s*/g, "")
		.replace(/\s*:\s*/g, ":")
		.replace(/\s*;\s*/g, ";")
		.replace(/;+/g, ";")
		.replace(/^;|;$/g, "")

	return result
}

/**
 * Extract string literals from a JavaScript expression
 * Handles: ternaries, logical operators, simple strings
 *
 * @example
 * extractStringLiterals('active ? "bg-blue" : "bg-gray"') → ["bg-blue", "bg-gray"]
 * extractStringLiterals('`text-${size}`') → [] (unresolvable)
 */
function extractStringLiterals(expr: string): string[] {
	const literals: string[] = []

	/* Match double-quoted strings */
	const doubleQuoted = expr.match(/"([^"\\]|\\.)*"/g)
	if (doubleQuoted) {
		for (const match of doubleQuoted) {
			literals.push(match.slice(1, -1))
		}
	}

	/* Match single-quoted strings */
	const singleQuoted = expr.match(/'([^'\\]|\\.)*'/g)
	if (singleQuoted) {
		for (const match of singleQuoted) {
			literals.push(match.slice(1, -1))
		}
	}

	/* Filter empty strings */
	return literals.filter((s) => s.length > 0)
}

/**
 * Async string replace helper
 */
async function replaceAsync(
	str: string,
	regex: RegExp,
	asyncFn: (match: string, ...args: string[]) => Promise<string>,
): Promise<string> {
	const promises: Promise<string>[] = []
	const matches: { start: number; end: number; index: number }[] = []

	let index = 0

	/* Reset regex state */
	regex.lastIndex = 0

	let match = regex.exec(str)
	while (match !== null) {
		matches.push({
			end: match.index + match[0].length,
			index,
			start: match.index,
		})
		promises.push(asyncFn(match[0], ...match.slice(1)))
		index++
		match = regex.exec(str)
	}

	const replacements = await Promise.all(promises)

	/* Build result string */
	let result = ""
	let lastEnd = 0

	for (let i = 0; i < matches.length; i++) {
		const m = matches[i]
		const r = replacements[i]
		if (m && r !== undefined) {
			result += str.slice(lastEnd, m.start)
			result += r
			lastEnd = m.end
		}
	}

	result += str.slice(lastEnd)

	return result
}

/**
 * Check if a string contains tw= attribute or tw: property
 */
function hasTwAttribute(code: string): boolean {
	return /\btw\s*=/.test(code) || /\btw\s*:/.test(code)
}

/**
 * Transform tw attributes to css attributes
 */
async function transformTw(
	code: string,
	id: string,
	options: TailwindTransformOptions,
): Promise<string> {
	/* Skip if no tw= found */
	if (!hasTwAttribute(code)) {
		return code
	}

	let result = code

	/* Handle tw="..." (static strings) → css="..." */
	result = await replaceAsync(result, /\btw="([^"]+)"/g, async (_, classes) => {
		const css = await resolveClasses(classes, options)
		return `css="${css}"`
	})

	/* Handle tw='...' (single-quoted static strings) → css='...' */
	result = await replaceAsync(result, /\btw='([^']+)'/g, async (_, classes) => {
		const css = await resolveClasses(classes, options)
		return `css="${css}"`
	})

	/* Handle tw={...} (dynamic expressions) */
	result = await replaceAsync(result, /\btw=\{([^}]+)\}/g, async (_, expr) => {
		const possibleClasses = extractStringLiterals(expr)

		if (possibleClasses.length === 0) {
			/* Unresolvable dynamic expression */
			if (options.strict) {
				throw new Error(
					`[tailwind] Cannot resolve dynamic expression in ${id}: tw={${expr}}\nUse css= for truly dynamic styles.`,
				)
			}
			console.warn(`[tailwind] Cannot resolve dynamic expression in ${id}: tw={${expr}}`)
			return `css=""`
		}

		/* Build inline map */
		const map: Record<string, string> = {}
		for (const cls of possibleClasses) {
			map[cls] = await resolveClasses(cls, options)
		}

		/* Return inline lookup */
		return `css={(${JSON.stringify(map)})[${expr}] ?? ""}`
	})

	/* Handle elements with both tw= and css= */
	/* tw="p-4" css="color:red" → css="padding:1rem;color:red" */
	result = mergeTwAndCss(result)

	/* Handle tw: "..." inside styles() calls (static strings) */
	/* styles("x", { tw: "flex gap-4", ... }) → styles("x", { tw: "display:flex;gap:1rem", ... }) */
	result = await replaceAsync(result, /\btw\s*:\s*"([^"]+)"/g, async (_, classes) => {
		const css = await resolveClasses(classes, options)
		return `tw: "${css}"`
	})

	/* Handle tw: '...' (single-quoted) inside styles() calls */
	result = await replaceAsync(result, /\btw\s*:\s*'([^']+)'/g, async (_, classes) => {
		const css = await resolveClasses(classes, options)
		return `tw: "${css}"`
	})

	/* Handle tw: `...` (template literals without interpolation) inside styles() calls */
	result = await replaceAsync(result, /\btw\s*:\s*`([^`]+)`/g, async (_, classes) => {
		const css = await resolveClasses(classes, options)
		return `tw: "${css}"`
	})

	return result
}

/**
 * Merge adjacent tw= and css= on same element
 * The css= value takes precedence (appended after tw=)
 */
function mergeTwAndCss(code: string): string {
	/* Pattern: css="tw-resolved" css="user-css" on same element */
	/* This happens after tw→css transform, so we have two css= attrs */

	/* Find elements with multiple css= */
	/* Regex matches: first css="..." followed by whitespace and another css="..." */
	/* Use [^"]* (zero or more) not [^"]+ to handle empty css="" from unresolved tw */
	const multiCssRegex = /css="([^"]*)"\s+css="([^"]*)"/g

	return code.replace(multiCssRegex, (_, first, second) => {
		/* Merge: first (from tw) + second (original css) */
		let merged = first
		if (!merged.endsWith(";")) {
			merged += ";"
		}
		merged += second
		/* Clean up trailing semicolon */
		merged = merged.replace(/;+/g, ";").replace(/;$/, "")
		return `css="${merged}"`
	})
}

/**
 * Vite plugin for tw= to css= transformation using Tailwind CSS v4
 */
export function tailwindTransform(options: TailwindTransformOptions = {}): Plugin {
	return {
		configResolved(config) {
			viteRoot = config.root
		},
		configureServer(devServer) {
			/* Watch CSS file for HMR */
			if (cssPath) {
				devServer.watcher.add(cssPath)
			}
		},
		enforce: "pre",
		handleHotUpdate({ file, server: s }) {
			/* If CSS config file changed, invalidate compiler and all tw files */
			if (cssPath && file === cssPath) {
				invalidateCompiler()

				/* Invalidate all modules that use tw= */
				const modulesToReload = []
				for (const twFile of twFiles) {
					const mod = s.moduleGraph.getModuleById(twFile)
					if (mod) {
						s.moduleGraph.invalidateModule(mod)
						modulesToReload.push(mod)
					}
				}

				if (modulesToReload.length > 0) {
					console.log(`[tailwind] CSS config changed, reloading ${modulesToReload.length} files`)
					return modulesToReload
				}
			}
			return undefined
		},
		async load(id) {
			/* Only process .tsx files */
			if (!id.endsWith(".tsx")) {
				return null
			}

			/* Read original file */
			let code: string
			try {
				code = readFileSync(id, "utf-8")
			} catch {
				return null
			}

			/* Skip if no tw= attributes */
			if (!hasTwAttribute(code)) {
				return null
			}

			/* Track file for HMR */
			twFiles.add(id)

			/* Transform tw= to css= */
			const transformed = await transformTw(code, id, options)

			return transformed
		},
		name: "flare:tailwind-transform",
	}
}

/**
 * Clear the resolve cache (useful for testing)
 */
export function clearTailwindCache(): void {
	resolveCache.clear()
	invalidateCompiler()
}
