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
    <main className="h-screen flex flex-col">
      <Header />
      <div className="p-6 grow overflow-auto bg-slate-300 bg-opacity-20">
        {children} 
      </div>
      <Footer />
    </main>
  );
}
