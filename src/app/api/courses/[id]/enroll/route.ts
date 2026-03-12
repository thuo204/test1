import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const course = await db.course.findUnique({ where: { id: params.id, published: true } });
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.userId, courseId: params.id } },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already enrolled' }, { status: 409 });
  }

  const enrollment = await db.enrollment.create({
    data: { userId: session.userId, courseId: params.id },
  });

  return NextResponse.json({ enrollment }, { status: 201 });
}
