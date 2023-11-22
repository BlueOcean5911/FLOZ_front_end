import ProjectView from "@components/ProjectView/ProjectView";

import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getTodos, getAllTodos} from "@service/todo.service";
import { getMeetings,getAllMeetings } from "@service/meeting.service";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");
  const projects = await getProjects({});
  const meetings = await getAllMeetings(params.projectId);
  const todolist = await getTodos();
  const projectTodolist = await getAllTodos(params.projectId);
console.log(projectTodolist,'projectTodolist---------');

  return (
    <>
      <ProjectView data={{ projects, todolist, meetings }} />
    </>
  );
}


