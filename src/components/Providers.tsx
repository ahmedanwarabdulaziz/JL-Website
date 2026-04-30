"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { QuotationModalProvider } from "@/contexts/QuotationModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QuotationModalProvider>{children}</QuotationModalProvider>
    </AuthProvider>
  );
}
