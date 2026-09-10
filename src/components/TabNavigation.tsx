import React from "react";
import {
  BarChart3,
  ArrowLeftRight,
  Coins,
  Cookie,
  GitFork,
  Bot,
  Sparkles,
} from "lucide-react";
import type { ActiveTab } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface TabNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { t } = useLanguage();

  const tabs = [
    {
      id: "analytics" as ActiveTab,
      label: t.tabRadar,
      icon: BarChart3,
      desc: t.tabRadarDesc,
    },
    {
      id: "swap" as ActiveTab,
      label: t.tabSwap,
      icon: ArrowLeftRight,
      desc: t.tabSwapDesc,
    },
    {
      id: "stake" as ActiveTab,
      label: t.tabStake,
      icon: Coins,
      desc: t.tabStakeDesc,
      badge: "High APY",
    },
    {
      id: "fortune" as ActiveTab,
      label: t.tabFortune,
      icon: Sparkles,
      desc: t.tabFortuneDesc,
      badge: "Win 10x",
    },
    {
      id: "cookiejar" as ActiveTab,
      label: t.tabJar,
      icon: Cookie,
      desc: t.tabJarDesc,
    },
    {
      id: "bridge" as ActiveTab,
      label: t.tabBridge,
      icon: GitFork,
      desc: t.tabBridgeDesc,
    },
    {
      id: "copilot" as ActiveTab,
      label: t.tabCopilot,
      icon: Bot,
      desc: t.tabCopilotDesc,
      badge: "AI",
    },
  ];

  return (
    <div className="shrink-0 w-full border-b border-white/[0.06] bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-cookie-500/10 text-cookie-300 border border-cookie-500/30 shadow-cookie-glow"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                    isActive ? "text-cookie-400 scale-110" : "text-slate-400"
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold tracking-tight uppercase ${
                      tab.badge === "AI"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cookie-400 to-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
