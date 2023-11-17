import ProjectDetail from "@components/ProjectDetail";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import ProjectView from "@components/ProjectView/ProjectView";

import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getTodos } from "@service/todo.service";

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const projects = await getProjects();
  const todolist = await getTodos();
 

  return (
    <>
      <ProjectView data={{ projects, todolist} } />
    </>
  );
}
