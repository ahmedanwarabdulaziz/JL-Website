"use client";

import { createContext, useContext, useState, useCallback } from "react";
import QuotationModal from "@/components/QuotationModal";
import { sendGAEvent } from "@next/third-parties/google";

type QuotationModalContextValue = { openQuotationModal: () => void };

const QuotationModalContext = createContext<QuotationModalContextValue | null>(null);

export function QuotationModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openQuotationModal = useCallback(() => {
    setOpen(true);
    sendGAEvent("event", "open_quotation", { page_source: window.location.pathname });
    (window as any).clarity?.("set", "action", "opened_quotation");
  }, []);
  return (
    <QuotationModalContext.Provider value={{ openQuotationModal }}>
      {children}
      <QuotationModal open={open} onClose={() => setOpen(false)} />
    </QuotationModalContext.Provider>
  );
}

export function useQuotationModal(): QuotationModalContextValue {
  const ctx = useContext(QuotationModalContext);
  if (!ctx) return { openQuotationModal: () => window.location.assign("/contact") };
  return ctx;
}
