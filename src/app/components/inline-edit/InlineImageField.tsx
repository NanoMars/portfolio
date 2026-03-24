"use client";

import { useState, useRef } from "react";
import { uploadImageAction } from "@/app/actions";

interface InlineImageFieldProps {
  value: string | null;
  alt: string | null;
  onSave: (url: string) => void;
  admin: boolean;
  className?: string;
}

export default function InlineImageField({
  value,
  alt,
  onSave,
  admin,
  className = "",
}: InlineImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await uploadImageAction(formData);
      onSave(url);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  if (!admin) {
    if (!value) return null;
    return (
      <div
        className={`w-full h-64 md:h-96 bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${value})` }}
        role="img"
        aria-label={alt || "Header image"}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-64 md:h-96 bg-cover bg-center cursor-pointer group ${className}`}
      style={value ? { backgroundImage: `url(${value})` } : undefined}
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        className={`absolute inset-0 flex items-center justify-center cursor-pointer ${
          isDragging
            ? "bg-black/30"
            : value
              ? "bg-black/0 group-hover:bg-black/20"
              : "bg-gray-100 border-2 border-dashed border-gray-300 group-hover:bg-gray-200"
        }`}
      >
        <span
          className={`text-sm font-bold px-3 py-1 bg-white/90 border-2 border-black cursor-pointer ${
            value && !isDragging
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-100"
          }`}
        >
          {uploading
            ? "uploading..."
            : isDragging
              ? "drop image here"
              : value
                ? "click or drag to change"
                : "click or drag to add header image"}
        </span>
      </div>
    </div>
  );
}
