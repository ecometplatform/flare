/**
 * Editor Lazy Test
 *
 * WHAT THIS TESTS:
 * - clientLazy() for heavy WYSIWYG editor component
 * - Editor uses contentEditable, selection API, execCommand
 * - These are all browser-only APIs
 *
 * EXPECTED BEHAVIOR:
 * 1. Server: Shows "Loading Editor..." placeholder
 * 2. Client: Full editor with toolbar loads
 * 3. Toolbar buttons work (bold, italic, lists)
 * 4. Selection tracking shows cursor position
 */

import { clientLazy } from "@ecomet/flare/client-lazy"
import { createPage } from "@ecomet/flare/router/create-page"
import { Link } from "@ecomet/flare/router/link"
import { createSignal } from "solid-js"

/* ========================================
   LAZY EDITOR COMPONENT
   ======================================== */

const RichTextEditor = clientLazy({
	error: (err, retry) => (
		<div
			data-testid="editor-error"
			style={{ background: "#ffebee", border: "1px solid #ef5350", padding: "16px" }}
		>
			<p>Failed to load editor: {err.message}</p>
			<button data-testid="editor-retry" onClick={retry} type="button">
				Retry
			</button>
		</div>
	),
	loader: () => import("../../components/lazy-demos/RichTextEditor"),
	pending: () => (
		<div data-testid="editor-pending" style={{ border: "1px solid #ccc" }}>
			<div
				style={{
					background: "#f5f5f5",
					"border-bottom": "1px solid #ccc",
					height: "40px",
					padding: "8px",
				}}
			>
				<span style={{ color: "#999" }}>Loading toolbar...</span>
			</div>
			<div style={{ color: "#999", "min-height": "150px", padding: "12px" }}>
				Loading editor content area...
			</div>
			<div
				style={{
					background: "#f9f9f9",
					"border-top": "1px solid #ccc",
					"font-size": "12px",
					padding: "8px",
				}}
			>
				Loading status bar...
			</div>
		</div>
	),
})

/* ========================================
   PAGE
   ======================================== */

export const EditorLazyPage = createPage({ virtualPath: "_root_/lazy-test/editor" })
	.head(() => ({ title: "Editor - Lazy Loading Test" }))
	.render(() => {
		const [content, setContent] = createSignal("")

		return (
			<main data-testid="editor-lazy-page" style={{ "max-width": "800px", padding: "20px" }}>
				<Link to="/lazy-test">← Back to Lazy Tests</Link>

				<h1>Rich Text Editor (clientLazy)</h1>

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
							<strong>clientLazy()</strong> - Heavy component with browser APIs
						</li>
						<li>
							<strong>contentEditable</strong> - Browser-only API for editing
						</li>
						<li>
							<strong>document.execCommand</strong> - Browser-only for formatting
						</li>
						<li>
							<strong>window.getSelection</strong> - Browser-only for cursor tracking
						</li>
					</ul>
					<h4>Expected:</h4>
					<ul>
						<li>SSR: Loading placeholder with skeleton UI</li>
						<li>Client: Full editor with working toolbar</li>
						<li>Status bar shows "Mounted: yes"</li>
					</ul>
				</section>

				{/* Editor Section */}
				<section data-testid="editor-section">
					<h2>Blog Post Editor</h2>
					<p style={{ color: "#666", "font-size": "14px", "margin-bottom": "12px" }}>
						Try the formatting buttons. Type some text and use Bold (B), Italic (I), Underline (U).
					</p>
					<RichTextEditor
						initialContent="<p>Start writing your blog post here...</p>"
						onChange={setContent}
						placeholder="Write something..."
					/>
				</section>

				{/* Output Preview */}
				<section data-testid="output-section" style={{ "margin-top": "24px" }}>
					<h3>Raw HTML Output</h3>
					<pre
						data-testid="html-output"
						style={{
							background: "#f5f5f5",
							"font-size": "12px",
							"max-height": "200px",
							overflow: "auto",
							padding: "12px",
						}}
					>
						{content() || "(empty)"}
					</pre>
				</section>
			</main>
		)
	})
