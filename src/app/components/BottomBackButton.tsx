"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BottomBackButton() {
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      // Only show footer when content extends well beyond the viewport.
      // Use a threshold to avoid showing it when there's just a tiny overflow
      // from padding/editor chrome.
      const overflow = document.body.scrollHeight - window.innerHeight;
      setIsLong(overflow > 200);
    };

    checkHeight();

    window.addEventListener("resize", checkHeight);

    const observer = new MutationObserver(checkHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = setTimeout(checkHeight, 500);

    return () => {
      window.removeEventListener("resize", checkHeight);
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  if (!isLong) return null;

  return (
    <div className="mt-10">
      <div className="border-t-2 border-black" />
      <div className="mt-4 flex justify-start">
        <Link
          href="/"
          className="group text-black hover:text-gray-700 transition-colors duration-200 py-2 font-bold flex items-center lowercase"
        >
          <span className="relative">
            back
            <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
