"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastTur = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  baslik: string;
  mesaj?: string;
  tur: ToastTur;
}

interface ToastContextType {
  toast: (baslik: string, mesaj?: string, tur?: ToastTur) => void;
  success: (baslik: string, mesaj?: string) => void;
  error: (baslik: string, mesaj?: string) => void;
  warning: (baslik: string, mesaj?: string) => void;
  info: (baslik: string, mesaj?: string) => void;
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
};

const renkler: Record<ToastTur, string> = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
};

const ikonRenkleri: Record<ToastTur, string> = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
};

function ToastItem({ toast, onKapat }: { toast: Toast; onKapat: (id: string) => void }) {
  const Ikon = ikonlar[toast.tur];

  useEffect(() => {
    const timer = setTimeout(() => onKapat(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onKapat]);

  return (
    <div className={`animate-slide-in-right flex items-start gap-3 rounded-lg border p-4 shadow-lg ${renkler[toast.tur]}`}>
      <Ikon className={`h-5 w-5 mt-0.5 shrink-0 ${ikonRenkleri[toast.tur]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{toast.baslik}</p>
        {toast.mesaj && <p className="mt-1 text-xs opacity-80">{toast.mesaj}</p>}
      </div>
      <button onClick={() => onKapat(toast.id)} className="shrink-0 opacity-60 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const kapat = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((baslik: string, mesaj?: string, tur: ToastTur = "info") => {
    const id = Math.random().toString(36).substring(2, 15);
    setToasts((prev) => [...prev, { id, baslik, mesaj, tur }]);
  }, []);

  const success = useCallback((baslik: string, mesaj?: string) => toast(baslik, mesaj, "success"), [toast]);
  const error = useCallback((baslik: string, mesaj?: string) => toast(baslik, mesaj, "error"), [toast]);
  const warning = useCallback((baslik: string, mesaj?: string) => toast(baslik, mesaj, "warning"), [toast]);
  const info = useCallback((baslik: string, mesaj?: string) => toast(baslik, mesaj, "info"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onKapat={kapat} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
