import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  NightlyWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { COOKIE_RPC_URL, COOKIE_WSS_URL } from "../config/constants";

// Import default wallet adapter UI styles
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use Cookie Chain RPC endpoint
  const endpoint = useMemo(() => COOKIE_RPC_URL, []);

  // Initialize supported wallets - Nightly is given prominent priority for the Cookie Chain bounty
  const wallets = useMemo(
    () => [
      new NightlyWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ wsEndpoint: COOKIE_WSS_URL, commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
