interface pageProps {
  projectId?: string;
}

export default function Page({ params }: { params: pageProps }) {
  return (
    <div className="mt-10">Description of Project {params?.projectId}</div>
  );
}
