import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ExternalLink, Flame, Globe, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { useTokenData } from "../context/TokenDataContext";
import { useLanguage } from "../context/LanguageContext";
import { HYPERLANE_BRIDGE_URL, EXPLORER_URL } from "../config/constants";
import { resolveCookDomain } from "../services/domainService";

export const Navbar: React.FC = () => {
  const { publicKey } = useWallet();
  const {
    cookUsd,
    cookBalance,
    bCookBalance,
    chainSlot,
    soundEnabled,
    toggleSound,
    isDemoMode,
    toggleDemoMode,
  } = useTokenData();
  const { lang, setLang, toggleLang, t } = useLanguage();
  const [domain, setDomain] = useState<string | null>(null);

  // Check for .cook domain
  useEffect(() => {
    if (!publicKey) {
      setDomain(null);
      return;
    }
    const checkDomain = async () => {
      // Demo reverse lookup or search primary
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
    <header className="shrink-0 sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/90 backdrop-blur-xl">
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Network Badge */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative group cursor-pointer shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cookie-500 to-amber-600 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <img
                src="/cookie-logo.svg"
                alt="Cookie Chain Logo"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans whitespace-nowrap">
                  Cookie<span className="text-cookie-400">Pulse</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase bg-cookie-500/10 text-cookie-300 border border-cookie-500/30 whitespace-nowrap">
                  cApp
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 hidden sm:block whitespace-nowrap">
                {t.terminalSubtitle}
              </p>
            </div>
          </div>

          {/* Live Network & Price Metric */}
          <div className="hidden md:flex items-center gap-2.5 pl-3 sm:pl-4 border-l border-white/[0.08] shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.06] text-xs shrink-0 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-slate-300">{t.svmMainnet}</span>
              {chainSlot > 0 && (
                <span className="font-mono text-slate-500 text-[10px] pl-1">
                  #{chainSlot.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cookie-500/10 border border-cookie-500/20 text-xs font-mono shrink-0 whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 text-cookie-400" />
              <span className="text-slate-300">{t.cookPrice}</span>
              <span className="font-bold text-cookie-300">
                ${cookUsd.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools, Language, & Wallet Connection */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* External Links (Desktop wide only) */}
          <a
            href={HYPERLANE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all shrink-0 whitespace-nowrap"
          >
            <span>{t.hyperlaneBridge}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all shrink-0 whitespace-nowrap"
          >
            <span>{t.explorer}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Nightly Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300 shrink-0 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.nightlyReady}</span>
          </div>

          {/* Dual Segmented Language Switcher [ 🇻🇳 VI | 🇬🇧 EN ] */}
          <div className="flex items-center p-0.5 rounded-xl bg-obsidian-900 border border-white/[0.08] text-xs font-mono shrink-0 shadow-sm">
            <button
              onClick={() => setLang("vi")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                lang === "vi"
                  ? "bg-cookie-500 text-obsidian-950 font-bold shadow-cookie-glow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tiếng Việt"
            >
              <span>🇻🇳</span>
              <span>VI</span>
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                lang === "en"
                  ? "bg-cookie-500 text-obsidian-950 font-bold shadow-cookie-glow"
                  : "text-slate-400 hover:text-white"
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              soundEnabled
                ? "bg-cookie-500/10 text-cookie-300 border-cookie-500/30 hover:bg-cookie-500/20"
                : "bg-obsidian-900 text-slate-500 border-white/[0.06] hover:text-slate-300"
            }`}
            title={soundEnabled ? t.muteSounds : t.enableSounds}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Sandbox / Demo Mode Pill */}
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all shrink-0 whitespace-nowrap ${
              isDemoMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-cookie-glow"
                : "bg-obsidian-900 text-slate-400 border-white/[0.08] hover:text-white"
            }`}
            title="Toggle Demo Mode with 1,000 COOK sandbox balance"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isDemoMode ? "bg-amber-400 animate-ping" : "bg-slate-500"
              }`}
            />
            <span>{isDemoMode ? t.sandboxMode : t.realSvm}</span>
          </button>

          {/* Connected User Balances */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-white/[0.08] text-xs font-mono shrink-0 whitespace-nowrap">
            <div className="flex items-center gap-1 text-slate-300">
              <span>{cookBalance.toFixed(2)}</span>
              <span className="text-cookie-400 font-semibold">COOK</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <span>{bCookBalance.toFixed(2)}</span>
              <span className="text-amber-300 font-semibold">bCOOK</span>
            </div>
          </div>

          {/* Custom Wallet Button */}
          <div className="flex items-center shrink-0">
            <WalletMultiButton className="!bg-gradient-to-r !from-cookie-500 !to-amber-500 !hover:from-cookie-400 !hover:to-amber-400 !text-obsidian-950 !font-semibold !rounded-xl !h-10 !text-sm !shadow-cookie-glow !transition-all !duration-200 !whitespace-nowrap !shrink-0">
              {publicKey ? (shortAddress ?? t.selectWallet) : t.selectWallet}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </header>
  );
};
