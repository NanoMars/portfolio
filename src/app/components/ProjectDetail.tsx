"use client";

import { useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@/lib/schema_types";
import { updateProjectAction, deleteProjectAction } from "@/app/actions";
import { parseContent, serializeContent } from "@/lib/editorjs/utils";
import InlineTextField from "./inline-edit/InlineTextField";
import InlineImageField from "./inline-edit/InlineImageField";
import InlineLinkField from "./inline-edit/InlineLinkField";
import InlineVisibilityBadge from "./inline-edit/InlineVisibilityBadge";
import InlineSlugField from "./inline-edit/InlineSlugField";
import ProjectContent from "./ProjectContent";
import dynamic from "next/dynamic";
import type { EditorJsEditorHandle } from "./EditorJsEditor";
import BottomBackButton from "./BottomBackButton";
import RemoveHash from "./RemoveHash";

const EditorJsEditor = dynamic(() => import("./EditorJsEditor"), {
  ssr: false,
});

interface ProjectDetailProps {
  project: Project;
  admin: boolean;
}

export default function ProjectDetail({ project, admin }: ProjectDetailProps) {
  const router = useRouter();
  const editorRef = useRef<EditorJsEditorHandle>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaved = () => {
    setSaveStatus("saved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSaveStatus(null), 2000);
  };

  const showSaving = () => setSaveStatus("saving...");

  const saveField = useCallback(
    async (fields: Record<string, unknown>) => {
      showSaving();
      try {
        await updateProjectAction({ id: project.id, ...fields });
        showSaved();
        router.refresh();
      } catch (error) {
        console.error("Failed to save:", error);
        setSaveStatus("error saving");
      }
    },
    [project.id, router],
  );

  const handleContentSave = useCallback(
    async (data: import("@editorjs/editorjs").OutputData) => {
      await saveField({
        content: serializeContent(data),
        contentFormat: "editorjs",
      });
    },
    [saveField],
  );

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${project.name}"? This cannot be undone.`,
      )
    )
      return;
    try {
      await deleteProjectAction(project.id);
      router.push("/");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const parsed = parseContent(project.content, project.contentFormat);
  const editorInitialData =
    parsed.type === "editorjs" ? parsed.data : undefined;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <RemoveHash />

      {/* Save status indicator */}
      {admin && saveStatus && (
        <div className="fixed top-4 right-4 z-50 text-xs font-bold px-3 py-1 bg-white border-2 border-black">
          {saveStatus}
        </div>
      )}

      <div className="mb-8 flex justify-start items-center gap-4">
        <Link
          href="/"
          className="group text-black hover:text-gray-700 transition-colors duration-200 py-2 font-bold flex items-center lowercase"
        >
          <span className="relative">
            back
            <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
        {admin && (
          <InlineVisibilityBadge
            value={project.visibility}
            onSave={(v) => saveField({ visibility: v })}
            admin={admin}
          />
        )}
      </div>

      <article id="content" className="scroll-mt-6">
        {/* Header Image */}
        <InlineImageField
          value={project.headerImage}
          alt={project.headerImageAlt}
          onSave={(url) => saveField({ headerImage: url })}
          admin={admin}
          className="mb-8"
        />

        {/* Project Title */}
        <InlineTextField
          value={project.name}
          onSave={(v) => saveField({ name: v })}
          admin={admin}
          tag="h1"
          className="text-4xl font-bold mb-2"
          placeholder="Project name"
        />

        {/* Slug (admin only) */}
        <InlineSlugField
          value={project.slug || ""}
          onSave={(v) => {
            const oldSlug = project.slug;
            saveField({ slug: v }).then(() => {
              if (v !== oldSlug) {
                router.push(`/${v}`);
              }
            });
          }}
          admin={admin}
        />

        {/* Description */}
        <div className="mb-8 mt-4">
          <InlineTextField
            value={project.description || ""}
            onSave={(v) => saveField({ description: v || null })}
            admin={admin}
            tag="p"
            className="text-xl text-gray-600"
            multiline
            placeholder="Add a description..."
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <InlineLinkField
            url={project.githubUrl}
            onSave={(f) =>
              saveField({
                ...(f.url !== undefined && { githubUrl: f.url }),
              })
            }
            admin={admin}
            type="github"
          />
          <InlineLinkField
            url={project.liveUrl}
            text={project.liveUrlText}
            iconName={project.liveUrlIcon}
            onSave={(f) =>
              saveField({
                ...(f.url !== undefined && { liveUrl: f.url }),
                ...(f.text !== undefined && { liveUrlText: f.text }),
                ...(f.icon !== undefined && { liveUrlIcon: f.icon }),
              })
            }
            admin={admin}
            type="live"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-black max-w-none border-y-2 border-black py-10">
          {admin ? (
            <EditorJsEditor
              ref={editorRef}
              initialData={editorInitialData}
              onSave={handleContentSave}
            />
          ) : (
            <ProjectContent
              content={project.content}
              contentFormat={project.contentFormat}
            />
          )}
        </div>
      </article>

      {/* Admin: Delete */}
      {admin && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
          >
            delete project
          </button>
        </div>
      )}

      <BottomBackButton />
    </main>
  );
}
