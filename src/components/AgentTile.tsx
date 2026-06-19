'use client';

import { Agent } from '@/lib/data';

interface AgentTileProps {
  agent: Agent;
  size?: number;
}

export default function AgentTile({ agent, size = 48 }: AgentTileProps) {
  const lg = size > 56;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: lg ? 16 : 11,
      background: agent.color,
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      fontSize: lg ? 24 : 15,
      flex: 'none',
      letterSpacing: '0.02em',
    }}>
      {agent.monogram}
    </div>
  );
}
