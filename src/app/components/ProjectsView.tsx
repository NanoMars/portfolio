
import { getAllProject } from "@/lib/server/db/queries/project";
import ProjectCard from "./projectCard";

export default async function ProjectsView({ limit = -1 }: { limit?: number }) {
  const rawProjects = await getAllProject();

  if (!rawProjects || rawProjects.length === 0) {
    return <p className="text-center text-muted-foreground">No projects found.</p>;
  }

  const displayData = limit > 0 ? rawProjects.slice(0, limit) : rawProjects;

  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {displayData.map((project) => (
        <li key={project.id}>
          <ProjectCard
            title={project.name}
            url={project.url ?? ""}
            logoImage={project.logo_image ?? undefined}
            headerImage={project.header_image ?? undefined}
            description={project.description ?? ""}
          />
        </li>
      ))}
    </ul>
  );
}

