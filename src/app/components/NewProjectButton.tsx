"use client";

import React from "react";

export default function NewProjectButton() {
  const handleNewProject = () => {
    // Dispatch the custom event to open the AdminEditModal
    // We pass an ID of "new" so the modal knows to create rather than update
    const event = new CustomEvent("open-edit-modal", {
      detail: {
        id: "new",
        name: "",
        slug: "",
        description: "",
        content: "",
        url: "",
        githubUrl: "",
        liveUrl: "",
        liveUrlText: "",
        liveUrlIcon: "",
        headerImage: "",
        headerImageAlt: "",
        priority: 0,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleNewProject}
      className="px-4 py-1 bg-white text-black border-2 border-black hover:border-4 hover:px-[14px] hover:py-[2px] transition-all lowercase"
    >
      + new project
    </button>
  );
}
