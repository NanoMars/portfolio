import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.URL || 'https://armandpm.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Prevent crawlers from indexing internal routing, auth paths, or any specific hidden directories
      disallow: ['/login/', '/api/', '/_next/'],
    },
    // Dynamically point crawlers and AI bots to the auto-generated sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
