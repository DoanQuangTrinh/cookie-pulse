import React, { useEffect, useState, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  ExternalLink,
  Flame,
  Globe,
  ShieldCheck,
  Volume2,
  VolumeX,
  ChevronDown,
  BookOpen,
  Terminal,
  Send,
  Sparkles,
} from "lucide-react";
import { useTokenData } from "../context/TokenDataContext";
import { useLanguage } from "../context/LanguageContext";
import { HYPERLANE_BRIDGE_URL, EXPLORER_URL } from "../config/constants";
import { resolveCookDomain } from "../services/domainService";

export const Navbar: React.FC = () => {
  const { publicKey } = useWallet();
  const {
    cookUsd,
    cookBalance,
    chainSlot,
    soundEnabled,
    toggleSound,
    isDemoMode,
    toggleDemoMode,
  } = useTokenData();
  const { lang, setLang, t } = useLanguage();
  const [domain, setDomain] = useState<string | null>(null);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target as Node)) {
        setIsEcosystemOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check for .cook domain
  useEffect(() => {
    if (!publicKey) {
      setDomain(null);
      return;
    }
    const checkDomain = async () => {
      const resolved = await resolveCookDomain("chef.cook");
      if (resolved === publicKey.toBase58()) {
        setDomain("chef.cook");
      }
    };
    checkDomain();
  }, [publicKey]);

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  return (
    <header className="shrink-0 sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/95 backdrop-blur-xl">
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* ================= LEFT: Brand & Live Telemetry ================= */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative group cursor-pointer shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cookie-500 to-amber-600 rounded-xl blur-sm opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <img
                src="/cookie-logo.svg"
                alt="Cookie Chain"
                className="relative w-8 h-8 rounded-xl object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-sans">
                Cookie<span className="text-cookie-400">Pulse</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-cookie-500/10 text-cookie-300 border border-cookie-500/30">
                cApp
              </span>
            </div>
          </div>

          {/* Unified Live Telemetry Capsule */}
          <div className="hidden md:flex items-center pl-3 border-l border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs font-mono">
              {/* SVM Status */}
              <div className="flex items-center gap-1.5" title="Cookie Chain SVM Mainnet (Chain ID 333333333)">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 text-[11px] font-medium">{t.svmMainnet}</span>
              </div>

              <span className="text-slate-600 text-[10px]">•</span>

              {/* Live COOK Price */}
              <div className="flex items-center gap-1" title="Real-time COOK / USD DEX Spot Price">
                <Flame className="w-3 h-3 text-cookie-400" />
                <span className="font-bold text-cookie-300 text-[11px]">
                  ${cookUsd.toFixed(6)}
                </span>
                <span className="text-[9px] text-emerald-400 font-sans font-bold">+3.4%</span>
              </div>

              {/* Slot Height */}
              {chainSlot > 0 && (
                <>
                  <span className="text-slate-600 text-[10px] hidden lg:inline">•</span>
                  <span
                    className="text-slate-500 text-[10px] hidden lg:inline"
                    title={`Current SVM Slot Height: ${chainSlot.toLocaleString()}`}
                  >
                    #{chainSlot.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= CENTER: Ecosystem Dropdown & Nightly Badge ================= */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Nightly Badge (Bounty Requirement Prominence) */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-mono text-purple-300 shadow-sm"
            title="Nightly Wallet Fully Supported on Cookie Chain SVM"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] font-medium">{t.nightlyReady}</span>
          </div>

          {/* Ecosystem Links Dropdown Menu */}
          <div className="relative" ref={ecosystemRef}>
            <button
              onClick={() => setIsEcosystemOpen(!isEcosystemOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                isEcosystemOpen
                  ? "bg-cookie-500/15 text-cookie-300 border border-cookie-500/30"
                  : "bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-white/[0.08]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{t.ecosystem}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isEcosystemOpen ? "rotate-180 text-cookie-400" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Popup */}
            {isEcosystemOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-obsidian-950 border border-white/[0.12] p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
                  Cookie Chain Resources
                </div>

                <a
                  href={EXPLORER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cookie-500/10 text-cookie-400 group-hover:bg-cookie-500/20">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cookie-300">
                        {t.explorer}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">cookiescan.io</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cookie-400" />
                </a>

                <a
                  href={HYPERLANE_BRIDGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-blue-300">
                        {t.hyperlaneBridge}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">hyperlane.cookiescan.io</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-400" />
                </a>

                <a
                  href="https://docs.cookiechain.wtf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-emerald-300">
                        {t.docs}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">docs.cookiechain.wtf</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400" />
                </a>

                <a
                  href="https://rpc.cookiescan.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-amber-300">
                        {t.rpc}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">rpc.cookiescan.io</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="https://t.me/TheCookieNetChain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                        Telegram Community
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">@TheCookieNetChain</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-400" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT: Controls & Wallet Connection ================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Dual Segmented Language Switcher [ 🇻🇳 VI | 🇬🇧 EN ] */}
          <div className="flex items-center p-0.5 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs font-mono shrink-0 shadow-inner">
            <button
              onClick={() => setLang("vi")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                lang === "vi"
                  ? "bg-cookie-500 text-obsidian-950 font-bold shadow-cookie-glow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span className="text-[11px]">VI</span>
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
                lang === "en"
                  ? "bg-cookie-500 text-obsidian-950 font-bold shadow-cookie-glow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span className="text-[11px]">EN</span>
            </button>
          </div>

          {/* Web3 Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
              soundEnabled
                ? "bg-cookie-500/10 text-cookie-300 border-cookie-500/30 hover:bg-cookie-500/20 shadow-cookie-glow"
                : "bg-obsidian-900 text-slate-500 border-white/[0.06] hover:text-slate-300"
            }`}
            title={soundEnabled ? t.muteSounds : t.enableSounds}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Sandbox Toggle Pill */}
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all shrink-0 ${
              isDemoMode
                ? "bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-cookie-glow"
                : "bg-obsidian-900 text-slate-400 border-white/[0.08] hover:text-slate-200"
            }`}
            title="Toggle Demo Mode (1,000 COOK sandbox balance)"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isDemoMode ? "bg-amber-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className="text-[11px] whitespace-nowrap">
              {isDemoMode ? t.sandboxMode : t.realSvm}
            </span>
          </button>

          {/* User Balances (Compact pill) */}
          {(publicKey || isDemoMode) && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/[0.08] text-xs font-mono shrink-0">
              <span className="font-bold text-cookie-300 text-[11px]">
                {cookBalance.toLocaleString()}
              </span>
              <span className="text-cookie-400 text-[9px] uppercase font-bold">COOK</span>
              {domain && (
                <>
                  <span className="text-slate-600 text-[10px]">|</span>
                  <span className="text-amber-300 font-semibold text-[11px]">{domain}</span>
                </>
              )}
            </div>
          )}

          {/* Primary Action: Wallet Connect (Guaranteed Visibility & Spacing) */}
          <div className="flex items-center shrink-0">
            <WalletMultiButton className="!bg-gradient-to-r !from-cookie-500 !to-amber-500 !hover:from-cookie-400 !hover:to-amber-400 !text-obsidian-950 !font-bold !rounded-xl !h-9 !px-3.5 !text-xs !shadow-cookie-glow !transition-all !duration-200 !whitespace-nowrap !shrink-0">
              {publicKey ? (domain || shortAddress) : t.selectWallet}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </header>
  );
};
