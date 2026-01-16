/**
 * Client-only Lazy Component
 *
 * This component is loaded via clientLazy() and never renders on server.
 * Uses browser APIs to prove it only runs on client.
 */

import { createSignal, onMount } from "solid-js"

interface ClientOnlyComponentProps {
	name: string
}

export default function ClientOnlyComponent(props: ClientOnlyComponentProps) {
	const [mounted, setMounted] = createSignal(false)
	const [windowWidth, setWindowWidth] = createSignal(0)

	onMount(() => {
		setMounted(true)
		setWindowWidth(window.innerWidth)
	})

	return (
		<div data-testid="client-lazy-loaded">
			<p data-testid="client-lazy-content">Client Component loaded: {props.name}</p>
			<p data-testid="client-lazy-mounted">Mounted: {mounted() ? "yes" : "no"}</p>
			<p data-testid="client-lazy-window">Window width: {windowWidth()}px</p>
		</div>
	)
}
