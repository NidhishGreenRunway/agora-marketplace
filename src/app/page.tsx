'use client';

import { useState } from 'react';
import { Plan, Role, Screen } from '@/lib/data';
import Nav from '@/components/Nav';
import Browse from '@/components/Browse';
import ListingDetail from '@/components/ListingDetail';
import Onboarding from '@/components/Onboarding';
import Checkout from '@/components/Checkout';
import SellerDashboard from '@/components/SellerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('browse');
  const [selectedId, setSelectedId] = useState('aria');
  const [plan, setPlan] = useState<Plan>('monthly');
  const [loggedOut, setLoggedOut] = useState(false);

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAgent = (id: string) => { setSelectedId(id); go('listing'); };
  const startCheckout = (p: Plan) => { setPlan(p); go('checkout'); };
  const finishOnboarding = (role: Role) => { go(role === 'seller' ? 'seller' : 'buyer'); };
  const handleLogout = () => { setLoggedOut(true); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const handleLogin = () => { setLoggedOut(false); go('browse'); };

  if (loggedOut) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#DD6A33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>Agora</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>You've been signed out</div>
        <p style={{ color: '#756B61', fontSize: 16, margin: 0 }}>Thanks for using Agora. See you next time.</p>
        <button
          onClick={handleLogin}
          style={{ marginTop: 8, background: '#DD6A33', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          Sign back in
        </button>
      </div>
    );
  }

  const showNav = screen !== 'onboarding';

  return (
    <>
      {showNav && (
        <Nav
          screen={screen}
          onBrowse={() => go('browse')}
          onSeller={() => go('seller')}
          onBuyer={() => go('buyer')}
          onListAgent={() => go('onboarding')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'browse' && <Browse onOpen={openAgent} />}
      {screen === 'listing' && <ListingDetail agentId={selectedId} onBack={() => go('browse')} onCheckout={startCheckout} />}
      {screen === 'onboarding' && <Onboarding onFinish={finishOnboarding} onSkip={() => go('browse')} />}
      {screen === 'checkout' && <Checkout agentId={selectedId} initialPlan={plan} onBack={() => go('listing')} onConfirm={() => go('buyer')} />}
      {screen === 'seller' && <SellerDashboard onPublish={() => go('onboarding')} />}
      {screen === 'buyer' && <BuyerDashboard onBrowse={() => go('browse')} onOpen={openAgent} />}
    </>
  );
}
