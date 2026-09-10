import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Cookie,
  Sparkles,
  Flame,
  Award,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Dice5,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useTokenData } from "../../context/TokenDataContext";
import { COOKIE_JAR_VAULT, getExplorerTxUrl } from "../../config/constants";
import { sounds } from "../../services/soundEffects";
import { useLanguage } from "../../context/LanguageContext";
import type { FortuneResult } from "../../types";

const FORTUNES = [
  "The baker who holds through the dip shall feast upon the sweetest crumbs.",
  "Sub-second finality has aligned your stars today. A 10x gem awaits in the next block.",
  "He who stakes $COOK for $bCOOK never sleeps with an empty jar.",
  "Nightly wallet has unlocked your true degen potential. WAGMI!",
  "A mysterious whale from Solana mainnet is bridging $COOK right now.",
  "Bake your stake, compound your crumbs, let the validators do the work.",
  "High APY favors the bold. The oven temperature is optimal.",
  "Gas fees on Cookie Chain are so low, even your micro-crumbs will compound into gold.",
  "Today is the day you discover the next 100x memecoin on Cookiebox.",
  "Trust the SVM, bridge the COOK, taste the future of decentralized speed.",
];

export const FortuneCookieCard: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const {
    cookBalance,
    isDemoMode,
    adjustDemoBalance,
    addToast,
    refreshBalances,
    showTxReceipt,
    chainSlot,
  } = useTokenData();
  const { t } = useLanguage();

  const [cracking, setCracking] = useState<boolean>(false);
  const [isCracked, setIsCracked] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
  const [history, setHistory] = useState<FortuneResult[]>([
    {
      id: "demo-1",
      fortune: "The baker who holds through the dip shall feast upon the sweetest crumbs.",
      luckyNumbers: [7, 23, 42, 69, 88],
      multiplier: 2.5,
      rewardCook: 0.25,
      timestamp: Date.now() - 1000 * 60 * 12,
      txHash: "5vNxT9wL...3B",
    },
    {
      id: "demo-2",
      fortune: "Sub-second finality has aligned your stars today. A 10x gem awaits!",
      luckyNumbers: [3, 14, 28, 55, 77],
      multiplier: 5.0,
      rewardCook: 0.5,
      timestamp: Date.now() - 1000 * 60 * 35,
      txHash: "8mFzK2pQ...7Z",
    },
  ]);

  const handleCrackCookie = async () => {
    // Check wallet unless in Demo mode
    if (!publicKey && !isDemoMode) {
      addToast({
        type: "error",
        title: "Wallet Not Connected",
        message: "Connect your Nightly or Solana wallet (or enable Demo Mode in the top bar) to crack.",
      });
      return;
    }

    setCracking(true);
    sounds.playCookieCrack();

    // Pick random fortune & multiplier
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    const luckyNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 90) + 1);
    
    // Weighted multipliers: 1x (60%), 2x (25%), 5x (12%), 10x JACKPOT (3%)
    const roll = Math.random();
    let multiplier = 1.0;
    if (roll > 0.97) multiplier = 10.0;
    else if (roll > 0.85) multiplier = 5.0;
    else if (roll > 0.60) multiplier = 2.0;

    const betAmount = 0.1;
    const rewardCook = Number((betAmount * multiplier).toFixed(4));

    try {
      let txSig = `sim-${Math.random().toString(36).substring(2, 10)}`;

      if (publicKey && !isDemoMode) {
        // Execute real SVM micro-transaction
        const tx = new Transaction();
        tx.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: COOKIE_JAR_VAULT,
            lamports: Math.floor(betAmount * LAMPORTS_PER_SOL),
          })
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;
        tx.feePayer = publicKey;

        txSig = await sendTransaction(tx, connection);
        await connection.confirmTransaction(
          { signature: txSig, blockhash, lastValidBlockHeight },
          "confirmed"
        );
        refreshBalances();
      } else {
        // Demo Sandbox Mode: immediate feedback
        adjustDemoBalance(rewardCook - betAmount, 0);
      }

      const result: FortuneResult = {
        id: Math.random().toString(),
        fortune: randomFortune,
        luckyNumbers,
        multiplier,
        rewardCook,
        timestamp: Date.now(),
        txHash: txSig,
      };

      // Crack animation delay
      setTimeout(() => {
        setIsCracked(true);
        setCurrentResult(result);
        setHistory([result, ...history]);
        setCracking(false);

        showTxReceipt({
          title: `Fortune Cookie Cracked (${multiplier}x Multiplier)`,
          summary: `Inscribed fortune on Cookie Chain SVM: "${randomFortune.slice(0, 50)}..." and won ${rewardCook} COOK!`,
          txHash: txSig,
          slot: chainSlot > 0 ? chainSlot : 24239020,
          executionTimeMs: 365,
          actionType: "fortune",
        });

        if (multiplier >= 5.0) {
          sounds.playSuccess();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ["#f59e0b", "#fbbf24", "#ec4899", "#8b5cf6"],
          });
          addToast({
            type: "success",
            title: `🎰 ${multiplier}X JACKPOT CRACKED!`,
            message: `You won ${rewardCook} COOK! Fortune inscribed on Cookie Chain.`,
            txHash: txSig.startsWith("sim-") ? undefined : txSig,
          });
        } else {
          sounds.playCoin();
          addToast({
            type: "success",
            title: "Fortune Unlocked!",
            message: `Cookie cracked with ${multiplier}x payout. Sub-second proof confirmed.`,
            txHash: txSig.startsWith("sim-") ? undefined : txSig,
          });
        }
      }, 500);
    } catch (err: any) {
      console.error("Cookie crack failed:", err);
      setCracking(false);
      addToast({
        type: "error",
        title: "Crack Failed",
        message: err?.message || "Transaction was rejected.",
      });
    }
  };

  const handleResetCookie = () => {
    sounds.playClick();
    setIsCracked(false);
    setCurrentResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-obsidian-900 to-cookie-950/40 border border-cookie-500/20 shadow-card-subtle backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cookie-500/10 text-cookie-300 border border-cookie-500/30 mb-2">
              <Flame className="w-3.5 h-3.5 text-cookie-400" />
              <span>Degen Culture & Fast Finality</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {t.fortuneTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t.fortuneDesc}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs px-4 py-2 rounded-2xl bg-obsidian-950/80 border border-white/[0.08]">
            <span className="text-slate-400">{t.fortuneCost}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{t.fortuneMaxWin}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Cookie Stage (3 cols) */}
        <div className="lg:col-span-3 p-8 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute w-64 h-64 bg-cookie-500/10 rounded-full blur-3xl pointer-events-none" />

          {!isCracked ? (
            <div className="space-y-6 py-4">
              {/* Interactive Cookie Graphic */}
              <div
                onClick={!cracking ? handleCrackCookie : undefined}
                className={`relative cursor-pointer group select-none transition-transform duration-300 ${
                  cracking ? "animate-wiggle scale-95" : "hover:scale-105 active:scale-95"
                }`}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-cookie-500 to-amber-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition duration-300" />
                <img
                  src="/cookie-logo.svg"
                  alt="Fortune Cookie"
                  className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-2xl relative"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 rounded-full bg-obsidian-950/90 text-cookie-300 text-xs font-mono font-bold border border-cookie-500/40 shadow-cookie-glow">
                    {t.fortuneClickPrompt}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {cracking ? t.cracking : "Ready to reveal your destiny?"}
                </p>
                <p className="text-xs font-mono text-slate-400">
                  {t.fortuneSubtext}
                </p>
              </div>

              <button
                onClick={handleCrackCookie}
                disabled={cracking}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide uppercase transition-all duration-200 flex items-center gap-2 mx-auto ${
                  cracking
                    ? "bg-cookie-600 text-obsidian-950 cursor-wait"
                    : "bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 shadow-cookie-glow hover:shadow-cookie-glow-lg"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{t.btnCrackCookie}</span>
              </button>
            </div>
          ) : (
            /* Cracked Result Reveal */
            <div className="w-full space-y-5 animate-slide-in py-2">
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-cookie-500/20 text-cookie-300 border border-cookie-500/40">
                  {currentResult?.multiplier}X {t.multiplier}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  +{currentResult?.rewardCook} COOK REWARD
                </span>
              </div>

              {/* The Fortune Slip */}
              <div className="p-6 rounded-2xl bg-amber-50 text-slate-900 shadow-2xl border border-amber-200/80 transform -rotate-1 relative">
                <div className="absolute top-2 left-3 text-[10px] font-mono tracking-widest uppercase text-amber-800/60">
                  Cookie Chain Prophecy
                </div>
                <p className="font-serif italic text-base sm:text-lg text-slate-900 my-3 leading-relaxed">
                  "{currentResult?.fortune}"
                </p>
                <div className="border-t border-amber-300/60 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-amber-900">
                  <span>{t.luckyNumbers}</span>
                  <div className="flex gap-1.5">
                    {currentResult?.luckyNumbers.map((num, i) => (
                      <span
                        key={i}
                        className="w-6 h-6 rounded-full bg-amber-200/80 font-bold flex items-center justify-center text-[11px]"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetCookie}
                  className="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-white/[0.06] border border-white/[0.1] text-xs font-bold text-slate-200 flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.crackAnother}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fortune History (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Dice5 className="w-4 h-4 text-cookie-400" />
              <span>{t.recentFortunesTitle}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">{t.onChainLedgerTitle}</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/[0.04] space-y-2 hover:border-cookie-500/20 transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cookie-300">
                    {item.multiplier}x {t.multiplier}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    +{item.rewardCook} COOK
                  </span>
                </div>
                <p className="text-xs font-serif italic text-slate-300 leading-snug">
                  "{item.fortune.slice(0, 75)}..."
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-white/[0.03]">
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span className="text-slate-400">{item.txHash.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
