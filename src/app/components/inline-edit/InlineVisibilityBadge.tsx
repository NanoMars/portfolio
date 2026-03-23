"use client";

import { useState } from "react";

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

  if (!admin) return null;

  if (open) {
    return (
      <div className="inline-flex gap-1">
        {VISIBILITY_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              setOpen(false);
              if (opt !== value) onSave(opt);
            }}
            className={`text-xs px-2 py-0.5 border font-bold transition-colors ${
              opt === value
                ? "border-black bg-black text-white"
                : "border-black bg-white text-black hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <span
      onDoubleClick={() => setOpen(true)}
      className="inline-block text-xs px-2 py-0.5 border border-black font-bold cursor-text hover:bg-gray-50 transition-colors"
      title="Double-click to change visibility"
    >
      {value}
    </span>
  );
}
