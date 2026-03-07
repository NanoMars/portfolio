"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ProjectCard from "./projectCard";
import { reorderProjectsAction } from "../actions";
import type { Project } from "@/lib/schema_types";

function SortableProjectItem({
  project,
  admin,
}: {
  project: Project;
  admin: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : 0,
    position: "relative" as const,
  };

  return (
    <li ref={setNodeRef} style={style} className="relative group">
      {admin && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 bg-white border-2 border-black px-2 py-1 cursor-grab active:cursor-grabbing font-bold text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors"
        >
          DRAG
        </div>
      )}
      {admin && (
        <button
          className="absolute top-2 left-2 z-10 bg-black text-white border-2 border-black px-2 py-1 font-bold text-sm hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          onClick={(e) => {
            e.preventDefault();
            // Dispatch custom event to open the edit modal (to be implemented next)
            const event = new CustomEvent("open-edit-modal", {
              detail: project,
            });
            window.dispatchEvent(event);
          }}
        >
          EDIT
        </button>
      )}
      <ProjectCard
        title={project.name}
        url={project.url ?? ""}
        slug={project.slug ?? undefined}
        headerImage={project.headerImage ?? undefined}
        description={project.description ?? ""}
      />
    </li>
  );
}

export default function ClientProjectList({
  initialProjects,
  admin = false,
}: {
  initialProjects: Project[];
  admin?: boolean;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before dragging starts so clicks still work
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let newOrder: Project[] = [];

      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder;
      });

      // Optimistically update the database outside of the setProjects render cycle
      if (newOrder.length > 0) {
        startTransition(() => {
          reorderProjectsAction(newOrder.map((p) => p.id));
        });
      }
    }
  }

  if (!admin) {
    return (
      <ul className="grid grid-cols-1 min-[650px]:grid-cols-2 gap-6 w-full">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard
              title={project.name}
              url={project.url ?? ""}
              slug={project.slug ?? undefined}
              headerImage={project.headerImage ?? undefined}
              description={project.description ?? ""}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={projects} strategy={rectSortingStrategy}>
        <ul
          className="grid grid-cols-1 min-[650px]:grid-cols-2 gap-6 w-full transition-opacity duration-200"
          style={{ opacity: isPending ? 0.6 : 1 }}
        >
          {projects.map((project) => (
            <SortableProjectItem
              key={project.id}
              project={project}
              admin={admin}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
