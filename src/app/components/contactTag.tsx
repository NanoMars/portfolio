import React from "react";

interface ContactTagProps {
  imgSrc: string;
  label: string;
  href: string;
}

export default function ContactTag({ imgSrc, label, href }: ContactTagProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 border-2 border-black text-black p-2"
    >
      <img src={imgSrc} alt={label} className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </a>
  );
}