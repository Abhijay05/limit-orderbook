# 📚 Limit Orderbook

> 💡 This is my first public project on GitHub! Excited to share and improve it over time.

A simple **limit orderbook matching engine** implemented in TypeScript. Supports bids, asks, order matching, and balance updates. Designed for experimentation, learning, and future expansion into market orders and DeFi integrations.

---

## 🚀 Features

- Place **limit buy (bid)** and **limit sell (ask)** orders
- Match incoming orders against best available prices
- Update user balances after trades
- View live orderbook depth via API
- Basic Jest test coverage for core logic

---
## 🛠️ Tech Stack

- **TypeScript**
- **Node.js**
- **Express.js**
- **Jest** (for testing)

---

## 🎯 Future Goals

- **Market Order Support** – Handle market buys/sells consuming best available prices.  
- **Real-Time Orderbook** – WebSocket streams for depth, trades, and ticker updates.  
- **Frontend Dashboard** – React/Tailwind UI for order placement and visualization.  
- **Persistence Layer** – Redis/Postgres storage for durability and analytics.  
- **User Accounts & Auth** – JWT authentication and access control.  
- **DeFi Integration (major focus)** – Off-chain matching with on-chain settlement via signed orders.  
- **Smart Contract Settlement** – Audited Solidity contracts for trustless execution.  
- **Advanced Features** – Slippage protection, partial fill handling, and analytics dashboard.  
