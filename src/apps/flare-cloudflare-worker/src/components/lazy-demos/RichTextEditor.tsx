/**
 * Rich Text Editor Component (Client-only)
 *
 * Simulates a WYSIWYG editor like TipTap/Quill.
 * Uses contentEditable, selection API, document.execCommand.
 */

import { createSignal, onMount } from "solid-js"

interface RichTextEditorProps {
	initialContent?: string
	onChange?: (content: string) => void
	placeholder?: string
}

export default function RichTextEditor(props: RichTextEditorProps) {
	const [mounted, setMounted] = createSignal(false)
	const [selectionInfo, setSelectionInfo] = createSignal("")
	const [content, setContent] = createSignal(props.initialContent ?? "")
	let editorRef: HTMLDivElement | undefined

	onMount(() => {
		setMounted(true)

		/* Track selection changes */
		document.addEventListener("selectionchange", () => {
			const sel = window.getSelection()
			if (sel && sel.rangeCount > 0) {
				setSelectionInfo(`Cursor at offset: ${sel.anchorOffset}`)
			}
		})
	})

	const execCommand = (cmd: string, value?: string) => {
		document.execCommand(cmd, false, value)
		editorRef?.focus()
	}

	const handleInput = () => {
		const newContent = editorRef?.innerHTML ?? ""
		setContent(newContent)
		props.onChange?.(newContent)
	}

	return (
		<div data-testid="rich-editor-loaded" style={{ border: "1px solid #ccc" }}>
			{/* Toolbar */}
			<div
				data-testid="editor-toolbar"
				style={{
					background: "#f5f5f5",
					"border-bottom": "1px solid #ccc",
					display: "flex",
					gap: "4px",
					padding: "8px",
				}}
			>
				<button
					data-testid="btn-bold"
					onClick={() => execCommand("bold")}
					style={{
						background: "white",
						border: "1px solid #ddd",
						cursor: "pointer",
						"font-weight": "bold",
						padding: "4px 8px",
					}}
					title="Bold"
					type="button"
				>
					B
				</button>
				<button
					data-testid="btn-italic"
					onClick={() => execCommand("italic")}
					style={{
						background: "white",
						border: "1px solid #ddd",
						cursor: "pointer",
						"font-style": "italic",
						padding: "4px 8px",
					}}
					title="Italic"
					type="button"
				>
					I
				</button>
				<button
					data-testid="btn-underline"
					onClick={() => execCommand("underline")}
					style={{
						background: "white",
						border: "1px solid #ddd",
						cursor: "pointer",
						padding: "4px 8px",
						"text-decoration": "underline",
					}}
					title="Underline"
					type="button"
				>
					U
				</button>
				<span style={{ "border-left": "1px solid #ccc", margin: "0 4px" }} />
				<button
					data-testid="btn-ul"
					onClick={() => execCommand("insertUnorderedList")}
					style={{
						background: "white",
						border: "1px solid #ddd",
						cursor: "pointer",
						padding: "4px 8px",
					}}
					title="Bullet List"
					type="button"
				>
					• List
				</button>
				<button
					data-testid="btn-ol"
					onClick={() => execCommand("insertOrderedList")}
					style={{
						background: "white",
						border: "1px solid #ddd",
						cursor: "pointer",
						padding: "4px 8px",
					}}
					title="Numbered List"
					type="button"
				>
					1. List
				</button>
			</div>

			{/* Editor Content */}
			<div
				contentEditable
				data-testid="editor-content"
				innerHTML={content()}
				onInput={handleInput}
				ref={editorRef}
				style={{
					"min-height": "150px",
					outline: "none",
					padding: "12px",
				}}
			/>

			{/* Status Bar */}
			<div
				data-testid="editor-status"
				style={{
					background: "#f9f9f9",
					"border-top": "1px solid #ccc",
					"font-size": "12px",
					padding: "8px",
				}}
			>
				<span data-testid="editor-mounted">Mounted: {mounted() ? "yes" : "no"}</span>
				<span style={{ margin: "0 8px" }}>|</span>
				<span data-testid="editor-selection">{selectionInfo() || "No selection"}</span>
				<span style={{ margin: "0 8px" }}>|</span>
				<span data-testid="editor-length">Length: {content().length} chars</span>
			</div>
		</div>
	)
}
