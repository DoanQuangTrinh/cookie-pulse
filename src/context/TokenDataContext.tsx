import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { CookieToken, MarketPair } from "../types";
import { fetchTokens, fetchMarkets } from "../services/cookieScanApi";
import { getCookBalance, getBCookBalance, getChainStatus } from "../services/cookieRpc";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  txHash?: string;
}

interface TokenDataContextType {
  tokens: CookieToken[];
  markets: MarketPair[];
  cookUsd: number;
  cookBalance: number;
  bCookBalance: number;
  chainSlot: number;
  chainBlockHeight: number;
  loading: boolean;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  refreshBalances: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const TokenDataContext = createContext<TokenDataContextType | null>(null);

export const TokenDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState<CookieToken[]>([]);
  const [markets, setMarkets] = useState<MarketPair[]>([]);
  const [cookUsd, setCookUsd] = useState<number>(0.000112);
  const [cookBalance, setCookBalance] = useState<number>(0);
  const [bCookBalance, setBCookBalance] = useState<number>(0);
  const [chainSlot, setChainSlot] = useState<number>(0);
  const [chainBlockHeight, setChainBlockHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tokens and markets from CookieScan
  const refreshTokens = useCallback(async () => {
    try {
      setLoading(true);
      const [tokenRes, marketRes, statusRes] = await Promise.all([
        fetchTokens(),
        fetchMarkets(),
        getChainStatus(),
      ]);

      if (tokenRes.tokens.length > 0) {
        setTokens(tokenRes.tokens);
        setCookUsd(tokenRes.cookUsd);
      }
      setMarkets(marketRes);
      setChainSlot(statusRes.slot);
      setChainBlockHeight(statusRes.blockHeight);
    } catch (err) {
      console.error("Failed to load ecosystem data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch balances for connected wallet
  const refreshBalances = useCallback(async () => {
    if (!publicKey) {
      setCookBalance(0);
      setBCookBalance(0);
      return;
    }
    const addr = publicKey.toBase58();
    try {
      const [cook, bCook] = await Promise.all([
        getCookBalance(addr),
        getBCookBalance(addr),
      ]);
      setCookBalance(cook);
      setBCookBalance(bCook);
    } catch (err) {
      console.error("Failed to refresh balances:", err);
    }
  }, [publicKey]);

  // Initial load
  useEffect(() => {
    refreshTokens();
    const interval = setInterval(() => {
      refreshTokens();
    }, 45000);
    return () => clearInterval(interval);
  }, [refreshTokens]);

  // Balance update on wallet change
  useEffect(() => {
    refreshBalances();
    const balInterval = setInterval(() => {
      refreshBalances();
    }, 15000);
    return () => clearInterval(balInterval);
  }, [refreshBalances]);

  return (
    <TokenDataContext.Provider
      value={{
        tokens,
        markets,
        cookUsd,
        cookBalance,
        bCookBalance,
        chainSlot,
        chainBlockHeight,
        loading,
        toasts,
        addToast,
        removeToast,
        refreshBalances,
        refreshTokens,
      }}
    >
      {children}
    </TokenDataContext.Provider>
  );
};

export const useTokenData = () => {
  const context = useContext(TokenDataContext);
  if (!context) {
    throw new Error("useTokenData must be used within a TokenDataProvider");
  }
  return context;
};
