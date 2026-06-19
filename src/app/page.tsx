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

  const go = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openAgent = (id: string) => {
    setSelectedId(id);
    go('listing');
  };

  const startCheckout = (p: Plan) => {
    setPlan(p);
    go('checkout');
  };

  const finishOnboarding = (role: Role) => {
    go(role === 'seller' ? 'seller' : 'buyer');
  };

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
        />
      )}

      {screen === 'browse' && (
        <Browse onOpen={openAgent} />
      )}

      {screen === 'listing' && (
        <ListingDetail
          agentId={selectedId}
          onBack={() => go('browse')}
          onCheckout={startCheckout}
        />
      )}

      {screen === 'onboarding' && (
        <Onboarding
          onFinish={finishOnboarding}
          onSkip={() => go('browse')}
        />
      )}

      {screen === 'checkout' && (
        <Checkout
          agentId={selectedId}
          initialPlan={plan}
          onBack={() => go('listing')}
          onConfirm={() => go('buyer')}
        />
      )}

      {screen === 'seller' && (
        <SellerDashboard onPublish={() => go('onboarding')} />
      )}

      {screen === 'buyer' && (
        <BuyerDashboard onBrowse={() => go('browse')} onOpen={openAgent} />
      )}
    </>
  );
}
