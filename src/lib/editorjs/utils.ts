import type { OutputData } from "@editorjs/editorjs";

export type ParsedContent =
  | { type: "editorjs"; data: OutputData }
  | { type: "markdown"; data: string }
  | { type: "empty" };

export function parseContent(
  raw: string | null | undefined,
  format: string | null | undefined,
): ParsedContent {
  if (!raw) return { type: "empty" };

  if (format === "editorjs") {
    try {
      const parsed = JSON.parse(raw) as OutputData;
      if (parsed && Array.isArray(parsed.blocks)) {
        return { type: "editorjs", data: parsed };
      }
    } catch {
      // Fall through to markdown
    }
  }

  return { type: "markdown", data: raw };
}

export function serializeContent(data: OutputData): string {
  return JSON.stringify(data);
}
