import type { User } from "@/lib/schema_types";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components";
import { isAdmin } from "@/lib/server/auth/admin";
import { getCurrentSession } from "@/lib/server/auth/session";

export default async function Page() {
  const { user } = await getCurrentSession();
  const profile = user as User;
  if (!user) {
    redirect("/login");
  }
  if (!isAdmin(profile)) {
    redirect("/home");
  }

  const image = `https://avatars.githubusercontent.com/u/${profile.github_id}`;

  return (
    <div className="flex flex-col items-center gap-12 pt-20">
      <h1 className="text-3xl font-bold">[admin]</h1>
      <div className="flex flex-col items-center gap-4">
        <img src={image} alt="profile" height="100" width="100" className="rounded-full" />
        <p className="font-semibold">{profile.email}</p>
        <LogoutButton />
      </div>
    </div>
  );
}
