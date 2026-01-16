/**
 * Eager Client Component
 *
 * This component is loaded via clientLazy({ eager: true }).
 * It starts loading on module evaluation (client-side only).
 */

export default function EagerComponent() {
	return (
		<div data-testid="eager-lazy-loaded">
			<p data-testid="eager-lazy-content">Eager Component loaded!</p>
			<p>This component started loading immediately on client.</p>
		</div>
	)
}
