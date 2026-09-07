# 🍪 CookiePulse — The Cookie Chain All-in-One Terminal & AI Copilot

[![Cookie Chain](https://img.shields.io/badge/Network-Cookie%20Chain%20SVM-f59e0b)](https://www.cookiechain.wtf)
[![Wallet](https://img.shields.io/badge/Wallet-Nightly%20Ready-9333ea)](https://nightly.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CookiePulse** is an innovative **cApp (Cookie App)** engineered specifically for **Cookie Chain** — a fast, community-driven Solana Virtual Machine (SVM) blockchain featuring sub-second finality, negligible fees (~$0.000001), and dirt-cheap program deployments.

CookiePulse brings together a complete DeFi and ecosystem cockpit into one unified interface, leveraging Cookie Chain's native infrastructure, Nightly wallet connectivity, live DAS indexing, multi-venue DEX routing, and the `cookie-mcp` AI architecture.

---

## 🚀 Key Features

### 1. 👛 Native Wallet Integration (Nightly Required & Supported)
- Full support for **Nightly Wallet** (`https://nightly.app/`), as well as Phantom and Solflare.
- Connects directly to the official Cookie Chain RPC (`https://rpc.cookiescan.io`) with automatic network configuration.
- Real-time display of connected wallet address, native **COOK** balance, and liquid-staked **bCOOK** holdings.
- Integration with CookOven domain resolution for `.cook` names (e.g. `chef.cook`).

### 2. 📡 Live Ecosystem Radar & Token Explorer
- Direct integration with the **CookieScan DAS API** (`https://api.cookiescan.io/api/tokens` & `/api/markets`).
- Real-time tracking of over **6,400+ indexed tokens**, DEX liquidity depth, 24h trading volume, and market capitalizations.
- Instant search by token name, ticker symbol, or mint address.
- Fast filters: All Tokens, High Liquidity, and Top 24h Gainers.

### 3. 🔄 Cookiebox & Candy Shop Swap Router
- Multi-venue quote routing connecting **Cookiebox DAMM v2**, **Cookiebox CLMM**, and **CookieSwap BAMM**.
- Visual route inspection with hop breakdown, simulated price impact, protocol fee (20 bps), and slippage tolerance.
- Executes swaps with real-time on-chain status tracking and celebratory micro-interactions.

### 4. 🥩 1-Click bCOOK Liquid Staking
- Native on-chain interaction with Cookie Chain's canonical **SPL Stake Pool** (`GxbNKNYdtNXQkhDkpHdLDAMX64GxaECgANqdfp6cUGH4`).
- **Stake COOK**: Deposits COOK into the reserve and mints **bCOOK** (bakedCOOK) auto-compounding at ~14.8% APY.
- **Instant Unstake**: Burns bCOOK to withdraw liquid COOK instantly from the reserve with 0-epoch wait time.
- Dynamic exchange rate calculation fetched directly from the on-chain stake pool account.

### 5. 🍪 Community Cookie Jar & On-Chain Tribute
- Inscribes permanent messages on the Cookie Chain blockchain using the **Solana Memo Program** (`MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`).
- Allows users to send tips in COOK to the community vault alongside a custom baker tribute.
- Sub-second transaction confirmation with direct links to `https://cookiescan.io/tx/{sig}`.
- Real-time tribute feed showcasing recent community messages.

### 6. 🌉 Hyperlane Bridge Companion
- Step-by-step interactive guide and balance checker for bridging between **Solana Mainnet** and **Cookie Chain**.
- Direct portal to the Hyperlane Warp Route (`https://hyperlane.cookiescan.io`).
- Explains token mechanics (Cookie native COOK with 9 decimals ⇄ Solana Token-2022 COOK with 6 decimals).

### 7. 🤖 CookieCopilot AI Terminal (`cookie-mcp` Interface)
- Conversational Web3 terminal designed around the official `cookie-mcp` tool suite.
- Simulates and formats MCP actions (`get_tokens`, `get_quote`, `stake`, `bridge_status`).
- Quick prompt pills for querying top tokens, pricing swap routes, and examining staking yields.

---

## 🛠 Verified Program & Contract Addresses

| Component | Network / Type | Address |
| :--- | :--- | :--- |
| **COOK (Native Mint)** | Cookie Chain (9 dec) | `So11111111111111111111111111111111111111112` |
| **bCOOK (Stake Pool Token)** | Cookie Chain (9 dec) | `EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz` |
| **COOK (Solana Mainnet)** | Solana (Token-2022, 6 dec)| `36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1` |
| **Stake Pool Program** | Cookie Chain | `GZgs5uREPp6BvDt8eysmhavQPAHBAtjePgV4zfhgd9pH` |
| **Stake Pool Account** | Cookie Chain | `GxbNKNYdtNXQkhDkpHdLDAMX64GxaECgANqdfp6cUGH4` |
| **Reserve Stake Account** | Cookie Chain | `GAw1vRQ8R3ohDsSgGZV58dc32W7jYhHtc8DzuiVdvm8F` |
| **Withdraw Authority PDA** | Cookie Chain | `C8F9jQy259ZtYkG3139bN8KuhXw2s2zL9WwYp8V1n6D` |
| **CookOven Registry (.cook)** | Cookie Chain | `H43Qtq4AMQ86y7yc3YtCKZJ2QMhhnCcHyZKeFeoQn7PA` |
| **Cookiebox DAMM v2** | Cookie Chain | `DAMMjDCEFTDkt7ywazZS8GoaLtjb3HaJo3pLbf64xrPY` |
| **Cookiebox CLMM** | Cookie Chain | `CLMMmWqTtyNSomqXP3kETJy2SGKPdr31USsm4GfbLyKs` |
| **CookieSwap BAMM** | Cookie Chain | `WTzkPUoprVx7PDc1tfKA5sS7k1ynCgU89WtwZhksHX5` |
| **Memo Program** | Cookie Chain / Solana | `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` |
| **Hyperlane Warp Route** | Cookie Chain | `Aa9wq46NB7qkg1amnBuMRsV1DunmkPHuoRLWZgWiBKdn` |

---

## 💻 Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Web3 / Blockchain**: `@solana/web3.js`, `@solana/spl-token`
- **Wallet Adapters**: `@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets` (Nightly, Phantom, Solflare)
- **Styling**: Tailwind CSS, PostCSS, Custom Obsidian/Amber Cyberpunk Theme
- **Icons & Motion**: `lucide-react`, `canvas-confetti`
- **APIs**: CookieScan DAS REST API, Cookiebox Aggregator API, Cookie Chain RPC

---

## 📦 Getting Started

### Prerequisites
- Node.js ≥ 20.x
- `pnpm` or `npm`
- [Nightly Wallet extension](https://nightly.app/) installed in your browser

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cookie-pulse.git
cd cookie-pulse

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be running at `http://localhost:5173`.

### Production Build

```bash
# Typecheck and bundle with Vite
pnpm build

# Preview production build locally
pnpm preview
```

---

## 🌐 Deploying to Vercel / Cloudflare Pages

### Option A: Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Import Project**.
3. Select your repository. Vercel will automatically detect Vite and configure the build settings (`pnpm build`, output directory `dist`).
4. Click **Deploy**.

### Option B: Vercel CLI
```bash
npx vercel deploy --prod
```

---

## 🧵 Demo X (Twitter) Thread Template

*(Use this template when submitting your bounty entry to X and the Cookie Chain Telegram community)*

```markdown
🧵 1/6: Introducing CookiePulse 🍪⚡️ — The all-in-one DeFi, Analytics, and AI Copilot Terminal built natively on @TheCookieChain! 

Built for the @SuperteamDAO Cookie Chain bounty. Here's what we shipped 👇

🔗 Live App: [YOUR_DEPLOYED_URL]
💻 GitHub: [YOUR_GITHUB_URL]

---

🧵 2/6: Why Cookie Chain? 
With sub-second finality and near-zero gas fees (<$0.000001), @TheCookieChain is the premier playground for high-speed SVM experimentation.

CookiePulse leverages this raw speed to deliver instant swaps, live token indexing, and real on-chain liquid staking!

---

🧵 3/6: 👛 Nightly Wallet & Ecosystem Integration
We natively integrated @Nightly_app for seamless wallet connection on Cookie Chain!
- Instant balance tracking for $COOK & $bCOOK
- Auto-resolution of .cook domain handles via CookOven
- Real-time transaction feedback with 1-click CookieScan explorer links

---

🧵 4/6: 🥩 1-Click bCOOK Liquid Staking
Stake $COOK directly into the canonical SPL Stake Pool to earn auto-compounding yields (~14.8% APY) in $bCOOK!
Need instant liquidity? Unstake back to $COOK in a single block with zero unlock epochs.

---

🧵 5/6: 🌉 How to Bridge to Cookie Chain:
New to Cookie Chain? Bridging from Solana takes under 2 minutes:
1. Visit https://hyperlane.cookiescan.io
2. Connect your wallet (Solana side)
3. Transfer $COOK across the Hyperlane Warp Route
4. Watch it arrive on Cookie Chain with sub-second execution!

CookiePulse includes an interactive bridge companion to guide you every step of the way.

---

🧵 6/6: 🤖 AI Copilot & Cookie Jar
Inspired by `cookie-mcp`, our built-in Copilot terminal helps you query top tokens, inspect liquidity, and simulate routes in plain English. 

Leave your mark by dropping a tip and an on-chain memo in the Community Cookie Jar!

Special thanks to @TheCookieChain & @SuperteamDAO! 🍪🚀
```

---

## 📚 Ecosystem Resources

- **Cookie Chain Homepage**: [https://www.cookiechain.wtf](https://www.cookiechain.wtf)
- **Official Documentation**: [https://docs.cookiechain.wtf](https://docs.cookiechain.wtf)
- **CookieScan Explorer**: [https://cookiescan.io](https://cookiescan.io)
- **CookieScan DAS API**: [https://api.cookiescan.io](https://api.cookiescan.io)
- **Cookie Chain RPC**: `https://rpc.cookiescan.io`
- **Cookie Chain WebSocket**: `wss://wss.cookiescan.io`
- **Cookiebox Aggregator**: [https://cookiebox.app](https://cookiebox.app)
- **Hyperlane Bridge**: [https://hyperlane.cookiescan.io](https://hyperlane.cookiescan.io)
- **Cookie Chain Telegram**: [https://t.me/TheCookieNetChain](https://t.me/TheCookieNetChain)
- **Cookie Chain X**: [https://x.com/TheCookieChain](https://x.com/TheCookieChain)

---

## 📄 License

MIT License © 2026 CookiePulse Contributors.
