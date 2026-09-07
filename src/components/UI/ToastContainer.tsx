import React from "react";
import { CheckCircle2, AlertCircle, Info, ExternalLink, X } from "lucide-react";
import { useTokenData } from "../../context/TokenDataContext";
import { getExplorerTxUrl } from "../../config/constants";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTokenData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-in ${
              isSuccess
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-100"
                : isError
                ? "bg-rose-950/80 border-rose-500/40 text-rose-100"
                : "bg-obsidian-850/90 border-cookie-500/30 text-cookie-100"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-cookie-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight text-white mb-1">
                {toast.title}
              </h4>
              <p className="text-xs opacity-90 leading-relaxed break-words">
                {toast.message}
              </p>

              {toast.txHash && (
                <a
                  href={getExplorerTxUrl(toast.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-mono font-medium text-cookie-400 hover:text-cookie-300 underline underline-offset-2 transition-colors"
                >
                  View on CookieScan
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
