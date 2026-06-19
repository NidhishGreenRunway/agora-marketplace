'use client';

import { useState } from 'react';
import { AGENTS, Plan, money } from '@/lib/data';
import AgentTile from './AgentTile';

interface CheckoutProps {
  agentId: string;
  initialPlan: Plan;
  onBack: () => void;
  onConfirm: () => void;
}

export default function Checkout({ agentId, initialPlan, onBack, onConfirm }: CheckoutProps) {
  const agent = AGENTS.find(a => a.id === agentId) ?? AGENTS[0];
  const [plan, setPlan] = useState<Plan>(initialPlan);

  const planDefs = [
    { key: 'peruse' as Plan, label: 'Pay per use', sub: 'Billed monthly for what you run', price: '$' + agent.perUse.toFixed(2) + '/task' },
    { key: 'monthly' as Plan, label: 'Monthly subscription', sub: 'Unlimited tasks · cancel anytime', price: money(agent.monthly) + '/mo' },
    { key: 'buy' as Plan, label: 'Buy outright', sub: 'One-time · full ownership transfer', price: money(agent.buy) },
  ];

  let orderPlanLabel: string, orderLine1Label: string, orderLine1Val: string, fee: string, tax: string, orderDue: string, confirmLabel: string;
  if (plan === 'peruse') {
    orderPlanLabel = 'Pay per use'; orderLine1Label = 'Starting balance'; orderLine1Val = money(20);
    fee = '$0.00'; tax = money(2); orderDue = money(22); confirmLabel = 'Add $20 & activate';
  } else if (plan === 'monthly') {
    orderPlanLabel = 'Monthly subscription'; orderLine1Label = agent.name + ' · monthly'; orderLine1Val = money(agent.monthly);
    fee = '$0.00'; tax = money(Math.round(agent.monthly * 0.08)); orderDue = money(agent.monthly + Math.round(agent.monthly * 0.08)); confirmLabel = 'Start subscription';
  } else {
    orderPlanLabel = 'Buy outright'; orderLine1Label = agent.name + ' · license'; orderLine1Val = money(agent.buy);
    fee = money(Math.round(agent.buy * 0.03)); tax = money(Math.round(agent.buy * 0.08));
    orderDue = money(agent.buy + Math.round(agent.buy * 0.03) + Math.round(agent.buy * 0.08)); confirmLabel = 'Buy & transfer';
  }

  return (
    <main className="fade-up" style={{ maxWidth: 980, margin: '0 auto', padding: '28px 32px 90px' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#867C71', fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '6px 0', marginBottom: 18 }}>
        ← Back to {agent.name}
      </button>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 28px' }}>
        Confirm &amp; hire {agent.name}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
        <div>
          {/* Plan selection */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#867C71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 13 }}>
            1 · Select plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
            {planDefs.map(p => {
              const sel = p.key === plan;
              return (
                <div
                  key={p.key}
                  onClick={() => setPlan(p.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 13, cursor: 'pointer',
                    border: '1px solid ' + (sel ? '#DD6A33' : '#ECE5DA'),
                    background: sel ? '#FEF8F4' : '#fff',
                    boxShadow: sel ? '0 0 0 3px rgba(221,106,51,0.10)' : 'none',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flex: 'none',
                    border: '2px solid ' + (sel ? '#DD6A33' : '#D8CFC2'),
                    background: sel ? 'radial-gradient(circle, #DD6A33 0 5px, #fff 6px)' : '#fff',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{p.label}</div>
                    <div style={{ fontSize: 13, color: '#867C71' }}>{p.sub}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{p.price}</div>
                </div>
              );
            })}
          </div>

          {/* Payment */}
          <div style={{ fontSize: 13, fontWeight: 600, color: '#867C71', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 13 }}>
            2 · Payment
          </div>
          <div style={{ background: '#fff', border: '1px solid #ECE5DA', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Card number</label>
              <input
                placeholder="4242 4242 4242 4242"
                style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Expiry</label>
                <input placeholder="12 / 28" style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>CVC</label>
                <input placeholder="123" style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <aside style={{ position: 'sticky', top: 88, background: '#fff', border: '1px solid #ECE5DA', borderRadius: 18, padding: 22, boxShadow: '0 8px 30px rgba(43,37,32,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid #F1EBE2', marginBottom: 16 }}>
            <AgentTile agent={agent} size={40} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{agent.name}</div>
              <div style={{ fontSize: 13, color: '#867C71' }}>{orderPlanLabel}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#5E554B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{orderLine1Label}</span>
              <span style={{ fontWeight: 600, color: '#2B2520' }}>{orderLine1Val}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Platform fee</span>
              <span style={{ fontWeight: 600, color: '#2B2520' }}>{fee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span style={{ fontWeight: 600, color: '#2B2520' }}>{tax}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1EBE2' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Due today</span>
            <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{orderDue}</span>
          </div>
          <button
            onClick={onConfirm}
            style={{ width: '100%', marginTop: 18, background: '#DD6A33', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}
          >
            {confirmLabel}
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#A89E91', marginTop: 11 }}>🔒 Encrypted · billed by Agora</div>
        </aside>
      </div>
    </main>
  );
}
