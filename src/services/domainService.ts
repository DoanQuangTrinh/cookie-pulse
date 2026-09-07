import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { COOKOVEN_PROGRAM_ID } from "../config/constants";
import { connection } from "./cookieRpc";

/**
 * Derive domain account PDA for a .cook domain name
 */
export function deriveDomainPda(name: string): [PublicKey, number] {
  const cleanName = name.toLowerCase().replace(/\.cook$/, "");
  return PublicKey.findProgramAddressSync(
    [Buffer.from("domain"), Buffer.from(cleanName)],
    COOKOVEN_PROGRAM_ID
  );
}

/**
 * Resolve a .cook domain to its owner address
 */
export async function resolveCookDomain(domainName: string): Promise<string | null> {
  try {
    const [pda] = deriveDomainPda(domainName);
    const accountInfo = await connection.getAccountInfo(pda, "confirmed");
    if (!accountInfo || accountInfo.data.length < 40) return null;

    // The owner pubkey in the DomainAccount layout is typically at offset 8 (after 8-byte discriminator)
    const ownerBuffer = accountInfo.data.subarray(8, 40);
    const ownerPubkey = new PublicKey(ownerBuffer);
    return ownerPubkey.toBase58();
  } catch (err) {
    console.warn(`Could not resolve domain ${domainName}:`, err);
    return null;
  }
}
