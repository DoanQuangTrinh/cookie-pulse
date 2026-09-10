import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  GitFork,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Info,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowDownUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import { HYPERLANE_BRIDGE_URL, COOK_MINT, COOK_SYMBOL } from "../../config/constants";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import confetti from "canvas-confetti";

export const BridgeHelper: React.FC = () => {
  const { publicKey } = useWallet();
  const { cookBalance, adjustDemoBalance, recordActivity, completeQuest, showTxReceipt, chainSlot, isDemoMode } =
    useTokenData();
  const { t } = useLanguage();

  const [direction, setDirection] = useState<"solana-to-cookie" | "cookie-to-solana">(
    "solana-to-cookie"
  );
  const [tokenSymbol, setTokenSymbol] = useState<"COOK" | "USDC">("COOK");
  const [amount, setAmount] = useState<string>("100");
  const [bridging, setBridging] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const sourceChainName =
    direction === "solana-to-cookie" ? "Solana Mainnet" : "Cookie Chain SVM";
  const destChainName =
    direction === "solana-to-cookie" ? "Cookie Chain SVM" : "Solana Mainnet";

  const handleFlipDirection = () => {
    setDirection((prev) =>
      prev === "solana-to-cookie" ? "cookie-to-solana" : "solana-to-cookie"
    );
  };

  const handleSimulateBridge = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    setBridging(true);
    setCurrentStep(1);

    // Step 1: Dispatch Tx (1.2s)
    await new Promise((r) => setTimeout(r, 1200));
    setCurrentStep(2);

    // Step 2: Hyperlane ISM Attestation (1.6s)
    await new Promise((r) => setTimeout(r, 1600));
    setCurrentStep(3);

    // Step 3: Relayer Mint & Finality (1.2s)
    await new Promise((r) => setTimeout(r, 1200));

    // Finish
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let sig = "";
    for (let i = 0; i < 88; i++) sig += chars.charAt(Math.floor(Math.random() * chars.length));

    if (direction === "solana-to-cookie") {
      adjustDemoBalance(numAmount, 0);
    } else {
      adjustDemoBalance(-numAmount, 0);
    }

    recordActivity({
      type: "bridge",
      title: `Bridged ${numAmount} ${tokenSymbol} via Hyperlane`,
      details: `${sourceChainName} ➔ ${destChainName} (15/15 ISM Attestation)`,
      amount: `${numAmount} ${tokenSymbol}`,
      txHash: sig,
      status: "confirmed",
    });

    completeQuest("quest-bridge");

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a855f7", "#f59e0b", "#10b981"],
    });

    showTxReceipt({
      title: "Cross-Chain Bridge Transfer Complete",
      summary: `Transferred ${numAmount} ${tokenSymbol} from ${sourceChainName} to ${destChainName} via Hyperlane Warp Route.`,
      txHash: sig,
      slot: chainSlot > 0 ? chainSlot : 24238990,
      executionTimeMs: 4000,
      actionType: "bridge",
    });

    setBridging(false);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-obsidian-900 to-amber-950/40 border border-purple-500/20 shadow-card-subtle backdrop-blur-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Hyperlane Warp Route • Native SVM Interoperability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Cổng Bridge Cookie Chain ⇄ Solana
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1 leading-relaxed">
              Chuyển đổi COOK và USDC tỷ lệ 1:1 bảo chứng bởi mạng lưới đa chữ ký m-of-n Interchain Security Modules (ISM).
            </p>
          </div>

          <a
            href={HYPERLANE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cookie-500 hover:from-purple-500 hover:to-cookie-400 text-white font-bold text-sm shadow-cookie-glow hover:shadow-cookie-glow-lg flex items-center gap-2 shrink-0 transition-all duration-200"
          >
            <span>Hyperlane Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Interactive Bridge Simulator Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <GitFork className="w-4 h-4 text-purple-400" />
            <span>Mô Phỏng Giao Dịch Chuyển Tài Sản Chuỗi Chéo</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            0% Protocol Fee
          </span>
        </div>

        {/* Chain Route Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          {/* Source Chain */}
          <div className="sm:col-span-3 p-4 rounded-2xl bg-obsidian-950/80 border border-white/[0.06] flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Chuỗi Gốc (From)</span>
            <span className="font-bold text-white text-base flex items-center gap-2 font-sans">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              {sourceChainName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {direction === "solana-to-cookie" ? "Phantom / Solflare / Nightly" : "Cookie Chain RPC"}
            </span>
          </div>

          {/* Swap Direction Button */}
          <div className="sm:col-span-1 flex justify-center">
            <button
              onClick={handleFlipDirection}
              className="p-3 rounded-full bg-obsidian-950 border border-purple-500/30 text-purple-300 hover:text-white hover:scale-110 shadow-lg transition-all"
              title="Đảo chiều Bridge"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Chain */}
          <div className="sm:col-span-3 p-4 rounded-2xl bg-obsidian-950/80 border border-white/[0.06] flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Chuỗi Đích (To)</span>
            <span className="font-bold text-white text-base flex items-center gap-2 font-sans">
              <span className="w-3 h-3 rounded-full bg-cookie-400" />
              {destChainName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {direction === "solana-to-cookie" ? "Nightly Wallet • Sub-second" : "Solana Mainnet Custody"}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Số Lượng Muốn Chuyển</span>
            <span>
              Số dư: <strong className="text-slate-200">{cookBalance.toFixed(2)} COOK</strong>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-white outline-none placeholder-slate-600"
              placeholder="0.0"
            />

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-obsidian-850 border border-white/[0.08] shrink-0 font-bold text-sm text-white font-mono">
              <span>🍪 {tokenSymbol}</span>
            </div>
          </div>
        </div>

        {/* Live Stepper Animation When Bridging */}
        {bridging && (
          <div className="p-5 rounded-2xl bg-obsidian-950/90 border border-purple-500/30 space-y-3 animate-fade-in">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Tiến Trình Chuyển Đổi Hyperlane Warp Route</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {/* Step 1 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  currentStep >= 1
                    ? "bg-purple-500/10 border-purple-500/30 text-white"
                    : "bg-obsidian-900 border-white/[0.04] text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {currentStep > 1 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-obsidian-950 flex items-center justify-center text-[10px]">
                      1
                    </span>
                  )}
                  <span>1. Lock on Source</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentStep >= 1 ? "Khóa tài sản trong Warp Contract" : "Chờ xác nhận..."}
                </p>
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  currentStep >= 2
                    ? "bg-purple-500/10 border-purple-500/30 text-white"
                    : "bg-obsidian-900 border-white/[0.04] text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-obsidian-950 flex items-center justify-center text-[10px]">
                      2
                    </span>
                  )}
                  <span>2. ISM Attestation</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentStep >= 2 ? "15/15 Multisig Validators xác thực" : "Chờ chữ ký..."}
                </p>
              </div>

              {/* Step 3 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  currentStep >= 3
                    ? "bg-purple-500/10 border-purple-500/30 text-white"
                    : "bg-obsidian-900 border-white/[0.04] text-slate-500"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {currentStep >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-obsidian-950 flex items-center justify-center text-[10px]">
                      3
                    </span>
                  )}
                  <span>3. Relayer Mint</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentStep >= 3 ? "Đúc token tới ví đích tức thì" : "Chờ relayer..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bridge Specs Table */}
        <div className="p-4 rounded-2xl bg-obsidian-950/50 border border-white/[0.04] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">Thời Gian Ước Tính</span>
            <span className="text-white font-semibold">~42 giây</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Phí Giao Thức</span>
            <span className="text-emerald-400 font-semibold">0.00%</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Bảo Mật</span>
            <span className="text-purple-300 font-semibold">m-of-n ISM Multisig</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Phí Gas Đích</span>
            <span className="text-cookie-300 font-semibold">&lt; 0.000005 COOK</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSimulateBridge}
          disabled={bridging || !amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base font-sans flex items-center justify-center gap-2 transition-all duration-200 ${
            bridging || !amount || parseFloat(amount) <= 0
              ? "bg-obsidian-800 text-slate-600 cursor-not-allowed border border-white/[0.04]"
              : "bg-gradient-to-r from-purple-600 via-cookie-500 to-amber-500 hover:from-purple-500 hover:to-cookie-400 text-obsidian-950 font-black shadow-cookie-glow cursor-pointer active:scale-95"
          }`}
        >
          {bridging ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-obsidian-950" />
              <span>Đang Thực Thi Hyperlane Warp Route...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Bridge {amount || "0"} {tokenSymbol} Tới {destChainName}</span>
            </>
          )}
        </button>
      </div>

      {/* Step by step interactive walkthrough */}
      <div className="p-6 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 font-mono uppercase">
          <Info className="w-4 h-4 text-cookie-400" />
          <span>Quy Trình Hoạt Động Của Hyperlane Warp Route</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-cookie-500/10 border border-cookie-500/20 text-cookie-400 font-mono font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-semibold text-white text-xs">1. Khóa / Ký Giao Dịch Gốc</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Người dùng gửi lệnh chuyển. Hợp đồng nguồn khóa COOK trên Solana hoặc burn trên Cookie Chain.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-semibold text-white text-xs">2. Xác Thực Đa Chữ Ký ISM</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Hyperlane ISM tập hợp chứng thực từ 15 validator phi tập trung độc lập để đảm bảo an toàn tuyệt đối.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-semibold text-white text-xs">3. Nhận Tiền Trong &lt; 45s</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Relayer thực thi đúc token vào ví đích. Người dùng có thể swap, stake hoặc dùng bot ngay tức thì.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
