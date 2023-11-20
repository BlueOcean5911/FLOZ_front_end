import ProjectItems from "@components/ProjectItems/ProjectItems";
import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  // Get projects from backend api
  const projects = await getProjects({});

  return (
    <div className="flex flex-col">
      <ProjectItems projects={projects} />
    </div>
  );
}
