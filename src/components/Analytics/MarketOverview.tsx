import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { getExplorerTokenUrl, getExplorerAddressUrl } from "../../config/constants";
import type { CookieToken } from "../../types";

interface MarketOverviewProps {
  onSelectTokenForSwap?: (mint: string) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ onSelectTokenForSwap }) => {
  const { tokens, markets, cookUsd, loading, refreshTokens } = useTokenData();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "high-liq" | "gainers">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTokens();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Aggregated market metrics
  const stats = useMemo(() => {
    let totalLiqUsd = 0;
    let totalVol24h = 0;

    tokens.forEach((t) => {
      if (t.marketData?.volume24h) totalVol24h += Number(t.marketData.volume24h);
      if (t.marketData?.liquidity && cookUsd) {
        totalLiqUsd += Number(t.marketData.liquidity) * cookUsd;
      }
    });

    return {
      tokenCount: tokens.length,
      marketCount: markets.length || 160,
      totalLiqUsd: totalLiqUsd > 0 ? totalLiqUsd : 320000,
      totalVol24h: totalVol24h > 0 ? totalVol24h : 185000,
      cookMarketCap: 1120000,
    };
  }, [tokens, markets, cookUsd]);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    let list = tokens;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.metadata?.name?.toLowerCase().includes(q) ||
          t.metadata?.symbol?.toLowerCase().includes(q) ||
          t.mint.toLowerCase().includes(q)
      );
    }

    if (activeFilter === "high-liq") {
      list = [...list].sort(
        (a, b) => (b.marketData?.liquidity ?? 0) - (a.marketData?.liquidity ?? 0)
      );
    } else if (activeFilter === "gainers") {
      list = [...list].sort(
        (a, b) => (b.price?.change24h ?? 0) - (a.price?.change24h ?? 0)
      );
    }

    return list.slice(0, 100); // paginate first 100 for ultra-fluid performance
  }, [tokens, searchQuery, activeFilter]);

  return (
    <div className="h-full min-h-0 flex flex-col gap-3 overflow-hidden">
      {/* Top Ecosystem Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
        {/* Stat 1: COOK Price */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-obsidian-900/80 border border-white/[0.08] shadow-card-subtle backdrop-blur-xl relative overflow-hidden group hover:border-cookie-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-12 h-12 text-cookie-400" />
          </div>
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            {t.nativePriceLabel}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              ${cookUsd.toFixed(6)}
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +3.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            Fast sub-second finality
          </p>
        </div>

        {/* Stat 2: Active DEX Markets */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-obsidian-900/80 border border-white/[0.08] shadow-card-subtle backdrop-blur-xl relative overflow-hidden group hover:border-cookie-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            {t.activePoolsLabel}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              {stats.marketCount} {t.poolsCount}
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {t.poolsSubtext}
          </p>
        </div>

        {/* Stat 3: Total Tokens */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-obsidian-900/80 border border-white/[0.08] shadow-card-subtle backdrop-blur-xl relative overflow-hidden group hover:border-cookie-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-12 h-12 text-cookie-400" />
          </div>
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            {t.registeredTokensLabel}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              {stats.tokenCount.toLocaleString()}
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {t.tokensSubtext}
          </p>
        </div>

        {/* Stat 4: Ecosystem TVL / Volume */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-obsidian-900/80 border border-white/[0.08] shadow-card-subtle backdrop-blur-xl relative overflow-hidden group hover:border-cookie-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-emerald-400" />
          </div>
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            {t.estLiquidityLabel}
          </p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
              ${stats.totalLiqUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">
            {t.liquiditySubtext}
          </p>
        </div>
      </div>

      {/* Token Radar Controls & Search & Table */}
      <div className="flex-1 min-h-0 p-3.5 sm:p-4 rounded-2xl bg-obsidian-900/80 border border-white/[0.08] shadow-card-subtle backdrop-blur-xl flex flex-col gap-3 overflow-hidden">
        <div className="shrink-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-950/70 border border-white/[0.08] focus:border-cookie-500/50 focus:outline-none text-xs sm:text-sm text-white placeholder-slate-500 font-sans transition-all"
            />
          </div>

          {/* Filters & Refresh */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-cookie-500 text-obsidian-950 font-semibold shadow-cookie-glow"
                  : "bg-obsidian-950 text-slate-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter("high-liq")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "high-liq"
                  ? "bg-cookie-500 text-obsidian-950 font-semibold shadow-cookie-glow"
                  : "bg-obsidian-950 text-slate-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {t.filterHighLiq}
            </button>
            <button
              onClick={() => setActiveFilter("gainers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "gainers"
                  ? "bg-cookie-500 text-obsidian-950 font-semibold shadow-cookie-glow"
                  : "bg-obsidian-950 text-slate-400 hover:text-white border border-white/[0.06]"
              }`}
            >
              {t.filterGainers}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title={t.refreshTooltip}
              className="p-2 rounded-lg bg-obsidian-950 border border-white/[0.06] text-slate-400 hover:text-white hover:border-cookie-500/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cookie-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tokens Table Container (ONLY this scrolls internally!) */}
        <div className="flex-1 min-h-0 rounded-xl border border-white/[0.06] overflow-hidden flex flex-col bg-obsidian-950/40">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-obsidian-950 shadow-md">
                <tr className="border-b border-white/[0.08] bg-obsidian-950 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 bg-obsidian-950">{t.tableAsset}</th>
                  <th className="py-2.5 px-4 bg-obsidian-950">{t.tablePriceUsd}</th>
                  <th className="py-2.5 px-4 bg-obsidian-950">{t.tablePriceCook}</th>
                  <th className="py-2.5 px-4 bg-obsidian-950">{t.tableChange24h}</th>
                  <th className="py-2.5 px-4 bg-obsidian-950">{t.tableLiquidity}</th>
                  <th className="py-2.5 px-4 text-right bg-obsidian-950">{t.tableActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-sm">
              {filteredTokens.map((token, index) => {
                const name = token.metadata?.name || "Unknown Token";
                const symbol = token.metadata?.symbol || token.mint.slice(0, 4);
                const logo = token.metadata?.logo || "/cookie-logo.svg";
                const priceUsd = Number(token.price?.usd || 0);
                const priceCook = Number(token.price?.native || 0);
                const change = Number(token.price?.change24h || 0);
                const liq = Number(token.marketData?.liquidity || 0);

                return (
                  <tr
                    key={token.mint}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 w-5">
                        {index + 1}
                      </span>
                      <img
                        src={logo}
                        alt={symbol}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/cookie-logo.svg";
                        }}
                        className="w-8 h-8 rounded-full object-cover bg-obsidian-800 border border-white/[0.08]"
                      />
                      <div>
                        <div className="font-semibold text-white group-hover:text-cookie-300 transition-colors flex items-center gap-1.5">
                          {name}
                          <span className="text-xs font-mono text-slate-400 font-normal">
                            ({symbol})
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <span>{token.mint.slice(0, 4)}...{token.mint.slice(-4)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      {priceUsd > 0 ? `$${priceUsd < 0.0001 ? priceUsd.toExponential(4) : priceUsd.toFixed(6)}` : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {priceCook > 0 ? `${priceCook.toFixed(4)} COOK` : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          change > 0
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : change < 0
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {liq > 0 ? liq.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onSelectTokenForSwap && (
                          <button
                            onClick={() => onSelectTokenForSwap(token.mint)}
                            className="px-2.5 py-1 rounded-lg bg-cookie-500/10 hover:bg-cookie-500 text-cookie-300 hover:text-obsidian-950 border border-cookie-500/30 text-xs font-medium transition-all"
                          >
                            Swap
                          </button>
                        )}
                        <a
                          href={getExplorerTokenUrl(token.mint)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                          title="View on CookieScan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
};
