import GreetingCard from "./components/greetingCard";
import ProjectsView from "./components/ProjectsView";
import { getCurrentSession } from "@/lib/server/auth/session";
import { isAdmin } from "@/lib/server/auth/admin";
import AdminEditModal from "./components/AdminEditModal";
import { LogoutButton } from "./components";
import NewProjectButton from "./components/NewProjectButton";

export default async function Home() {
  const { user } = await getCurrentSession();
  const admin = user ? isAdmin(user) : false;

  return (
    <div className="flex flex-col gap-12 w-full max-w-[800px] mx-auto px-4">
      <GreetingCard />

      {admin && (
        <div className="w-full flex justify-between items-center bg-white text-black p-4 border-2 border-black font-bold mt-4">
          <span>admin panel</span>
          <div className="flex gap-4">
            <NewProjectButton />
            <LogoutButton />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-8 w-full">
        <h4 className="text-3xl font-bold w-fit mx-auto flex items-center gap-2">
          [projects]
          {admin && (
            <span className="text-sm font-normal text-red-500">
              (admin mode)
            </span>
          )}
        </h4>
        <ProjectsView admin={admin} />
      </div>
      {admin && <AdminEditModal />}
    </div>
  );
}

export const metadata = {
  title: "Armand Packham-McGuiness | Games, Software & Hardware",
  description:
    "Portfolio of Armand Packham-McGuiness—creative tech projects across games, software, and hardware. Developer, builder, and experimental maker.",
};
