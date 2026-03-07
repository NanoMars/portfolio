import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/server/db";
import { projectTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

async function getProject(slug: string) {
  // Try to find the project by slug
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.slug, slug),
  });
  return project;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | Portfolio`,
    description: project.description || `Read about my work on ${project.name}`,
    openGraph: {
      title: project.name,
      description: project.description || `Read about my work on ${project.name}`,
      images: project.headerImage ? [project.headerImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <article>
        {/* Header Image */}
        {project.headerImage && (
          <div
            className="w-full h-64 md:h-96 bg-cover bg-center mb-8 border-2 border-black"
            style={{ backgroundImage: `url(${project.headerImage})` }}
            role="img"
            aria-label={project.headerImageAlt || `Header image for ${project.name}`}
          />
        )}

        {/* Project Title */}
        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>

        {/* Description */}
        {project.description && (
          <p className="text-xl text-gray-600 mb-8">{project.description}</p>
        )}

        {/* Action Bar (Links to GitHub & Live Project) */}
        <div className="flex gap-4 mb-8">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              {project.liveUrlText || "Visit"}
            </a>
          )}
        </div>

        {/* Markdown Content Placeholder (Stage 3) */}
        <div className="prose prose-lg max-w-none mt-10">
          {project.content ? (
            <p>Markdown renderer will be implemented here...</p>
          ) : (
            <p className="text-gray-500 italic">No content written yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}
