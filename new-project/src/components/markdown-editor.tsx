"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
})

interface MarkdownEditorProps {
  value: string
  onChange?: (value?: string) => void
  placeholder?: string
  minHeight?: string
  readOnly?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Enter markdown content...",
  minHeight = "400px",
  readOnly = false,
}: MarkdownEditorProps) {
  return (
    <div data-color-mode="light" className="dark:data-[color-mode=dark]">
      <MDEditor
        value={value}
        onChange={readOnly ? undefined : onChange}
        textareaProps={{
          placeholder,
        }}
        height={minHeight}
        preview={readOnly ? "preview" : "live"}
        visibleDragbar={false}
        hideToolbar={readOnly}
      />
    </div>
  )
}

