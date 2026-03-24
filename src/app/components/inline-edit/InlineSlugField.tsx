"use client";

import { useState, useRef, useEffect } from "react";

const RESERVED_SLUGS = [
  "login",
  "projects",
  "api",
  "_next",
  "sitemap",
  "robots",
];

interface InlineSlugFieldProps {
  value: string;
  onSave: (value: string) => void;
  admin: boolean;
}

export default function InlineSlugField({
  value,
  onSave,
  admin,
}: InlineSlugFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const validate = (slug: string): string | null => {
    if (RESERVED_SLUGS.includes(slug.toLowerCase())) {
      return `"${slug}" is reserved`;
    }
    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
      return "lowercase letters, numbers, and hyphens only";
    }
    return null;
  };

  const commit = () => {
    const trimmed = draft.trim();
    const err = validate(trimmed);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setEditing(false);
    if (trimmed !== value) {
      onSave(trimmed);
    }
  };

  if (!admin) return null;

  const baseClasses = "text-xs text-gray-400 font-mono";

  if (editing) {
    return (
      <span className={`inline-flex items-center gap-0 ${baseClasses}`}>
        <span>/</span>
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setDraft(value);
              setError(null);
              setEditing(false);
            }
          }}
          className={`${baseClasses} bg-transparent outline-none`}
          style={{ width: Math.max(draft.length + 2, 6) + "ch" }}
        />
        {error && <span className="text-red-500 ml-2">{error}</span>}
      </span>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`${baseClasses} cursor-text hover:text-gray-600 transition-colors`}
    >
      /{value}
    </span>
  );
}
