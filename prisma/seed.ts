import { PrismaClient, Role, CourseLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@learnhub.dev' },
    update: {},
    create: {
      email: 'admin@learnhub.dev',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create instructor
  const instructorPassword = await bcrypt.hash('instructor123', 12);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@learnhub.dev' },
    update: {},
    create: {
      email: 'instructor@learnhub.dev',
      name: 'Jane Smith',
      password: instructorPassword,
      role: Role.INSTRUCTOR,
      bio: 'Senior Full-Stack Developer with 10+ years of experience.',
    },
  });

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { slug: 'nextjs-fundamentals' },
    update: {},
    create: {
      slug: 'nextjs-fundamentals',
      title: 'Next.js 14 Fundamentals',
      description: 'Master Next.js 14 with the App Router, Server Components, and more. Build production-ready applications from scratch.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      price: 49.99,
      level: CourseLevel.BEGINNER,
      published: true,
      featured: true,
      tags: ['nextjs', 'react', 'typescript', 'web development'],
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'typescript-mastery' },
    update: {},
    create: {
      slug: 'typescript-mastery',
      title: 'TypeScript Mastery',
      description: 'Deep dive into TypeScript. From generics to decorators, become a TypeScript expert.',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
      price: 39.99,
      level: CourseLevel.INTERMEDIATE,
      published: true,
      featured: true,
      tags: ['typescript', 'javascript', 'programming'],
    },
  });

  // Create lessons for course 1
  const lessons1 = [
    { slug: 'introduction', title: 'Introduction to Next.js 14', content: '# Introduction\n\nWelcome to Next.js 14! In this lesson we cover the basics.', order: 1, free: true, duration: 600 },
    { slug: 'app-router', title: 'Understanding the App Router', content: '# App Router\n\nThe App Router is the new way to build Next.js applications.', order: 2, free: false, duration: 900 },
    { slug: 'server-components', title: 'React Server Components', content: '# Server Components\n\nServer Components allow you to render on the server.', order: 3, free: false, duration: 1200 },
    { slug: 'data-fetching', title: 'Data Fetching Strategies', content: '# Data Fetching\n\nLearn how to fetch data in Next.js 14.', order: 4, free: false, duration: 1500 },
  ];

  for (const lesson of lessons1) {
    await prisma.lesson.upsert({
      where: { courseId_slug: { courseId: course1.id, slug: lesson.slug } },
      update: {},
      create: { ...lesson, courseId: course1.id, published: true },
    });
  }

  // Create blog posts
  const posts = [
    {
      slug: 'getting-started-with-nextjs-14',
      title: 'Getting Started with Next.js 14',
      excerpt: 'A comprehensive guide to getting started with Next.js 14 and the App Router.',
      content: '# Getting Started with Next.js 14\n\nNext.js 14 introduces several groundbreaking features...',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      published: true,
      featured: true,
      tags: ['nextjs', 'react', 'tutorial'],
      authorId: instructor.id,
    },
    {
      slug: 'typescript-best-practices-2025',
      title: 'TypeScript Best Practices in 2025',
      excerpt: 'Essential TypeScript patterns and best practices for modern web development.',
      content: '# TypeScript Best Practices\n\nAs TypeScript continues to evolve...',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
      published: true,
      featured: false,
      tags: ['typescript', 'javascript', 'best-practices'],
      authorId: instructor.id,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  // Create ad slots
  await prisma.adSlot.createMany({
    data: [
      { name: 'Hero Banner', placement: 'hero', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200', linkUrl: '#', active: true },
      { name: 'Sidebar Ad', placement: 'sidebar', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', linkUrl: '#', active: true },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed');
  console.log('Admin: admin@learnhub.dev / admin123');
  console.log('Instructor: instructor@learnhub.dev / instructor123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
