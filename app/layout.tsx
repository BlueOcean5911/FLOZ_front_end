import AuthProvider from "@middlewares/AuthProvider";

import "./globals.css";
import "./index.css"

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
        <AuthProvider>{children}</AuthProvider>
        {/* {children} */}
      </body>
    </html>
  );
}
