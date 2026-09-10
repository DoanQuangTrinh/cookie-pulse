import React, { useState, useEffect } from "react";
import { Activity, ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { TradeOrder } from "../../types";

interface LiveTradeStreamProps {
  cookUsd: number;
}

const INITIAL_TRADES: TradeOrder[] = [
  {
    id: "tr-1",
    type: "buy",
    maker: "Cook9k...41af",
    amountCook: 450,
    priceUsd: 0.000142,
    totalUsd: 0.0639,
    timestamp: Date.now() - 3000,
    txHash: "4tY8X9z1...39kL",
  },
  {
    id: "tr-2",
    type: "buy",
    maker: "Bake7v...192b",
    amountCook: 1200,
    priceUsd: 0.000143,
    totalUsd: 0.1716,
    timestamp: Date.now() - 8000,
    txHash: "7bQ1P4...77dE",
  },
  {
    id: "tr-3",
    type: "sell",
    maker: "Sol8xR...88cc",
    amountCook: 300,
    priceUsd: 0.000141,
    totalUsd: 0.0423,
    timestamp: Date.now() - 15000,
    txHash: "2kR9Lm...41aZ",
  },
  {
    id: "tr-4",
    type: "buy",
    maker: "Whale3...990a",
    amountCook: 5000,
    priceUsd: 0.000142,
    totalUsd: 0.71,
    timestamp: Date.now() - 24000,
    txHash: "9vM2K1...12ff",
  },
  {
    id: "tr-5",
    type: "sell",
    maker: "CookE7...89a2",
    amountCook: 850,
    priceUsd: 0.00014,
    totalUsd: 0.119,
    timestamp: Date.now() - 38000,
    txHash: "3bQ8P2...91ac",
  },
];

export const LiveTradeStream: React.FC<LiveTradeStreamProps> = ({ cookUsd }) => {
  const [trades, setTrades] = useState<TradeOrder[]>(INITIAL_TRADES);

  useEffect(() => {
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.4;
      const amount = Math.floor(100 + Math.random() * 2500);
      const priceVariation = (Math.random() - 0.5) * 0.000004;
      const price = Math.max(0.0001, cookUsd + priceVariation);
      const totalUsd = +(amount * price).toFixed(4);

      const makers = [
        "Cook9k...41af",
        "Bake7v...192b",
        "Whale3...990a",
        "DEXbot...001a",
        "Sol8xR...88cc",
        "Chef4x...22ee",
      ];
      const randomMaker = makers[Math.floor(Math.random() * makers.length)];

      const newTrade: TradeOrder = {
        id: "tr-" + Math.random().toString(36).substring(2, 8),
        type: isBuy ? "buy" : "sell",
        maker: randomMaker,
        amountCook: amount,
        priceUsd: price,
        totalUsd,
        timestamp: Date.now(),
        txHash: "5vW8...88kk",
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 14)]);
    }, 5500);

    return () => clearInterval(interval);
  }, [cookUsd]);

  return (
    <div className="rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cookie-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Dòng Lệnh Trực Tiếp (Live Trade Stream)
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Real-Time SVM
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-white/[0.04]">
              <th className="pb-2 font-medium">Thời Gian</th>
              <th className="pb-2 font-medium">Loại</th>
              <th className="pb-2 font-medium">Giá (USD)</th>
              <th className="pb-2 font-medium">Số Lượng (COOK)</th>
              <th className="pb-2 font-medium">Tổng (USD)</th>
              <th className="pb-2 font-medium text-right">Maker</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {trades.map((tr) => {
              const isBuy = tr.type === "buy";
              const secondsAgo = Math.max(1, Math.floor((Date.now() - tr.timestamp) / 1000));
              const timeDisplay =
                secondsAgo < 60
                  ? `${secondsAgo}s trước`
                  : `${Math.floor(secondsAgo / 60)}m trước`;

              return (
                <tr
                  key={tr.id}
                  className="hover:bg-white/[0.02] transition-colors group select-none"
                >
                  <td className="py-2 text-slate-400 text-[11px]">{timeDisplay}</td>
                  <td className="py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isBuy
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                      }`}
                    >
                      {isBuy ? (
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      ) : (
                        <ArrowDownRight className="w-2.5 h-2.5" />
                      )}
                      {isBuy ? "MUA" : "BÁN"}
                    </span>
                  </td>
                  <td
                    className={`py-2 font-semibold ${
                      isBuy ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    ${tr.priceUsd.toFixed(6)}
                  </td>
                  <td className="py-2 text-slate-200">{tr.amountCook.toLocaleString()}</td>
                  <td className="py-2 text-slate-400">${tr.totalUsd.toFixed(4)}</td>
                  <td className="py-2 text-right">
                    <a
                      href={`https://cookiescan.io/address/${tr.maker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cookie-400 hover:text-cookie-300 transition-colors inline-flex items-center gap-1 group-hover:underline"
                    >
                      <span>{tr.maker}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
