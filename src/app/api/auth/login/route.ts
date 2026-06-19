import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { redis } from '@/lib/redis';
import { createSessionToken, SESSION_COOKIE, COOKIE_OPTIONS } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const key = `user:${email.toLowerCase()}`;
    const user = await redis.hgetall<{ id: string; name: string; email: string; passwordHash: string }>(key);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createSessionToken({ id: user.id, name: user.name, email: user.email });
    const res = NextResponse.json({ id: user.id, name: user.name, email: user.email });
    res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error('login error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
