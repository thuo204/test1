import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { courseSchema } from '@/lib/validations';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: { lessons: { orderBy: { order: 'asc' } } },
  });

  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = courseSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const course = await db.course.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ course });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.course.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
