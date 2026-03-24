"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

const VISIBILITY_OPTIONS = ["public", "private", "unlisted"] as const;

interface InlineVisibilityBadgeProps {
  value: string;
  onSave: (value: string) => void;
  admin: boolean;
}

export default function InlineVisibilityBadge({
  value,
  onSave,
  admin,
}: InlineVisibilityBadgeProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(containerRef, open, close);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!admin) return null;

  return (
    <div className="relative inline-block" ref={containerRef}>
      <span
        onClick={() => setOpen(!open)}
        className="inline-block text-xs px-2 py-0.5 border border-black font-bold cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {value}
      </span>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 flex gap-1">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setOpen(false);
                if (opt !== value) onSave(opt);
              }}
              className={`text-xs px-2 py-0.5 border font-bold transition-colors whitespace-nowrap ${
                opt === value
                  ? "border-black bg-black text-white"
                  : "border-black bg-white text-black hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
