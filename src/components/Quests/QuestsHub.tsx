import React from "react";
import {
  Trophy,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Gift,
  Crown,
  Medal,
  Coins,
  Rocket,
  Bot,
  ExternalLink,
} from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { useLanguage } from "../../context/LanguageContext";
import type { ActiveTab } from "../../types";

interface QuestsHubProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

const LEADERBOARD_USERS = [
  { rank: 1, name: "CookWhale.cookie", xp: 4850, level: "👑 Cookie Legend", streak: 14 },
  { rank: 2, name: "BakerAlpha.sol", xp: 3420, level: "👨‍🍳 Master Chef", streak: 9 },
  { rank: 3, name: "HyperDeFi.cook", xp: 2890, level: "👨‍🍳 Master Chef", streak: 7 },
  { rank: 4, name: "SweetTooth99", xp: 2150, level: "🥖 Artisan Baker", streak: 5 },
  { rank: 5, name: "SolCookieFan", xp: 1780, level: "🥖 Artisan Baker", streak: 4 },
];

export const QuestsHub: React.FC<QuestsHubProps> = ({ onNavigateTab }) => {
  const { quests, userXp, userStreak, claimDailyStreak } = useTokenData();
  const { t } = useLanguage();

  const userLevelName =
    userXp >= 2000
      ? "👑 Cookie Legend"
      : userXp >= 1000
      ? "👨‍🍳 Master Chef"
      : userXp >= 500
      ? "🥖 Artisan Baker"
      : "🍪 Novice Baker";

  const nextLevelThreshold = userXp >= 2000 ? 5000 : userXp >= 1000 ? 2000 : userXp >= 500 ? 1000 : 500;
  const levelProgressPct = Math.min(100, Math.floor((userXp / nextLevelThreshold) * 100));

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6 py-2 pb-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-900 via-cookie-950/40 to-amber-950/30 border border-cookie-500/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cookie-500/10 border border-cookie-500/30 text-xs font-mono font-bold text-cookie-300 uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5 text-cookie-400" />
              <span>Season 1 • Cookie Baker Expedition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trung Tâm Nhiệm Vụ & Điểm Danh Airdrop
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              Hoàn thành các nhiệm vụ hệ sinh thái Cookie Chain SVM để tích lũy <strong>Cookie XP</strong>,
              thăng hạng danh hiệu Baker và mở khóa cơ hội Airdrop độc quyền trong Season 1.
            </p>
          </div>

          {/* User Rank & XP Summary Box */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-obsidian-950/90 border border-cookie-500/30 flex flex-col gap-3 shrink-0 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Danh Hiệu Của Bạn:</span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {userLevelName}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-black text-white">{userXp.toLocaleString()} XP</span>
              <span className="text-xs text-slate-400">/ {nextLevelThreshold.toLocaleString()} XP</span>
            </div>

            {/* Level Progress */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-obsidian-900 overflow-hidden p-0.5 border border-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cookie-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-right">
                {completedQuestsCount} / {quests.length} nhiệm vụ đã xong
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Streak Check-in Widget */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/30 via-obsidian-900 to-obsidian-900 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-cookie-600 flex items-center justify-center text-obsidian-950 shadow-cookie-glow shrink-0">
            <Flame className="w-8 h-8 fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-sans">
                Chuỗi Điểm Danh: Ngày {userStreak} 🔥
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                {1 + userStreak * 0.1}x XP Multiplier
              </span>
            </div>
            <p className="text-xs font-mono text-slate-300 mt-1">
              Điểm danh mỗi 24h để nhận bánh quy may mắn và duy trì ngọn lửa nhiệt huyết.
            </p>
          </div>
        </div>

        {/* 7-Day Dots Preview */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isDone = day <= userStreak;
            return (
              <div
                key={day}
                className={`w-8 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-mono border transition-all ${
                  isDone
                    ? "bg-amber-500 text-obsidian-950 font-bold border-amber-400 shadow-sm"
                    : "bg-obsidian-950 text-slate-500 border-white/[0.06]"
                }`}
              >
                <span>D{day}</span>
                <span>{isDone ? "✓" : "+50"}</span>
              </div>
            );
          })}

          <button
            onClick={claimDailyStreak}
            className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-500 hover:from-cookie-400 hover:to-amber-400 text-obsidian-950 font-mono font-bold text-xs shadow-cookie-glow transition-all active:scale-95 whitespace-nowrap"
          >
            Điểm Danh Ngay
          </button>
        </div>
      </div>

      {/* Quests & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Quests List (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cookie-400" />
              <span>Nhiệm Vụ Hệ Sinh Thái (Ecosystem Quests)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {completedQuestsCount} / {quests.length} Hoàn Tất
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  quest.completed
                    ? "bg-obsidian-900/40 border-emerald-500/25 opacity-90"
                    : "bg-obsidian-900/80 border-white/[0.08] hover:border-cookie-500/30"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      quest.completed
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-cookie-500/10 text-cookie-400 border border-cookie-500/20"
                    }`}
                  >
                    {quest.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Gift className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm font-sans">
                        {quest.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cookie-500/10 text-cookie-300 border border-cookie-500/20">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-1 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Action button */}
                <div className="self-end sm:self-center shrink-0">
                  {quest.completed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      ✓ Đã Hoàn Thành
                    </span>
                  ) : (
                    <button
                      onClick={() => quest.actionTab && onNavigateTab(quest.actionTab)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-obsidian-950 hover:bg-cookie-500 text-cookie-300 hover:text-obsidian-950 border border-cookie-500/30 font-mono font-bold text-xs transition-all active:scale-95"
                    >
                      <span>Làm Ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Leaderboard (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-obsidian-900/90 border border-white/[0.08] p-5 sm:p-6 shadow-card-subtle backdrop-blur-2xl flex flex-col gap-4 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              Bảng Xếp Hạng Baker
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Season 1</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {LEADERBOARD_USERS.map((user) => (
              <div key={user.rank} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      user.rank === 1
                        ? "bg-amber-400 text-obsidian-950 shadow-sm"
                        : user.rank === 2
                        ? "bg-slate-300 text-obsidian-950"
                        : user.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-obsidian-950 text-slate-400"
                    }`}
                  >
                    {user.rank}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.level}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-cookie-300 font-bold">{user.xp.toLocaleString()} XP</div>
                  <div className="text-[10px] text-amber-400 font-semibold">🔥 {user.streak}d</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-[11px] font-mono text-slate-400 leading-relaxed">
            💡 <strong>Mẹo:</strong> Điểm danh liên tục và tham gia giao dịch mỗi ngày giúp bạn giữ vững vị trí trong Top 10 nhận thưởng token $COOK!
          </div>
        </div>
      </div>
    </div>
  );
};
