import { AuthContextProvider } from "../contexts/AuthContext";
import { SupabaseContextProvider } from "../contexts/SupabaseContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseContextProvider>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </SupabaseContextProvider>
  );
}
