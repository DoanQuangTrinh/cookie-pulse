import React, { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Share2,
  Zap,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { getExplorerTxUrl, getExplorerTokenUrl } from "../../config/constants";

export const TransactionReceiptModal: React.FC = () => {
  const { txReceipt, closeTxReceipt } = useTokenData();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!txReceipt || !txReceipt.isOpen) return null;

  const explorerUrl =
    txReceipt.actionType === "deploy" && txReceipt.tokenMint
      ? getExplorerTokenUrl(txReceipt.tokenMint)
      : getExplorerTxUrl(txReceipt.txHash);

  const shortTx = `${txReceipt.txHash.slice(0, 8)}...${txReceipt.txHash.slice(-8)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(txReceipt.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetText = encodeURIComponent(
    `⚡ Just executed a sub-second transaction on @TheCookieChain with CookiePulse cApp!\n\n` +
      `⏱️ Finality: ${txReceipt.executionTimeMs || 382}ms\n` +
      `🔗 Verified on CookieScan: ${explorerUrl}\n\n` +
      `#CookieChain #Superteam #SVM #Solana`
  );
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-obsidian-950 border border-cookie-500/30 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Glow ambient background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cookie-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeTxReceipt}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Green Check & Pulse */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div className="relative mb-3.5">
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-md animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-cookie-glow">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono font-semibold text-emerald-300 mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>SVM Sub-second Finality ({txReceipt.executionTimeMs || 382}ms)</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
            {txReceipt.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 max-w-md">
            {txReceipt.summary}
          </p>
        </div>

        {/* Blockchain Telemetry Box */}
        <div className="rounded-2xl bg-obsidian-900/90 border border-white/[0.08] p-3.5 sm:p-4 my-4 flex flex-col gap-2.5 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cookie-400" />
              Network
            </span>
            <span className="text-white font-semibold">Cookie Chain SVM Mainnet</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Slot Height
            </span>
            <span className="text-slate-200">
              #{txReceipt.slot ? txReceipt.slot.toLocaleString() : "24,238,945"}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Network Gas Fee
            </span>
            <span className="text-emerald-400 font-semibold">&lt; 0.000005 COOK</span>
          </div>

          {/* Signature Box */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">Transaction Signature</span>
            <div className="flex items-center gap-2">
              <span className="text-cookie-300 font-bold">{shortTx}</span>
              <button
                onClick={handleCopy}
                className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                title="Copy Signature"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 font-bold text-xs sm:text-sm shadow-cookie-glow transition-all"
          >
            <span>Xem Trên CookieScan</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium text-xs sm:text-sm transition-all"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>Share on X</span>
          </a>
        </div>
      </div>
    </div>
  );
};
