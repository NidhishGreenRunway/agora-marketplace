import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Agent } from '@/lib/data';

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

export async function GET(req: NextRequest) {
  try {
    const ids = await redis.smembers('agents:ids');
    if (!ids.length) return NextResponse.json([]);

    const pipeline = redis.pipeline();
    ids.forEach(id => pipeline.hgetall(`agent:${id}`));
    const results = await pipeline.exec<Record<string, unknown>[]>();

    const agents = results
      .filter(Boolean)
      .map(raw => parseAgent(raw as Record<string, unknown>));

    // Apply filters from query params
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const sort = searchParams.get('sort') ?? 'popular';

    let list = agents;
    if (category && category !== 'All') list = list.filter(a => a.category === category);
    if (search) list = list.filter(a =>
      (a.name + ' ' + a.blurb + ' ' + a.category + ' ' + a.tags.join(' ')).toLowerCase().includes(search)
    );

    if (sort === 'popular') list.sort((a, b) => b.tasks - a.tasks);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'priceLow') list.sort((a, b) => a.monthly - b.monthly);
    else if (sort === 'priceHigh') list.sort((a, b) => b.monthly - a.monthly);

    return NextResponse.json(list);
  } catch (err) {
    console.error('agents GET error', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
