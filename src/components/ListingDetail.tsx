'use client';

import { useState } from 'react';
import { AGENTS, REVIEWS, Plan, fmt, money } from '@/lib/data';
import AgentTile from './AgentTile';

interface ListingDetailProps {
  agentId: string;
  onBack: () => void;
  onCheckout: (plan: Plan) => void;
}

interface DemoMsg { role: 'you' | 'agent'; text: string; }

export default function ListingDetail({ agentId, onBack, onCheckout }: ListingDetailProps) {
  const agent = AGENTS.find(a => a.id === agentId) ?? AGENTS[0];
  const [selectedPlan, setSelectedPlan] = useState<Plan>('monthly');
  const [demoMsgs, setDemoMsgs] = useState<DemoMsg[]>([]);
  const [demoInput, setDemoInput] = useState('');

  const sendDemo = () => {
    const t = demoInput.trim();
    if (!t) return;
    const reply = `On it. I'd tackle "${t.length > 54 ? t.slice(0, 54) + '…' : t}" in three steps: pull the relevant context, draft a first pass, then check it against your guidelines before handing it back. Want me to run it for real?`;
    setDemoMsgs(msgs => [...msgs, { role: 'you', text: t }]);
    setDemoInput('');
    setTimeout(() => setDemoMsgs(msgs => [...msgs, { role: 'agent', text: reply }]), 650);
  };

  const planDefs = [
    { key: 'peruse' as Plan, label: 'Pay per use', price: '$' + agent.perUse.toFixed(2), sub: 'per task · no commitment', cta: 'Rent per use', badge: '' },
    { key: 'monthly' as Plan, label: 'Monthly', price: money(agent.monthly), sub: '/mo · unlimited tasks', cta: 'Start subscription', badge: 'POPULAR' },
    { key: 'buy' as Plan, label: 'Buy outright', price: money(agent.buy), sub: 'one-time · full ownership transfer', cta: 'Buy & transfer', badge: '' },
  ];

  const stats = [
    { value: agent.rating.toFixed(1) + ' ★', label: 'avg rating' },
    { value: fmt(agent.tasks), label: 'tasks completed' },
    { value: '99.4%', label: 'success rate' },
    { value: '1.8s', label: 'median latency' },
  ];

  return (
    <main className="fade-up" style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px 90px' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#867C71', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '6px 0', marginBottom: 18 }}
      >
        ← Back to marketplace
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
        {/* Left */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 26 }}>
            <AgentTile agent={agent} size={72} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{agent.name}</h1>
                {agent.verified && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: '#E6F1EA', color: '#2E7A50', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
                  }}>✓ Verified seller</span>
                )}
              </div>
              <div style={{ fontSize: 15, color: '#867C71', marginTop: 4 }}>{agent.category} · by {agent.seller}</div>
            </div>
          </div>

          <p style={{ fontSize: 18, lineHeight: 1.55, color: '#4A423A', margin: '0 0 28px', maxWidth: 640 }}>{agent.blurb}</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 34 }}>
            {stats.map(st => (
              <div key={st.label} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 13, padding: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{st.value}</div>
                <div style={{ fontSize: 12.5, color: '#867C71', marginTop: 3 }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Live demo */}
          <div style={{ marginBottom: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Try it live</h3>
              <span style={{
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                background: '#FBEDE4', color: '#C0532A', padding: '2px 8px', borderRadius: 6,
              }}>FREE DEMO</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: 18, minHeight: 150, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {demoMsgs.length === 0 && (
                  <div style={{ color: '#A89E91', fontSize: 14.5, textAlign: 'center', margin: 'auto', maxWidth: 300, lineHeight: 1.5 }}>
                    Send a message to see how {agent.name} responds. No signup needed.
                  </div>
                )}
                {demoMsgs.map((m, i) => {
                  const mine = m.role === 'you';
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '82%', padding: '11px 14px',
                        borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        fontSize: 14.5, lineHeight: 1.45,
                        background: mine ? '#2B2520' : '#F4EEE5',
                        color: mine ? '#fff' : '#3A332C',
                      }}>{m.text}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 10, padding: 13, borderTop: '1px solid #F1EBE2', background: '#FCFAF6' }}>
                <input
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendDemo()}
                  placeholder="Ask the agent to do something…"
                  style={{ flex: 1, border: '1px solid #E4DCD0', borderRadius: 10, padding: '11px 14px', fontSize: 14.5, background: '#fff' }}
                />
                <button
                  onClick={sendDemo}
                  style={{ background: '#2B2520', color: '#fff', border: 'none', borderRadius: 10, padding: '0 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>
              Reviews <span style={{ color: '#A89E91', fontWeight: 500 }}>({agent.reviews.toLocaleString()})</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {REVIEWS.map(r => (
                <div key={r.name} style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 13, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', background: '#F0E6D8', color: '#8A7B66',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                    }}>{r.initials}</div>
                    <span style={{ fontWeight: 600, fontSize: 14.5 }}>{r.name}</span>
                    <span style={{ color: '#E89A2C', fontSize: 13 }}>{r.stars}</span>
                    <span style={{ color: '#B6ADA0', fontSize: 12.5, marginLeft: 'auto' }}>{r.when}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: '#5E554B' }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: pricing */}
        <aside style={{ position: 'sticky', top: 88 }}>
          <div style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 18, padding: 22, boxShadow: '0 8px 30px rgba(43,37,32,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#867C71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Choose how to hire
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {planDefs.map(p => {
                const sel = p.key === selectedPlan;
                return (
                  <div
                    key={p.key}
                    style={{
                      border: '1px solid ' + (sel ? '#DD6A33' : '#ECE5DA'),
                      background: sel ? '#FEF8F4' : '#fff',
                      borderRadius: 13, padding: 15, position: 'relative',
                      boxShadow: sel ? '0 0 0 3px rgba(221,106,51,0.10)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</span>
                      {p.badge && (
                        <span style={{
                          fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
                          background: '#DD6A33', color: '#fff', padding: '2px 7px', borderRadius: 5,
                        }}>{p.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{p.price}</div>
                    <div style={{ fontSize: 12.5, color: '#867C71', marginTop: 2 }}>{p.sub}</div>
                    <button
                      onClick={() => { setSelectedPlan(p.key); onCheckout(p.key); }}
                      style={{
                        width: '100%', marginTop: 12, borderRadius: 10, padding: 11,
                        fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none',
                        background: sel ? '#DD6A33' : '#2B2520', color: '#fff',
                      }}
                    >
                      {p.cta}
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, paddingTop: 16,
              borderTop: '1px solid #F1EBE2', fontSize: 12.5, color: '#867C71', lineHeight: 1.45,
            }}>
              <span style={{ color: '#3F9D6B', fontSize: 15 }}>✓</span>
              Money-back guarantee on the first 100 tasks. Cancel anytime.
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
