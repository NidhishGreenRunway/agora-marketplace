'use client';

import { useState, useEffect } from 'react';
import { Plan, Role, Screen } from '@/lib/data';
import Nav from '@/components/Nav';
import Browse from '@/components/Browse';
import ListingDetail from '@/components/ListingDetail';
import Onboarding from '@/components/Onboarding';
import Checkout from '@/components/Checkout';
import SellerDashboard from '@/components/SellerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import Login from '@/components/Login';

interface User { id: string; name: string; email: string; }

export default function Home() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading
  const [screen, setScreen] = useState<Screen>('browse');
  const [selectedId, setSelectedId] = useState('');
  const [plan, setPlan] = useState<Plan>('monthly');

  // Restore session from cookie on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : { user: null })
      .then(data => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  const go = (s: Screen) => { setScreen(s); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const openAgent = (id: string) => { setSelectedId(id); go('listing'); };
  const startCheckout = (p: Plan) => { setPlan(p); go('checkout'); };
  const finishOnboarding = (role: Role) => { go(role === 'seller' ? 'seller' : 'buyer'); };

  const handleLogin = (name: string, email: string, id = '') => {
    setUser({ id, name, email });
    go('browse');
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Still checking session
  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#DD6A33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', color: '#A89E91' }}>Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const showNav = screen !== 'onboarding';

  return (
    <>
      {showNav && (
        <Nav
          screen={screen}
          user={user}
          initials={initials}
          onBrowse={() => go('browse')}
          onSeller={() => go('seller')}
          onBuyer={() => go('buyer')}
          onListAgent={() => go('onboarding')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'browse' && <Browse onOpen={openAgent} />}
      {screen === 'listing' && selectedId && <ListingDetail agentId={selectedId} onBack={() => go('browse')} onCheckout={startCheckout} />}
      {screen === 'onboarding' && <Onboarding onFinish={finishOnboarding} onSkip={() => go('browse')} />}
      {screen === 'checkout' && selectedId && <Checkout agentId={selectedId} initialPlan={plan} onBack={() => go('listing')} onConfirm={() => go('buyer')} />}
      {screen === 'seller' && <SellerDashboard onPublish={() => go('onboarding')} />}
      {screen === 'buyer' && <BuyerDashboard onBrowse={() => go('browse')} onOpen={openAgent} />}
    </>
  );
}
