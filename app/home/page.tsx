import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import { getProjects } from "../../service/project.service";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id").value;

  const projects = await getProjects({ userId: userId });

  return (
    <div className=" flex flex-col">
      <ProjectPanel data={projects} />
      <div className="mb-24" />
      <Calendar />
    </div>
  );
}
