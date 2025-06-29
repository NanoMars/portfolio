"use server";


import { createProjectAction } from "../actions";

import type { User } from "@/lib/schema_types";
import {InputField,  LogoutButton, TextField } from "../components";
import { getCurrentSession } from "@/lib/server/auth/session";
import ProjectsView from "../components/ProjectsView";


export default async function Page() {
  const { user: profile } = await getCurrentSession() as { user: User };

  const imageUrl = `https://avatars.githubusercontent.com/u/${profile.github_id}`;

  // if (!profile) {
  //   redirect("/login");
  // }
  // if (!isAdmin(profile)) {
  //   logoutAction();
  //   redirect("/");
  // }

  return (
    <div className="flex flex-col items-center gap-12 pt-20">
      <h1 className="text-3xl font-bold">[admin]</h1>
      <div className="flex flex-col items-center gap-4">
        <img src={imageUrl} alt="profile" height={100} width={100} className="rounded-full" />
        {/* <p className="font-semibold">{profile.email}</p> */}
        <p className="font-black">welcome, {profile.username}</p>
        <div>
          <input type="checkbox" id="modal-toggle" className="peer hidden" />
          <label
            htmlFor="modal-toggle"
            className="mb-2 inline-block cursor-pointer rounded bg-black px-4 py-2 text-white hover:bg-black/80 transition-colors duration-200"
          >
            Add New Project
          </label>

          <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 peer-checked:flex">
            <form action={createProjectAction} className="relative w-96 max-w-full rounded-lg bg-white p-6 shadow-xl">
              <label
                htmlFor="modal-toggle"
                className="absolute right-2 top-2 cursor-pointer text-xl text-gray-500 hover:text-black"
              >
                &times;
              </label>

              <InputField fieldName="name" fieldDescription="The name of the project" />
              <TextField fieldName="description" fieldDescription="A brief description of the project" />
              <InputField fieldName="logo_link" fieldDescription="Link to the logo image" />
              <InputField fieldName="header_link" fieldDescription="Link to the header image" />
              <InputField fieldName="link" fieldDescription="Link to the project" />
              <button
                type="submit"
                className="mb-2 mx-auto block rounded bg-black px-4 py-2 text-white hover:bg-black/80 transition-colors duration-200 mt-4"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
        <ProjectsView />
        <LogoutButton />
      </div>
    </div>
  );
}
