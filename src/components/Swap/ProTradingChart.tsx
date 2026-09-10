import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  Sparkles,
  Maximize2,
  DollarSign,
} from "lucide-react";
import type { CookieToken } from "../../types";
import { TokenAvatar } from "../UI/TokenAvatar";

interface ProTradingChartProps {
  inputToken: CookieToken;
  outputToken: CookieToken;
  cookUsd: number;
}

type TimeFrame = "15M" | "1H" | "4H" | "1D" | "1W";
type ChartMode = "candles" | "area";

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const ProTradingChart: React.FC<ProTradingChartProps> = ({
  inputToken,
  outputToken,
  cookUsd,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("1H");
  const [chartMode, setChartMode] = useState<ChartMode>("candles");
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [tick, setTick] = useState(0);

  // Derive current price
  const currentPrice = useMemo(() => {
    const p = outputToken.price?.usd
      ? Number(outputToken.price.usd)
      : inputToken.price?.usd
      ? Number(inputToken.price.usd)
      : cookUsd;
    return p > 0 ? p : 0.000142;
  }, [outputToken, inputToken, cookUsd]);

  // Subtle real-time price tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Generate realistic candles based on price & timeframe
  const candles = useMemo(() => {
    const count = 30;
    const list: Candle[] = [];
    let base = currentPrice * 0.94;
    const volatility = currentPrice * 0.035;

    const now = Date.now();
    const stepMs =
      timeframe === "15M"
        ? 15 * 60 * 1000
        : timeframe === "1H"
        ? 60 * 60 * 1000
        : timeframe === "4H"
        ? 4 * 60 * 60 * 1000
        : timeframe === "1D"
        ? 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;

    for (let i = count; i >= 1; i--) {
      const timeDate = new Date(now - i * stepMs);
      const timeStr =
        timeframe === "15M" || timeframe === "1H"
          ? timeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : timeDate.toLocaleDateString([], { month: "short", day: "numeric" });

      const change = (Math.sin(i * 0.7 + tick * 0.1) + (Math.random() - 0.48)) * volatility;
      const open = base;
      const close = Math.max(base * 0.5, base + change);
      const high = Math.max(open, close) + Math.random() * volatility * 0.7;
      const low = Math.min(open, close) - Math.random() * volatility * 0.7;
      const volume = Math.floor(15000 + Math.random() * 85000);

      list.push({ time: timeStr, open, high, low, close, volume });
      base = close;
    }
    return list;
  }, [currentPrice, timeframe, tick]);

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let mVol = 0;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > mVol) mVol = c.volume;
    });
    const padding = (max - min) * 0.1 || min * 0.05;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
      maxVol: mVol || 1,
    };
  }, [candles]);

  const chartHeight = 240;
  const chartWidth = 640;
  const candleWidth = chartWidth / candles.length;

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl p-5 flex flex-col gap-4">
      {/* Top Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <TokenAvatar
              src={inputToken.metadata?.logo}
              symbol={inputToken.metadata?.symbol}
              name={inputToken.metadata?.name}
              mint={inputToken.mint}
              size="md"
              className="border-2 border-obsidian-950"
            />
            <TokenAvatar
              src={outputToken.metadata?.logo}
              symbol={outputToken.metadata?.symbol}
              name={outputToken.metadata?.name}
              mint={outputToken.mint}
              size="md"
              className="border-2 border-obsidian-950"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">
                {inputToken.metadata?.symbol || "COOK"} /{" "}
                {outputToken.metadata?.symbol || "USDC"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +8.4%
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Cookiebox DAMM v2 • SVM
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block">Giá Hiện Tại</span>
            <span className="text-white font-bold text-sm">
              ${activeCandle ? activeCandle.close.toFixed(6) : currentPrice.toFixed(6)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">24h Cao/Thấp</span>
            <span className="text-slate-300">
              ${(currentPrice * 1.08).toFixed(6)} / ${(currentPrice * 0.92).toFixed(6)}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] text-slate-500 block">Khối Lượng 24h</span>
            <span className="text-cookie-300 font-semibold">$185,420</span>
          </div>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Timeframe */}
          <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-white/[0.06] text-xs font-mono">
            {(["15M", "1H", "4H", "1D", "1W"] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  timeframe === tf
                    ? "bg-cookie-500 text-obsidian-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Mode switch */}
          <div className="flex items-center bg-obsidian-950 rounded-xl p-1 border border-white/[0.06] text-xs">
            <button
              onClick={() => setChartMode("candles")}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === "candles"
                  ? "bg-white/[0.1] text-cookie-400 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartMode("area")}
              className={`p-1.5 rounded-lg transition-all ${
                chartMode === "area"
                  ? "bg-white/[0.1] text-cookie-400 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              title="Area Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full h-[260px] bg-obsidian-950/60 rounded-2xl border border-white/[0.04] p-2 select-none overflow-hidden">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
          <div className="border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-b border-white" />
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Volume bars (bottom 25%) */}
          {candles.map((c, i) => {
            const x = i * candleWidth + candleWidth * 0.2;
            const barW = candleWidth * 0.6;
            const vHeight = (c.volume / maxVol) * 45;
            const y = chartHeight - vHeight;
            const isGreen = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={barW}
                height={vHeight}
                fill={isGreen ? "#10b981" : "#f43f5e"}
                opacity={0.25}
              />
            );
          })}

          {/* Area Chart Mode */}
          {chartMode === "area" && (
            <>
              {/* Path Area */}
              <path
                d={`M 0,${chartHeight} ${candles
                  .map((c, i) => {
                    const x = i * candleWidth + candleWidth / 2;
                    const y =
                      chartHeight -
                      ((c.close - minPrice) / (maxPrice - minPrice || 1)) * (chartHeight - 40) -
                      20;
                    return `L ${x},${y}`;
                  })
                  .join(" ")} L ${chartWidth},${chartHeight} Z`}
                fill="url(#areaGradient)"
              />
              {/* Path Line */}
              <path
                d={candles
                  .map((c, i) => {
                    const x = i * candleWidth + candleWidth / 2;
                    const y =
                      chartHeight -
                      ((c.close - minPrice) / (maxPrice - minPrice || 1)) * (chartHeight - 40) -
                      20;
                    return `${i === 0 ? "M" : "L"} ${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Candlestick Mode */}
          {chartMode === "candles" &&
            candles.map((c, i) => {
              const x = i * candleWidth + candleWidth / 2;
              const isGreen = c.close >= c.open;
              const color = isGreen ? "#10b981" : "#f43f5e";

              const range = maxPrice - minPrice || 1;
              const yHigh = chartHeight - ((c.high - minPrice) / range) * (chartHeight - 50) - 25;
              const yLow = chartHeight - ((c.low - minPrice) / range) * (chartHeight - 50) - 25;
              const yOpen = chartHeight - ((c.open - minPrice) / range) * (chartHeight - 50) - 25;
              const yClose = chartHeight - ((c.close - minPrice) / range) * (chartHeight - 50) - 25;

              const bodyY = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));
              const bodyWidth = Math.max(3, candleWidth * 0.7);

              return (
                <g
                  key={`candle-${i}`}
                  onMouseEnter={() => setHoveredCandle(c)}
                  className="cursor-pointer"
                >
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - bodyWidth / 2}
                    y={bodyY}
                    width={bodyWidth}
                    height={bodyHeight}
                    fill={color}
                    rx={1}
                  />
                </g>
              );
            })}
        </svg>

        {/* Hover Crosshair Tooltip */}
        {hoveredCandle && (
          <div className="absolute top-3 left-3 bg-obsidian-950/90 border border-white/[0.1] rounded-xl px-3 py-2 text-[11px] font-mono shadow-xl backdrop-blur-md flex items-center gap-3">
            <span className="text-slate-400">{hoveredCandle.time}</span>
            <span>
              O: <strong className="text-white">${hoveredCandle.open.toFixed(6)}</strong>
            </span>
            <span>
              H: <strong className="text-emerald-400">${hoveredCandle.high.toFixed(6)}</strong>
            </span>
            <span>
              L: <strong className="text-rose-400">${hoveredCandle.low.toFixed(6)}</strong>
            </span>
            <span>
              C: <strong className="text-cookie-300">${hoveredCandle.close.toFixed(6)}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
