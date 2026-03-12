import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = rateLimit(`register:${ip}`, 3, 60000);

  if (!success) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    setAuthCookie(token);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
