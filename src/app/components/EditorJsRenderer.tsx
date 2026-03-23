"use client";

import type { OutputData } from "@editorjs/editorjs";

// Render Editor.js blocks as static HTML matching the Tailwind prose styling.
// We avoid editorjs-react-renderer here and roll our own for full control over markup.

interface EditorJsRendererProps {
  data: OutputData;
}

function renderBlock(block: OutputData["blocks"][number]) {
  switch (block.type) {
    case "header": {
      const level = block.data.level || 2;
      const text = block.data.text;
      if (level === 1) return <h1 key={block.id} dangerouslySetInnerHTML={{ __html: text }} />;
      if (level === 2) return <h2 key={block.id} dangerouslySetInnerHTML={{ __html: text }} />;
      if (level === 3) return <h3 key={block.id} dangerouslySetInnerHTML={{ __html: text }} />;
      return <h4 key={block.id} dangerouslySetInnerHTML={{ __html: text }} />;
    }
    case "paragraph":
      return (
        <p
          key={block.id}
          dangerouslySetInnerHTML={{ __html: block.data.text }}
        />
      );
    case "list": {
      const Tag = block.data.style === "ordered" ? "ol" : "ul";
      return (
        <Tag key={block.id}>
          {block.data.items.map((item: string | { content: string }, i: number) => (
            <li
              key={i}
              dangerouslySetInnerHTML={{
                __html: typeof item === "string" ? item : item.content,
              }}
            />
          ))}
        </Tag>
      );
    }
    case "image":
      return (
        <figure key={block.id}>
          <img
            src={block.data.file?.url || block.data.url}
            alt={block.data.caption || ""}
          />
          {block.data.caption && (
            <figcaption
              dangerouslySetInnerHTML={{ __html: block.data.caption }}
            />
          )}
        </figure>
      );
    case "code":
      return (
        <pre key={block.id}>
          <code>{block.data.code}</code>
        </pre>
      );
    case "quote":
      return (
        <blockquote key={block.id}>
          <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
          {block.data.caption && (
            <cite dangerouslySetInnerHTML={{ __html: block.data.caption }} />
          )}
        </blockquote>
      );
    case "delimiter":
      return <hr key={block.id} />;
    case "table":
      return (
        <table key={block.id}>
          <tbody>
            {block.data.content.map((row: string[], ri: number) => (
              <tr key={ri}>
                {row.map((cell: string, ci: number) => (
                  <td
                    key={ci}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "embed":
      return (
        <div key={block.id} className="not-prose">
          <iframe
            src={block.data.embed}
            width={block.data.width || "100%"}
            height={block.data.height || 320}
            allowFullScreen
            className="w-full"
          />
          {block.data.caption && (
            <p
              className="text-sm text-gray-500 mt-1"
              dangerouslySetInnerHTML={{ __html: block.data.caption }}
            />
          )}
        </div>
      );
    default:
      return null;
  }
}

export default function EditorJsRenderer({ data }: EditorJsRendererProps) {
  if (!data?.blocks?.length) return null;
  return <>{data.blocks.map(renderBlock)}</>;
}
