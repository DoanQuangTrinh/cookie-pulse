import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ExternalLink, Flame, ShieldCheck, Activity, Copy, Check } from "lucide-react";
import { useTokenData } from "../context/TokenDataContext";
import { HYPERLANE_BRIDGE_URL, EXPLORER_URL } from "../config/constants";
import { resolveCookDomain } from "../services/domainService";

export const Navbar: React.FC = () => {
  const { publicKey } = useWallet();
  const { cookUsd, cookBalance, bCookBalance, chainSlot } = useTokenData();
  const [domain, setDomain] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

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

  const handleCopy = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand & Network Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-cookie-500 to-amber-600 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <img
                src="/cookie-logo.svg"
                alt="Cookie Chain Logo"
                className="relative w-10 h-10 rounded-xl object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Cookie<span className="text-cookie-400">Pulse</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-cookie-500/10 text-cookie-300 border border-cookie-500/30">
                  cApp
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Cookie Chain SVM Terminal
              </p>
            </div>
          </div>

          {/* Live Network & Price Metric */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/[0.08]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/[0.06] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-slate-300">SVM Mainnet</span>
              {chainSlot > 0 && (
                <span className="font-mono text-slate-500 text-[10px] pl-1">
                  #{chainSlot.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cookie-500/10 border border-cookie-500/20 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-cookie-400" />
              <span className="text-slate-300">COOK:</span>
              <span className="font-bold text-cookie-300">
                ${cookUsd.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools & Wallet Connection */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bridge Link */}
          <a
            href={HYPERLANE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all duration-200"
          >
            <span>Hyperlane Bridge</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Explorer Link */}
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition-all duration-200"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Nightly Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Nightly Ready</span>
          </div>

          {/* Connected User Balances */}
          {publicKey && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-white/[0.08] text-xs font-mono">
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
          )}

          {/* Custom Wallet Button */}
          <div className="flex items-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-cookie-500 !to-amber-500 !hover:from-cookie-400 !hover:to-amber-400 !text-obsidian-950 !font-semibold !rounded-xl !h-10 !text-sm !shadow-cookie-glow !transition-all !duration-200" />
          </div>
        </div>
      </div>
    </header>
  );
};
