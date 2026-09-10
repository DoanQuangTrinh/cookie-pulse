/**
 * Image URL normalization and IPFS gateway resolver
 * Prevents ERR_CONNECTION_REFUSED / network spam by:
 * 1. Rewriting blocked gateways (ipfs.io) to reliable, fast gateways (ipfs.filebase.io)
 * 2. Caching failed URLs in memory so the browser never spams broken links twice
 * 3. Generating beautiful deterministic badge colors for tokens without working logos
 */

import { COOK_MINT } from "../config/constants";

// Global in-memory cache of URLs that have already failed during this session
const failedUrls = new Set<string>();

/**
 * Check if a URL has already failed to load
 */
export function isImageFailed(url: string): boolean {
  if (!url) return true;
  return failedUrls.has(url);
}

/**
 * Mark a URL as failed so no component ever tries to fetch it again
 */
export function markImageFailed(url: string): void {
  if (url && url !== "/cookie-logo.svg") {
    failedUrls.add(url);
  }
}

/**
 * Extract IPFS CID (v0 Qm... or v1 bafy...) from any IPFS link format
 */
export function extractIpfsCid(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // ipfs://Qm... or ipfs://bafy...
  if (trimmed.startsWith("ipfs://")) {
    const withoutPrefix = trimmed.replace(/^ipfs:\/\//, "");
    // Could be ipfs://ipfs/Qm... or ipfs://Qm...
    const clean = withoutPrefix.replace(/^ipfs\//, "");
    return clean.split(/[?#/]/)[0] || null;
  }

  // https://ipfs.io/ipfs/Qm... or any gateway URL
  const ipfsMatch = trimmed.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  if (ipfsMatch && ipfsMatch[1]) {
    return ipfsMatch[1];
  }

  // Raw CIDv0 (Qm... 46 chars) or CIDv1 (bafy... ~59 chars)
  if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55,})/.test(trimmed)) {
    return trimmed.split(/[?#/]/)[0];
  }

  return null;
}

/**
 * Convert any raw logo URL into a reliable, fast URL
 * Rewrites blocked ipfs.io to active IPFS gateway (ipfs.filebase.io)
 */
export function resolveTokenLogo(
  url?: string | null,
  mint?: string,
  symbol?: string
): string {
  // Always use local SVG for native COOK
  if (mint === COOK_MINT || symbol?.toUpperCase() === "COOK") {
    return "/cookie-logo.svg";
  }

  if (!url || typeof url !== "string") {
    return "/cookie-logo.svg";
  }

  const trimmed = url.trim();
  if (!trimmed || trimmed === "/cookie-logo.svg") {
    return "/cookie-logo.svg";
  }

  // If already known failed, return fallback immediately
  if (failedUrls.has(trimmed)) {
    return "/cookie-logo.svg";
  }

  // Extract IPFS CID
  const cid = extractIpfsCid(trimmed);
  if (cid) {
    // ipfs.filebase.io is fast, has SGP POP and valid SSL
    return `https://ipfs.filebase.io/ipfs/${cid}`;
  }

  // If already a valid HTTPS URL (and not ipfs.io)
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  // Data URLs or local paths
  if (trimmed.startsWith("data:") || trimmed.startsWith("/")) {
    return trimmed;
  }

  return "/cookie-logo.svg";
}

/**
 * Deterministic color palette for token fallback initials
 * High-contrast, vibrant Obsidian-matching badges
 */
const BADGE_PALETTES = [
  { bg: "bg-amber-500/25", border: "border-amber-500/50", text: "text-amber-300 shadow-sm" },
  { bg: "bg-emerald-500/25", border: "border-emerald-500/50", text: "text-emerald-300 shadow-sm" },
  { bg: "bg-cyan-500/25", border: "border-cyan-500/50", text: "text-cyan-300 shadow-sm" },
  { bg: "bg-purple-500/25", border: "border-purple-500/50", text: "text-purple-300 shadow-sm" },
  { bg: "bg-rose-500/25", border: "border-rose-500/50", text: "text-rose-300 shadow-sm" },
  { bg: "bg-indigo-500/25", border: "border-indigo-500/50", text: "text-indigo-300 shadow-sm" },
  { bg: "bg-orange-500/25", border: "border-orange-500/50", text: "text-orange-300 shadow-sm" },
  { bg: "bg-teal-500/25", border: "border-teal-500/50", text: "text-teal-300 shadow-sm" },
];

export function getTokenBadgeStyle(identifier: string) {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BADGE_PALETTES.length;
  return BADGE_PALETTES[index];
}
