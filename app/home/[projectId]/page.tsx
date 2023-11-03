import ProjectDetail from "@components/ProjectDetail";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";
import { getProviderToken } from "@providerVar";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const providerToken = getProviderToken();
  async function checkSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");
  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: true });

  const { data: eventsData } = await supabase
    .from("event")
    .select("id")
    .eq("project_id", params.projectId)
    .order("created_at", { ascending: false });

  console.log("eventsData: ", eventsData);

  const allEvents = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + providerToken,
      },
    }
  );
  const events = await allEvents.json();

  return (
    <>
      <ProjectPanel data={projects} />
      <ProjectDetail pId={params.projectId} events={eventsData} />
    </>
  );
}
