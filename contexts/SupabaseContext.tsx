"use client";

import { createContext, ReactNode, useContext } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SupabaseContextInterface {
  supabaseClient: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextInterface | undefined>(
  undefined
);

export const SupabaseContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <SupabaseContext.Provider
      value={{
        supabaseClient,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseContext = (): SupabaseContextInterface => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("SupabaseContext must be within SupabaseContextProvider");
  }

  return context;
};
