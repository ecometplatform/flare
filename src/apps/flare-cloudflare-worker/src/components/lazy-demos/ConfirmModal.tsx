/**
 * Confirm Modal Component (Client-only)
 *
 * Modal dialog that needs portal and focus management.
 * Uses document.body for portal, window for escape key.
 */

import { createSignal, onCleanup, onMount } from "solid-js"

interface ConfirmModalProps {
	message: string
	onCancel: () => void
	onConfirm: () => void
	title: string
}

export default function ConfirmModal(props: ConfirmModalProps) {
	const [mounted, setMounted] = createSignal(false)
	const [focusedAt, setFocusedAt] = createSignal("")

	onMount(() => {
		setMounted(true)
		setFocusedAt(new Date().toISOString())

		/* Handle escape key */
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") props.onCancel()
		}
		window.addEventListener("keydown", handleEscape)

		/* Focus trap - focus first button */
		const firstButton = document.querySelector("[data-testid='modal-cancel']") as HTMLButtonElement
		firstButton?.focus()

		onCleanup(() => {
			window.removeEventListener("keydown", handleEscape)
		})
	})

	return (
		<div
			data-testid="confirm-modal-loaded"
			onClick={(e) => e.target === e.currentTarget && props.onCancel()}
			style={{
				"align-items": "center",
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				inset: "0",
				"justify-content": "center",
				position: "fixed",
				"z-index": "1000",
			}}
		>
			<div
				style={{
					background: "white",
					"border-radius": "8px",
					"max-width": "400px",
					padding: "24px",
					width: "90%",
				}}
			>
				<h3 data-testid="modal-title">{props.title}</h3>
				<p data-testid="modal-message" style={{ margin: "16px 0" }}>
					{props.message}
				</p>
				<p data-testid="modal-mounted" style={{ color: "#666", "font-size": "12px" }}>
					Mounted: {mounted() ? "yes" : "no"} | Focused at: {focusedAt()}
				</p>
				<div
					style={{
						display: "flex",
						gap: "12px",
						"justify-content": "flex-end",
						"margin-top": "16px",
					}}
				>
					<button
						data-testid="modal-cancel"
						onClick={props.onCancel}
						style={{ background: "#eee", border: "none", cursor: "pointer", padding: "8px 16px" }}
						type="button"
					>
						Cancel
					</button>
					<button
						data-testid="modal-confirm"
						onClick={props.onConfirm}
						style={{
							background: "#4a90d9",
							border: "none",
							color: "white",
							cursor: "pointer",
							padding: "8px 16px",
						}}
						type="button"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}
