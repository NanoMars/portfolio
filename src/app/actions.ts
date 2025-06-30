// src/app/actions.ts
"use server";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession
} from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { createProject } from "@/lib/server/db/queries/project";
import { revalidatePath } from "next/cache";

export async function logoutAction(): Promise<ActionResult> {
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated"
    };
  }
  await invalidateSession(session.id);
  await deleteSessionTokenCookie();
  return redirect("/login");
}



export async function createProjectAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const logo_image = formData.get("logo_link") as string;
  const logo_image_alt = formData.get("logo_alt") as string;
  const header_image = formData.get("header_link") as string;
  const header_image_alt = formData.get("header_alt") as string;
  const url = formData.get("link") as string;

  await createProject({ name, description, logo_image, logo_image_alt, header_image, header_image_alt, url });
  revalidatePath("/admin");
}

interface ActionResult {
  message: string;
}
