import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "vi";

export interface Translations {
  // Navbar
  terminalSubtitle: string;
  svmMainnet: string;
  cookPrice: string;
  hyperlaneBridge: string;
  explorer: string;
  nightlyReady: string;
  muteSounds: string;
  enableSounds: string;
  sandboxMode: string;
  realSvm: string;
  selectWallet: string;
  copyAddress: string;
  copied: string;
  ecosystem: string;
  docs: string;
  rpc: string;

  // Tabs
  tabRadar: string;
  tabRadarDesc: string;
  tabSwap: string;
  tabSwapDesc: string;
  tabStake: string;
  tabStakeDesc: string;
  tabFortune: string;
  tabFortuneDesc: string;
  tabJar: string;
  tabJarDesc: string;
  tabBridge: string;
  tabBridgeDesc: string;
  tabCopilot: string;
  tabCopilotDesc: string;

  // Radar / Market Overview
  nativePriceLabel: string;
  activePoolsLabel: string;
  poolsCount: string;
  poolsSubtext: string;
  registeredTokensLabel: string;
  tokensSubtext: string;
  estLiquidityLabel: string;
  liquiditySubtext: string;
  searchPlaceholder: string;
  filterAll: string;
  filterHighLiq: string;
  filterGainers: string;
  refreshTooltip: string;
  tableAsset: string;
  tablePriceUsd: string;
  tablePriceCook: string;
  tableChange24h: string;
  tableLiquidity: string;
  tableActions: string;
  btnSwap: string;
  btnViewExplorer: string;
  noTokensFound: string;
  fixedTableNotice: string;

  // Swap
  swapTitle: string;
  swapSubtitle: string;
  youPay: string;
  youReceive: string;
  balance: string;
  max: string;
  slippageTolerance: string;
  routeTitle: string;
  estPriceImpact: string;
  protocolFee: string;
  finalityTime: string;
  btnConnectToSwap: string;
  btnEnterAmount: string;
  btnInsufficientBalance: string;
  btnSwapNow: string;
  swapping: string;

  // Staking
  stakeTitle: string;
  stakeSubtitle: string;
  tabStakeAction: string;
  tabUnstakeAction: string;
  apyBadge: string;
  exchangeRate: string;
  reserveLiquidity: string;
  stakeInputLabel: string;
  unstakeInputLabel: string;
  receiveCook: string;
  receiveBcook: string;
  btnStakeCook: string;
  btnUnstakeCook: string;
  staking: string;
  unstaking: string;
  stakePoolInfo: string;

  // Fortune Cookie
  fortuneTag: string;
  fortuneTitle: string;
  fortuneDesc: string;
  fortuneCost: string;
  fortuneMaxWin: string;
  fortuneClickPrompt: string;
  fortuneSubtext: string;
  btnCrackCookie: string;
  cracking: string;
  recentFortunesTitle: string;
  onChainLedgerTitle: string;
  crackAnother: string;
  fortuneUnlocked: string;
  luckyNumbers: string;
  multiplier: string;

  // Cookie Jar
  jarTitle: string;
  jarSubtitle: string;
  tipAmountLabel: string;
  memoMessageLabel: string;
  memoPlaceholder: string;
  btnSendTribute: string;
  sendingTribute: string;
  recentTributesTitle: string;

  // Bridge & Copilot
  bridgeTitle: string;
  bridgeDesc: string;
  btnOpenHyperlane: string;
  copilotTitle: string;
  copilotDesc: string;
  copilotPlaceholder: string;
  btnAskCopilot: string;

  // Footer
  builtOn: string;
  subsecondNotice: string;
}

const translations: Record<Language, Translations> = {
  en: {
    terminalSubtitle: "Cookie Chain SVM Terminal",
    svmMainnet: "SVM Mainnet",
    cookPrice: "COOK:",
    hyperlaneBridge: "Hyperlane Bridge",
    explorer: "Explorer",
    nightlyReady: "Nightly Ready",
    muteSounds: "Mute Web3 Sounds",
    enableSounds: "Enable Web3 Sounds",
    sandboxMode: "Sandbox (1k COOK)",
    realSvm: "Real SVM",
    selectWallet: "Select Wallet",
    copyAddress: "Copy address",
    copied: "Copied!",
    ecosystem: "Ecosystem",
    docs: "Docs",
    rpc: "RPC Node",

    tabRadar: "Ecosystem Radar",
    tabRadarDesc: "Live Markets & 6k+ Tokens",
    tabSwap: "Instant Swap",
    tabSwapDesc: "Cookiebox / Candy Shop Aggregator",
    tabStake: "Liquid Staking",
    tabStakeDesc: "Stake COOK for bCOOK",
    tabFortune: "Fortune Cookie",
    tabFortuneDesc: "On-Chain Degen Game",
    tabJar: "Cookie Jar",
    tabJarDesc: "On-Chain Messages & Tips",
    tabBridge: "Hyperlane Bridge",
    tabBridgeDesc: "Cookie Chain ⇄ Solana Mainnet",
    tabCopilot: "AI Copilot",
    tabCopilotDesc: "Powered by cookie-mcp Tools",

    nativePriceLabel: "Native Token Price",
    activePoolsLabel: "Active DEX Pools",
    poolsCount: "Pools",
    poolsSubtext: "Cookiebox & CookieSwap venues",
    registeredTokensLabel: "Registered Tokens",
    tokensSubtext: "Indexed by CookieScan DAS",
    estLiquidityLabel: "Estimated Liquidity",
    liquiditySubtext: "Cross-DEX liquidity depth",
    searchPlaceholder: "Search token by name, symbol, or mint...",
    filterAll: "All Tokens",
    filterHighLiq: "High Liquidity",
    filterGainers: "Top Gainers",
    refreshTooltip: "Refresh Ecosystem Data",
    tableAsset: "# Asset",
    tablePriceUsd: "Price (USD)",
    tablePriceCook: "Price (COOK)",
    tableChange24h: "24h Change",
    tableLiquidity: "Liquidity (COOK)",
    tableActions: "Actions",
    btnSwap: "Swap",
    btnViewExplorer: "View on CookieScan",
    noTokensFound: "No tokens found matching your filter.",
    fixedTableNotice: "Fixed table viewport — only rows scroll",

    swapTitle: "Instant Swap Router",
    swapSubtitle: "Sub-second DEX aggregation across Cookiebox & CookieSwap venues",
    youPay: "You Pay",
    youReceive: "You Receive",
    balance: "Balance:",
    max: "MAX",
    slippageTolerance: "Slippage Tolerance",
    routeTitle: "Best Route",
    estPriceImpact: "Price Impact",
    protocolFee: "Protocol Fee",
    finalityTime: "Est. Finality",
    btnConnectToSwap: "Connect Wallet to Swap",
    btnEnterAmount: "Enter an Amount",
    btnInsufficientBalance: "Insufficient COOK Balance",
    btnSwapNow: "Swap Now",
    swapping: "Confirming on Cookie Chain...",

    stakeTitle: "bCOOK Liquid Staking",
    stakeSubtitle: "Stake native COOK directly into the canonical SPL Stake Pool",
    tabStakeAction: "Stake COOK",
    tabUnstakeAction: "Instant Unstake",
    apyBadge: "~14.8% APY",
    exchangeRate: "Current Exchange Rate",
    reserveLiquidity: "Reserve Liquidity",
    stakeInputLabel: "Deposit COOK",
    unstakeInputLabel: "Withdraw bCOOK",
    receiveCook: "Receive COOK",
    receiveBcook: "Receive bCOOK",
    btnStakeCook: "Stake COOK",
    btnUnstakeCook: "Instant Unstake to COOK",
    staking: "Depositing to Stake Pool...",
    unstaking: "Withdrawing from Reserve...",
    stakePoolInfo: "Canonical SPL Stake Pool on Cookie Chain",

    fortuneTag: "Degen Culture & Fast Finality",
    fortuneTitle: "On-Chain Fortune Cookie Cracker",
    fortuneDesc: "Crack an on-chain fortune cookie for 0.1 COOK. Receive crypto prophecies & win up to 10x JACKPOT!",
    fortuneCost: "Cost: 0.1 COOK",
    fortuneMaxWin: "Max 10x Win",
    fortuneClickPrompt: "CLICK TO CRACK!",
    fortuneSubtext: "Sub-second cryptographic entropy generated on-chain",
    btnCrackCookie: "CRACK COOKIE (0.1 COOK)",
    cracking: "Baking On-Chain Entropy...",
    recentFortunesTitle: "Recent Fortunes",
    onChainLedgerTitle: "On-Chain Ledger",
    crackAnother: "Crack Another Cookie",
    fortuneUnlocked: "Fortune Unlocked!",
    luckyNumbers: "Lucky Numbers:",
    multiplier: "Multiplier",

    jarTitle: "Community Cookie Jar",
    jarSubtitle: "Inscribe permanent baker tributes on Cookie Chain with Solana Memo",
    tipAmountLabel: "Tip Amount (COOK)",
    memoMessageLabel: "On-Chain Memo Message",
    memoPlaceholder: "Leave a timeless message on Cookie Chain...",
    btnSendTribute: "Send Tip & Inscribe Memo",
    sendingTribute: "Inscribing on-chain...",
    recentTributesTitle: "Recent Baker Tributes",

    bridgeTitle: "Hyperlane Warp Bridge",
    bridgeDesc: "Bridge assets smoothly between Solana Mainnet and Cookie Chain",
    btnOpenHyperlane: "Open Hyperlane Bridge",
    copilotTitle: "CookieCopilot AI Terminal",
    copilotDesc: "Execute natural language queries powered by cookie-mcp tools",
    copilotPlaceholder: "Ask Copilot e.g., 'Find top tokens' or 'Simulate swap'...",
    btnAskCopilot: "Execute",

    builtOn: "Built on",
    subsecondNotice: "• Sub-second finality & minimal fees",
  },
  vi: {
    terminalSubtitle: "Hệ Thống Giao Dịch Cookie Chain SVM",
    svmMainnet: "SVM Mainnet",
    cookPrice: "COOK:",
    hyperlaneBridge: "Cầu Nối Hyperlane",
    explorer: "Trình Khám Phá",
    nightlyReady: "Hỗ Trợ Nightly",
    muteSounds: "Tắt Âm Thanh",
    enableSounds: "Bật Âm Thanh Web3",
    sandboxMode: "Sandbox (1k COOK)",
    realSvm: "Mạng SVM Thật",
    selectWallet: "Kết Nối Ví",
    copyAddress: "Sao chép địa chỉ",
    copied: "Đã chép!",
    ecosystem: "Hệ Sinh Thái",
    docs: "Tài Liệu",
    rpc: "Node RPC",

    tabRadar: "Radar Hệ Sinh Thái",
    tabRadarDesc: "Thị Trường & 6k+ Token",
    tabSwap: "Hoán Đổi Nhanh",
    tabSwapDesc: "Bộ Định Tuyến Cookiebox / Candy Shop",
    tabStake: "Staking Thanh Khoản",
    tabStakeDesc: "Stake COOK Nhận bCOOK",
    tabFortune: "Bánh May Mắn",
    tabFortuneDesc: "Degen Game On-Chain",
    tabJar: "Hũ Bánh",
    tabJarDesc: "Lời Nhắn On-Chain & Tiền Tip",
    tabBridge: "Cầu Hyperlane",
    tabBridgeDesc: "Cookie Chain ⇄ Solana Mainnet",
    tabCopilot: "Trợ Lý AI",
    tabCopilotDesc: "Kiến Trúc cookie-mcp",

    nativePriceLabel: "Giá Token Gốc (COOK)",
    activePoolsLabel: "Số Bể Thanh Khoản DEX",
    poolsCount: "Bể",
    poolsSubtext: "Bể Cookiebox & CookieSwap",
    registeredTokensLabel: "Token Được Ghi Nhận",
    tokensSubtext: "Chỉ mục bởi CookieScan DAS",
    estLiquidityLabel: "Tổng Thanh Khoản Ước Tính",
    liquiditySubtext: "Độ sâu thanh khoản toàn sàn",
    searchPlaceholder: "Tìm token theo tên, mã symbol, hoặc địa chỉ mint...",
    filterAll: "Tất Cả Token",
    filterHighLiq: "Thanh Khoản Cao",
    filterGainers: "Tăng Giá Nhất",
    refreshTooltip: "Làm mới dữ liệu hệ sinh thái",
    tableAsset: "# Tài Sản",
    tablePriceUsd: "Giá (USD)",
    tablePriceCook: "Giá (COOK)",
    tableChange24h: "Biến Động 24h",
    tableLiquidity: "Thanh Khoản (COOK)",
    tableActions: "Thao Tác",
    btnSwap: "Hoán Đổi",
    btnViewExplorer: "Xem Trên CookieScan",
    noTokensFound: "Không tìm thấy token nào khớp với bộ lọc.",
    fixedTableNotice: "Khung bảng cố định — chỉ cuộn dữ liệu",

    swapTitle: "Bộ Định Tuyến Hoán Đổi Tức Thì",
    swapSubtitle: "Tổng hợp thanh khoản tốc độ cao qua Cookiebox & CookieSwap",
    youPay: "Bạn Chi Trả",
    youReceive: "Bạn Nhận Được",
    balance: "Số dư:",
    max: "TỐI ĐA",
    slippageTolerance: "Độ Trượt Giá (Slippage)",
    routeTitle: "Tuyến Tốt Nhất",
    estPriceImpact: "Tác Động Giá",
    protocolFee: "Phí Giao Thức",
    finalityTime: "Thời Gian Chốt Khối",
    btnConnectToSwap: "Kết Nối Ví Để Hoán Đổi",
    btnEnterAmount: "Nhập Số Lượng",
    btnInsufficientBalance: "Không Đủ Số Dư COOK",
    btnSwapNow: "Hoán Đổi Ngay",
    swapping: "Đang xác nhận trên Cookie Chain...",

    stakeTitle: "Staking Thanh Khoản bCOOK",
    stakeSubtitle: "Gửi COOK trực tiếp vào SPL Stake Pool chính thức của mạng",
    tabStakeAction: "Stake COOK",
    tabUnstakeAction: "Rút Về Tức Thì",
    apyBadge: "~14.8% Lãi Suất APY",
    exchangeRate: "Tỷ Giá Hiện Tại",
    reserveLiquidity: "Thanh Khoản Dự Trữ",
    stakeInputLabel: "Nạp COOK",
    unstakeInputLabel: "Rút bCOOK",
    receiveCook: "Nhận Lại COOK",
    receiveBcook: "Nhận Lại bCOOK",
    btnStakeCook: "Stake COOK Ngay",
    btnUnstakeCook: "Rút Tức Thì Về COOK",
    staking: "Đang gửi vào Stake Pool...",
    unstaking: "Đang rút từ kho dự trữ...",
    stakePoolInfo: "Chương trình SPL Stake Pool chuẩn trên Cookie Chain",

    fortuneTag: "Văn Hóa Degen & Tốc Độ Cực Nhanh",
    fortuneTitle: "Bánh May Mắn On-Chain (Fortune Cookie)",
    fortuneDesc: "Bẻ bánh may mắn on-chain với chỉ 0.1 COOK. Nhận lời tiên tri crypto & cơ hội trúng Jackpot x10 lần!",
    fortuneCost: "Chi phí: 0.1 COOK",
    fortuneMaxWin: "Thưởng Tối Đa 10x",
    fortuneClickPrompt: "BẤM ĐỂ BẺ BÁNH!",
    fortuneSubtext: "Entropy ngẫu nhiên mật mã được tạo tức thì on-chain",
    btnCrackCookie: "BẺ BÁNH NGAY (0.1 COOK)",
    cracking: "Đang tạo số ngẫu nhiên on-chain...",
    recentFortunesTitle: "Lời Tiên Tri Gần Đây",
    onChainLedgerTitle: "Sổ Cái On-Chain",
    crackAnother: "Bẻ Chiếc Bánh Khác",
    fortuneUnlocked: "Mở Khóa Vận May!",
    luckyNumbers: "Con Số May Mắn:",
    multiplier: "Hệ Số Nhân",

    jarTitle: "Hũ Bánh May Mắn Cộng Đồng",
    jarSubtitle: "Khắc lời nhắn vĩnh viễn trên Cookie Chain với chương trình Memo",
    tipAmountLabel: "Số Tiền Tip (COOK)",
    memoMessageLabel: "Nội Dung Lời Nhắn On-Chain",
    memoPlaceholder: "Để lại một thông điệp bất tử trên Cookie Chain...",
    btnSendTribute: "Gửi Tip & Khắc Lời Nhắn",
    sendingTribute: "Đang ghi nhận on-chain...",
    recentTributesTitle: "Lời Nhắn Của Các Baker",

    bridgeTitle: "Cầu Nối Hyperlane Warp",
    bridgeDesc: "Chuyển tài sản mượt mà giữa Solana Mainnet và Cookie Chain",
    btnOpenHyperlane: "Mở Cầu Nối Hyperlane",
    copilotTitle: "Trợ Lý AI CookieCopilot",
    copilotDesc: "Thực thi lệnh bằng ngôn ngữ tự nhiên được hỗ trợ bởi cookie-mcp",
    copilotPlaceholder: "Hỏi Copilot ví dụ: 'Tìm top token' hoặc 'Mô phỏng swap'...",
    btnAskCopilot: "Thực Thi",

    builtOn: "Xây dựng trên nền tảng",
    subsecondNotice: "• Tốc độ sub-second & phí giao dịch siêu rẻ",
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("cookiepulse_lang");
    if (saved === "vi" || saved === "en") return saved;
    return "vi"; // Default to Vietnamese, instant toggle to English
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("cookiepulse_lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "vi" : "en");
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t: translations[lang],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
