import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { COOKIE_RPC_URL, BCOOK_MINT } from "../config/constants";

export const connection = new Connection(COOKIE_RPC_URL, {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 30000,
});

/**
 * Fetch native COOK balance for an address
 */
export async function getCookBalance(walletAddress: string): Promise<number> {
  try {
    const pubkey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubkey, "confirmed");
    return balance / LAMPORTS_PER_SOL;
  } catch (err) {
    console.error("Error fetching COOK balance:", err);
    return 0;
  }
}

/**
 * Fetch bCOOK token balance for an address
 */
export async function getBCookBalance(walletAddress: string): Promise<number> {
  try {
    const owner = new PublicKey(walletAddress);
    const mint = new PublicKey(BCOOK_MINT);
    const ata = getAssociatedTokenAddressSync(mint, owner);
    const tokenAccount = await connection.getTokenAccountBalance(ata, "confirmed");
    return tokenAccount.value.uiAmount ?? 0;
  } catch {
    // Returns 0 if account not created yet
    return 0;
  }
}

/**
 * Fetch current chain slot and block height
 */
export async function getChainStatus(): Promise<{ slot: number; blockHeight: number }> {
  try {
    const slot = await connection.getSlot("confirmed");
    const blockHeight = await connection.getBlockHeight("confirmed");
    return { slot, blockHeight };
  } catch (err) {
    console.error("Error fetching chain status:", err);
    return { slot: 0, blockHeight: 0 };
  }
}
