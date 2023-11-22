import Header from "@components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <div className="grow overflow-auto">
        {children}
      </div>
    </main>
  );
}
