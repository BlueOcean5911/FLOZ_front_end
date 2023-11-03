import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: false });

  return (
    <div className="m-20 flex flex-col">
      <ProjectPanel data={projects} />
      <div className="mb-24" />
      <Calendar />
    </div>
  );
}
