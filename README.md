# ⚡ Web3 Multi-Chain Telemetry & Whale Alert Engine

A high-performance decentralized network telemetry monitoring dashboard and live whale transaction radar, built with **React, Vite, and Framer Motion**.

This project bridges **telecommunications network telemetry methodologies** (RSRP/throughput/KPI auditing) with **high-throughput blockchain systems** (Solana, Base L2, and Ethereum).

Live Portfolio: [https://portofolio-toti.vercel.app](https://portofolio-toti.vercel.app)  
Developer: **Toti Putra Pratama** (Data & Infrastructure Operations Specialist)

---

## 🚀 Key Features

- **Real-Time Node Telemetry Polling**: Queries public JSON-RPC endpoints directly:
  - **Solana Mainnet**: Live slot height, slot performance, and true throughput calculation (`~1,300+ TPS`).
  - **Base (Coinbase L2)**: Real-time L2 block height, batch latency, and L1 blob gas pricing (`0.0028 - 0.0060 Gwei`).
  - **Ethereum Mainnet**: Settlement layer block heights and EIP-1559 base fee telemetry.
- **Whale Transaction Alert Radar**: Filters and highlights multi-million dollar on-chain liquidity moves, DEX arbitrage swaps, and cold storage transfers (`> $100k USD`).
- **Interactive Multi-Chain Filters**: Filter streams seamlessly between Solana, Base, and Ethereum with instant state transitions.
- **Modern Glassmorphic Cyberpunk UI**: Smooth entrance animations, hover physics, and live status pulses powered by **Framer Motion**.
- **100% Serverless & Edge-Ready**: Zero backend dependencies required; connects straight to decentralized RPC nodes.

---

## 🛠️ Tech Stack

- **Framework**: React 18 / 19
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Cyberpunk Glassmorphism / Modern CSS3
- **Network**: Web3 JSON-RPC (Solana RPC, Base L2, Ethereum L1)

---

## 💻 Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/Toti-417/web3-telemetry-tracker.git

# Enter project directory
cd web3-telemetry-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 👤 Author

**Toti Putra Pratama**
- Portfolio: [https://portofolio-toti.vercel.app](https://portofolio-toti.vercel.app)
- LinkedIn: [https://linkedin.com/in/totiputra](https://linkedin.com/in/totiputra)
- GitHub: [https://github.com/Toti-417](https://github.com/Toti-417)
