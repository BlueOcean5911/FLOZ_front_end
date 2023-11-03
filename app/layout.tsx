import AuthProvider from "@middlewares/AuthProvider";

import "./globals.css";
import Header from "@components/Header";

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
      <AuthProvider>
        <body className="font-figtree flex  flex-col justify-center px-3 md:px-16">
          <Header />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
