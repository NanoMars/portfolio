import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/server/db";
import { projectTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as LucideIcons from "lucide-react";
import { getCurrentSession } from "@/lib/server/auth/session";
import { isAdmin } from "@/lib/server/auth/admin";
import Link from "next/link";
import BottomBackButton from "../../components/BottomBackButton";
import RemoveHash from "../../components/RemoveHash";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  // Try to find the project by slug
  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.slug, slug),
  });
  return project;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const isUnlisted = project.visibility === "unlisted";
  const isPrivate = project.visibility === "private";

  return {
    title: `${project.name} | Armand`,
    description: project.description || `Read about my work on ${project.name}`,
    robots:
      isUnlisted || isPrivate ? { index: false, follow: false } : undefined,
    openGraph: {
      title: project.name,
      description:
        project.description || `Read about my work on ${project.name}`,
      images: project.headerImage ? [project.headerImage] : [],
    },
  };
}

// Helper to render Lucide icons dynamically based on string name from the database
const DynamicIcon = ({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) => {
  const Fallback =
    (LucideIcons as any)["ExternalLink"] || (LucideIcons as any)["Link"];

  if (!name) {
    return Fallback ? <Fallback className={className} size={20} /> : null;
  }

  // Format string to match Lucide component names (e.g., "gamepad" -> "Gamepad", "external-link" -> "ExternalLink")
  const formattedName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[formattedName];

  if (!IconComponent) {
    return Fallback ? <Fallback className={className} size={20} /> : null; // Fallback icon
  }

  return <IconComponent className={className} size={20} />;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  if (project.visibility === "private") {
    const { user } = await getCurrentSession();
    if (!user || !isAdmin(user)) {
      notFound();
    }
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <RemoveHash />
      <div className="mb-8 flex justify-start">
        <Link
          href="/"
          className="group text-black hover:text-gray-700 transition-colors duration-200 py-2 font-bold flex items-center lowercase"
        >
          <span className="relative">
            back
            <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
      <article id="content" className="scroll-mt-6">
        {/* Header Image */}
        {project.headerImage && (
          <div
            className="w-full h-64 md:h-96 bg-cover bg-center mb-8"
            style={{ backgroundImage: `url(${project.headerImage})` }}
            role="img"
            aria-label={
              project.headerImageAlt || `Header image for ${project.name}`
            }
          />
        )}

        {/* Project Title */}
        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>

        {/* Description */}
        {project.description && (
          <p className="text-xl text-gray-600 mb-8">{project.description}</p>
        )}

        {/* Action Bar (Links to GitHub & Live Project) */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-4 mb-8">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                <DynamicIcon name="github" />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                <DynamicIcon name={project.liveUrlIcon} />
                {project.liveUrlText || "Visit"}
              </a>
            )}
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-lg prose-black max-w-none border-y-2 border-black py-10">
          {project.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500 italic">
              No detailed content written yet.
            </p>
          )}
        </div>
      </article>
      <BottomBackButton />
    </main>
  );
}
