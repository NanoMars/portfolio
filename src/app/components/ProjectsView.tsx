import { getAllProject } from "@/lib/server/db/queries/project";
import ProjectCard from "./projectCard";

export default async function ProjectsView({ limit = -1 }: { limit?: number }) {
  const rawProjects = await getAllProject();

  if (!rawProjects || rawProjects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects found.</p>
    );
  }

  const displayData = limit > 0 ? rawProjects.slice(0, limit) : rawProjects;

  return (
    <>
      <ul className="grid grid-cols-1 min-[650px]:grid-cols-2 gap-6 w-full">
        {displayData.map((project) => (
          <li key={project.id}>
            <ProjectCard
              title={project.name}
              url={project.url ?? ""}
              slug={project.slug ?? undefined}
              headerImage={project.headerImage ?? undefined}
              description={project.description ?? ""}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
