import React, { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Rocket,
  ShieldCheck,
  Sparkles,
  Layers,
  Coins,
  Lock,
  ExternalLink,
  Flame,
  Bot,
  Zap,
  Gem,
  CheckCircle2,
  Crown,
  Search,
  Filter,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import confetti from "canvas-confetti";
import type { BondingCurveToken } from "../../types";

const LOGO_PRESETS = [
  { label: "Cookie", icon: "🍪", url: "/cookie-logo.svg" },
  { label: "AI Agent", icon: "🤖", url: "https://api.dicebear.com/7.x/bottts/svg?seed=cook" },
  { label: "Fire Flame", icon: "🔥", url: "https://api.dicebear.com/7.x/identicon/svg?seed=fire" },
  { label: "Diamond", icon: "💎", url: "https://api.dicebear.com/7.x/identicon/svg?seed=diamond" },
  { label: "Rocket", icon: "🚀", url: "https://api.dicebear.com/7.x/identicon/svg?seed=rocket" },
];

export const CookPad: React.FC = () => {
  const { publicKey } = useWallet();
  const { deployToken, bondingTokens, buyBondingToken, cookBalance } = useTokenData();
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<"market" | "launch">("market");
  const [filterMode, setFilterMode] = useState<"all" | "graduating" | "high-vol" | "newest">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Token creation form state
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000000");
  const [decimals] = useState(9);
  const [description, setDescription] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [revokeMint, setRevokeMint] = useState(true);
  const [disableFreeze, setDisableFreeze] = useState(true);
  const [deploying, setDeploying] = useState(false);

  const activeLogo = customLogoUrl.trim() ? customLogoUrl : LOGO_PRESETS[selectedPresetIndex].url;

  // King of the Hill (Token with highest bonding progress)
  const kingOfTheHill = useMemo(() => {
    if (!bondingTokens.length) return null;
    return [...bondingTokens].sort(
      (a, b) => b.bondingProgressPct - a.bondingProgressPct
    )[0];
  }, [bondingTokens]);

  // Filtered bonding tokens
  const filteredTokens = useMemo(() => {
    let list = bondingTokens;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.symbol.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (filterMode === "graduating") {
      list = [...list].filter((t) => t.bondingProgressPct >= 50);
    } else if (filterMode === "high-vol") {
      list = [...list].sort((a, b) => b.volume24hUsd - a.volume24hUsd);
    } else if (filterMode === "newest") {
      list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    }
    return list;
  }, [bondingTokens, searchQuery, filterMode]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim() || !supply) return;

    setDeploying(true);
    try {
      await deployToken({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        decimals,
        initialSupply: parseFloat(supply) || 1000000000,
        description: description.trim() || "Autonomous Token deployed on Cookie Chain SVM",
        logoUrl: activeLogo,
        revokeMintAuthority: revokeMint,
        disableFreezeAuthority: disableFreeze,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899"],
      });

      // Clear form & switch to market
      setName("");
      setSymbol("");
      setDescription("");
      setActiveSubTab("market");
    } catch (err) {
      console.error("Token deployment failed:", err);
    } finally {
      setDeploying(false);
    }
  };

  const handleQuickBuy = async (mint: string, amount: number) => {
    await buyBondingToken(mint, amount);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 py-2 pb-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-900/90 to-cookie-950/40 border border-cookie-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rocket className="w-48 h-48 text-cookie-400" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cookie-500/10 border border-cookie-500/30 text-xs font-mono font-bold text-cookie-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cookie-400" />
            <span>CookPad • Pump.fun-Style SVM Fair Launch</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Sàn Khởi Tạo & Giao Dịch Memecoin Cookie Chain
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-2 leading-relaxed">
            Phát hành và giao dịch token cộng đồng qua cơ chế <strong>Bonding Curve</strong> công bằng.
            Không dev dump, cố định thanh khoản, tự động tốt nghiệp lên <strong>Cookiebox DAMM v2</strong> khi đạt 100% tiến độ.
          </p>
        </div>
      </div>

      {/* Sub-Tab Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="flex items-center bg-obsidian-900/90 rounded-2xl p-1.5 border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => setActiveSubTab("market")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
              activeSubTab === "market"
                ? "bg-cookie-500 text-obsidian-950 shadow-cookie-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Thị Trường Bonding Curve ({bondingTokens.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("launch")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all ${
              activeSubTab === "launch"
                ? "bg-cookie-500 text-obsidian-950 shadow-cookie-glow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Khởi Tạo Token Mới</span>
          </button>
        </div>

        {activeSubTab === "market" && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm token / symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-cookie-500 placeholder:text-slate-600"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-white/[0.06] text-xs font-mono">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "all"
                    ? "bg-white/[0.1] text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tất Cả
              </button>
              <button
                onClick={() => setFilterMode("graduating")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "graduating"
                    ? "bg-amber-500/20 text-amber-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🔥 &gt;50%
              </button>
              <button
                onClick={() => setFilterMode("newest")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterMode === "newest"
                    ? "bg-white/[0.1] text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mới
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MARKET VIEW */}
      {activeSubTab === "market" && (
        <div className="flex flex-col gap-6">
          {/* King of the Hill Spotlight */}
          {kingOfTheHill && (
            <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-obsidian-900 to-amber-900/20 border-2 border-amber-500/30 p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={kingOfTheHill.logoUrl}
                      alt={kingOfTheHill.name}
                      className="w-16 h-16 rounded-2xl bg-obsidian-950 border-2 border-amber-400/40 p-1 object-cover shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/cookie-logo.svg";
                      }}
                    />
                    <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-obsidian-950 shadow-md">
                      <Crown className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                        👑 King of the Hill • Vua Đỉnh Núi
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {kingOfTheHill.bondingProgressPct}% Filled
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white font-sans mt-0.5">
                      {kingOfTheHill.name} (${kingOfTheHill.symbol})
                    </h3>

                    <p className="text-xs text-slate-300 font-mono line-clamp-1 mt-1 max-w-xl">
                      {kingOfTheHill.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Quick Buy */}
                <div className="flex flex-col gap-2.5 w-full sm:w-72 shrink-0">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Tiến Độ Tốt Nghiệp:</span>
                    <span className="text-amber-400 font-bold">
                      {kingOfTheHill.bondingProgressPct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-obsidian-950 border border-white/[0.08] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cookie-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, kingOfTheHill.bondingProgressPct)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleQuickBuy(kingOfTheHill.mint, 10)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-mono font-bold text-xs shadow-cookie-glow transition-all active:scale-95"
                    >
                      Ape 10 COOK
                    </button>
                    <button
                      onClick={() => handleQuickBuy(kingOfTheHill.mint, 50)}
                      className="flex-1 py-2 rounded-xl bg-obsidian-950 hover:bg-white/[0.1] text-amber-300 font-mono font-bold text-xs border border-amber-500/30 transition-all active:scale-95"
                    >
                      Ape 50 COOK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTokens.map((token) => (
              <div
                key={token.mint}
                className="rounded-3xl bg-obsidian-900/80 border border-white/[0.08] p-5 shadow-card-subtle backdrop-blur-xl hover:border-cookie-500/30 transition-all duration-300 flex flex-col justify-between gap-4 group"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={token.logoUrl}
                        alt={token.name}
                        className="w-12 h-12 rounded-2xl bg-obsidian-950 border border-white/[0.08] p-1 object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/cookie-logo.svg";
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base font-sans">
                            {token.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cookie-500/10 text-cookie-400 border border-cookie-500/20">
                            ${token.symbol}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Tạo bởi: {token.creator}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://cookiescan.io/token/${token.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-obsidian-950 text-slate-500 hover:text-cookie-300 border border-white/[0.06] transition-colors"
                      title="Xem trên CookieScan"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-mono text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {token.description}
                  </p>

                  {/* Bonding Curve Progress */}
                  <div className="mt-4 p-3 rounded-2xl bg-obsidian-950/70 border border-white/[0.06] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Tiến Độ Bonding Curve</span>
                      <span className="text-cookie-300 font-bold">
                        {token.bondingProgressPct}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-obsidian-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cookie-500 to-amber-400"
                        style={{ width: `${Math.min(100, token.bondingProgressPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                      <span>Vốn hóa: ${token.marketCapUsd.toLocaleString()}</span>
                      <span>Vol 24h: ${token.volume24hUsd.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Buy Actions */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => handleQuickBuy(token.mint, 10)}
                    className="flex-1 py-2 px-3 rounded-xl bg-cookie-500/10 hover:bg-cookie-500 text-cookie-300 hover:text-obsidian-950 border border-cookie-500/30 font-mono font-bold text-xs transition-all active:scale-95"
                  >
                    +10 COOK
                  </button>
                  <button
                    onClick={() => handleQuickBuy(token.mint, 50)}
                    className="flex-1 py-2 px-3 rounded-xl bg-cookie-500/20 hover:bg-cookie-500 text-cookie-300 hover:text-obsidian-950 border border-cookie-500/40 font-mono font-bold text-xs transition-all active:scale-95"
                  >
                    +50 COOK
                  </button>
                  <button
                    onClick={() => handleQuickBuy(token.mint, 100)}
                    className="py-2 px-3 rounded-xl bg-obsidian-950 hover:bg-white/[0.1] text-slate-300 font-mono font-bold text-xs border border-white/[0.06] transition-all active:scale-95"
                  >
                    +100
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAUNCH TOKEN VIEW */}
      {activeSubTab === "launch" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (7 cols) */}
          <form
            onSubmit={handleDeploy}
            className="lg:col-span-7 rounded-3xl bg-obsidian-900/80 border border-white/[0.08] p-5 sm:p-7 flex flex-col gap-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Coins className="w-4 h-4 text-cookie-400" />
                Thông Tin Token (Metadata)
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                SVM Token-2022 Ready
              </span>
            </div>

            {/* Token Name & Symbol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Tên Token <span className="text-cookie-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Cookie AI Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-cookie-500 transition-colors font-sans placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Ký Hiệu (Symbol) <span className="text-cookie-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: CAI"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.1] text-white text-sm font-mono uppercase focus:outline-none focus:border-cookie-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Supply & Decimals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Tổng Cung Ban Đầu (Supply)
                </label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-cookie-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Số Thập Phân (Decimals)
                </label>
                <input
                  type="number"
                  disabled
                  value={decimals}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950/60 border border-white/[0.06] text-slate-400 text-sm font-mono cursor-not-allowed"
                />
              </div>
            </div>

            {/* Logo Preset Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2">
                Biểu Tượng Token (Avatar Presets)
              </label>
              <div className="flex items-center gap-2 flex-wrap mb-2.5">
                {LOGO_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSelectedPresetIndex(idx);
                      setCustomLogoUrl("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      selectedPresetIndex === idx && !customLogoUrl
                        ? "bg-cookie-500 text-obsidian-950 font-bold shadow-cookie-glow"
                        : "bg-obsidian-950 border border-white/[0.08] text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="text-sm">{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                placeholder="Hoặc nhập URL hình ảnh tùy chỉnh (https://...)"
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-cookie-500 placeholder:text-slate-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Mô Tả Dự Án
              </label>
              <textarea
                rows={2}
                placeholder="Mô tả tóm tắt mục đích token (AI Agent, Memecoin, GameFi)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/[0.1] text-white text-xs font-mono focus:outline-none focus:border-cookie-500 placeholder:text-slate-600"
              />
            </div>

            {/* Security Checklist (Toggles) */}
            <div className="p-3.5 rounded-2xl bg-obsidian-950/80 border border-white/[0.06] flex flex-col gap-2.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                Tiêu Chuẩn An Toàn Hợp Đồng
              </div>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Revoke Mint Authority (Cố định tổng cung sau tạo)
                </span>
                <input
                  type="checkbox"
                  checked={revokeMint}
                  onChange={(e) => setRevokeMint(e.target.checked)}
                  className="w-4 h-4 rounded text-cookie-500 bg-obsidian-900 border-white/[0.2] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Disable Freeze Authority (Không thể đóng băng tài khoản)
                </span>
                <input
                  type="checkbox"
                  checked={disableFreeze}
                  onChange={(e) => setDisableFreeze(e.target.checked)}
                  className="w-4 h-4 rounded text-cookie-500 bg-obsidian-900 border-white/[0.2] focus:ring-0"
                />
              </label>
            </div>

            {/* Deploy Button */}
            <button
              type="submit"
              disabled={deploying || !name.trim() || !symbol.trim()}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm font-sans flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                deploying || !name.trim() || !symbol.trim()
                  ? "bg-obsidian-800 text-slate-600 cursor-not-allowed border border-white/[0.04]"
                  : "bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 shadow-cookie-glow cursor-pointer"
              }`}
            >
              <Rocket className={`w-4 h-4 ${deploying ? "animate-bounce" : ""}`} />
              <span>
                {deploying
                  ? "Đang Khởi Tạo Token Trên SVM..."
                  : "Khởi Tạo Token Trên Cookie Chain"}
              </span>
            </button>
          </form>

          {/* Right Preview Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl bg-obsidian-900/80 border border-white/[0.08] p-5 sm:p-6 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-cookie-400" />
                Live Preview Trên CookPad & Radar
              </h3>

              {/* Simulated Radar Card */}
              <div className="p-4 rounded-2xl bg-obsidian-950 border border-cookie-500/20 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <img
                    src={activeLogo}
                    alt="Token Preview"
                    className="w-12 h-12 rounded-2xl bg-obsidian-900 border border-white/[0.08] p-1 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/cookie-logo.svg";
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-base">
                        {name || "Token Name"}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cookie-500/10 text-cookie-400 border border-cookie-500/20">
                        ${symbol || "SYM"}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Mạng: Cookie Chain SVM Mainnet
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tổng Cung</span>
                    <span className="text-white font-semibold">
                      {parseFloat(supply || "0").toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tiến Độ Ban Đầu</span>
                    <span className="text-cookie-300 font-semibold">1.5% Bonding</span>
                  </div>
                </div>
              </div>

              {/* Superteam Advantages Callout */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex flex-col gap-2.5 text-xs font-mono text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Đặc Quyền Fair Launch Cookie Chain:
                </div>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li>• **Sub-second deployment**: Hoàn tất trong chưa đầy 500ms.</li>
                  <li>• **Bonding Curve Fair Market**: Mọi người đều mua ở cùng công thức giá.</li>
                  <li>• **Auto-Graduation**: Đạt 100% tự động mở pool Cookiebox DAMM v2.</li>
                  <li>• **CookieScan DAS indexing**: Tự động hiển thị trên explorer.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
