import React, { useState, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Coins,
  History,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import type { ActiveTab } from "../../types";

interface PortfolioViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onNavigateTab }) => {
  const { publicKey } = useWallet();
  const {
    cookBalance,
    bCookBalance,
    cookUsd,
    activityLogs,
  } = useTokenData();
  const { t } = useLanguage();

  const [filterType, setFilterType] = useState<string>("all");

  const bCookRate = 1.2928;
  const cookValueUsd = cookBalance * cookUsd;
  const bCookValueUsd = bCookBalance * bCookRate * cookUsd;
  const totalNetWorthUsd = cookValueUsd + bCookValueUsd;

  // Staking yield estimates
  const estAnnualYieldCook = bCookBalance * bCookRate * 0.148;
  const estAnnualYieldUsd = estAnnualYieldCook * cookUsd;

  const filteredLogs = useMemo(() => {
    if (filterType === "all") return activityLogs;
    return activityLogs.filter((log) => log.type === filterType);
  }, [activityLogs, filterType]);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 py-2 pb-8">
      {/* Top Banner & Net Worth Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Total Net Worth Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-900/90 to-cookie-950/30 border border-white/[0.08] p-6 sm:p-7 shadow-card-subtle backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Tổng Tài Sản (Net Worth)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +12.4% (24h)
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1.5">
                <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
                  ${totalNetWorthUsd.toFixed(4)}
                </h2>
                <span className="text-sm font-mono text-slate-400">
                  ≈ {(cookBalance + bCookBalance * bCookRate).toFixed(2)} COOK
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-obsidian-950 border border-white/[0.08] text-cookie-400 shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Allocation Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Phân Bổ Tài Sản</span>
              <span>
                COOK: {totalNetWorthUsd > 0 ? ((cookValueUsd / totalNetWorthUsd) * 100).toFixed(0) : 0}% • bCOOK: {totalNetWorthUsd > 0 ? ((bCookValueUsd / totalNetWorthUsd) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-obsidian-950 overflow-hidden flex p-0.5 border border-white/[0.06]">
              <div
                className="h-full bg-cookie-500 rounded-l-full transition-all"
                style={{
                  width: `${totalNetWorthUsd > 0 ? (cookValueUsd / totalNetWorthUsd) * 100 : 50}%`,
                }}
              />
              <div
                className="h-full bg-amber-400 rounded-r-full transition-all"
                style={{
                  width: `${totalNetWorthUsd > 0 ? (bCookValueUsd / totalNetWorthUsd) * 100 : 50}%`,
                }}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
            <button
              onClick={() => onNavigateTab("swap")}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cookie-500 hover:bg-cookie-400 text-obsidian-950 font-mono font-bold text-xs shadow-cookie-glow transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Giao Dịch Swap</span>
            </button>
            <button
              onClick={() => onNavigateTab("stake")}
              className="flex-1 py-2.5 px-4 rounded-xl bg-obsidian-950 hover:bg-white/[0.1] text-cookie-300 font-mono font-bold text-xs border border-white/[0.08] transition-all flex items-center justify-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Stake Nhận 14.8% APY</span>
            </button>
          </div>
        </div>

        {/* Staking Positions Summary (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] p-6 sm:p-7 shadow-card-subtle backdrop-blur-2xl flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Coins className="w-4 h-4 text-cookie-400" />
              Vị Thế Staking (bCOOK)
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              14.8% APY
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Số Lượng bCOOK:</span>
              <span className="text-white font-bold">{bCookBalance.toFixed(2)} bCOOK</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Giá Trị Quy Đổi COOK:</span>
              <span className="text-cookie-300 font-semibold">
                ≈ {(bCookBalance * bCookRate).toFixed(2)} COOK
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Lợi Nhuận Năm Ước Tính:</span>
              <span className="text-emerald-400 font-semibold">
                +{estAnnualYieldCook.toFixed(2)} COOK (~${estAnnualYieldUsd.toFixed(4)})
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("stake")}
            className="w-full py-2.5 rounded-xl bg-obsidian-950 hover:bg-white/[0.08] text-white font-mono font-bold text-xs border border-cookie-500/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Quản Lý Staking & Rút Vốn</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Token Holdings Table */}
      <div className="rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-cookie-400" />
          <span>Danh Sách Tài Sản Đang Sở Hữu</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="pb-2.5">Tài Sản</th>
                <th className="pb-2.5">Giá (USD)</th>
                <th className="pb-2.5">Số Dư</th>
                <th className="pb-2.5">Tổng Giá Trị</th>
                <th className="pb-2.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {/* COOK Row */}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/cookie-logo.svg"
                      alt="COOK"
                      className="w-8 h-8 rounded-full bg-obsidian-950 border border-white/[0.08] p-0.5 object-cover"
                    />
                    <div>
                      <div className="font-bold text-white text-sm font-sans">Cookie</div>
                      <div className="text-[10px] text-slate-500">Native Token ($COOK)</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-white">${cookUsd.toFixed(6)}</td>
                <td className="py-3 font-semibold text-white">{cookBalance.toLocaleString()} COOK</td>
                <td className="py-3 text-cookie-300 font-bold">${cookValueUsd.toFixed(4)}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigateTab("swap")}
                    className="px-3 py-1.5 rounded-lg bg-cookie-500/10 hover:bg-cookie-500 text-cookie-300 hover:text-obsidian-950 border border-cookie-500/30 transition-all font-bold text-xs"
                  >
                    Swap
                  </button>
                </td>
              </tr>

              {/* bCOOK Row */}
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/cookie-logo.svg"
                      alt="bCOOK"
                      className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 p-0.5 object-cover"
                    />
                    <div>
                      <div className="font-bold text-white text-sm font-sans">Baked COOK</div>
                      <div className="text-[10px] text-slate-500">Liquid Staked ($bCOOK)</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-white">${(cookUsd * bCookRate).toFixed(6)}</td>
                <td className="py-3 font-semibold text-white">{bCookBalance.toFixed(2)} bCOOK</td>
                <td className="py-3 text-cookie-300 font-bold">${bCookValueUsd.toFixed(4)}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigateTab("stake")}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-obsidian-950 border border-amber-500/30 transition-all font-bold text-xs"
                  >
                    Unstake
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* On-Chain Activity History */}
      <div className="rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cookie-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
              Nhật Ký Hoạt Động On-Chain ({activityLogs.length})
            </h3>
          </div>

          {/* Filter pills */}
          <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-white/[0.06] text-xs font-mono">
            {["all", "swap", "stake", "deploy", "bridge"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold transition-all ${
                  filterType === type
                    ? "bg-cookie-500 text-obsidian-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {filteredLogs.map((log) => {
            const timeAgo = Math.floor((Date.now() - log.timestamp) / 1000);
            const timeStr =
              timeAgo < 60
                ? `${timeAgo} giây trước`
                : timeAgo < 3600
                ? `${Math.floor(timeAgo / 60)} phút trước`
                : `${Math.floor(timeAgo / 3600)} giờ trước`;

            return (
              <div
                key={log.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-white/[0.01] transition-colors px-2 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase shrink-0 mt-0.5 ${
                      log.type === "swap"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : log.type === "stake"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : log.type === "deploy"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : log.type === "bridge"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-cookie-500/10 text-cookie-300 border border-cookie-500/20"
                    }`}
                  >
                    {log.type}
                  </span>

                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm font-sans">
                      {log.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {log.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-slate-500">{timeStr}</span>

                  <a
                    href={`https://cookiescan.io/tx/${log.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-obsidian-950 text-cookie-400 hover:text-cookie-300 border border-white/[0.06] transition-colors flex items-center gap-1"
                    title="Xem trên CookieScan"
                  >
                    <span>{log.txHash.slice(0, 6)}...</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
