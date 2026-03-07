"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { updateProjectAction, createNewProjectAction } from "../actions";
import type { Project } from "@/lib/schema_types";

// Dynamically import MDEditor to avoid SSR hydration issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function AdminEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [liveUrlText, setLiveUrlText] = useState("");
  const [liveUrlIcon, setLiveUrlIcon] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<Project>;
      const p = customEvent.detail;
      setProject(p);
      setName(p.name || "");
      setSlug(p.slug || "");
      setDescription(p.description || "");
      setHeaderImage(p.headerImage || "");
      setGithubUrl(p.githubUrl || "");
      setLiveUrl(p.liveUrl || "");
      setLiveUrlText(p.liveUrlText || "");
      setLiveUrlIcon(p.liveUrlIcon || "");
      setContent(p.content || "");
      setIsOpen(true);
    };

    window.addEventListener("open-edit-modal", handleOpen);
    return () => window.removeEventListener("open-edit-modal", handleOpen);
  }, []);

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    try {
      const payload = {
        name,
        slug: slug || null,
        description: description || null,
        headerImage: headerImage || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        liveUrlText: liveUrlText || null,
        liveUrlIcon: liveUrlIcon || null,
        content: content || null,
      };

      if (project.id === "new") {
        await createNewProjectAction(payload);
      } else {
        await updateProjectAction({ id: project.id, ...payload });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white border-2 border-black w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b-2 border-black bg-white">
          <h2 className="text-2xl font-black truncate pr-4 lowercase">
            {project.id === "new"
              ? "create new project"
              : `edit project: ${project.name}`}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black hover:text-red-500 font-bold text-xl flex-shrink-0 lowercase"
          >
            [x] close
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6"
          data-color-mode="light"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2 font-bold">
              name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold">
              slug (seo url)
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold md:col-span-2">
              description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-2 border-black p-2 font-normal h-24 resize-y focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold">
              header image url
              <input
                type="text"
                value={headerImage}
                onChange={(e) => setHeaderImage(e.target.value)}
                className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold">
              github url
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold">
              live url
              <input
                type="text"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
              />
            </label>
            <div className="flex gap-4">
              <label className="flex flex-col gap-2 font-bold w-1/2">
                live url text
                <input
                  type="text"
                  value={liveUrlText}
                  onChange={(e) => setLiveUrlText(e.target.value)}
                  placeholder="e.g. Play, Visit"
                  className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
              <label className="flex flex-col gap-2 font-bold w-1/2">
                live url icon
                <input
                  type="text"
                  value={liveUrlIcon}
                  onChange={(e) => setLiveUrlIcon(e.target.value)}
                  placeholder="e.g. gamepad, link"
                  className="border-2 border-black p-2 font-normal focus:outline-none focus:ring-2 focus:ring-black"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 font-bold flex-1">
            <span className="mb-2">markdown content</span>
            <div className="border-2 border-black flex-1 min-h-[400px]">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height="100%"
                preview="edit"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t-2 border-black bg-white flex justify-end gap-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border-2 border-black font-bold hover:border-4 hover:px-[22px] hover:py-[6px] transition-all lowercase bg-white text-black"
          >
            cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 border-2 border-black bg-white text-black font-bold hover:border-4 hover:px-[22px] hover:py-[6px] transition-all disabled:opacity-50 lowercase"
          >
            {isSaving
              ? "saving..."
              : project.id === "new"
                ? "create project"
                : "save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
