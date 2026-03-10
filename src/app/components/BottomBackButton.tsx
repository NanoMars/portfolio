"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BottomBackButton() {
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      // Compare total document height vs viewport height
      if (document.body.scrollHeight > window.innerHeight) {
        setIsLong(true);
      } else {
        setIsLong(false);
      }
    };

    // Check initially
    checkHeight();

    // Check on resize
    window.addEventListener("resize", checkHeight);

    // Check if content changes (e.g., images loading)
    const observer = new MutationObserver(checkHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback delay to catch late-loading elements
    const timeout = setTimeout(checkHeight, 500);

    return () => {
      window.removeEventListener("resize", checkHeight);
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  if (!isLong) return null;

  return (
    <div className="mt-12 flex justify-start">
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
  );
}
