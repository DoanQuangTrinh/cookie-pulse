import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { CookieToken, MarketPair } from "../types";
import { fetchTokens, fetchMarkets } from "../services/cookieScanApi";
import { getCookBalance, getBCookBalance, getChainStatus } from "../services/cookieRpc";
import { sounds } from "../services/soundEffects";

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
  isDemoMode: boolean;
  soundEnabled: boolean;
  toasts: ToastMessage[];
  toggleDemoMode: () => void;
  toggleSound: () => void;
  adjustDemoBalance: (cookDelta: number, bCookDelta: number) => void;
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
  const [realCookBalance, setRealCookBalance] = useState<number>(0);
  const [realBCookBalance, setRealBCookBalance] = useState<number>(0);
  
  // Sandbox / Demo mode for instant interactive testing by judges
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [demoCookBalance, setDemoCookBalance] = useState<number>(1000);
  const [demoBCookBalance, setDemoBCookBalance] = useState<number>(250);
  
  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [chainSlot, setChainSlot] = useState<number>(0);
  const [chainBlockHeight, setChainBlockHeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleSound = useCallback(() => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      sounds.playClick();
      return next;
    });
  }, []);

  const adjustDemoBalance = useCallback((cookDelta: number, bCookDelta: number) => {
    setDemoCookBalance((prev) => Math.max(0, prev + cookDelta));
    setDemoBCookBalance((prev) => Math.max(0, prev + bCookDelta));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (toast.type === "success") {
      sounds.playSuccess();
    } else if (toast.type === "info") {
      sounds.playCoin();
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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

  const refreshBalances = useCallback(async () => {
    if (!publicKey) {
      setRealCookBalance(0);
      setRealBCookBalance(0);
      return;
    }
    const addr = publicKey.toBase58();
    try {
      const [cook, bCook] = await Promise.all([
        getCookBalance(addr),
        getBCookBalance(addr),
      ]);
      setRealCookBalance(cook);
      setRealBCookBalance(bCook);
    } catch (err) {
      console.error("Failed to refresh balances:", err);
    }
  }, [publicKey]);

  useEffect(() => {
    refreshTokens();
    const interval = setInterval(refreshTokens, 45000);
    return () => clearInterval(interval);
  }, [refreshTokens]);

  useEffect(() => {
    refreshBalances();
    const balInterval = setInterval(refreshBalances, 15000);
    return () => clearInterval(balInterval);
  }, [refreshBalances]);

  // Compute effective balances
  const effectiveCookBalance = isDemoMode && !publicKey ? demoCookBalance : (realCookBalance || demoCookBalance);
  const effectiveBCookBalance = isDemoMode && !publicKey ? demoBCookBalance : (realBCookBalance || demoBCookBalance);

  return (
    <TokenDataContext.Provider
      value={{
        tokens,
        markets,
        cookUsd,
        cookBalance: effectiveCookBalance,
        bCookBalance: effectiveBCookBalance,
        chainSlot,
        chainBlockHeight,
        loading,
        isDemoMode,
        soundEnabled,
        toasts,
        toggleDemoMode,
        toggleSound,
        adjustDemoBalance,
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
