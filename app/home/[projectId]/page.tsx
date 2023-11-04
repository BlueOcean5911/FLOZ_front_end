import ProjectDetail from "@components/ProjectDetail";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";

interface pageProps {
  projectId: string;
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: [
    {
      email: string;
      responseStatus: string;
      self: boolean;
    }
  ];
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
  };
  hangoutLink: string;
}
interface Event {
  kind: string;
  summary: string;
  items: Item[];
}

interface ProviderToken {
  name: string;
  value: string;
}

export default async function Page({ params }: { params: pageProps }) {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");
  const providerToken: ProviderToken = cookieStore.get("p_token");
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const googleEvents: Event = await allEvents.json();
  const myEvents: string[] = eventIds?.map((event: { id: string }) => event.id);

  const filteredEvents = googleEvents?.items?.filter((event: Item) =>
    myEvents?.includes(event.id)
  );

  return (
    <>
      <ProjectPanel data={projects} />
      <ProjectDetail pId={params.projectId} events={filteredEvents} />
    </>
  );
}
