import React from "react";
import { Zap, TrendingUp, ShieldCheck, GitFork, Flame, Layers } from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";

export const LiveMarketTicker: React.FC = () => {
  const { cookUsd, chainSlot } = useTokenData();

  const tickerItems = [
    {
      icon: <span className="text-amber-400 font-bold">🍪 COOK</span>,
      text: `$${cookUsd.toFixed(6)}`,
      badge: "+8.4%",
      isPositive: true,
    },
    {
      icon: <Zap className="w-3 h-3 text-cookie-400" />,
      text: "Sub-Second Finality",
      badge: "~380ms",
      badgeColor: "text-cookie-300 bg-cookie-500/10",
    },
    {
      icon: <Layers className="w-3 h-3 text-emerald-400" />,
      text: `SVM Slot #${(chainSlot || 24239120).toLocaleString()}`,
      badge: "1,420 TPS",
      badgeColor: "text-emerald-300 bg-emerald-500/10",
    },
    {
      icon: <Flame className="w-3 h-3 text-rose-400" />,
      text: "Trending: $CAI",
      badge: "+42.6%",
      isPositive: true,
    },
    {
      icon: <GitFork className="w-3 h-3 text-purple-400" />,
      text: "Hyperlane Warp Route",
      badge: "🟢 Online",
      badgeColor: "text-purple-300 bg-purple-500/10",
    },
    {
      icon: <ShieldCheck className="w-3 h-3 text-blue-400" />,
      text: "Avg Gas Fee",
      badge: "< 0.000005 COOK",
      badgeColor: "text-blue-300 bg-blue-500/10",
    },
    {
      icon: <span className="text-amber-400">🌊</span>,
      text: "Total Ecosystem TVL",
      badge: "$482,500",
      badgeColor: "text-amber-300 bg-amber-500/10",
    },
  ];

  return (
    <div className="w-full bg-obsidian-950 border-b border-white/[0.04] overflow-hidden py-1.5 px-4 select-none shrink-0">
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-[11px] font-mono">
        {/* Double for seamless continuous visual loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-default"
          >
            <span className="flex items-center gap-1 text-slate-400">
              {item.icon}
              <span className="text-slate-300 font-medium">{item.text}</span>
            </span>

            {item.badge && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  item.badgeColor
                    ? item.badgeColor
                    : item.isPositive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                }`}
              >
                {item.badge}
              </span>
            )}
            <span className="text-slate-700 mx-1">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
