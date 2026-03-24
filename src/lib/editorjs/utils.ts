import type { OutputData } from "@editorjs/editorjs";

export type ParsedContent =
  | { type: "editorjs"; data: OutputData }
  | { type: "markdown"; data: string }
  | { type: "empty" };

/**
 * Determine what content to display.
 * If editorjsContent exists and is valid JSON, use it.
 * Otherwise fall back to markdown content column.
 */
export function parseContent(
  markdownContent: string | null | undefined,
  editorjsContent: string | null | undefined,
): ParsedContent {
  // Prefer Editor.js content if it exists
  if (editorjsContent) {
    try {
      const parsed = JSON.parse(editorjsContent) as OutputData;
      if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
        return { type: "editorjs", data: parsed };
      }
    } catch {
      // Fall through
    }
  }

  // Fall back to markdown
  if (markdownContent) {
    return { type: "markdown", data: markdownContent };
  }

  return { type: "empty" };
}

export function serializeContent(data: OutputData): string {
  return JSON.stringify(data);
}
