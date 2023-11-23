import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import UserCard from "@components/UserCard/UserCard";
import { getProjects } from "@service/project.service";
import { getMeetings } from "@service/meeting.service";
import { getTodos } from "@service/todo.service";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const providerToken = cookieStore.get("p_token")?.value;

  // Get projects from backend api
  const projects = await getProjects({});

  // Get meetings from backend api
  const meetings = await getMeetings();

  // Get todos from backend api
  const todos = await getTodos();

  return (
    <div className="flex flex-col">
      <UserCard data={{ todos }} />
      <ProjectPanel data={{ projects, meetings, userId, providerToken }} />
    </div>
  );
}
