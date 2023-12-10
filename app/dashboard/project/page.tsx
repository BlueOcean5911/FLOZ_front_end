import ProjectItems from "@components/ProjectItems/ProjectItems";
import { cookies } from "next/headers";
import { getProjects } from "@service/project.service";
import { getPersons } from "@service/person.service";
import Sidebar from "@components/sidebar/Sidebar";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const organization = cookieStore.get("user_organization")?.value;

  // Get projects from backend api
  const projects = await getProjects({ userId });
  const persons = await getPersons({ organization });

  return (
    <>
      <div className="w-full items-center justify-between grow sm:h-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
          <div className="col-span-1 sm:border rounded-xl border-stone-300 sm:p-3 bg-white sm:shadow-md overflow-auto">
            <Sidebar persons={persons} projects={projects} />
          </div>

          <div className="col-span-3 overflow-auto shadow-md rounded-xl">
            <ProjectItems projects={projects} />
          </div>
          <div className="col-span-1 border rounded-xl border-stone-300 bg-white shadow-md h-full" ></div>
        </div>
      </div>
    </>
  );
}
