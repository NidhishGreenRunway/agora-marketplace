'use client';

import { useState } from 'react';
import { Role } from '@/lib/data';

interface OnboardingProps {
  onFinish: (role: Role) => void;
  onSkip: () => void;
}

export default function Onboarding({ onFinish, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');

  const next = () => {
    if (step === 0 && !role) return;
    if (step >= 2) { onFinish(role); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const roleDefs = [
    { key: 'buyer' as Role, icon: '🛒', title: 'I want to hire agents', desc: 'Browse, try, rent or buy agents for your team.' },
    { key: 'seller' as Role, icon: '🚀', title: 'I want to sell agents', desc: 'List your agents, set pricing, and earn.' },
    { key: 'both' as Role, icon: '⇄', title: 'Both', desc: 'Do everything — switch modes anytime.' },
  ];

  const sellerMode = role === 'seller' || role === 'both';
  const step2Title = sellerMode ? 'Set up payouts & verification' : 'Tell us what you need';
  const step2Sub = sellerMode
    ? 'Buyers trust verified sellers — these unlock the badge and payments.'
    : "We'll tune your recommendations to match.";
  const step2Items = sellerMode
    ? [
        { icon: '🏦', title: 'Connect a payout account', desc: 'Stripe or bank transfer — paid out weekly.' },
        { icon: '🪪', title: 'Verify your identity', desc: 'Unlocks the green Verified seller badge.' },
        { icon: '📄', title: 'Accept the seller terms', desc: 'Revenue share is a flat 12% per transaction.' },
      ]
    : [
        { icon: '🎯', title: 'Pick your use cases', desc: 'Support, coding, analysis, sales, and more.' },
        { icon: '🔔', title: 'Get matched', desc: "We'll surface agents that fit your stack." },
        { icon: '💳', title: 'Add a payment method', desc: 'Only charged when you actually hire.' },
      ];

  const progressPct = ((step + 1) / 3) * 100;
  const canContinue = step !== 0 || !!role;

  return (
    <main className="fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal header */}
      <div style={{ padding: '22px 32px', display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#DD6A33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>A</div>
        <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Agora</span>
        <button onClick={onSkip} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#867C71', fontSize: 14, cursor: 'pointer' }}>
          Skip for now
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '30px 32px 80px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          {/* Progress bar */}
          <div style={{ height: 5, background: '#ECE5DA', borderRadius: 99, marginBottom: 34, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: progressPct + '%', background: '#DD6A33', borderRadius: 99, transition: 'width 0.35s ease' }} />
          </div>

          {/* Step 0: Role */}
          {step === 0 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C0532A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Step 1 of 3</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>How will you use Agora?</h1>
              <p style={{ fontSize: 16, color: '#756B61', margin: '0 0 28px' }}>You can do both later — this just sets up your home screen.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {roleDefs.map(r => {
                  const sel = r.key === role;
                  return (
                    <div
                      key={r.key}
                      onClick={() => setRole(r.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 15, padding: 18, borderRadius: 14, cursor: 'pointer',
                        border: '1px solid ' + (sel ? '#DD6A33' : '#E4DCD0'),
                        background: sel ? '#FEF8F4' : '#fff',
                        boxShadow: sel ? '0 0 0 3px rgba(221,106,51,0.10)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 26 }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16.5 }}>{r.title}</div>
                        <div style={{ fontSize: 14, color: '#756B61', marginTop: 2 }}>{r.desc}</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flex: 'none',
                        border: '2px solid ' + (sel ? '#DD6A33' : '#D8CFC2'),
                        background: sel ? 'radial-gradient(circle, #DD6A33 0 5px, #fff 6px)' : '#fff',
                      }} />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C0532A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Step 2 of 3</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>Create your profile</h1>
              <p style={{ fontSize: 16, color: '#756B61', margin: '0 0 28px' }}>This is what buyers and sellers see when they work with you.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Jordan Diaz" style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>
                    Company / handle <span style={{ color: '#B6ADA0', fontWeight: 400 }}>optional</span>
                  </label>
                  <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Labs" style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Work email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jordan@acme.com" style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#fff' }} />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Verify / payout */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C0532A', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Step 3 of 3</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 8px' }}>{step2Title}</h1>
              <p style={{ fontSize: 16, color: '#756B61', margin: '0 0 28px' }}>{step2Sub}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {step2Items.map(it => (
                  <div key={it.title} style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#fff', border: '1px solid #ECE5DA', borderRadius: 13, padding: 16 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: '#FBEDE4', color: '#C0532A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: 'none' }}>{it.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{it.title}</div>
                      <div style={{ fontSize: 13.5, color: '#867C71' }}>{it.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 34 }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: '14px 22px', borderRadius: 11, border: '1px solid #E4DCD0', background: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: 1, padding: 14, borderRadius: 11, border: 'none',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
                background: canContinue ? '#DD6A33' : '#E7C7B4', color: '#fff',
              }}
            >
              {step >= 2 ? 'Finish & enter Agora' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
