"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";
import { getEditorTools } from "@/lib/editorjs/config";

export interface EditorJsEditorHandle {
  save: () => Promise<OutputData>;
}

interface EditorJsEditorProps {
  initialData?: OutputData | null;
  onSave: (data: OutputData) => void;
}

const EditorJsEditor = forwardRef<EditorJsEditorHandle, EditorJsEditorProps>(
  function EditorJsEditor({ initialData, onSave }, ref) {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const save = useCallback(async () => {
      if (!editorRef.current) return initialData || { blocks: [] };
      const data = await editorRef.current.save();
      return data;
    }, [initialData]);

    useImperativeHandle(ref, () => ({ save }), [save]);

    const debouncedSave = useCallback(() => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        if (editorRef.current) {
          const data = await editorRef.current.save();
          onSave(data);
        }
      }, 1500);
    }, [onSave]);

    useEffect(() => {
      let editor: EditorJS | null = null;
      let cancelled = false;

      async function init() {
        if (!holderRef.current) return;

        const { default: EditorJSClass } = await import("@editorjs/editorjs");
        const tools = await getEditorTools();

        if (cancelled) return;

        editor = new EditorJSClass({
          holder: holderRef.current,
          tools,
          data: initialData || undefined,
          placeholder: "Start writing...",
          onChange: () => debouncedSave(),
          onReady: () => {
            if (!cancelled) setReady(true);
          },
        });

        editorRef.current = editor;
      }

      init();

      return () => {
        cancelled = true;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        if (editor && typeof editor.destroy === "function") {
          editor.destroy();
        }
        editorRef.current = null;
      };
      // Only init once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="editorjs-container">
        {!ready && (
          <div className="text-gray-400 italic py-4">Loading editor...</div>
        )}
        <div ref={holderRef} className={ready ? "" : "hidden"} />
      </div>
    );
  },
);

export default EditorJsEditor;
