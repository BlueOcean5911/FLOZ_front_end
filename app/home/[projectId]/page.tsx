interface pageProps {
  projectId?: string;
}

export default function Page({ params }: { params: pageProps }) {
  return <div className="mt-20">Project {params?.projectId}</div>;
}
