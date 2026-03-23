"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewProjectAction } from "../actions";

export default function NewProjectButton() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleNewProject = async () => {
    setCreating(true);
    try {
      const slug = `new-project-${Date.now()}`;
      const project = await createNewProjectAction({
        name: "New Project",
        slug,
        contentFormat: "editorjs",
      });
      if (project?.slug) {
        router.push(`/${project.slug}`);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setCreating(false);
    }
  };

  return (
    <button
      onClick={handleNewProject}
      disabled={creating}
      className="btn-outline px-4 py-1 disabled:opacity-50"
    >
      {creating ? "creating..." : "+ new project"}
    </button>
  );
}
