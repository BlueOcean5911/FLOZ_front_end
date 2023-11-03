import ProjectItems from "@components/ProjectItems/ProjectItems";
import React from "react";
import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: false });

  return (
    <div className="m-20">
      <ProjectItems projects={projects} />
    </div>
  );
}
