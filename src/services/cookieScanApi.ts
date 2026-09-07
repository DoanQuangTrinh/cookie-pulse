import { COOKIESCAN_API_URL, COOK_MINT } from "../config/constants";
import type { CookieToken, MarketPair } from "../types";

let cachedTokens: CookieToken[] | null = null;
let cachedCookUsd = 0.00011;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30_000;

export interface TokensApiResponse {
  success: boolean;
  cookUsd: number;
  count: number;
  data: CookieToken[];
}

export interface MarketsApiResponse {
  success: boolean;
  cookUsd: number;
  marketCount: number;
  markets: MarketPair[];
}

/**
 * Fetch all registered tokens and current COOK price from CookieScan DAS API
 */
export async function fetchTokens(): Promise<{ cookUsd: number; tokens: CookieToken[] }> {
  const now = Date.now();
  if (cachedTokens && now - lastFetchTime < CACHE_TTL_MS) {
    return { cookUsd: cachedCookUsd, tokens: cachedTokens };
  }

  try {
    const res = await fetch(`${COOKIESCAN_API_URL}/api/tokens`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: TokensApiResponse = await res.json();
    
    if (json.data && Array.isArray(json.data)) {
      cachedTokens = json.data;
      cachedCookUsd = json.cookUsd || cachedCookUsd;
      lastFetchTime = now;
      return { cookUsd: cachedCookUsd, tokens: cachedTokens };
    }
    return { cookUsd: cachedCookUsd, tokens: [] };
  } catch (err) {
    console.warn("Using fallback token data due to API fetch error:", err);
    if (cachedTokens) return { cookUsd: cachedCookUsd, tokens: cachedTokens };
    
    // Return essential fallback list if network is down
    return {
      cookUsd: 0.000112,
      tokens: [
        {
          mint: COOK_MINT,
          metadata: {
            name: "Cookie",
            symbol: "COOK",
            decimals: 9,
            logo: "/cookie-logo.svg",
            description: "Cookie Chain Native Gas & Governance Token",
          },
          price: { usd: 0.000112, native: 1, change24h: 3.45 },
          marketData: { volume24h: 184500, liquidity: 4500000, marketCap: 1120000 },
        },
        {
          mint: "EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz",
          metadata: {
            name: "Baked COOK",
            symbol: "bCOOK",
            decimals: 9,
            logo: "/cookie-logo.svg",
            description: "Liquid Staked COOK (Bake Your Stake)",
          },
          price: { usd: 0.000144, native: 1.28, change24h: 4.12 },
          marketData: { volume24h: 62000, liquidity: 5949142, marketCap: 850000 },
        },
      ],
    };
  }
}

/**
 * Fetch active DEX markets from CookieScan
 */
export async function fetchMarkets(): Promise<MarketPair[]> {
  try {
    const res = await fetch(`${COOKIESCAN_API_URL}/api/markets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: MarketsApiResponse = await res.json();
    return json.markets || [];
  } catch (err) {
    console.warn("Error fetching markets:", err);
    return [];
  }
}
