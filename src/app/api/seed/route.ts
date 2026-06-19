import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { SEED_AGENTS, SEED_REVIEWS } from '@/lib/data';
import { randomUUID } from 'crypto';

// POST /api/seed  — idempotent: skips agents that already exist
// Protected by SEED_SECRET env var in production.
export async function POST(req: NextRequest) {
  const secret = process.env.SEED_SECRET;
  if (secret) {
    const auth = req.headers.get('x-seed-secret');
    if (auth !== secret) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  const pipeline = redis.pipeline();
  const created: string[] = [];

  for (const agent of SEED_AGENTS) {
    const id = agent.name.toLowerCase();
    const exists = await redis.exists(`agent:${id}`);
    if (exists) continue;

    pipeline.hset(`agent:${id}`, {
      ...agent,
      id,
      verified: String(agent.verified),
      tags: JSON.stringify(agent.tags),
    });
    pipeline.sadd('agents:ids', id);

    // Attach reviews to each agent
    for (const review of SEED_REVIEWS) {
      pipeline.rpush(`agent:${id}:reviews`, JSON.stringify(review));
    }

    created.push(id);
  }

  await pipeline.exec();

  return NextResponse.json({ seeded: created, skipped: SEED_AGENTS.length - created.length });
}
