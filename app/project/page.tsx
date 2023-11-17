import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import { cookies } from "next/headers";
import { getProjects } from "../../service/project.service";
import { getMeetings } from "../../service/meeting.service";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  // Get projects from backend api
  const projects = await getProjects();

  // Get meetings from backend api
  const meetings = await getMeetings();

  return (
    <div className="flex flex-col">
      <ProjectPanel data={ { projects, meetings } } />
    </div>
  );
}
