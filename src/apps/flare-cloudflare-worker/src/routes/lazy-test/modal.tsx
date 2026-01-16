/**
 * Modal Lazy Test
 *
 * WHAT THIS TESTS:
 * - preload() for fire-and-forget preloading on hover
 * - clientLazy() for modal component that needs focus management
 * - Instant modal open after preload completes
 *
 * EXPECTED BEHAVIOR:
 * 1. Hover "Delete" button: Preload starts (check console/network)
 * 2. Click button: Modal opens instantly (already loaded)
 * 3. Modal has keyboard nav (Escape to close)
 */

import { clientLazy } from "@ecomet/flare/client-lazy"
import { preload } from "@ecomet/flare/preload"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { createSignal, Show } from "solid-js"

/* ========================================
   PRELOADABLE MODAL COMPONENT
   ======================================== */

const confirmModalLoader = preload({
	loader: () => import("../../components/lazy-demos/ConfirmModal"),
	throws: false,
})

const ConfirmModal = clientLazy({
	loader: () => import("../../components/lazy-demos/ConfirmModal"),
	pending: () => (
		<div
			data-testid="modal-pending"
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
			<div style={{ background: "white", padding: "24px" }}>Loading modal...</div>
		</div>
	),
})

/* ========================================
   PAGE
   ======================================== */

export const ModalLazyPage = createPage({ virtualPath: "_root_/lazy-test/modal" })
	.head(() => ({ title: "Modal - Lazy Loading Test" }))
	.render(() => {
		const [showDeleteModal, setShowDeleteModal] = createSignal(false)
		const [showConfirmModal, setShowConfirmModal] = createSignal(false)
		const [preloadStatus, setPreloadStatus] = createSignal("Not started")
		const [actionResult, setActionResult] = createSignal("")

		const handlePreload = () => {
			if (preloadStatus() === "Preloaded!") return
			setPreloadStatus("Preloading...")
			confirmModalLoader.preload()
			setTimeout(() => setPreloadStatus("Preloaded!"), 100)
		}

		const handleDelete = () => {
			setShowDeleteModal(true)
		}

		const handleConfirmDelete = () => {
			setShowDeleteModal(false)
			setActionResult("Item deleted!")
		}

		const handleConfirmAction = () => {
			setShowConfirmModal(false)
			setActionResult("Action confirmed!")
		}

		return (
			<main data-testid="modal-lazy-page" style={{ "max-width": "800px", padding: "20px" }}>
				<Link to="/lazy-test">← Back to Lazy Tests</Link>

				<h1>Modal with Preload on Hover</h1>

				<section
					data-testid="test-explanation"
					style={{
						background: "#fffde7",
						border: "1px solid #ffc107",
						"margin-bottom": "24px",
						padding: "16px",
					}}
				>
					<h3>What This Tests</h3>
					<ul>
						<li>
							<strong>preload()</strong> - Fire-and-forget preload on hover
						</li>
						<li>
							<strong>clientLazy()</strong> - Modal with focus trap and keyboard nav
						</li>
						<li>
							<strong>Instant open</strong> - No loading spinner if preloaded
						</li>
					</ul>
					<h4>Expected:</h4>
					<ul>
						<li>Hover button → "Preloaded!" status</li>
						<li>Click button → Modal opens instantly</li>
						<li>Press Escape → Modal closes</li>
					</ul>
				</section>

				{/* Action Result */}
				<Show when={actionResult()}>
					<div
						data-testid="action-result"
						style={{
							background: "#e8f5e9",
							border: "1px solid #4caf50",
							"margin-bottom": "16px",
							padding: "12px",
						}}
					>
						{actionResult()}
					</div>
				</Show>

				{/* Preload Status */}
				<div data-testid="preload-status" style={{ "margin-bottom": "16px" }}>
					<strong>Preload Status:</strong> {preloadStatus()}
				</div>

				{/* Test Scenarios */}
				<div style={{ display: "flex", "flex-direction": "column", gap: "24px" }}>
					{/* Scenario 1: Preload on Hover */}
					<section
						data-testid="hover-preload-section"
						style={{ border: "1px solid #ddd", padding: "16px" }}
					>
						<h3>Scenario 1: Preload on Hover</h3>
						<p style={{ color: "#666", "font-size": "14px", "margin-bottom": "12px" }}>
							Hover the button to preload the modal component. Then click to open instantly.
						</p>
						<button
							data-testid="delete-button"
							onClick={handleDelete}
							onMouseEnter={handlePreload}
							style={{
								background: "#e53935",
								border: "none",
								color: "white",
								cursor: "pointer",
								"font-size": "16px",
								padding: "12px 24px",
							}}
							type="button"
						>
							Delete Item
						</button>
					</section>

					{/* Scenario 2: No Preload */}
					<section
						data-testid="no-preload-section"
						style={{ border: "1px solid #ddd", padding: "16px" }}
					>
						<h3>Scenario 2: No Preload (Shows Loading)</h3>
						<p style={{ color: "#666", "font-size": "14px", "margin-bottom": "12px" }}>
							Click directly without hovering first. May show brief loading state.
						</p>
						<button
							data-testid="confirm-button"
							onClick={() => setShowConfirmModal(true)}
							style={{
								background: "#1976d2",
								border: "none",
								color: "white",
								cursor: "pointer",
								"font-size": "16px",
								padding: "12px 24px",
							}}
							type="button"
						>
							Confirm Action
						</button>
					</section>
				</div>

				{/* Delete Modal */}
				<Show when={showDeleteModal()}>
					<ConfirmModal
						message="Are you sure you want to delete this item? This action cannot be undone."
						onCancel={() => setShowDeleteModal(false)}
						onConfirm={handleConfirmDelete}
						title="Delete Item?"
					/>
				</Show>

				{/* Confirm Modal */}
				<Show when={showConfirmModal()}>
					<ConfirmModal
						message="Do you want to proceed with this action?"
						onCancel={() => setShowConfirmModal(false)}
						onConfirm={handleConfirmAction}
						title="Confirm Action"
					/>
				</Show>
			</main>
		)
	})
