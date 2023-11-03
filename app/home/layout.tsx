import AuthProvider from "@middlewares/AuthProvider";

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
    <main className="px-8">
      <Header />
      {children}
    </main>
  );
}
