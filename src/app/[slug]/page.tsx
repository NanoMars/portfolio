import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/server/db";
import { projectTable } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/server/auth/session";
import { isAdmin } from "@/lib/server/auth/admin";
import ProjectDetail from "../components/ProjectDetail";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const { user } = await getCurrentSession();
  const admin = user ? isAdmin(user) : false;

  if (project.visibility === "private" && !admin) {
    notFound();
  }

  return <ProjectDetail project={project} admin={admin} />;
}
