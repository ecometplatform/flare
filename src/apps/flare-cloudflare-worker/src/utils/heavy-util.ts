/**
 * Heavy Utility Module
 *
 * Simulates a heavy utility that should be lazy-loaded.
 */

function compute(a: number, b: number): string {
	return `Result: ${a + b}`
}

function expensiveOperation(): Promise<number> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(42), 100)
	})
}

export default { compute, expensiveOperation }
