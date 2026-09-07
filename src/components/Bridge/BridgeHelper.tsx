import React, { useState } from "react";
import {
  GitFork,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Info,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { HYPERLANE_BRIDGE_URL, COOK_MINT, COOK_SYMBOL } from "../../config/constants";
import { useTokenData } from "../../context/TokenDataContext";

export const BridgeHelper: React.FC = () => {
  const { cookBalance } = useTokenData();
  const [direction, setDirection] = useState<"cookie-to-solana" | "solana-to-cookie">(
    "solana-to-cookie"
  );
  const [amount, setAmount] = useState<string>("100");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-obsidian-900 to-amber-950/40 border border-purple-500/20 shadow-card-subtle backdrop-blur-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Hyperlane Warp Route</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cookie Chain ⇄ Solana Bridge
            </h2>
            <p className="text-sm text-slate-300">
              Move COOK tokens 1:1 instantly with institutional-grade m-of-n community multisig custody.
            </p>
          </div>

          <a
            href={HYPERLANE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cookie-500 hover:from-purple-500 hover:to-cookie-400 text-white font-bold text-sm shadow-cookie-glow hover:shadow-cookie-glow-lg flex items-center gap-2 shrink-0 transition-all duration-200"
          >
            <span>Open Bridge Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Step by step interactive walkthrough */}
      <div className="p-6 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-6">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Info className="w-4 h-4 text-cookie-400" />
          <span>How Bridging Works (Step-by-Step Guide)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cookie-500/10 border border-cookie-500/20 text-cookie-400 font-mono font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-semibold text-white text-sm">Select Direction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridge from <strong>Solana mainnet</strong> to Cookie Chain to fund your wallet for gas and DeFi, or back to Solana at any time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-semibold text-white text-sm">Sign 1 Source Tx</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatch the transfer with a single click. Hyperlane interchain security modules verify the transfer automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-semibold text-white text-sm">Sub-Minute Arrival</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Hyperlane relayer automatically credits your destination wallet. Ready to swap, stake, or game immediately!
            </p>
          </div>
        </div>

        {/* Technical Architecture Comparison Box */}
        <div className="p-4 rounded-2xl bg-obsidian-950/50 border border-white/[0.06] space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Warp Route Technical Specifications
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/[0.04] space-y-1">
              <span className="text-cookie-400 font-bold">Cookie Chain Side:</span>
              <p className="text-slate-300">Asset: Native COOK (9 decimals)</p>
              <p className="text-slate-500 break-all text-[11px]">
                Mint: So11111111111111111111111111111111111111112
              </p>
              <p className="text-emerald-400 text-[11px]">Sub-second finality, ~$0.000001 gas</p>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-900 border border-white/[0.04] space-y-1">
              <span className="text-purple-400 font-bold">Solana Mainnet Side:</span>
              <p className="text-slate-300">Asset: Token-2022 COOK (6 decimals)</p>
              <p className="text-slate-500 break-all text-[11px]">
                Mint: 36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1
              </p>
              <p className="text-slate-400 text-[11px]">Traded on Jupiter (JUP) aggregator</p>
            </div>
          </div>
        </div>

        {/* Safety Checklist */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200/90 leading-relaxed">
            <strong>Preflight Safety Guaranteed:</strong> The bridge route releases from a dedicated collateral escrow on the receiving chain. No central custodian or single private key can pause or drain funds.
          </div>
        </div>
      </div>
    </div>
  );
};
