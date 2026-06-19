'use client';

import { Screen } from '@/lib/data';

interface NavProps {
  screen: Screen;
  onBrowse: () => void;
  onSeller: () => void;
  onBuyer: () => void;
  onListAgent: () => void;
}

export default function Nav({ screen, onBrowse, onSeller, onBuyer, onListAgent }: NavProps) {
  const navBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: '9px',
        fontSize: '15px',
        fontWeight: 500,
        cursor: 'pointer',
        border: 'none',
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

        <div
          onClick={onBuyer}
          style={{
            width: 36, height: 36, borderRadius: '50%', background: '#2B2520', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, cursor: 'pointer', flex: 'none',
          }}
        >
          JD
        </div>
      </div>
    </header>
  );
}
