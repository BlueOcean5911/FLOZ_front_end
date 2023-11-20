import ProjectView from "@components/ProjectView/ProjectView";

import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getTodos } from "@service/todo.service";
import { getMeetings } from "@service/meeting.service";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const projects = await getProjects();
  const todolist = await getTodos();
  const meetings = await getMeetings();
  
  return (
    <>
      <ProjectView data={{ projects, todolist, meetings} } />
    </>
  );
}
