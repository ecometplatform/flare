/**
 * SSR Lazy Component
 *
 * This component is loaded via lazy() and renders on server.
 */

interface SSRComponentProps {
	name: string
}

export default function SSRComponent(props: SSRComponentProps) {
	return (
		<div data-testid="ssr-lazy-loaded">
			<p data-testid="ssr-lazy-content">SSR Component loaded: {props.name}</p>
			<p data-testid="ssr-lazy-timestamp">Rendered at: {new Date().toISOString()}</p>
		</div>
	)
}
