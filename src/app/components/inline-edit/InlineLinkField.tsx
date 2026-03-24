"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

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

// Curated set of commonly useful icons for project links
const ICON_OPTIONS = [
  "ExternalLink", "Link", "Globe", "Play", "Gamepad2", "Music",
  "Video", "Camera", "Image", "FileText", "Code", "Terminal",
  "Smartphone", "Monitor", "Tv", "Download", "Upload", "Share2",
  "Eye", "Rocket", "Zap", "Star", "Heart", "ShoppingCart",
  "Package", "Box", "Layers", "Layout", "Grid3x3", "Map",
  "Navigation", "Compass", "BookOpen", "GraduationCap", "Lightbulb", "Wrench",
  "Settings", "Palette", "Brush", "Pen", "Scissors", "Mic",
] as const;

function DynamicIcon({
  name,
  className,
  size = 20,
}: {
  name?: string | null;
  className?: string;
  size?: number;
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
  return Icon ? <Icon className={className} size={size} /> : null;
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto p-1 border border-gray-200 rounded">
      {ICON_OPTIONS.map((iconName) => {
        // Convert PascalCase to kebab-case for storage
        const kebab = iconName.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
        const isSelected = value === kebab || value === iconName;
        const Icon = (LucideIcons as Record<string, any>)[iconName];
        if (!Icon) return null;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onChange(kebab)}
            className={`p-1.5 rounded flex items-center justify-center ${
              isSelected
                ? "bg-black text-white"
                : "hover:bg-gray-100 text-black"
            }`}
            title={kebab}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
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
  const popoverRef = useRef<HTMLDivElement>(null);
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

  const commit = useCallback(() => {
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
  }, [draftUrl, draftText, draftIcon, url, text, iconName, onSave]);

  const cancel = useCallback(() => {
    setDraftUrl(url || "");
    setDraftText(text || "");
    setDraftIcon(iconName || "");
    setEditing(false);
  }, [url, text, iconName]);

  useClickOutside(popoverRef, editing, commit);

  useEffect(() => {
    if (!editing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [editing, cancel]);

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

  // Admin: button + floating popover
  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger button — always visible */}
      {url ? (
        <button
          onClick={() => setEditing(!editing)}
          className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
        >
          <DynamicIcon name={defaultIcon} />
          {defaultText}
        </button>
      ) : (
        <button
          onClick={() => setEditing(!editing)}
          className="px-6 py-3 border-2 border-dashed border-gray-300 text-gray-400 font-bold flex items-center gap-2 hover:border-black hover:text-black cursor-pointer"
        >
          <DynamicIcon name={type === "github" ? "github" : "external-link"} />
          {type === "github" ? "GitHub" : "Live Link"}
        </button>
      )}

      {/* Popover */}
      {editing && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 border-2 border-black bg-white p-3 flex flex-col gap-2">
          <label className="text-xs font-bold">
            url
            <input
              ref={inputRef}
              type="text"
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              placeholder={type === "github" ? "https://github.com/..." : "https://..."}
              className="block w-full border-b border-black p-1 text-sm font-normal outline-none mt-0.5"
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
                  className="block w-full border-b border-black p-1 text-sm font-normal outline-none mt-0.5"
                />
              </label>
              <div>
                <span className="text-xs font-bold">icon</span>
                <div className="mt-1">
                  <IconPicker value={draftIcon} onChange={setDraftIcon} />
                </div>
              </div>
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
              onClick={cancel}
              className="btn-outline px-3 py-1 text-xs font-bold"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
