import React, { useState, useEffect } from "react";
import { resolveTokenLogo, markImageFailed, isImageFailed, getTokenBadgeStyle } from "../../utils/imageUrl";
import { COOK_MINT } from "../../config/constants";

interface TokenAvatarProps {
  src?: string | null;
  symbol?: string;
  name?: string;
  mint?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
}

const SIZE_MAP = {
  xs: "w-4 h-4 text-[9px]",
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
  xl: "w-12 h-12 text-base",
};

export const TokenAvatar: React.FC<TokenAvatarProps> = ({
  src,
  symbol = "",
  name = "",
  mint = "",
  size = "md",
  className = "",
}) => {
  const isCook = mint === COOK_MINT || symbol.toUpperCase() === "COOK";
  const resolvedSrc = resolveTokenLogo(src, mint, symbol);
  
  // Check if this specific URL is already known to fail
  const initiallyFailed = !isCook && isImageFailed(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(initiallyFailed);
  const [isLoaded, setIsLoaded] = useState<boolean>(isCook || resolvedSrc === "/cookie-logo.svg");

  const sizeClass = typeof size === "string" ? SIZE_MAP[size] || SIZE_MAP.md : "";
  const customStyle = typeof size === "number" ? { width: `${size}px`, height: `${size}px` } : undefined;

  // Timeout safety fallback: if an external IPFS CID hangs, swap to badge after 3 seconds
  useEffect(() => {
    if (isCook || hasError || isLoaded || !resolvedSrc || resolvedSrc === "/cookie-logo.svg") {
      return;
    }

    const timer = setTimeout(() => {
      if (!isLoaded) {
        markImageFailed(resolvedSrc);
        setHasError(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [resolvedSrc, isCook, hasError, isLoaded]);

  // Render initial badge fallback if image fails or URL is missing
  if (hasError && !isCook) {
    const badgeStyle = getTokenBadgeStyle(symbol || mint || name || "T");
    const displayInitials = symbol
      ? symbol.slice(0, 2).toUpperCase()
      : name
      ? name.slice(0, 2).toUpperCase()
      : "•";

    return (
      <div
        style={customStyle}
        className={`shrink-0 rounded-full flex items-center justify-center font-mono font-bold select-none border shadow-sm transition-all duration-200 ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text} ${sizeClass} ${className}`}
        title={name || symbol}
      >
        {displayInitials}
      </div>
    );
  }

  return (
    <img
      src={isCook ? "/cookie-logo.svg" : resolvedSrc}
      alt={symbol || name || "Token"}
      loading="lazy"
      decoding="async"
      style={customStyle}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        if (!isCook) {
          markImageFailed(resolvedSrc);
          setHasError(true);
        }
      }}
      className={`shrink-0 rounded-full object-cover bg-obsidian-900 border border-white/[0.08] transition-opacity duration-200 ${
        isLoaded ? "opacity-100" : "opacity-80"
      } ${sizeClass} ${className}`}
    />
  );
};
