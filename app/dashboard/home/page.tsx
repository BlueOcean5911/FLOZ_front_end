// import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import UserCard from "@components/UserCard/UserCard";
import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getMeetings } from "@service/meeting.service";
import { getTodos } from "@service/todo.service";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;

  // Get projects from backend api
  const projects = await getProjects({ userId });

  // Get meetings from backend api
  const meetings = await getMeetings();

  // Get todos from backend api
  const todos = await getTodos();

  return (
    <div className="flex flex-col">
      <UserCard data={{ todos }} />
      <ProjectPanel data={{ projects, meetings, userId }} />
    </div>
  );
}
