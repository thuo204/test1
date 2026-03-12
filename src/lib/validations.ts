import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const courseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  thumbnail: z.string().url().optional(),
  price: z.number().min(0),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const lessonSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  videoUrl: z.string().url().optional().nullable(),
  duration: z.number().min(0).default(0),
  order: z.number().min(0).default(0),
  published: z.boolean().default(false),
  free: z.boolean().default(false),
});

export const blogPostSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(10),
  thumbnail: z.string().url().optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
