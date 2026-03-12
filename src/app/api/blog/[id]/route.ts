import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { blogPostSchema } from '@/lib/validations';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = blogPostSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const post = await db.blogPost.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ post });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
