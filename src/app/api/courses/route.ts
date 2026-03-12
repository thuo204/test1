import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const published = searchParams.get('published');
  const featured = searchParams.get('featured');

  const where: Record<string, unknown> = {};
  if (published === 'true') where.published = true;
  if (featured === 'true') where.featured = true;

  const courses = await db.course.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { lessons: true, enrollments: true } } },
  });

  return NextResponse.json({ courses });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = courseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const slug = slugify(parsed.data.title);
    const course = await db.course.create({
      data: { ...parsed.data, slug },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
