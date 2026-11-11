import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw, 
  ExternalLink, 
  Globe, 
  Radio, 
  Cpu, 
  Flame, 
  ArrowUpRight,
  Code2
} from 'lucide-react';

// RPC endpoints
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const BASE_RPC = 'https://mainnet.base.org';
const ETH_RPC = 'https://eth.llamarpc.com';

const INITIAL_WHALES = [
  {
    id: 'tx_1',
    chain: 'Solana',
    amount: '45,000 SOL',
    usd: '$8,235,000',
    from: '7xKX...4mPQ',
    to: 'Binance Cold Storage (8sYz...9kLm)',
    time: 'Just now',
    type: 'Whale Transfer',
    hash: '5kLm...89aX'
  },
  {
    id: 'tx_2',
    chain: 'Ethereum',
    amount: '1,450 ETH',
    usd: '$4,640,000',
    from: '0x3841...98ae',
    to: 'Uniswap V3 Vault',
    time: '2 mins ago',
    type: 'Liquidity Injection',
    hash: '0x992f...1a4c'
  },
  {
    id: 'tx_3',
    chain: 'Base',
    amount: '850,000 USDC',
    usd: '$850,000',
    from: '0x712c...9b42',
    to: 'Aerodrome Slipstream DEX',
    time: '5 mins ago',
    type: 'Swap Arbitrage',
    hash: '0x43ba...77d1'
  },
  {
    id: 'tx_4',
    chain: 'Solana',
    amount: '120,000 JUP',
    usd: '$144,000',
    from: 'Jup6...3k1a',
    to: 'Kraken Exchange Router',
    time: '8 mins ago',
    type: 'Whale Transfer',
    hash: '3zQp...90eT'
  }
];

export default function App() {
  const [selectedChain, setSelectedChain] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  
  const [telemetry, setTelemetry] = useState({
    solana: { slot: 310860000, tps: 2850, status: 'Optimal', blockTime: '~400ms' },
    base: { block: 22160000, gas: '0.0028', status: 'Healthy', blockTime: '2.0s' },
    ethereum: { block: 21185000, gas: '14.20', status: 'Secured', blockTime: '12.0s' }
  });

  const [whaleAlerts, setWhaleAlerts] = useState(INITIAL_WHALES);

  // Fetch real live blockchain telemetry
  const fetchLiveData = async () => {
    setIsRefreshing(true);
    
    // 1. Fetch Solana
    try {
      const res = await fetch(SOLANA_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getRecentPerformanceSamples', params: [1] })
      });
      const data = await res.json();
      if (data.result && data.result[0]) {
        const s = data.result[0];
        const tps = Math.round(s.numTransactions / s.samplePeriodSecs);
        setTelemetry(prev => ({
          ...prev,
          solana: {
            ...prev.solana,
            slot: s.slot,
            tps: tps > 0 ? tps : 2840
          }
        }));
      }
    } catch (e) {
      console.warn('Solana RPC fallback:', e);
    }

    // 2. Fetch Base L2
    try {
      const res = await fetch(BASE_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_blockNumber', params: [] })
      });
      const data = await res.json();
      if (data.result) {
        const b = parseInt(data.result, 16);
        setTelemetry(prev => ({
          ...prev,
          base: { ...prev.base, block: b }
        }));
      }
    } catch (e) {
      console.warn('Base RPC fallback:', e);
    }

    // 3. Fetch Ethereum
    try {
      const res = await fetch(ETH_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'eth_blockNumber', params: [] })
      });
      const data = await res.json();
      if (data.result) {
        const b = parseInt(data.result, 16);
        setTelemetry(prev => ({
          ...prev,
          ethereum: { ...prev.ethereum, block: b }
        }));
      }
    } catch (e) {
      console.warn('ETH RPC fallback:', e);
    }

    setLastUpdated(new Date().toLocaleTimeString());
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredWhales = selectedChain === 'all' 
    ? whaleAlerts 
    : whaleAlerts.filter(w => w.chain.toLowerCase() === selectedChain.toLowerCase());

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Header */}
      <motion.header 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '18px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #14f195, #9945ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(20, 241, 149, 0.35)'
            }}
          >
            <Zap size={22} color="#000" />
          </motion.div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Multi-Chain Telemetry Engine
              </h1>
              <span style={{ 
                fontSize: '11px', 
                background: 'rgba(20, 241, 149, 0.15)', 
                color: '#14f195', 
                padding: '2px 8px', 
                borderRadius: '6px', 
                fontWeight: 600,
                border: '1px solid rgba(20, 241, 149, 0.3)'
              }}>
                v2.4 LIVE
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8' }} className="mono">
              Designed by Toti Putra Pratama • On-Chain Data & Telemetry Specialist
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLiveData}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Poll RPC</span>
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(20, 241, 149, 0.08)',
            border: '1px solid rgba(20, 241, 149, 0.25)',
            padding: '7px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            color: '#14f195'
          }} className="mono">
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#14f195',
              boxShadow: '0 0 10px #14f195'
            }} />
            <span>SYNCED ({lastUpdated})</span>
          </div>
        </div>
      </motion.header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px', flex: 1, width: '100%' }}>
        
        {/* Intro Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20,241,149,0.08) 0%, rgba(153,69,255,0.08) 50%, rgba(0,82,255,0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 700 }} className="mono">
              <Radio size={16} />
              <span>DISTRIBUTED NETWORK TELEMETRY</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', letterSpacing: '-0.5px' }}>
              Real-Time Node Telemetry & Whale Liquidity Radar
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '680px', marginTop: '6px', lineHeight: 1.6 }}>
              Translating telecommunications network monitoring methodologies into high-throughput decentralized protocols. Polling public RPC nodes across Solana, Base, and Ethereum mainnets.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="https://portofolio-toti.vercel.app" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              <Globe size={15} />
              <span>Portfolio</span>
              <ArrowUpRight size={14} />
            </motion.a>

            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="https://github.com/Toti-417" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              <Code2 size={15} />
              <span>GitHub</span>
              <ArrowUpRight size={14} />
            </motion.a>
          </div>
        </motion.div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {['all', 'solana', 'base', 'ethereum'].map(chain => (
              <motion.button
                key={chain}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChain(chain)}
                style={{
                  background: selectedChain === chain ? '#f8fafc' : 'rgba(255,255,255,0.04)',
                  color: selectedChain === chain ? '#07090e' : '#94a3b8',
                  border: '1px solid',
                  borderColor: selectedChain === chain ? '#fff' : 'rgba(255,255,255,0.08)',
                  padding: '7px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {chain === 'all' ? 'All Networks' : chain}
              </motion.button>
            ))}
          </div>

          <div style={{ fontSize: '13px', color: '#94a3b8' }} className="mono">
            Active Cluster Feeds: <span style={{ color: '#14f195', fontWeight: 700 }}>3 Nodes</span>
          </div>
        </div>

        {/* 3 Telemetry Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          
          {/* Solana Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-panel"
            style={{ padding: '26px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(20, 241, 149, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} color="#14f195" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Solana Mainnet</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }} className="mono">PoH / Tower BFT</p>
                </div>
              </div>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: 'rgba(20,241,149,0.12)', color: '#14f195', fontWeight: 700, border: '1px solid rgba(20,241,149,0.25)' }} className="mono">
                L1 SPEED
              </span>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }} className="mono">NETWORK THROUGHPUT (TPS)</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#14f195', letterSpacing: '-1.5px' }} className="mono">
                {telemetry.solana.tps.toLocaleString()}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Latest Slot Height</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.solana.slot.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Block Interval</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.solana.blockTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Node Consensus State</span>
                <span className="mono" style={{ color: '#14f195', fontWeight: 700 }}>SYNCHRONIZED (100%)</span>
              </div>
            </div>
          </motion.div>

          {/* Base Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-panel"
            style={{ padding: '26px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(0, 82, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={18} color="#0052ff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Base (Coinbase L2)</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }} className="mono">OP Stack Rollup</p>
                </div>
              </div>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: 'rgba(0,82,255,0.12)', color: '#60a5fa', fontWeight: 700, border: '1px solid rgba(0,82,255,0.25)' }} className="mono">
                L2 ROLLUP
              </span>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }} className="mono">GAS PRICE (GWEI)</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#60a5fa', letterSpacing: '-1.5px' }} className="mono">
                {telemetry.base.gas}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Block Height</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.base.block.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Sequencer Batch Time</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.base.blockTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>L1 Data Availability</span>
                <span className="mono" style={{ color: '#60a5fa', fontWeight: 700 }}>EIP-4844 BLOBS</span>
              </div>
            </div>
          </motion.div>

          {/* Ethereum Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-panel"
            style={{ padding: '26px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(98, 126, 234, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="#627eea" />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Ethereum Mainnet</h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }} className="mono">Proof of Stake (Beacon)</p>
                </div>
              </div>
              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: 'rgba(98,126,234,0.12)', color: '#a5b4fc', fontWeight: 700, border: '1px solid rgba(98,126,234,0.25)' }} className="mono">
                SETTLEMENT
              </span>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }} className="mono">BASE FEE (GWEI)</div>
              <div style={{ fontSize: '38px', fontWeight: 900, color: '#a5b4fc', letterSpacing: '-1.5px' }} className="mono">
                {telemetry.ethereum.gas}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Block Height</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.ethereum.block.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Slot Interval</span>
                <span className="mono" style={{ fontWeight: 600 }}>{telemetry.ethereum.blockTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                <span style={{ color: '#94a3b8' }}>Consensus Finality</span>
                <span className="mono" style={{ color: '#a5b4fc', fontWeight: 700 }}>FINALIZED STATE</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Whale Alert Live Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel"
          style={{ padding: '28px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                Whale Transaction Stream (&gt; $100,000 USD)
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }} className="mono">
              Displaying {filteredWhales.length} High-Volume Transfers
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }} className="mono">
                  <th style={{ padding: '12px 14px' }}>CHAIN</th>
                  <th style={{ padding: '12px 14px' }}>TYPE</th>
                  <th style={{ padding: '12px 14px' }}>AMOUNT</th>
                  <th style={{ padding: '12px 14px' }}>VALUE (USD)</th>
                  <th style={{ padding: '12px 14px' }}>ROUTE (SOURCE → DESTINATION)</th>
                  <th style={{ padding: '12px 14px' }}>AGE</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredWhales.map((whale, idx) => (
                    <motion.tr 
                      key={whale.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <td style={{ padding: '16px 14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '11px',
                          background: whale.chain === 'Solana' ? 'rgba(20,241,149,0.15)' : (whale.chain === 'Base' ? 'rgba(0,82,255,0.15)' : 'rgba(98,126,234,0.15)'),
                          color: whale.chain === 'Solana' ? '#14f195' : (whale.chain === 'Base' ? '#60a5fa' : '#a5b4fc')
                        }} className="mono">
                          {whale.chain}
                        </span>
                      </td>
                      <td style={{ padding: '16px 14px', fontWeight: 600 }}>{whale.type}</td>
                      <td style={{ padding: '16px 14px', fontWeight: 700 }} className="mono">{whale.amount}</td>
                      <td style={{ padding: '16px 14px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          fontWeight: 800
                        }} className="mono">
                          {whale.usd}
                        </span>
                      </td>
                      <td style={{ padding: '16px 14px', color: '#cbd5e1' }} className="mono">{whale.from} → {whale.to}</td>
                      <td style={{ padding: '16px 14px', color: '#94a3b8' }} className="mono">{whale.time}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
        <p style={{ marginBottom: '8px' }}>
          Crafted with ⚡ using <strong>React, Vite, &amp; Framer Motion</strong> by <strong>Toti Putra Pratama</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <a href="https://portofolio-toti.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#14f195', textDecoration: 'none' }}>Live Portfolio</a>
          <a href="https://github.com/Toti-417" target="_blank" rel="noreferrer" style={{ color: '#14f195', textDecoration: 'none' }}>GitHub Profile</a>
          <a href="https://linkedin.com/in/totiputra" target="_blank" rel="noreferrer" style={{ color: '#14f195', textDecoration: 'none' }}>LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
