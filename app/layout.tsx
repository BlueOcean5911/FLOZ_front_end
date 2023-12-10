import AuthProvider from "@middlewares/AuthProvider";
import NextAuthProvider from "../contexts/NextAuthContext";

import "./globals.css";
import "./index.css"
import { ToastContainer } from "react-toastify";


export const metadata = {
  title: "FLOZ Cost",
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
          <ToastContainer />
        <NextAuthProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
