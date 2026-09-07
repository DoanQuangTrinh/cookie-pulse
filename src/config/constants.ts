import { PublicKey } from "@solana/web3.js";

// Cookie Chain Network RPCs
export const COOKIE_RPC_URL = "https://rpc.cookiescan.io";
export const COOKIE_WSS_URL = "https://wss.cookiescan.io";

// Native / Wrapped Token
export const COOK_MINT = "So11111111111111111111111111111111111111112";
export const COOK_DECIMALS = 9;
export const COOK_SYMBOL = "COOK";

// bCOOK Liquid Staking (Bake Your Stake)
export const BCOOK_MINT = "EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz";
export const BCOOK_DECIMALS = 9;
export const BCOOK_SYMBOL = "bCOOK";

// bCOOK Stake Pool Program IDs
export const STAKE_POOL_PROGRAM_ID = new PublicKey("GZgs5uREPp6BvDt8eysmhavQPAHBAtjePgV4zfhgd9pH");
export const STAKE_POOL_ACCOUNT = new PublicKey("GxbNKNYdtNXQkhDkpHdLDAMX64GxaECgANqdfp6cUGH4");
export const RESERVE_STAKE_ACCOUNT = new PublicKey("GAw1vRQ8R3ohDsSgGZV58dc32W7jYhHtc8DzuiVdvm8F");
export const MANAGER_FEE_ACCOUNT = new PublicKey("6ay8hjir4VZJ38x9sfL44Su8bvDEXmc5FrNyErHyv7G8");

// CookOven Domain Program
export const COOKOVEN_PROGRAM_ID = new PublicKey("H43Qtq4AMQ86y7yc3YtCKZJ2QMhhnCcHyZKeFeoQn7PA");

// APIs
export const COOKIESCAN_API_URL = "https://api.cookiescan.io";
export const COOKIEBOX_AGG_API_URL = "https://agg.cookiebox.app";
export const CANDYSHOP_API_URL = "https://swap.cookiescan.io/api";

// Explorers & Links
export const EXPLORER_URL = "https://cookiescan.io";
export const HYPERLANE_BRIDGE_URL = "https://hyperlane.cookiescan.io";
export const COOKOVEN_URL = "https://book.cookoven.xyz";
export const COOKIESWAP_URL = "https://cookieswap.fun";
export const COOKIEBOX_URL = "https://cookiebox.app";

// Memo Program (for On-chain Cookie Jar & Messages)
export const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// Community Cookie Jar Vault Address (demo on-chain recipient)
export const COOKIE_JAR_VAULT = new PublicKey("B8AB9R9J98yggrwdnZhoHuGJBc8RzTpHsqDnRkTnMuV");

// Helper url formatters
export const getExplorerTxUrl = (txSig: string) => `${EXPLORER_URL}/tx/${txSig}`;
export const getExplorerAddressUrl = (addr: string) => `${EXPLORER_URL}/address/${addr}`;
export const getExplorerTokenUrl = (mint: string) => `${EXPLORER_URL}/token/${mint}`;
