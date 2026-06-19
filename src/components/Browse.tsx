'use client';

import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES, Agent, fmt, money } from '@/lib/data';
import AgentTile from './AgentTile';

interface BrowseProps {
  onOpen: (id: string) => void;
}

type Sort = 'popular' | 'rating' | 'priceLow' | 'priceHigh';

export default function Browse({ onOpen }: BrowseProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<Sort>('popular');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (category !== 'All') params.set('category', category);
    if (search) params.set('search', search);
    const res = await fetch(`/api/agents?${params}`);
    if (res.ok) setAgents(await res.json());
    setLoading(false);
  }, [search, category, sort]);

  useEffect(() => {
    const t = setTimeout(fetchAgents, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchAgents, search]);

  const resultLabel = loading
    ? 'Loading…'
    : agents.length + (agents.length === 1 ? ' agent' : ' agents') + (category !== 'All' ? ' in ' + category : ' available');

  return (
    <main className="fade-up">
      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#FBEDE4', color: '#C0532A', fontSize: 13, fontWeight: 600, marginBottom: 22 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3F9D6B', display: 'inline-block' }} />
          {agents.length > 0 ? `${agents.length} agents available` : 'AI agent marketplace'}
        </div>

        <h1 style={{ fontSize: 54, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 800, margin: '0 0 18px', maxWidth: 760 }}>
          Hire an AI agent for any job — by the task, the month, or for keeps.
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: '#756B61', maxWidth: 560, margin: '0 0 32px' }}>
          A trusted marketplace where builders rent and sell production-ready agents. Try before you commit, see real performance, pay only for what works.
        </p>

        <div style={{ display: 'flex', gap: 12, maxWidth: 640, marginBottom: 14 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #E4DCD0', borderRadius: 12, padding: '0 16px', height: 54, boxShadow: '0 1px 2px rgba(43,37,32,0.03)' }}>
            <span style={{ color: '#A89E91', fontSize: 18 }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search support, coding, analysis, sales…"
              style={{ border: 'none', background: 'transparent', fontSize: 16, width: '100%', color: '#2B2520' }}
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as Sort)}
            style={{ height: 54, border: '1px solid #E4DCD0', borderRadius: 12, background: '#fff', padding: '0 16px', fontSize: 15, fontWeight: 500, color: '#2B2520', cursor: 'pointer' }}
          >
            <option value="popular">Most used</option>
            <option value="rating">Top rated</option>
            <option value="priceLow">Price: low to high</option>
            <option value="priceHigh">Price: high to low</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 20 }}>
          {CATEGORIES.map(c => {
            const active = c === category;
            return (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid ' + (active ? '#DD6A33' : '#E4DCD0'), background: active ? '#DD6A33' : '#fff', color: active ? '#fff' : '#5E554B' }}>
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#756B61', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{resultLabel}</h2>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 16, padding: 22, height: 200, opacity: 0.5 + (i % 2) * 0.1 }} />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#A89E91' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🤖</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#756B61', marginBottom: 8 }}>No agents found</div>
            <div style={{ fontSize: 15 }}>Try a different search or category.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {agents.map(a => <AgentCard key={a.id} agent={a} onOpen={onOpen} />)}
          </div>
        )}
      </section>
    </main>
  );
}

function AgentCard({ agent: a, onOpen }: { agent: Agent; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onOpen(a.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', border: '1px solid ' + (hovered ? '#E0D2C2' : '#ECE5DA'), borderRadius: 16, padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14, transition: 'box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease', boxShadow: hovered ? '0 12px 28px rgba(43,37,32,0.10)' : 'none', transform: hovered ? 'translateY(-3px)' : 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
        <AgentTile agent={a} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 700, fontSize: 17 }}>{a.name}</span>
            {a.verified && (
              <span title="Verified seller" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: '#3F9D6B', color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#A89E91' }}>by {a.seller}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.45, color: '#5E554B', minHeight: 42 }}>{a.blurb}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {a.tags.map(t => <span key={t} style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", color: '#867C71', background: '#F4EEE5', padding: '3px 8px', borderRadius: 6 }}>{t}</span>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 13, borderTop: '1px solid #F1EBE2', fontSize: 13, color: '#756B61' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2B2520', fontWeight: 600 }}>
          <span style={{ color: '#E89A2C' }}>★</span>{a.rating.toFixed(1)}
        </span>
        <span style={{ color: '#CFC6B9' }}>·</span>
        <span>{fmt(a.tasks)} tasks</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontWeight: 700, color: '#2B2520' }}>{money(a.monthly)}<span style={{ color: '#A89E91', fontWeight: 400 }}>/mo</span></span>
      </div>
    </div>
  );
}
