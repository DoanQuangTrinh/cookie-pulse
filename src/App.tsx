import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { TabNavigation } from "./components/TabNavigation";
import { MarketOverview } from "./components/Analytics/MarketOverview";
import { SwapCard } from "./components/Swap/SwapCard";
import { StakingCard } from "./components/Staking/StakingCard";
import { FortuneCookieCard } from "./components/Fortune/FortuneCookieCard";
import { CookieJarCard } from "./components/CookieJar/CookieJarCard";
import { BridgeHelper } from "./components/Bridge/BridgeHelper";
import { AiTerminal } from "./components/Copilot/AiTerminal";
import { ToastContainer } from "./components/UI/ToastContainer";
import { ExternalLink } from "lucide-react";
import type { ActiveTab } from "./types";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("analytics");
  const [selectedSwapMint, setSelectedSwapMint] = useState<string | undefined>(undefined);

  const handleSelectTokenForSwap = (mint: string) => {
    setSelectedSwapMint(mint);
    setActiveTab("swap");
  };

  return (
    <div className="h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans selection:bg-cookie-500 selection:text-obsidian-950 overflow-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-0 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${
          activeTab === "analytics"
            ? "py-3 flex flex-col overflow-hidden"
            : "py-6 overflow-y-auto"
        }`}
      >
        {activeTab === "analytics" && (
          <MarketOverview onSelectTokenForSwap={handleSelectTokenForSwap} />
        )}

        {activeTab === "swap" && (
          <SwapCard initialOutputMint={selectedSwapMint} />
        )}

        {activeTab === "stake" && <StakingCard />}

        {activeTab === "fortune" && <FortuneCookieCard />}

        {activeTab === "cookiejar" && <CookieJarCard />}

        {activeTab === "bridge" && <BridgeHelper />}

        {activeTab === "copilot" && (
          <AiTerminal onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <footer className="shrink-0 w-full border-t border-white/[0.08] bg-obsidian-900/60 backdrop-blur-md py-2.5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Built on</span>
            <span className="text-cookie-400 font-bold">Cookie Chain SVM</span>
            <span>• Sub-second finality & minimal fees</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://docs.cookiechain.wtf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cookie-300 transition-colors flex items-center gap-1"
            >
              <span>Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.cookiescan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cookie-300 transition-colors flex items-center gap-1"
            >
              <span>RPC</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://t.me/TheCookieNetChain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cookie-300 transition-colors flex items-center gap-1"
            >
              <span>Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://x.com/TheCookieChain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cookie-300 transition-colors flex items-center gap-1"
            >
              <span>X @TheCookieChain</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
