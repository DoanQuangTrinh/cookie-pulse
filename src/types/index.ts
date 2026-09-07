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

export type ActiveTab = 'analytics' | 'swap' | 'stake' | 'cookiejar' | 'bridge' | 'copilot';
