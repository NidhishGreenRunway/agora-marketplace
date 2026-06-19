import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Agent, Review } from '@/lib/data';

function parseAgent(raw: Record<string, unknown>): Agent {
  return {
    id: raw.id as string,
    name: raw.name as string,
    monogram: raw.monogram as string,
    color: raw.color as string,
    category: raw.category as string,
    seller: raw.seller as string,
    verified: raw.verified === 'true' || raw.verified === true,
    rating: Number(raw.rating),
    reviews: Number(raw.reviews),
    tasks: Number(raw.tasks),
    perUse: Number(raw.perUse),
    monthly: Number(raw.monthly),
    buy: Number(raw.buy),
    tags: typeof raw.tags === 'string' ? JSON.parse(raw.tags) : raw.tags,
    blurb: raw.blurb as string,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [raw, reviewsRaw] = await Promise.all([
      redis.hgetall<Record<string, unknown>>(`agent:${id}`),
      redis.lrange<string>(`agent:${id}:reviews`, 0, -1),
    ]);

    if (!raw) return NextResponse.json({ error: 'Agent not found.' }, { status: 404 });

    const agent = parseAgent(raw);
    const agentReviews: Review[] = reviewsRaw.map(r => JSON.parse(r));

    return NextResponse.json({ agent, reviews: agentReviews });
  } catch (err) {
    console.error('agent GET error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
