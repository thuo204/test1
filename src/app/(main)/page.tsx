import { HeroSection } from '@/components/layout/hero-section';
import { FeaturedCourses } from '@/components/courses/featured-courses';
import { FeaturedPosts } from '@/components/blog/featured-posts';
import { StatsSection } from '@/components/layout/stats-section';
import { AdBanner } from '@/components/ads/ad-banner';
import { db } from '@/lib/db';

async function getHomeData() {
  const [courses, posts, adSlot] = await Promise.all([
    db.course.findMany({
      where: { published: true, featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    db.blogPost.findMany({
      where: { published: true, featured: true },
      take: 3,
      include: { author: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.adSlot.findFirst({
      where: { active: true, placement: 'hero' },
    }),
  ]);
  return { courses, posts, adSlot };
}

export default async function HomePage() {
  const { courses, posts, adSlot } = await getHomeData();

  return (
    <>
      <HeroSection />
      {adSlot && (
        <div className="container mx-auto px-4 py-6">
          <AdBanner ad={adSlot} />
        </div>
      )}
      <FeaturedCourses courses={courses} />
      <StatsSection />
      <FeaturedPosts posts={posts} />
    </>
  );
}
