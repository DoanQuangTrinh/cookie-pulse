import React, { useState } from "react";
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
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import confetti from "canvas-confetti";

const LOGO_PRESETS = [
  { label: "Cookie", icon: "🍪", url: "/cookie-logo.svg" },
  { label: "AI Agent", icon: "🤖", url: "https://api.dicebear.com/7.x/bottts/svg?seed=cook" },
  { label: "Fire Flame", icon: "🔥", url: "https://api.dicebear.com/7.x/identicon/svg?seed=fire" },
  { label: "Diamond", icon: "💎", url: "https://api.dicebear.com/7.x/identicon/svg?seed=diamond" },
  { label: "Rocket", icon: "🚀", url: "https://api.dicebear.com/7.x/identicon/svg?seed=rocket" },
];

export const CookPad: React.FC = () => {
  const { publicKey } = useWallet();
  const { deployToken, isDemoMode, cookBalance } = useTokenData();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000000");
  const [decimals, setDecimals] = useState(9);
  const [description, setDescription] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [revokeMint, setRevokeMint] = useState(true);
  const [disableFreeze, setDisableFreeze] = useState(true);
  const [deploying, setDeploying] = useState(false);

  const activeLogo = customLogoUrl.trim() ? customLogoUrl : LOGO_PRESETS[selectedPresetIndex].url;

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

      // Clear form
      setName("");
      setSymbol("");
      setDescription("");
    } catch (err) {
      console.error("Token deployment failed:", err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-900/90 to-cookie-950/40 border border-cookie-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rocket className="w-44 h-44 text-cookie-400" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cookie-500/10 border border-cookie-500/30 text-xs font-mono font-bold text-cookie-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cookie-400" />
            <span>CookPad • 1-Click SVM Launcher</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Khởi Tạo Token & Memecoin Trên Cookie Chain
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-mono mt-2 leading-relaxed">
            Phát hành SPL Token hoặc AI Agent Token trong vòng 10 giây với chuẩn SVM tốc độ cao, phí gas &lt; 0.000005 COOK, tự động xác thực trên CookieScan.
          </p>
        </div>
      </div>

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
              Live Preview Trên Radar & DEX
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
                  <span className="text-slate-500 text-[10px] block">Giá Khởi Điểm</span>
                  <span className="text-cookie-300 font-semibold">$0.000085</span>
                </div>
              </div>
            </div>

            {/* Superteam Advantages Callout */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 flex flex-col gap-2.5 text-xs font-mono text-slate-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Lợi Thế Của Cookie Chain SVM:
              </div>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>• **Sub-second deployment**: Hoàn tất trong chưa đầy 500ms.</li>
                <li>• **CookieScan DAS indexing**: Tự động hiển thị trên explorer.</li>
                <li>• **Zero-friction sandbox**: Test được ngay cả khi ví chưa có tiền.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
