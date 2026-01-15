#!/usr/bin/env bun
/// <reference types="bun-types" />

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

interface PackageJson {
	scripts?: Record<string, string>
}

interface VsCodeTask {
	command?: string
	dependsOn?: string[]
	label: string
	presentation?: {
		panel: string
		reveal: string
	}
	problemMatcher?: string[]
	type?: string
}

interface TasksJson {
	tasks: VsCodeTask[]
	version: string
}

/* Read package.json */
const pkgPath = resolve(import.meta.dirname, "../package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as PackageJson

/* Generate tasks from all package.json scripts */
const tasks: VsCodeTask[] = []

for (const [scriptName] of Object.entries(pkg.scripts ?? {})) {
	tasks.push({
		command: `bun run ${scriptName}`,
		label: scriptName,
		presentation: {
			panel: "new",
			reveal: "always",
		},
		problemMatcher: [],
		type: "shell",
	})
}

/* Sort tasks by label */
tasks.sort((a, b) => a.label.localeCompare(b.label))

/* Generate tasks.json */
const tasksJson: TasksJson = {
	tasks,
	version: "2.0.0",
}

/* Write tasks.json */
const tasksPath = resolve(import.meta.dirname, "../.vscode/tasks.json")
writeFileSync(tasksPath, `${JSON.stringify(tasksJson, null, "\t")}\n`, "utf-8")

console.log(`Generated ${tasks.length} tasks -> .vscode/tasks.json`)
