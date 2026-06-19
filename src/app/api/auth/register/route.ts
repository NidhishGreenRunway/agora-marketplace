import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { redis } from '@/lib/redis';
import { createSessionToken, SESSION_COOKIE, COOKIE_OPTIONS } from '@/lib/session';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }

    const key = `user:${email.toLowerCase()}`;
    const existing = await redis.exists(key);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = randomUUID();

    await redis.hset(key, { id, name: name.trim(), email: email.toLowerCase(), passwordHash });

    const token = await createSessionToken({ id, name: name.trim(), email: email.toLowerCase() });
    const res = NextResponse.json({ id, name: name.trim(), email: email.toLowerCase() });
    res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error('register error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
