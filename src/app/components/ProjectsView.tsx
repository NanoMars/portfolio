import { getAllProject } from "@/lib/server/db/queries/project";
import ClientProjectList from "./ClientProjectList";

export default async function ProjectsView({
  limit = -1,
  admin = false,
}: {
  limit?: number;
  admin?: boolean;
}) {
  const allProjects = await getAllProject();

  if (!allProjects || allProjects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects found.</p>
    );
  }

  const rawProjects = admin
    ? allProjects
    : allProjects.filter((p) => p.visibility === "public");

  if (rawProjects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects found.</p>
    );
  }

  const displayData = limit > 0 ? rawProjects.slice(0, limit) : rawProjects;

  return (
    <>
      <ClientProjectList initialProjects={displayData} admin={admin} />
    </>
  );
}
