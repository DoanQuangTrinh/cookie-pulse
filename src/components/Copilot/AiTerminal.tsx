import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Bot,
  Terminal,
  Send,
  Sparkles,
  Command,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  TrendingUp,
  ShieldCheck,
  Rocket,
  Coins,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { COOK_MINT, BCOOK_MINT } from "../../config/constants";
import type { ActiveTab } from "../../types";

interface Message {
  id: string;
  sender: "user" | "copilot";
  content: string;
  toolCall?: {
    name: string;
    args: Record<string, any>;
    result: any;
  };
  actionTab?: ActiveTab;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    sender: "copilot",
    content:
      "Hello! I am CookieCopilot, your autonomous agent powered by the Cookie Chain MCP architecture (`cookie-mcp`). I can query real-time market data, find multi-hop swap routes, inspect liquid staking rates, or simulate on-chain actions.",
  },
];

const PRESET_PROMPTS = [
  {
    label: "Top Volume Tokens",
    prompt: "Scan the top volume tokens on Cookie Chain via CookieScan DAS",
  },
  {
    label: "Quote 50 COOK → bCOOK",
    prompt: "Get swap quote for 50 COOK to bCOOK via Cookiebox",
  },
  {
    label: "Liquid Staking APY",
    prompt: "What is the current APY and exchange rate for bCOOK?",
  },
  {
    label: "Bridge to Solana Guide",
    prompt: "Explain how to bridge COOK to Solana mainnet",
  },
];

interface AiTerminalProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const AiTerminal: React.FC<AiTerminalProps> = ({ onNavigateTab }) => {
  const { publicKey } = useWallet();
  const { tokens, cookUsd, cookBalance, bCookBalance, chainSlot } = useTokenData();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setProcessing(true);

    // Simulate Agent Reasoning & MCP Tool Execution
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: Message;

      if (lower.includes("token") || lower.includes("scan") || lower.includes("volume")) {
        const topTokens = tokens.slice(0, 3);
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content: `Queried \`cookie-mcp:get_tokens\` across ${tokens.length} indexed tokens. Here are the top assets by activity:`,
          toolCall: {
            name: "cookie-mcp:get_tokens",
            args: { limit: 3, sort: "liquidity" },
            result: topTokens.map((t) => ({
              symbol: t.metadata?.symbol || "TKN",
              priceUsd: `$${Number(t.price?.usd || 0).toFixed(6)}`,
              liquidityCook: `${t.marketData?.liquidity || 0} COOK`,
            })),
          },
          actionTab: "analytics",
        };
      } else if (lower.includes("swap") || lower.includes("quote")) {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content:
            "Invoked `cookie-mcp:get_quote` on Cookiebox Aggregator. Found a direct route via Cookiebox DAMM v2 pool with minimal 0.08% price impact:",
          toolCall: {
            name: "cookie-mcp:get_quote",
            args: {
              inputMint: "COOK",
              outputMint: "bCOOK",
              amount: "50",
              aggregator: "cookiebox",
            },
            result: {
              inAmount: "50 COOK",
              expectedOut: "39.06 bCOOK",
              minOut: "38.67 bCOOK (1% slippage)",
              priceImpact: "0.08%",
              fee: "< 0.000005 COOK",
            },
          },
          actionTab: "swap",
        };
      } else if (lower.includes("stake") || lower.includes("apy") || lower.includes("bcook")) {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content:
            "Evaluated `cookie-mcp:stake` state. The canonical SPL Stake Pool is yielding ~14.8% APY. Current exchange rate: 1 bCOOK = 1.2928 COOK. Unstaking is instant from reserve without lockup.",
          actionTab: "stake",
        };
      } else if (lower.includes("arbitrage") || lower.includes("arb")) {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content:
            "⚡ [AUTONOMOUS ARBITRAGE SCANNER] Detected price divergence across DEX pools: Cookiebox DAMM v2 ($0.000105) vs CookieSwap BAMM ($0.000108). Net spread: +2.85%. Executing zero-risk atomic flash swap simulation on SVM:",
          toolCall: {
            name: "cookie-mcp:execute_arbitrage",
            args: {
              route: "COOK -> Cookiebox -> Token -> CookieSwap -> COOK",
              capitalCook: 100,
              computeUnits: 200000,
            },
            result: {
              status: "CONFIRMED",
              slot: chainSlot > 0 ? chainSlot : 24238992,
              finality: "370ms",
              profitCook: "+2.85 COOK",
              gasPaid: "0.000005 COOK",
            },
          },
          actionTab: "swap",
        };
      } else if (lower.includes("whale") || lower.includes("smart money")) {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content:
            "🐋 [WHALE & SMART MONEY RADAR] Queried CookieScan DAS Indexer for top holder accumulation in the last 1,000 slots. No dumping detected. Smart money addresses accumulating:",
          toolCall: {
            name: "cookie-mcp:track_whales",
            args: { thresholdCook: 5000, windowSlots: 1000 },
            result: [
              { address: "chef.cook (30k9...Et23)", netInflow: "+12,500 COOK", type: "Accumulation" },
              { address: "baker.cook (8nVr...tLox)", netInflow: "+8,200 COOK", type: "Staked to bCOOK" },
              { address: "reserve.cook (EhPa...9uHz)", netInflow: "+24,000 bCOOK", type: "Liquidity Provider" },
            ],
          },
          actionTab: "analytics",
        };
      } else if (lower.includes("bridge") || lower.includes("solana")) {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content:
            "The Cookie Chain ⇄ Solana Bridge operates via Hyperlane Warp Route. You can bridge native COOK (9 decimals) to Solana Token-2022 COOK (6 decimals) in ~2 minutes with 1 source signature. Check the Bridge tab for full instructions.",
          actionTab: "bridge",
        };
      } else {
        reply = {
          id: Math.random().toString(),
          sender: "copilot",
          content: `Processed query with connected wallet (${publicKey ? publicKey.toBase58().slice(0, 4) + '...' : 'Guest'}). Cookie Chain SVM is producing blocks at slot #${chainSlot.toLocaleString()}. How else can I assist your on-chain journey?`,
        };
      }

      setMessages((prev) => [...prev, reply]);
      setProcessing(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Copilot Header Card */}
      <div className="p-6 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] shadow-card-subtle backdrop-blur-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  CookieCopilot Terminal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  MCP v1.2
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Autonomous AI Agent interface for Cookie Chain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Cpu className="w-4 h-4 text-cookie-400" />
            <span>cookie-mcp connected</span>
          </div>
        </div>

        {/* Autonomous Autopilot Strategies Bar */}
        <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-purple-500/25 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Autonomous Autopilot Strategies
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              1-Click SVM Agent Execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() =>
                handleSend("Run DCA Yield Autopilot on Cookie Chain SVM for bCOOK staking")
              }
              className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:text-purple-200">
                <Coins className="w-3.5 h-3.5 text-purple-400" />
                <span>DCA Yield Maximizer</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Stake COOK to bCOOK (~14.8% APY)
              </div>
            </button>

            <button
              onClick={() =>
                handleSend("Scan and simulate DEX Arbitrage across Cookiebox DAMM and CookieSwap")
              }
              className="p-2.5 rounded-xl bg-cookie-500/10 hover:bg-cookie-500/20 border border-cookie-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-cookie-300 group-hover:text-cookie-200">
                <Zap className="w-3.5 h-3.5 text-cookie-400" />
                <span>Arbitrage Scanner</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Atomic zero-risk flash swap spread
              </div>
            </button>

            <button
              onClick={() =>
                handleSend("Track smart money and top whale accumulation on CookieScan DAS")
              }
              className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 group-hover:text-blue-200">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Whale & Smart Money</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                CookieScan DAS top holder radar
              </div>
            </button>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="px-3 py-1.5 rounded-xl bg-obsidian-950 hover:bg-cookie-500/10 border border-white/[0.06] hover:border-cookie-500/30 text-xs font-medium text-slate-300 hover:text-cookie-300 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto p-2">
          {messages.map((m) => {
            const isUser = m.sender === "user";

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? "bg-cookie-500 text-obsidian-950 font-medium rounded-tr-none"
                      : "bg-obsidian-950/90 border border-white/[0.08] text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p>{m.content}</p>

                  {m.toolCall && (
                    <div className="p-3 rounded-xl bg-black/50 border border-white/[0.06] font-mono text-xs text-cookie-300 space-y-1">
                      <div className="text-[10px] uppercase text-slate-500 font-bold">
                        Tool Executed: {m.toolCall.name}
                      </div>
                      <pre className="text-[11px] text-slate-300 overflow-x-auto">
                        {JSON.stringify(m.toolCall.result, null, 2)}
                      </pre>
                    </div>
                  )}

                  {m.actionTab && (
                    <button
                      onClick={() => onNavigateTab(m.actionTab!)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cookie-500/20 hover:bg-cookie-500/30 border border-cookie-500/40 text-cookie-300 text-xs font-semibold transition-all"
                    >
                      <span>Jump to {m.actionTab.toUpperCase()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {processing && (
            <div className="flex items-center gap-2 text-xs font-mono text-cookie-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing on-chain parameters...</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything or request a transaction simulation..."
            className="flex-1 px-4 py-3 rounded-2xl bg-obsidian-950/80 border border-white/[0.08] focus:border-cookie-500/50 focus:outline-none text-sm text-white placeholder-slate-500 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={processing || !input.trim()}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 font-bold shadow-cookie-glow disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
