import type { User } from "@/lib/schema_types";
import { redirect } from "next/navigation";
import {InputField,  LogoutButton, TextField, ButtonThing } from "../components";
import { isAdmin } from "@/lib/server/auth/admin";
import { getCurrentSession } from "@/lib/server/auth/session";
import { logoutAction } from "../actions";
import ProjectsView from "../components/ProjectsView";
import { Button, Input } from '@headlessui/react'

export default async function Page() {
  const { user: profile } = await getCurrentSession() as { user: User };
  // if (!profile) {
  //   redirect("/login");
  // }
  // if (!isAdmin(profile)) {
  //   logoutAction();
  //   redirect("/");
  // }

  //const image = `https://avatars.githubusercontent.com/u/${profile.github_id}`;

  return (
    <div className="flex flex-col items-center gap-12 pt-20">
      <h1 className="text-3xl font-bold">[admin]</h1>
      <div className="flex flex-col items-center gap-4">
        {/* <img src={image} alt="profile" height="100" width="100" className="rounded-full" /> */}
        {/* <p className="font-semibold">{profile.email}</p> */}
        <p className="font-black">welcome, {profile.username}</p>
        <div>
          <input type="checkbox" id="modal-toggle" className="peer hidden" />
          <label
            htmlFor="modal-toggle"
            className="mb-2 inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add New Project
          </label>

          <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 peer-checked:flex">
            <div className="relative w-96 max-w-full rounded-lg bg-white p-6 shadow-xl">
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
              <ButtonThing buttonText="Create Project" />
            </div>
          </div>
        </div>
        <ProjectsView />
        <LogoutButton />
      </div>
    </div>
  );
}

