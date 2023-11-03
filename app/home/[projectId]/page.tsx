import ProjectDetail from "@components/ProjectDetail";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");
  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: true });
  return (
    <>
      <ProjectPanel data={projects} />
      <ProjectDetail pId={params.projectId} />
    </>
  );
}
