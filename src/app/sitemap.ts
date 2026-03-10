import { MetadataRoute } from 'next';
import { db } from '@/lib/server/db';
import { projectTable } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the environment URL or fallback to your production domain
  const baseUrl = process.env.URL || 'https://armandpm.com';

  // Fetch only projects that are explicitly set to 'public'
  const publicProjects = await db.query.projectTable.findMany({
    where: eq(projectTable.visibility, 'public'),
  });

  // Dynamically generate sitemap entries for each public project
  const projectEntries: MetadataRoute.Sitemap = publicProjects
    .filter((project) => project.slug) // Only include projects with a valid slug
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.lastUpdated || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // Combine the static homepage with the dynamic project routes
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectEntries,
  ];
}
