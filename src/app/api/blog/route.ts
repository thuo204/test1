import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { blogPostSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get('published');
  const featured = searchParams.get('featured');

  const where: Record<string, unknown> = {};
  if (published === 'true') where.published = true;
  if (featured === 'true') where.featured = true;

  const posts = await db.blogPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true, avatar: true } } },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const slug = slugify(parsed.data.title);
    const post = await db.blogPost.create({
      data: { ...parsed.data, slug, authorId: session.userId },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
