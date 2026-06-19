'use client';

import { useState, useRef, useEffect } from 'react';
import { Screen } from '@/lib/data';

interface NavProps {
  screen: Screen;
  user: { name: string; email: string };
  initials: string;
  onBrowse: () => void;
  onSeller: () => void;
  onBuyer: () => void;
  onListAgent: () => void;
  onLogout: () => void;
}

export default function Nav({ screen, user, initials, onBrowse, onSeller, onBuyer, onListAgent, onLogout }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: '9px', fontSize: '15px', fontWeight: 500,
        cursor: 'pointer', border: 'none',
        color: active ? '#2B2520' : '#867C71',
        background: active ? '#F3EADF' : 'transparent',
      }}
    >
      {label}
    </button>
  );

  const isBrowseActive = screen === 'browse' || screen === 'listing' || screen === 'checkout';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,247,242,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #ECE5DA',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
        height: 64, display: 'flex', alignItems: 'center', gap: 28,
      }}>
        <div onClick={onBrowse} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', flex: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#DD6A33',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16,
          }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em' }}>Agora</span>
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {navBtn('Browse', isBrowseActive, onBrowse)}
          {navBtn('For sellers', screen === 'seller', onSeller)}
          {navBtn('My agents', screen === 'buyer', onBuyer)}
        </nav>

        <div style={{ flex: 1 }} />

        <button
          onClick={onListAgent}
          style={{
            padding: '9px 16px', borderRadius: 9, border: '1px solid #ECE5DA',
            background: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#2B2520',
          }}
        >
          List your agent
        </button>

        {/* Avatar + dropdown */}
        <div ref={menuRef} style={{ position: 'relative', flex: 'none' }}>
          <div
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 36, height: 36, borderRadius: '50%', background: '#2B2520', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              outline: menuOpen ? '2px solid #DD6A33' : 'none',
              outlineOffset: 2,
            }}
          >
            {initials}
          </div>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              background: '#fff', border: '1px solid #ECE5DA', borderRadius: 13,
              boxShadow: '0 8px 24px rgba(43,37,32,0.10)',
              minWidth: 180, overflow: 'hidden', zIndex: 100,
            }}>
              {/* User info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1EBE2' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                <div style={{ fontSize: 12.5, color: '#A89E91', marginTop: 2 }}>{user.email}</div>
              </div>

              {/* Menu items */}
              {[
                { label: 'My agents', onClick: () => { onBuyer(); setMenuOpen(false); } },
                { label: 'Seller dashboard', onClick: () => { onSeller(); setMenuOpen(false); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '11px 16px', background: 'none', border: 'none',
                    fontSize: 14, color: '#2B2520', cursor: 'pointer',
                    borderBottom: '1px solid #F4EEE5',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAF7F2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '11px 16px', background: 'none', border: 'none',
                  fontSize: 14, color: '#C0532A', cursor: 'pointer', fontWeight: 600,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF8F4')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
