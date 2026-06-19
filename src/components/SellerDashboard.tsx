'use client';

import { AGENTS, money } from '@/lib/data';
import AgentTile from './AgentTile';

interface SellerDashboardProps {
  onPublish: () => void;
}

const MY_IDS = ['aria', 'forge', 'scout'];
const SELLER_META: Record<string, { renters: number; mrr: number; tasks: string }> = {
  aria: { renters: 142, mrr: 18420, tasks: '2.1M' },
  forge: { renters: 88, mrr: 24560, tasks: '540K' },
  scout: { renters: 54, mrr: 9180, tasks: '140K' },
};

const STATS = [
  { label: 'Monthly revenue', value: money(52160), delta: '▲ 14% vs last mo' },
  { label: 'Active renters', value: '284', delta: '▲ 22 this week' },
  { label: 'Tasks run (30d)', value: '612K', delta: '▲ 8% vs last mo' },
  { label: 'Avg rating', value: '4.8 ★', delta: 'across 3 agents' },
];

export default function SellerDashboard({ onPublish }: SellerDashboardProps) {
  const myAgents = MY_IDS.map(id => AGENTS.find(a => a.id === id)!);

  return (
    <main className="fade-up" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 90px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 4px' }}>Seller dashboard</h1>
          <p style={{ color: '#756B61', fontSize: 15, margin: 0 }}>Welcome back, Jordan — here's how your agents are doing.</p>
        </div>
        <button
          onClick={onPublish}
          style={{ background: '#DD6A33', color: '#fff', border: 'none', borderRadius: 11, padding: '12px 20px', fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
        >
          + Publish new agent
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 34 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 15, padding: 20 }}>
            <div style={{ fontSize: 12.5, color: '#867C71', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: '#3F9D6B', fontWeight: 600, marginTop: 4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 0.8fr', gap: 16,
          padding: '14px 22px', background: '#FCFAF6', borderBottom: '1px solid #F1EBE2',
          fontSize: 12, fontWeight: 600, color: '#867C71', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <span>Agent</span><span>Active renters</span><span>Tasks run</span><span>Monthly revenue</span><span>Status</span>
        </div>
        {myAgents.map(a => {
          const meta = SELLER_META[a.id];
          return (
            <div key={a.id} style={{
              display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr 0.8fr', gap: 16,
              padding: '18px 22px', borderBottom: '1px solid #F4EEE5', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AgentTile agent={a} size={40} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                  <div style={{ fontSize: 12.5, color: '#A89E91' }}>{a.category}</div>
                </div>
              </div>
              <span style={{ fontWeight: 600 }}>{meta.renters}</span>
              <span style={{ color: '#5E554B' }}>{meta.tasks}</span>
              <span style={{ fontWeight: 700 }}>{money(meta.mrr)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2E7A50', fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3F9D6B', display: 'inline-block' }} />
                Live
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
