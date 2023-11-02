"use client";

import { AuthContextProvider } from "@contexts/AuthContext";
import { SupabaseContextProvider } from "@contexts/SupabaseContext";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContextProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SupabaseContextProvider>
  );
}
