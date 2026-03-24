"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import EditorJsRenderer from "./EditorJsRenderer";
import { parseContent } from "@/lib/editorjs/utils";

interface ProjectContentProps {
  content: string | null;
  editorjsContent: string | null;
}

export default function ProjectContent({
  content,
  editorjsContent,
}: ProjectContentProps) {
  const parsed = parseContent(content, editorjsContent);

  if (parsed.type === "empty") {
    return (
      <p className="text-gray-500 italic">No detailed content written yet.</p>
    );
  }

  if (parsed.type === "editorjs") {
    return <EditorJsRenderer data={parsed.data} />;
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.data}</ReactMarkdown>
  );
}
