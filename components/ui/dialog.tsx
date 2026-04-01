"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Content */}
      <div className="relative z-50 w-full max-w-lg mx-4 animate-fade-in">
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className = "" }: DialogContentProps) {
  return (
    <div
      className={`rounded-lg border shadow-xl bg-popover ${className}`}
    >
      {children}
    </div>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground mt-1">{children}</p>;
}

export function DialogBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function DialogFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-end gap-3 border-t px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

// Özel Onay Dialogu
interface OnayDialoguProps {
  open: boolean;
  onClose: () => void;
  onOnayla: () => void;
  baslik: string;
  mesaj: string;
  onayButonMetni?: string;
  iptalButonMetni?: string;
  tehlikeli?: boolean;
}

export function OnayDialogu({
  open,
  onClose,
  onOnayla,
  baslik,
  mesaj,
  onayButonMetni = "Onayla",
  iptalButonMetni = "İptal",
  tehlikeli = false,
}: OnayDialoguProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader onClose={onClose}>
          <DialogTitle>{baslik}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-sm text-muted-foreground">{mesaj}</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {iptalButonMetni}
          </Button>
          <Button
            variant={tehlikeli ? "destructive" : "default"}
            onClick={() => {
              onOnayla();
              onClose();
            }}
          >
            {onayButonMetni}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
