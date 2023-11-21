import Footer from "@components/Footer";
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
    <main className="h-full">
      <div className="p-6 bg-slate-300 bg-opacity-20 h-full">
        {children}  
      </div>
      <Footer />
    </main>
  );
}