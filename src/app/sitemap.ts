import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const [courses, posts] = await Promise.all([
    db.course.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${baseUrl}/courses/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
