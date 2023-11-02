import ProjectDetail from "@components/ProjectDetail";

interface pageProps {
  projectId: string;
}

export default function Page({ params }: { params: pageProps }) {
  return <ProjectDetail pId={params.projectId} />;
}
