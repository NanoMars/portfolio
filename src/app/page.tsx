import GreetingCard from "./components/greetingCard";
import ProjectsView from "./components/ProjectsView";
import { getCurrentSession } from "@/lib/server/auth/session";
import { isAdmin } from "@/lib/server/auth/admin";
import AdminEditModal from "./components/AdminEditModal";
import { LogoutButton } from "./components";

export default async function Home() {
  const { user } = await getCurrentSession();
  const admin = user ? isAdmin(user) : false;

  return (
    <div className="flex flex-col gap-12 w-full max-w-[800px] mx-auto px-4">
      <GreetingCard />

      {admin && (
        <div className="w-full flex justify-between items-center bg-black text-white p-4 border-2 border-black font-bold mt-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <span>ADMIN PANEL</span>
          <div className="flex gap-4">
            <form
              action={async () => {
                "use server";
                const { createProjectAction } = await import("./actions");
                const formData = new FormData();
                formData.append("name", "New Project");
                formData.append("priority", "100");
                await createProjectAction(formData);
              }}
            >
              <button
                type="submit"
                className="px-4 py-1 bg-white text-black border-2 border-transparent hover:border-white hover:bg-black hover:text-white transition-colors"
              >
                + NEW PROJECT
              </button>
            </form>
            <LogoutButton />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-8 w-full">
        <h4 className="text-3xl font-bold w-fit mx-auto flex items-center gap-2">
          [projects]
          {admin && (
            <span className="text-sm font-normal text-red-500">
              (Admin Mode)
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
