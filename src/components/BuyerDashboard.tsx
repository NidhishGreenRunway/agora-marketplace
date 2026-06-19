'use client';

import { useState, useEffect } from 'react';
import { Agent, money } from '@/lib/data';
import AgentTile from './AgentTile';

interface BuyerDashboardProps {
  onBrowse: () => void;
  onOpen: (id: string) => void;
}

const BUYER_DEFS = [
  { id: 'atlas',  plan: 'Monthly', price: money(229) + '/mo', usage: '1,204 tasks this cycle', renews: 'Renews Jul 1' },
  { id: 'quill',  plan: 'Per use', price: '$0.03/task',       usage: '$42.60 this month',      renews: 'Pay as you go' },
  { id: 'ledger', plan: 'Owned',   price: 'Purchased',        usage: 'Full ownership',          renews: 'Lifetime license' },
];

const BUYER_STATS = [
  { label: 'Active agents',   value: '3',           sub: '2 rented · 1 owned' },
  { label: 'Spend this month',value: money(271) + '.60', sub: 'across all agents' },
  { label: 'Tasks run (30d)', value: '1,204',        sub: 'mostly by Atlas' },
];

function badgeStyle(plan: string) {
  const [bg, color] =
    plan === 'Owned'   ? ['#E6F1EA', '#2E7A50'] :
    plan === 'Monthly' ? ['#FBEDE4', '#C0532A'] :
                         ['#EEEAF6', '#6B53A0'];
  return { fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", padding: '4px 9px', borderRadius: 6, background: bg, color };
}

export default function BuyerDashboard({ onBrowse, onOpen }: BuyerDashboardProps) {
  const [agents, setAgents] = useState<Record<string, Agent>>({});

  useEffect(() => {
    Promise.all(BUYER_DEFS.map(d =>
      fetch(`/api/agents/${d.id}`).then(r => r.ok ? r.json() : null)
    )).then(results => {
      const map: Record<string, Agent> = {};
      results.forEach((data: { agent: Agent } | null) => { if (data?.agent) map[data.agent.id] = data.agent; });
      setAgents(map);
    });
  }, []);

  return (
    <main className="fade-up" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 90px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 4px' }}>My agents</h1>
          <p style={{ color: '#756B61', fontSize: 15, margin: 0 }}>Everything you've rented or bought, in one place.</p>
        </div>
        <button onClick={onBrowse} style={{ background: '#fff', border: '1px solid #E4DCD0', borderRadius: 11, padding: '12px 20px', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', color: '#2B2520' }}>
          Browse marketplace
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 34 }}>
        {BUYER_STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 15, padding: 20 }}>
            <div style={{ fontSize: 12.5, color: '#867C71', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6 }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: '#867C71', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {BUYER_DEFS.map(d => {
          const a = agents[d.id];
          if (!a) return <div key={d.id} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 16, padding: 20, height: 200, opacity: 0.5 }} />;
          return (
            <div key={d.id} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AgentTile agent={a} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{a.name}</div>
                  <div style={{ fontSize: 12.5, color: '#A89E91' }}>{a.category}</div>
                </div>
                <span style={badgeStyle(d.plan)}>{d.plan}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13.5, color: '#5E554B', padding: '13px 0', borderTop: '1px solid #F1EBE2', borderBottom: '1px solid #F1EBE2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#867C71' }}>Rate</span><span style={{ fontWeight: 600, color: '#2B2520' }}>{d.price}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#867C71' }}>Usage</span><span style={{ fontWeight: 600, color: '#2B2520' }}>{d.usage}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#867C71' }}>Billing</span><span style={{ fontWeight: 600, color: '#2B2520' }}>{d.renews}</span></div>
              </div>
              <div style={{ display: 'flex', gap: 9 }}>
                <button onClick={() => onOpen(d.id)} style={{ flex: 1, background: '#2B2520', color: '#fff', border: 'none', borderRadius: 10, padding: 11, fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}>Open agent</button>
                <button style={{ background: '#fff', border: '1px solid #E4DCD0', borderRadius: 10, padding: '11px 14px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', color: '#756B61' }}>Manage</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
