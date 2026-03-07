// src/app/actions.ts
"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { createProject, updateProject } from "@/lib/server/db/queries/project";
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
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const headerImage = formData.get("header_link") as string;
  const headerImageAlt = formData.get("header_alt") as string;
  const url = formData.get("link") as string;
  const priority = parseInt(formData.get("priority") as string) || 0;

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

  for (let i = 0; i < orderedIds.length; i++) {
    await updateProject({ id: orderedIds[i], priority: i });
  }
  revalidatePath("/");
}

interface ActionResult {
  message: string;
}
