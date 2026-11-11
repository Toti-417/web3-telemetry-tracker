const express = require('express');
const path = require('path');
const { getNetworkTelemetry } = require('./tracker');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// In-memory cache for fast dashboard updates
let cachedTelemetry = null;
let lastUpdate = 0;

// API endpoint for live telemetry
app.get('/api/telemetry', async (req, res) => {
  try {
    const now = Date.now();
    // Cache for 3 seconds to avoid RPC rate limiting
    if (!cachedTelemetry || now - lastUpdate > 3000) {
      cachedTelemetry = await getNetworkTelemetry();
      lastUpdate = now;
    }
    res.json({
      success: true,
      data: cachedTelemetry
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mock / live Whale Alerts (transactions > $250k)
app.get('/api/whale-alerts', (req, res) => {
  const alerts = [
    {
      id: 'tx_01',
      chain: 'Solana',
      amount: '45,000 SOL',
      usdValue: '$8,235,000',
      from: '7xKX...4mPQ',
      to: 'Binance Cold Storage (8sYz...9kLm)',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toLocaleTimeString('id-ID'),
      type: 'Transfer'
    },
    {
      id: 'tx_02',
      chain: 'Ethereum',
      amount: '1,200 ETH',
      usdValue: '$3,840,000',
      from: '0x3841...98ae',
      to: 'Uniswap V3 Liquidity Pool',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleTimeString('id-ID'),
      type: 'Liquidity Add'
    },
    {
      id: 'tx_03',
      chain: 'Base',
      amount: '500,000 USDC',
      usdValue: '$500,000',
      from: '0x99f2...34c1',
      to: 'Aerodrome DEX',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString('id-ID'),
      type: 'Swap'
    }
  ];
  res.json({ success: true, alerts });
});

app.listen(PORT, () => {
  console.log(`🚀 Web3 Telemetry Tracker server running at http://localhost:${PORT}`);
});

