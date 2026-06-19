'use client';

import { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      onLogin(name, email.trim());
    }, 700);
  };

  return (
    <div className="fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 36 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#DD6A33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>A</div>
        <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>Agora</span>
      </div>

      <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #ECE5DA', borderRadius: 20, padding: '36px 32px', boxShadow: '0 8px 32px rgba(43,37,32,0.07)' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 6px' }}>Welcome back</h1>
        <p style={{ fontSize: 15, color: '#756B61', margin: '0 0 28px' }}>Sign in to your Agora account.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              placeholder="••••••••"
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
            style={{
              marginTop: 4, width: '100%', background: loading ? '#E7C7B4' : '#DD6A33',
              color: '#fff', border: 'none', borderRadius: 12, padding: '14px',
              fontWeight: 700, fontSize: 15.5, cursor: loading ? 'default' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F1EBE2', textAlign: 'center', fontSize: 13.5, color: '#867C71' }}>
          Don't have an account?{' '}
          <span
            onClick={() => onLogin('New User', 'newuser@example.com')}
            style={{ color: '#DD6A33', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
