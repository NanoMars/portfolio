"use client";

import { useEffect } from "react";

export default function RemoveHash() {
  useEffect(() => {
    // If there's a hash in the URL (e.g. #content), remove it instantly
    // without triggering a reload or affecting the browser's back history.
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  return null;
}
