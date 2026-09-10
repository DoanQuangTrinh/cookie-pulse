import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Coins,
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  Loader2,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  getStakePoolStats,
  buildStakeCookTx,
  buildUnstakeCookTx,
} from "../../services/stakeService";
import type { StakePoolInfo } from "../../types";

export const StakingCard: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { cookBalance, bCookBalance, addToast, refreshBalances } = useTokenData();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"stake" | "unstake">("stake");
  const [amount, setAmount] = useState<string>("50");
  const [poolStats, setPoolStats] = useState<StakePoolInfo>({
    totalLamports: 7691469,
    poolTokenSupply: 5949142,
    rate: 1.2928,
    depositFeePct: 0.5,
    withdrawFeePct: 2.0,
  });
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getStakePoolStats();
        setPoolStats(stats);
      } catch (err) {
        console.error("Failed to load stake pool stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const estimatedReceive =
    mode === "stake"
      ? (numAmount / poolStats.rate) * (1 - poolStats.depositFeePct / 100)
      : numAmount * poolStats.rate * (1 - poolStats.withdrawFeePct / 100);

  const handleMax = () => {
    if (mode === "stake") {
      setAmount(Math.max(0, cookBalance - 0.005).toFixed(2));
    } else {
      setAmount(bCookBalance.toFixed(2));
    }
  };

  const handleExecute = async () => {
    if (!publicKey) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Connect your Nightly or Solana wallet to participate in liquid staking.",
      });
      return;
    }

    if (numAmount <= 0) {
      addToast({
        type: "error",
        title: "Invalid Amount",
        message: "Please enter an amount greater than 0.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tx =
        mode === "stake"
          ? await buildStakeCookTx(publicKey, numAmount)
          : await buildUnstakeCookTx(publicKey, numAmount);

      const sig = await sendTransaction(tx, connection);

      addToast({
        type: "info",
        title: "Staking Transaction Sent",
        message: "Confirming on-chain with Cookie Chain validators...",
        txHash: sig,
      });

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#f59e0b", "#fbbf24", "#10b981"],
      });

      addToast({
        type: "success",
        title: mode === "stake" ? "Staked Successfully!" : "Unstaked Successfully!",
        message:
          mode === "stake"
            ? `Deposited ${numAmount} COOK for ~${estimatedReceive.toFixed(4)} bCOOK.`
            : `Burned ${numAmount} bCOOK for ~${estimatedReceive.toFixed(4)} COOK.`,
        txHash: sig,
      });

      refreshBalances();
    } catch (err: any) {
      console.error("Staking execution failed:", err);
      addToast({
        type: "error",
        title: "Transaction Failed",
        message: err?.message || "Simulation or wallet confirmation was rejected.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Pool Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono uppercase mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estimated APY</span>
          </div>
          <p className="text-xl font-bold font-mono text-emerald-400">~14.8%</p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Auto-compounding</p>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono uppercase mb-1">
            <Flame className="w-3.5 h-3.5 text-cookie-400" />
            <span>Total Staked</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {poolStats.totalLamports.toLocaleString(undefined, { maximumFractionDigits: 0 })} COOK
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">SPL Stake Pool</p>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-900/80 border border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono uppercase mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Exchange Rate</span>
          </div>
          <p className="text-xl font-bold font-mono text-cookie-300">
            1 bCOOK = {poolStats.rate} COOK
          </p>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">Constantly growing</p>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="p-6 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-5">
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-obsidian-950 border border-white/[0.06]">
          <button
            onClick={() => setMode("stake")}
            className={`py-2.5 rounded-xl font-semibold text-sm transition-all ${
              mode === "stake"
                ? "bg-cookie-500 text-obsidian-950 shadow-cookie-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.tabStakeAction}
          </button>
          <button
            onClick={() => setMode("unstake")}
            className={`py-2.5 rounded-xl font-semibold text-sm transition-all ${
              mode === "unstake"
                ? "bg-cookie-500 text-obsidian-950 shadow-cookie-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.tabUnstakeAction}
          </button>
        </div>

        {/* Input Card */}
        <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{mode === "stake" ? t.stakeInputLabel : t.unstakeInputLabel}</span>
            <div className="flex items-center gap-2">
              <span>
                {t.balance}{" "}
                <strong className="text-white">
                  {mode === "stake" ? cookBalance.toFixed(3) : bCookBalance.toFixed(3)}{" "}
                  {mode === "stake" ? "COOK" : "bCOOK"}
                </strong>
              </span>
              <button
                onClick={handleMax}
                className="px-2 py-0.5 rounded bg-cookie-500/20 text-cookie-300 font-bold hover:bg-cookie-500/30 text-[10px]"
              >
                {t.max}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-white outline-none placeholder-slate-600"
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-white/[0.08] shrink-0">
              <img src="/cookie-logo.svg" alt="" className="w-5 h-5 rounded-full" />
              <span className="font-bold text-sm text-white">
                {mode === "stake" ? "COOK" : "bCOOK"}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="flex justify-center -my-2 text-cookie-400">
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>

        {/* Output Estimation Card */}
        <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-1">
          <p className="text-xs font-mono text-slate-400">
            {mode === "stake" ? t.receiveBcook : t.receiveCook}:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-cookie-300">
              {estimatedReceive > 0 ? estimatedReceive.toFixed(4) : "0.0000"}
            </span>
            <span className="font-mono text-sm font-semibold text-slate-300">
              {mode === "stake" ? "bCOOK" : "COOK"}
            </span>
          </div>
        </div>

        {/* Summary Details */}
        <div className="p-3.5 rounded-xl bg-obsidian-950/40 border border-white/[0.04] space-y-2 text-xs font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Pool Program</span>
            <span className="text-slate-200">SPL Stake Pool (Canonical)</span>
          </div>
          <div className="flex justify-between">
            <span>{t.protocolFee}</span>
            <span className="text-slate-200">
              {mode === "stake"
                ? `${poolStats.depositFeePct}% Deposit Fee`
                : `${poolStats.withdrawFeePct}% Instant Unstake Fee`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.finalityTime}</span>
            <span className="text-emerald-400 font-semibold">
              Instant from reserve (0 epoch wait)
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExecute}
          disabled={submitting}
          className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
            submitting
              ? "bg-cookie-600 text-obsidian-950 cursor-wait opacity-80"
              : "bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 shadow-cookie-glow hover:shadow-cookie-glow-lg"
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{mode === "stake" ? t.staking : t.unstaking}</span>
            </>
          ) : !publicKey ? (
            <span>{t.selectWallet}</span>
          ) : (
            <span>{mode === "stake" ? t.btnStakeCook : t.btnUnstakeCook}</span>
          )}
        </button>
      </div>
    </div>
  );
};
