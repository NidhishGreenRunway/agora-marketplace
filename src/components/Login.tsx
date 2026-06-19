'use client';

import { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

type Mode = 'login' | 'register';

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    if (mode === 'register' && !name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    if (mode === 'register' && password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }
    onLogin(data.name, data.email);
  };

  const toggle = () => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <div className="fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 36 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#DD6A33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>A</div>
        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>Agora</span>
      </div>

      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #ECE5DA', borderRadius: 20, padding: '36px 32px', boxShadow: '0 8px 32px rgba(43,37,32,0.07)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 6px' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ fontSize: 15, color: '#756B61', margin: '0 0 28px' }}>
          {mode === 'login' ? 'Sign in to your Agora account.' : 'Join the AI agent marketplace.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Jordan Diaz"
                style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#FCFAF6' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="you@example.com"
              style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#FCFAF6' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              style={{ width: '100%', border: '1px solid #E4DCD0', borderRadius: 11, padding: '13px 15px', fontSize: 15, background: '#FCFAF6' }}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13.5, color: '#C0532A', background: '#FEF0E8', border: '1px solid #F6D0B8', borderRadius: 9, padding: '10px 14px' }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{ marginTop: 4, width: '100%', background: loading ? '#E7C7B4' : '#DD6A33', color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontWeight: 700, fontSize: 15.5, cursor: loading ? 'default' : 'pointer', transition: 'background 0.15s' }}
          >
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F1EBE2', textAlign: 'center', fontSize: 13.5, color: '#867C71' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={toggle} style={{ color: '#DD6A33', fontWeight: 600, cursor: 'pointer' }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
