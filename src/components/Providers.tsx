"use client";

import { QuotationModalProvider } from "@/contexts/QuotationModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <QuotationModalProvider>{children}</QuotationModalProvider>;
}
