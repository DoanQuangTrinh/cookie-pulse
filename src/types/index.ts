export interface TokenMetadata {
  name?: string;
  symbol?: string;
  logo?: string;
  decimals?: number;
  description?: string;
  updateAuthority?: string;
}

export interface TokenPrice {
  usd?: string | number;
  native?: number;
  change24h?: number;
}

export interface TokenMarketData {
  volume24h?: number;
  volumeChange24h?: number;
  liquidity?: number;
  marketCap?: number;
  supply?: number;
  holderCount?: number;
}

export interface CookieToken {
  mint: string;
  metadata?: TokenMetadata;
  price?: TokenPrice;
  marketData?: TokenMarketData;
  lastUpdated?: string;
}

export interface MarketPair {
  marketId: string;
  type: string;
  baseToken: {
    mint: string;
    symbol?: string;
    amount?: number;
    priceUsd?: number;
  };
  quoteToken: {
    mint: string;
    symbol?: string;
    amount?: number;
    priceUsd?: number;
  };
  liquidityUsd?: number;
  liquidityDisplay?: string;
}

export interface SwapRouteSegment {
  pool: string;
  venue: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  percentage?: number;
  hopIndex: number;
}

export interface SwapQuote {
  inAmount: string;
  outAmount: string;
  feePct: number;
  feeAmount: string;
  netOutAmount: string;
  minOutAmount: string;
  priceImpactPct: number | null;
  path: string[];
  isSplit: boolean;
  isMultiHop: boolean;
  segments: SwapRouteSegment[];
  aggregator: 'cookiebox' | 'candyshop';
}

export interface StakePoolInfo {
  totalLamports: number;
  poolTokenSupply: number;
  rate: number; // 1 bCOOK = X COOK
  depositFeePct: number;
  withdrawFeePct: number;
}

export interface CookieJarMessage {
  id: string;
  sender: string;
  domain?: string;
  amountCook: number;
  message: string;
  timestamp: number;
  txHash: string;
}

export interface FortuneResult {
  id: string;
  fortune: string;
  luckyNumbers: number[];
  multiplier: number;
  rewardCook: number;
  timestamp: number;
  txHash: string;
}

export interface TransactionReceipt {
  isOpen: boolean;
  title: string;
  summary: string;
  txHash: string;
  slot?: number;
  executionTimeMs?: number;
  tokenMint?: string;
  actionType?: 'swap' | 'stake' | 'fortune' | 'cookiejar' | 'deploy' | 'bridge' | 'quest';
}

export interface DeployTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  description: string;
  logoUrl?: string;
  revokeMintAuthority: boolean;
  disableFreezeAuthority: boolean;
}

export interface BondingCurveToken {
  mint: string;
  name: string;
  symbol: string;
  logoUrl: string;
  description: string;
  marketCapUsd: number;
  volume24hUsd: number;
  bondingProgressPct: number; // 0 - 100
  priceCook: number;
  creator: string;
  createdAt: number;
  repliesCount?: number;
}

export interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  maker: string;
  amountCook: number;
  priceUsd: number;
  totalUsd: number;
  timestamp: number;
  txHash: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'swap' | 'stake' | 'unstake' | 'deploy' | 'fortune' | 'cookiejar' | 'bridge' | 'quest';
  title: string;
  details: string;
  amount?: string;
  txHash: string;
  slot: number;
  timestamp: number;
  status: 'confirmed' | 'pending';
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'daily' | 'defi' | 'creator' | 'social';
  completed: boolean;
  claimed: boolean;
  actionTab?: ActiveTab;
}

export type ActiveTab =
  | 'analytics'
  | 'swap'
  | 'stake'
  | 'fortune'
  | 'cookiejar'
  | 'bridge'
  | 'copilot'
  | 'launchpad'
  | 'portfolio'
  | 'quests';

