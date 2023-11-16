// import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import UserCard from "@components/UserCard/UserCard";
import { cookies } from "next/headers";
import supabase from "@/utils/supabase";
import { get, post } from "../../httpService/http-service";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: true });

  let projectList = [];
  const getProject = await get('projects');
  if (getProject.data) projectList = getProject.data;

  return (
    <div className="flex flex-col">
      <UserCard />
      <ProjectPanel data={projectList} />
    </div>
  );
}
