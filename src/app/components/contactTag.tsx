import React from "react";

interface ContactTagProps {
  imgSrc?: string;
  icon?: React.ReactNode;
  label: string;
  href: string;
}

export default function ContactTag({ imgSrc, icon, label, href }: ContactTagProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 border-2 border-black text-black p-2"
    >
      {imgSrc ? (
        <img src={imgSrc} alt={label} className="w-4 h-4" />
      ) : (
        icon
      )}
      <span className="text-sm hidden sm:block">{label}</span>
    </a>
  );
}