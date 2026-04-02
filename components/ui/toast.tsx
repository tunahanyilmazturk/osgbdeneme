"use client";

import { useState, useEffect, useCallback, createContext, useContext, useRef, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

type ToastTur = "success" | "error" | "info" | "warning" | "loading";

interface Toast {
  id: string;
  baslik: string;
  mesaj?: string;
  tur: ToastTur;
  duration?: number;
  progress: number;
}

interface ToastContextType {
  toast: (baslik: string, mesaj?: string, tur?: ToastTur, duration?: number) => void;
  success: (baslik: string, mesaj?: string, duration?: number) => void;
  error: (baslik: string, mesaj?: string, duration?: number) => void;
  warning: (baslik: string, mesaj?: string, duration?: number) => void;
  info: (baslik: string, mesaj?: string, duration?: number) => void;
  loading: (baslik: string, mesaj?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ikonlar: Record<ToastTur, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const toastStyles: Record<ToastTur, { 
  container: string; 
  icon: string; 
  progress: string;
  iconBg: string;
}> = {
  success: {
    container: "bg-green-50/95 border-green-200/60 text-green-900 dark:bg-green-950/90 dark:border-green-800/60 dark:text-green-100",
    icon: "text-green-600 dark:text-green-400",
    progress: "bg-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/50",
  },
  error: {
    container: "bg-red-50/95 border-red-200/60 text-red-900 dark:bg-red-950/90 dark:border-red-800/60 dark:text-red-100",
    icon: "text-red-600 dark:text-red-400",
    progress: "bg-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/50",
  },
  warning: {
    container: "bg-amber-50/95 border-amber-200/60 text-amber-900 dark:bg-amber-950/90 dark:border-amber-800/60 dark:text-amber-100",
    icon: "text-amber-600 dark:text-amber-400",
    progress: "bg-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
  },
  info: {
    container: "bg-blue-50/95 border-blue-200/60 text-blue-900 dark:bg-blue-950/90 dark:border-blue-800/60 dark:text-blue-100",
    icon: "text-blue-600 dark:text-blue-400",
    progress: "bg-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
  },
  loading: {
    container: "bg-slate-50/95 border-slate-200/60 text-slate-900 dark:bg-slate-950/90 dark:border-slate-800/60 dark:text-slate-100",
    icon: "text-slate-600 dark:text-slate-400 animate-spin",
    progress: "bg-slate-500",
    iconBg: "bg-slate-100 dark:bg-slate-900/50",
  },
};

function ToastItem({ toast, onKapat }: { toast: Toast; onKapat: (id: string) => void }) {
  const Ikon = ikonlar[toast.tur];
  const styles = toastStyles[toast.tur];
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 4000;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (toast.tur === "loading") return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);

      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onKapat(toast.id);
      }
    }, 16);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [toast.id, toast.tur, duration, onKapat]);

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onKapat(toast.id);
  };

  return (
    <div className={`relative overflow-hidden animate-slide-in-right flex items-start gap-3 rounded-xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-[420px] ${styles.container}`}>
      {/* Progress bar */}
      {toast.tur !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
          <div
            className={`h-full ${styles.progress} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-3 p-4 w-full">
        {/* Icon */}
        <div className={`shrink-0 rounded-lg p-2 ${styles.iconBg}`}>
          <Ikon className={`h-5 w-5 ${styles.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-semibold text-sm leading-tight">{toast.baslik}</p>
          {toast.mesaj && (
            <p className="mt-1 text-xs opacity-80 leading-relaxed">{toast.mesaj}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const kapat = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((baslik: string, mesaj?: string, tur: ToastTur = "info", duration?: number) => {
    const id = Math.random().toString(36).substring(2, 15);
    setToasts((prev) => [...prev, { id, baslik, mesaj, tur, duration, progress: 100 }]);
    return id;
  }, []);

  const loading = useCallback((baslik: string, mesaj?: string) => {
    const id = Math.random().toString(36).substring(2, 15);
    setToasts((prev) => [...prev, { id, baslik, mesaj, tur: "loading", duration: Infinity, progress: 100 }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    kapat(id);
  }, [kapat]);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((baslik: string, mesaj?: string, duration?: number) => toast(baslik, mesaj, "success", duration), [toast]);
  const error = useCallback((baslik: string, mesaj?: string, duration?: number) => toast(baslik, mesaj, "error", duration), [toast]);
  const warning = useCallback((baslik: string, mesaj?: string, duration?: number) => toast(baslik, mesaj, "warning", duration), [toast]);
  const info = useCallback((baslik: string, mesaj?: string, duration?: number) => toast(baslik, mesaj, "info", duration), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, loading, dismiss, dismissAll }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onKapat={kapat} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
