import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const ads = await db.adSlot.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ ads });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const ad = await db.adSlot.create({
    data: {
      name: body.name,
      placement: body.placement,
      imageUrl: body.imageUrl || null,
      linkUrl: body.linkUrl || null,
      active: true,
    },
  });

  return NextResponse.json({ ad }, { status: 201 });
}
