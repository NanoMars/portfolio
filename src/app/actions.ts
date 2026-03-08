// src/app/actions.ts
"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/server/db/queries/project";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/server/auth/admin";

export async function logoutAction(): Promise<ActionResult> {
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/login");
}

export async function createProjectAction(formData: FormData) {
  const name = (formData.get("name") as string) || "New Project";
  const description = (formData.get("description") as string) || null;
  const headerImage = (formData.get("header_link") as string) || null;
  const headerImageAlt = (formData.get("header_alt") as string) || null;
  const url = (formData.get("link") as string) || null;

  let priority = parseInt(formData.get("priority") as string);
  // Give it a unique priority to prevent constraint errors
  if (isNaN(priority) || priority === 100) {
    priority = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
  }

  await createProject({
    name,
    description,
    headerImage,
    headerImageAlt,
    url,
    priority,
  });
  revalidatePath("/");
}

export async function createNewProjectAction(payload: any) {
  const { user } = await getCurrentSession();
  if (!user || !isAdmin(user)) throw new Error("Unauthorized");

  let priority = payload.priority;
  if (priority === undefined || priority === null || isNaN(priority)) {
    priority = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
  }

  const newProject = await createProject({
    name: payload.name || "New Project",
    slug: payload.slug || null,
    description: payload.description || null,
    headerImage: payload.headerImage || null,
    githubUrl: payload.githubUrl || null,
    liveUrl: payload.liveUrl || null,
    liveUrlText: payload.liveUrlText || null,
    liveUrlIcon: payload.liveUrlIcon || null,
    content: payload.content || null,
    priority,
  });

  revalidatePath("/");
  return newProject;
}

export async function updateProjectAction(payload: {
  id: string;
  [key: string]: any;
}) {
  const { user } = await getCurrentSession();
  if (!user || !isAdmin(user)) throw new Error("Unauthorized");

  await updateProject(payload as any);
  revalidatePath("/");
  if (payload.slug) {
    revalidatePath(`/projects/${payload.slug}`);
  }
}

export async function reorderProjectsAction(orderedIds: string[]) {
  const { user } = await getCurrentSession();
  if (!user || !isAdmin(user)) throw new Error("Unauthorized");

  // Pass 1: Assign temporary negative priorities to avoid unique constraint collisions
  const randomOffset = Math.floor(Math.random() * 1000000000);
  for (let i = 0; i < orderedIds.length; i++) {
    await updateProject({ id: orderedIds[i], priority: -randomOffset - i });
  }

  // Pass 2: Assign final 0-indexed priorities
  for (let i = 0; i < orderedIds.length; i++) {
    await updateProject({ id: orderedIds[i], priority: i });
  }
  revalidatePath("/");
}

export async function deleteProjectAction(id: string) {
  const { user } = await getCurrentSession();
  if (!user || !isAdmin(user)) throw new Error("Unauthorized");

  await deleteProject(id);
  revalidatePath("/");
}

interface ActionResult {
  message: string;
}
