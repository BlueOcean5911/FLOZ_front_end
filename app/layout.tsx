import { AuthContextProvider } from "@/contexts/AuthContext";
import { SupabaseContextProvider } from "@/contexts/SupabaseContext";

import "./globals.css";

export const metadata = {
  title: "Cost Estimator",
  description: "Cost Estimator Web App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseContextProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </SupabaseContextProvider>
      </body>
    </html>
  );
}
