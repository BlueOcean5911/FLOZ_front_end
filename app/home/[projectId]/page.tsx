import ProjectDetail from "@components/ProjectDetail";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

import { getProviderToken } from "@providerVar";

interface pageProps {
  projectId: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");
  const providerToken = cookieStore.get("p_token");
  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: true });

  const { data: eventIds } = await supabase
    .from("event")
    .select("id")
    .eq("project_id", params.projectId)
    .order("created_at", { ascending: false });

  const allEvents = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + providerToken?.value,
      },
    }
  );
  const googleEvents = await allEvents.json();
  const myEvents = eventIds?.map((event) => event.id);

  // Filter googleEvents to include only those events whose id is in the eventIds array
  const filteredEvents = googleEvents?.filter((event) =>
    myEvents?.includes(event.id)
  );
  console.log("Google events: ", filteredEvents);

  return (
    <>
      <ProjectPanel data={projects} />
      <ProjectDetail pId={params.projectId} events={filteredEvents} />
    </>
  );
}
