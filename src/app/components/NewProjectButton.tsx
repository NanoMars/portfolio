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
    <button onClick={handleNewProject} className="btn-outline px-4 py-1">
      + new project
    </button>
  );
}
