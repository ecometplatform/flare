import { existsSync, readdirSync, rmSync, statSync } from "node:fs"
import { basename, join, resolve } from "node:path"

const CLAUDE_FOLDER_NAME = ".claude"

/**
 * Checks if path ends exactly with .claude (resolve() strips trailing slash).
 * ONLY allows: /path/.claude or /path/.claude/
 * REJECTS: /path/.claude/subdir, /path/.claudefake, /path/fake.claude
 */
function isExactClaudeFolder(resolvedPath: string): boolean {
	return basename(resolvedPath) === CLAUDE_FOLDER_NAME
}

/**
 * Checks if path is inside a .claude folder (for entry deletion safety).
 */
function isInsideClaudeFolder(resolvedPath: string): boolean {
	const segments = resolvedPath.split("/")
	return segments.some((segment) => segment === CLAUDE_FOLDER_NAME)
}

/**
 * Safely deletes contents inside a .claude folder.
 * CRITICAL: Will NEVER delete anything outside of a .claude folder.
 */
function safeClearClaudeFolder(folderPath: string, label: string): boolean {
	const resolvedPath = resolve(folderPath)

	/* Safety check: path must end exactly with .claude */
	if (!isExactClaudeFolder(resolvedPath)) {
		console.error(`❌ SAFETY BLOCK: "${resolvedPath}" must end with .claude`)
		console.error(`   Path must be exactly a ".claude" directory, not a subdirectory`)
		return false
	}

	if (!existsSync(resolvedPath)) {
		console.log(`⚠️  ${label}: "${resolvedPath}" does not exist, skipping`)
		return true
	}

	const stats = statSync(resolvedPath)
	if (!stats.isDirectory()) {
		console.error(`❌ ${label}: "${resolvedPath}" is not a directory`)
		return false
	}

	console.log(`🗑️  ${label}: Clearing "${resolvedPath}"`)

	try {
		const entries = readdirSync(resolvedPath)
		let cleared = 0

		for (const entry of entries) {
			const entryPath = join(resolvedPath, entry)

			/* Double safety: verify we're still inside .claude */
			if (!isInsideClaudeFolder(entryPath)) {
				console.error(`❌ SAFETY BLOCK: Refusing to delete "${entryPath}" - not inside .claude`)
				continue
			}

			/* Skip settings.json and .credentials.json - keep user config */
			if (entry === "settings.json" || entry === ".credentials.json") {
				console.log(`   ⏭️  Skipping ${entry} (user config)`)
				continue
			}

			rmSync(entryPath, { force: true, recursive: true })
			cleared++
		}

		console.log(`   ✅ Cleared ${cleared} items`)
		return true
	} catch (error) {
		console.error(`❌ ${label}: Failed to clear - ${error}`)
		return false
	}
}

function main() {
	const args = process.argv.slice(2)
	const globalCachePath = args[0]?.trim() || ""

	console.log("🧹 Claude Cache Clear Script")
	console.log("━".repeat(50))

	/* Repo .claude folder */
	const repoClaude = join(process.cwd(), CLAUDE_FOLDER_NAME)
	const repoSuccess = safeClearClaudeFolder(repoClaude, "Repo cache")

	/* Global .claude folder */
	let globalSuccess = true
	if (globalCachePath === "") {
		console.log("\n📁 Global cache path: (empty) - skipping global cache")
	} else {
		console.log(`\n📁 Global cache path: "${globalCachePath}"`)

		const resolvedGlobal = resolve(globalCachePath)

		/* Validate path exists */
		if (!existsSync(resolvedGlobal)) {
			console.error(`❌ Error: Path "${resolvedGlobal}" does not exist`)
			console.error("   Please provide a valid path to your ~/.claude directory")
			console.error("   Example: bun run claude:clear /home/username/.claude")
			globalSuccess = false
		} else if (!statSync(resolvedGlobal).isDirectory()) {
			console.error(`❌ Error: "${resolvedGlobal}" is not a directory`)
			globalSuccess = false
		} else if (basename(resolvedGlobal) !== CLAUDE_FOLDER_NAME) {
			console.error(`❌ Error: Path must point to a ".claude" folder`)
			console.error(`   Got: "${basename(resolvedGlobal)}" - expected: ".claude"`)
			console.error("   Example: bun run claude:clear /home/username/.claude")
			globalSuccess = false
		} else {
			globalSuccess = safeClearClaudeFolder(resolvedGlobal, "Global cache")
		}
	}

	console.log(`\n${"━".repeat(50)}`)
	if (repoSuccess && globalSuccess) {
		console.log("✅ Cache clear complete")
	} else {
		console.log("⚠️  Cache clear completed with errors")
		process.exit(1)
	}
}

main()
