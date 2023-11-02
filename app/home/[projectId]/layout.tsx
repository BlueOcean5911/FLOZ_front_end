import Header from "@components/Header/Header";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

interface pageProps {
  projectId?: string;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: pageProps;
}) {
  return (
    <body className="font-figtree flex min-h-screen flex-col justify-center px-3 md:px-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-grow flex-col">
        <Header />
        <ProjectPanel />
        <main className="flex-grow">{children}</main>
      </div>
    </body>
  );
}