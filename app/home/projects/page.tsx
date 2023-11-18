import ProjectItems from "@components/ProjectItems/ProjectItems";
import React from "react";
import { cookies } from "next/headers";
import { getProjects } from "@./service/project.service";

export default async function Page() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id").value;

  const projects = await getProjects({ userId: userId });

  return (
    <div className="m-20">
      <ProjectItems projects={projects} />
    </div>
  );
}
