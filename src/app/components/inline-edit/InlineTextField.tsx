"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ElementType } from "react";

interface InlineTextFieldProps {
  value: string;
  onSave: (value: string) => void;
  admin: boolean;
  tag?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function InlineTextField({
  value,
  onSave,
  admin,
  tag: Tag = "span",
  className = "",
  multiline = false,
  placeholder = "",
}: InlineTextFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (el && multiline) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [multiline]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      autoResize();
    }
  }, [editing, autoResize]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  if (!admin) {
    if (!value && !placeholder) return null;
    return (
      <Tag className={className}>
        {value || placeholder}
      </Tag>
    );
  }

  if (editing) {
    const sharedProps = {
      ref: inputRef as any,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDraft(e.target.value);
        if (multiline) {
          // Auto-resize on next frame after value updates
          requestAnimationFrame(() => autoResize());
        }
      },
      onBlur: commit,
      onKeyDown: handleKeyDown,
      placeholder,
      className: `${className} outline-none bg-transparent w-full`,
    };

    return multiline ? (
      <textarea {...sharedProps} rows={1} style={{ resize: "none", overflow: "hidden" }} />
    ) : (
      <input type="text" {...sharedProps} />
    );
  }

  return (
    <Tag
      className={`${className} cursor-text hover:bg-gray-50 transition-colors duration-150 rounded-sm`}
      onClick={() => setEditing(true)}
    >
      {value || (
        <span className="text-gray-400 italic">
          {placeholder || "Click to add..."}
        </span>
      )}
    </Tag>
  );
}
