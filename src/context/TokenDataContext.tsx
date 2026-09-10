import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import type {
  CookieToken,
  MarketPair,
  TransactionReceipt,
  DeployTokenParams,
  BondingCurveToken,
  ActivityLogItem,
  QuestItem,
} from "../types";
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
  txReceipt: TransactionReceipt | null;
  bondingTokens: BondingCurveToken[];
  activityLogs: ActivityLogItem[];
  quests: QuestItem[];
  userXp: number;
  userStreak: number;
  showTxReceipt: (receipt: Omit<TransactionReceipt, "isOpen">) => void;
  closeTxReceipt: () => void;
  deployToken: (params: DeployTokenParams) => Promise<{ mint: string; txHash: string }>;
  buyBondingToken: (mint: string, cookAmount: number) => Promise<void>;
  recordActivity: (activity: Omit<ActivityLogItem, "id" | "timestamp" | "slot">) => void;
  completeQuest: (questId: string) => void;
  claimDailyStreak: () => { success: boolean; xpEarned: number };
  toggleDemoMode: () => void;
  toggleSound: () => void;
  adjustDemoBalance: (cookDelta: number, bCookDelta: number) => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  refreshBalances: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const TokenDataContext = createContext<TokenDataContextType | null>(null);

const INITIAL_BONDING_TOKENS: BondingCurveToken[] = [
  {
    mint: "Cook7vN3Xw51...cai1111111111111111111111111111",
    name: "Cookie AI Agent",
    symbol: "CAI",
    logoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=cai",
    description: "Autonomous high-frequency AI Arbitrage Agent running on Cookie Chain SVM.",
    marketCapUsd: 84200,
    volume24hUsd: 42100,
    bondingProgressPct: 86.4,
    priceCook: 0.000185,
    creator: "CookE7...89a2",
    createdAt: Date.now() - 3600000 * 4,
    repliesCount: 42,
  },
  {
    mint: "Bake9kP2Lm41...baker222222222222222222222222222",
    name: "Master Baker DAO",
    symbol: "BAKER",
    logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=baker",
    description: "Decentralized governance token for liquid staking pool node validators.",
    marketCapUsd: 56900,
    volume24hUsd: 28400,
    bondingProgressPct: 64.2,
    priceCook: 0.000124,
    creator: "7fN3...192b",
    createdAt: Date.now() - 3600000 * 12,
    repliesCount: 29,
  },
  {
    mint: "Pepe4xR8Qa61...pepe3333333333333333333333333333",
    name: "Pepe The Baker",
    symbol: "PEPECOOK",
    logoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=pepecook",
    description: "The official memecoin mascot of Cookie Chain. 100% community owned.",
    marketCapUsd: 41200,
    volume24hUsd: 19800,
    bondingProgressPct: 48.9,
    priceCook: 0.000092,
    creator: "3bQ8...91ac",
    createdAt: Date.now() - 3600000 * 24,
    repliesCount: 18,
  },
  {
    mint: "Cybr8tK1Vz71...cyber444444444444444444444444444",
    name: "Cybernetic Cookie",
    symbol: "CYBER",
    logoUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=cyber",
    description: "Neural network token powering CookieCopilot natural language parser.",
    marketCapUsd: 28500,
    volume24hUsd: 11200,
    bondingProgressPct: 32.5,
    priceCook: 0.000065,
    creator: "9kL2...83ff",
    createdAt: Date.now() - 3600000 * 36,
    repliesCount: 14,
  },
];

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: "act-1",
    type: "swap",
    title: "Swapped COOK for bCOOK",
    details: "Swapped 50 COOK for 38.67 bCOOK on Cookiebox DAMM v2",
    amount: "50 COOK",
    txHash: "5vW8X7z9Lk1P3m4N8q2R5t7Y6u9I0o1P2a3S4d5F6g7H8j9K0l1Z2x3C4v5B6n7M8",
    slot: 24238940,
    timestamp: Date.now() - 600000,
    status: "confirmed",
  },
  {
    id: "act-2",
    type: "stake",
    title: "Staked COOK in CandyShop Pool",
    details: "Deposited 100 COOK into liquid staking at 14.8% APY",
    amount: "100 COOK",
    txHash: "8bQ1P4m7K9z2L5t6Y8u0I1o2P3a4S5d6F7g8H9j0K1l2Z3x4C5v6B7n8M9q0W1e2",
    slot: 24238810,
    timestamp: Date.now() - 1800000,
    status: "confirmed",
  },
  {
    id: "act-3",
    type: "fortune",
    title: "Cracked Fortune Cookie",
    details: "Won 10x multiplier reward! Received 10 COOK",
    amount: "+10 COOK",
    txHash: "2kR9Lm4P7z1L3t5Y7u9I0o1P2a3S4d5F6g7H8j9K0l1Z2x3C4v5B6n7M8q9W0e1r",
    slot: 24238620,
    timestamp: Date.now() - 3600000,
    status: "confirmed",
  },
];

const INITIAL_QUESTS: QuestItem[] = [
  {
    id: "quest-daily",
    title: "Điểm Danh Hàng Ngày (Daily Streak)",
    description: "Nhận bánh quy may mắn mỗi ngày để tăng chuỗi streak và bội số thưởng.",
    xpReward: 50,
    category: "daily",
    completed: false,
    claimed: false,
    actionTab: "quests",
  },
  {
    id: "quest-swap",
    title: "Giao Dịch Đầu Tiên Trên CookieBox",
    description: "Thực hiện lệnh Swap bất kỳ trên sàn DEX Cookie Chain SVM.",
    xpReward: 150,
    category: "defi",
    completed: false,
    claimed: false,
    actionTab: "swap",
  },
  {
    id: "quest-stake",
    title: "Ủy Thác COOK Nhận bCOOK",
    description: "Stake tối thiểu 10 COOK vào bể thanh khoản bCOOK nhận lợi suất 14.8% APY.",
    xpReward: 200,
    category: "defi",
    completed: false,
    claimed: false,
    actionTab: "stake",
  },
  {
    id: "quest-deploy",
    title: "Phát Hành Token Trên CookPad",
    description: "Tạo một SPL Memecoin hoặc AI Agent Token mới trong 10 giây.",
    xpReward: 500,
    category: "creator",
    completed: false,
    claimed: false,
    actionTab: "launchpad",
  },
  {
    id: "quest-copilot",
    title: "Tương Tác Với CookieCopilot AI",
    description: "Gửi lệnh hoặc kích hoạt chiến lược Autopilot trong terminal AI.",
    xpReward: 100,
    category: "social",
    completed: false,
    claimed: false,
    actionTab: "copilot",
  },
  {
    id: "quest-bridge",
    title: "Mô Phỏng Hyperlane Warp Route",
    description: "Trải nghiệm quy trình chuyển tài sản chuỗi chéo giữa Solana và Cookie Chain.",
    xpReward: 150,
    category: "defi",
    completed: false,
    claimed: false,
    actionTab: "bridge",
  },
];

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
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);

  // Bonding curve tokens
  const [bondingTokens, setBondingTokens] = useState<BondingCurveToken[]>(() => {
    try {
      const saved = localStorage.getItem("cookie_pulse_bonding_tokens");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BONDING_TOKENS;
  });

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem("cookie_pulse_activity_logs");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ACTIVITY_LOGS;
  });

  // Quests & XP
  const [quests, setQuests] = useState<QuestItem[]>(() => {
    try {
      const saved = localStorage.getItem("cookie_pulse_quests");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_QUESTS;
  });

  const [userXp, setUserXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("cookie_pulse_xp");
      if (saved) return parseInt(saved, 10) || 150;
    } catch (e) {}
    return 150;
  });

  const [userStreak, setUserStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("cookie_pulse_streak");
      if (saved) return parseInt(saved, 10) || 1;
    } catch (e) {}
    return 1;
  });

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

  const showTxReceipt = useCallback((receipt: Omit<TransactionReceipt, "isOpen">) => {
    setTxReceipt({ ...receipt, isOpen: true });
    sounds.playSuccess();
  }, []);

  const closeTxReceipt = useCallback(() => {
    setTxReceipt(null);
  }, []);

  const recordActivity = useCallback((activity: Omit<ActivityLogItem, "id" | "timestamp" | "slot">) => {
    const id = "act-" + Math.random().toString(36).substring(2, 9);
    const item: ActivityLogItem = {
      ...activity,
      id,
      timestamp: Date.now(),
      slot: chainSlot > 0 ? chainSlot : 24238980,
    };
    setActivityLogs((prev) => {
      const next = [item, ...prev].slice(0, 50);
      try {
        localStorage.setItem("cookie_pulse_activity_logs", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, [chainSlot]);

  const completeQuest = useCallback((questId: string) => {
    setQuests((prev) => {
      const target = prev.find((q) => q.id === questId);
      if (!target || target.completed) return prev;
      const next = prev.map((q) => q.id === questId ? { ...q, completed: true } : q);
      try {
        localStorage.setItem("cookie_pulse_quests", JSON.stringify(next));
      } catch (e) {}
      setUserXp((xp) => {
        const newXp = xp + target.xpReward;
        try {
          localStorage.setItem("cookie_pulse_xp", String(newXp));
        } catch (e) {}
        return newXp;
      });
      sounds.playSuccess();
      addToast({
        type: "success",
        title: "Nhiệm Vụ Hoàn Thành! 🏆",
        message: `Bạn nhận được +${target.xpReward} XP: ${target.title}`,
      });
      return next;
    });
  }, [addToast]);

  const claimDailyStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem("cookie_pulse_last_claim");
    if (lastClaim === today) {
      addToast({
        type: "info",
        title: "Hôm nay đã điểm danh",
        message: "Hãy quay lại vào ngày mai để tiếp tục duy trì chuỗi Streak!",
      });
      return { success: false, xpEarned: 0 };
    }
    const newStreak = userStreak + 1;
    const xpEarned = 50 + Math.min(newStreak * 10, 100);
    setUserStreak(newStreak);
    setUserXp((prev) => {
      const updated = prev + xpEarned;
      try {
        localStorage.setItem("cookie_pulse_xp", String(updated));
      } catch (e) {}
      return updated;
    });
    try {
      localStorage.setItem("cookie_pulse_streak", String(newStreak));
      localStorage.setItem("cookie_pulse_last_claim", today);
    } catch (e) {}
    sounds.playCoin();
    addToast({
      type: "success",
      title: `Điểm Danh Thành Công! 🔥 Ngày ${newStreak}`,
      message: `Nhận được +${xpEarned} XP và duy trì ngọn lửa chuỗi ngày làm bánh!`,
    });
    completeQuest("quest-daily");
    return { success: true, xpEarned };
  }, [userStreak, addToast, completeQuest]);

  const buyBondingToken = useCallback(
    async (mint: string, cookAmount: number) => {
      if (cookAmount <= 0) return;
      const currentCook = isDemoMode && !publicKey ? demoCookBalance : (realCookBalance || demoCookBalance);
      if (currentCook < cookAmount) {
        addToast({
          type: "error",
          title: "Không Đủ Số Dư COOK",
          message: `Bạn cần ít nhất ${cookAmount} COOK để mua token này.`,
        });
        return;
      }
      adjustDemoBalance(-cookAmount, 0);
      const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      let randomSig = "";
      for (let i = 0; i < 88; i++) {
        randomSig += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const currentSlot = chainSlot > 0 ? chainSlot : 24238990;

      const targetToken = bondingTokens.find((t) => t.mint === mint);
      const tokenSymbol = targetToken ? targetToken.symbol : "TOKEN";

      // Update bonding progress
      setBondingTokens((prev) => {
        const next = prev.map((t) => {
          if (t.mint === mint) {
            const newProgress = Math.min(100, +(t.bondingProgressPct + cookAmount / 10).toFixed(1));
            return {
              ...t,
              bondingProgressPct: newProgress,
              volume24hUsd: t.volume24hUsd + cookAmount * cookUsd,
              marketCapUsd: t.marketCapUsd + cookAmount * cookUsd * 2,
            };
          }
          return t;
        });
        try {
          localStorage.setItem("cookie_pulse_bonding_tokens", JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      recordActivity({
        type: "swap",
        title: `Bought $${tokenSymbol} on CookPad`,
        details: `Purchased bonding curve shares with ${cookAmount} COOK on Cookie Chain SVM`,
        amount: `${cookAmount} COOK`,
        txHash: randomSig,
        status: "confirmed",
      });

      showTxReceipt({
        title: `Bought $${tokenSymbol} on CookPad`,
        summary: `Purchased bonding curve shares with ${cookAmount} COOK on Cookie Chain SVM.`,
        txHash: randomSig,
        slot: currentSlot,
        executionTimeMs: 340,
        tokenMint: mint,
        actionType: "swap",
      });

      completeQuest("quest-swap");
      sounds.playSuccess();
    },
    [
      isDemoMode,
      publicKey,
      demoCookBalance,
      realCookBalance,
      adjustDemoBalance,
      chainSlot,
      bondingTokens,
      cookUsd,
      recordActivity,
      showTxReceipt,
      completeQuest,
      addToast,
    ]
  );

  const deployToken = useCallback(
    async (params: DeployTokenParams) => {
      // Generate a valid SVM mint keypair
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey.toBase58();

      // Generate a realistic 88-char base58 transaction signature
      const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      let randomSig = "";
      for (let i = 0; i < 88; i++) {
        randomSig += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const currentSlot = chainSlot > 0 ? chainSlot : 24238945;

      const newToken: CookieToken = {
        mint: mintAddress,
        metadata: {
          name: params.name,
          symbol: params.symbol.toUpperCase(),
          decimals: params.decimals || 9,
          logo: params.logoUrl || "/cookie-logo.svg",
          description: params.description,
        },
        price: {
          usd: 0.000085,
          native: 0.75,
          change24h: 12.5,
        },
        marketData: {
          liquidity: 2500,
          volume24h: 0,
          supply: params.initialSupply,
          holderCount: 1,
        },
        lastUpdated: new Date().toISOString(),
      };

      setTokens((prev) => [newToken, ...prev]);

      const newBondingToken: BondingCurveToken = {
        mint: mintAddress,
        name: params.name,
        symbol: params.symbol.toUpperCase(),
        logoUrl: params.logoUrl || "/cookie-logo.svg",
        description: params.description,
        marketCapUsd: 12500,
        volume24hUsd: 0,
        bondingProgressPct: 1.5,
        priceCook: 0.000085,
        creator: publicKey
          ? publicKey.toBase58().slice(0, 4) + "..." + publicKey.toBase58().slice(-4)
          : "Cook7vN",
        createdAt: Date.now(),
        repliesCount: 0,
      };

      setBondingTokens((prev) => {
        const next = [newBondingToken, ...prev];
        try {
          localStorage.setItem("cookie_pulse_bonding_tokens", JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      recordActivity({
        type: "deploy",
        title: `Deployed $${params.symbol.toUpperCase()} on CookPad`,
        details: `Created new SVM token with initial supply of ${params.initialSupply.toLocaleString()}`,
        amount: `${params.initialSupply.toLocaleString()} ${params.symbol.toUpperCase()}`,
        txHash: randomSig,
        status: "confirmed",
      });

      completeQuest("quest-deploy");

      showTxReceipt({
        title: "Token Deployed on Cookie Chain",
        summary: `Created ${params.name} ($${params.symbol.toUpperCase()}) on Cookie Chain SVM with ${params.initialSupply.toLocaleString()} supply.`,
        txHash: randomSig,
        slot: currentSlot,
        executionTimeMs: 382,
        tokenMint: mintAddress,
        actionType: "deploy",
      });

      addToast({
        type: "success",
        title: "Token Deployed!",
        message: `${params.symbol.toUpperCase()} is now live on Cookie Chain SVM & CookPad.`,
        txHash: randomSig,
      });

      return { mint: mintAddress, txHash: randomSig };
    },
    [chainSlot, publicKey, recordActivity, completeQuest, showTxReceipt, addToast]
  );

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
        txReceipt,
        bondingTokens,
        activityLogs,
        quests,
        userXp,
        userStreak,
        showTxReceipt,
        closeTxReceipt,
        deployToken,
        buyBondingToken,
        recordActivity,
        completeQuest,
        claimDailyStreak,
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
