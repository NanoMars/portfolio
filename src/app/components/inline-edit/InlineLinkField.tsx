"use client";

import { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";

interface InlineLinkFieldProps {
  url: string | null;
  text?: string | null;
  iconName?: string | null;
  onSave: (fields: {
    url?: string | null;
    text?: string | null;
    icon?: string | null;
  }) => void;
  admin: boolean;
  type: "github" | "live";
}

function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const fallbackName = "ExternalLink";
  const formattedName = name
    ? name
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("")
    : fallbackName;
  const Icon =
    (LucideIcons as Record<string, any>)[formattedName] ||
    (LucideIcons as Record<string, any>)[fallbackName];
  return Icon ? <Icon className={className} size={20} /> : null;
}

export default function InlineLinkField({
  url,
  text,
  iconName,
  onSave,
  admin,
  type,
}: InlineLinkFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draftUrl, setDraftUrl] = useState(url || "");
  const [draftText, setDraftText] = useState(text || "");
  const [draftIcon, setDraftIcon] = useState(iconName || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraftUrl(url || "");
    setDraftText(text || "");
    setDraftIcon(iconName || "");
  }, [url, text, iconName]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const changes: { url?: string | null; text?: string | null; icon?: string | null } = {};
    const trimmedUrl = draftUrl.trim() || null;
    const trimmedText = draftText.trim() || null;
    const trimmedIcon = draftIcon.trim() || null;
    if (trimmedUrl !== url) changes.url = trimmedUrl;
    if (trimmedText !== text) changes.text = trimmedText;
    if (trimmedIcon !== iconName) changes.icon = trimmedIcon;
    if (Object.keys(changes).length > 0) {
      onSave(changes);
    }
  };

  const defaultIcon = type === "github" ? "github" : iconName;
  const defaultText = type === "github" ? "GitHub" : text || "Visit";

  // Non-admin: just render the link button (or nothing if no URL)
  if (!admin) {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
      >
        <DynamicIcon name={defaultIcon} />
        {defaultText}
      </a>
    );
  }

  // Admin: editing popover
  if (editing) {
    return (
      <div className="border-2 border-black p-3 flex flex-col gap-2 bg-white">
        <label className="text-xs font-bold">
          url
          <input
            ref={inputRef}
            type="text"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder={type === "github" ? "https://github.com/..." : "https://..."}
            className="block w-full border-b-2 border-black p-1 text-sm font-normal outline-none mt-0.5"
          />
        </label>
        {type === "live" && (
          <>
            <label className="text-xs font-bold">
              button text
              <input
                type="text"
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="e.g. Play, Visit"
                className="block w-full border-b-2 border-black p-1 text-sm font-normal outline-none mt-0.5"
              />
            </label>
            <label className="text-xs font-bold">
              icon name
              <input
                type="text"
                value={draftIcon}
                onChange={(e) => setDraftIcon(e.target.value)}
                placeholder="e.g. gamepad, link"
                className="block w-full border-b-2 border-black p-1 text-sm font-normal outline-none mt-0.5"
              />
            </label>
          </>
        )}
        <div className="flex gap-2 mt-1">
          <button
            onClick={commit}
            className="btn-outline px-3 py-1 text-xs font-bold"
          >
            done
          </button>
          <button
            onClick={() => {
              setDraftUrl(url || "");
              setDraftText(text || "");
              setDraftIcon(iconName || "");
              setEditing(false);
            }}
            className="btn-outline px-3 py-1 text-xs font-bold"
          >
            cancel
          </button>
        </div>
      </div>
    );
  }

  // Admin: show button (or placeholder) — double-click to edit
  if (!url) {
    return (
      <button
        onDoubleClick={() => setEditing(true)}
        className="px-6 py-3 border-2 border-dashed border-gray-300 text-gray-400 font-bold flex items-center gap-2 hover:border-black hover:text-black transition-colors cursor-text"
        title="Double-click to add link"
      >
        <DynamicIcon name={type === "github" ? "github" : "plus"} />
        {type === "github" ? "+ GitHub" : "+ Live Link"}
      </button>
    );
  }

  return (
    <button
      onDoubleClick={() => setEditing(true)}
      className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-text"
      title="Double-click to edit"
    >
      <DynamicIcon name={defaultIcon} />
      {defaultText}
    </button>
  );
}
