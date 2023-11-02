import ProjectDetail from "@components/ProjectDetail";

interface pageProps {
  projectId: string;
}

export default function Page({ params }: { params: pageProps }) {
  return (
    <div className="mt-10">
      <ProjectDetail pId={params.projectId} />
    </div>
  );
}
