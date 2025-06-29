import type { User } from "@/lib/schema_types";
import { redirect } from "next/navigation";
import InputField, { LogoutButton } from "../components";
import { isAdmin } from "@/lib/server/auth/admin";
import { getCurrentSession } from "@/lib/server/auth/session";
import { logoutAction } from "../actions";
import ProjectsView from "../components/ProjectsView";
import { Input } from '@headlessui/react'

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
          <InputField fieldName="name" fieldDescription="The name of the project" />
          <textarea name="description" data-focus data-hover></textarea>
          <InputField fieldName="logo_link" fieldDescription="Link to the logo image" />
          <InputField fieldName="header_link" fieldDescription="Link to the header image" />
          <InputField fieldName="link" fieldDescription="Link to the project" />
          
        </div>
        <ProjectsView />
        <LogoutButton />
      </div>
    </div>
  );
}

