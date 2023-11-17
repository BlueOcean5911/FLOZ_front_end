"use client";

import React, { useState, Fragment, useEffect } from "react";
import supabase from "@/utils/supabase";

import Select from "@components/Select/Select";
import { getCookie } from "cookies-next";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Transition } from "@headlessui/react";
import { getProjects } from "../../service/project.service";

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

interface DateTime {
  start: string;
  end: string;
}

export default function Calendar() {
  const [selectedProject, setSelectedProject] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState<DateTime>({
    start: "",
    end: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const [initialEvents, setInitialEvents] = useState([]);

  const providerToken = getCookie("p_token");

  const INITIAL_EVENTS = [];

  const userId = getCookie("user_id");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [isOpen]);

  const fetchAllProjects = async () => {
    const projects = await getProjects({ userId: userId });
  };

  async function fetchEvents() {
    const allEvents: Response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        },
      }
    );

    const events: Event = (await allEvents.json()) as Event;
    // Loop through the Google Calendar events and convert them

    const googleEvents = events?.items;
    for (const googleEvent of googleEvents) {
      const eventId = googleEvent.id; // Event ID
      const title = googleEvent.summary; // Event summary
      const start = googleEvent.start.dateTime; // Start date

      const startStr = start?.replace(/T.*$/, "") ?? start;

      const ievents = INITIAL_EVENTS.filter(
        (evt: { id: string }) => evt.id === eventId
      );

      if (!ievents.length) {
        INITIAL_EVENTS.push({
          id: eventId,
          title: title,
          start: startStr,
        });
      }
    }

    // Now, INITIAL_EVENTS contains the converted events in the desired format
    setInitialEvents(INITIAL_EVENTS);
  }

  // async function checkSession() {
  //   const { data } = await supabaseClient.auth.getSession();
  //   return data.session;
  // }

  function closeModal() {
    setIsOpen(false);
  }

  // const handleDateSelect = (selectInfo) => {
  //   const title = prompt("Please enter a new title for your event");
  //   const calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     });
  //   }
  // };

  ////////////////////////////////////////////////////////////////
  const addEvent = (selectInfo: { start: string; end: string }) => {
    setCurrentDateTime(selectInfo);
    setIsOpen(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form);

    const { eventName, eventDescription, attendees } = formData;
    const timestamp = Date.now().toString();
    const requestId = "conference-" + timestamp;

    const event = {
      summary: eventName,
      description: eventDescription ?? "",
      start: {
        dateTime: currentDateTime.start, // Date.ISOString()
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Pakistan/Lahore
      },
      end: {
        dateTime: currentDateTime.end, // Date.ISOString()
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Pakistan/Lahore
      },
      ...(attendees?.length && { attendees: [{ email: attendees }] }),
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const url = new URL(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    );
    const params = { conferenceDataVersion: 1 };
    Object.keys(params).forEach((key) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      url.searchParams.append(key, params[key])
    );

    const eventCreationRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + providerToken, // Access token for google
      },
      body: JSON.stringify(event),
    });

    const eventCreationResponse: { id: string } =
      (await eventCreationRes.json()) as { id: string };

    const eventId = eventCreationResponse.id;

    await supabase.from("event").insert({
      id: eventId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      project_id: selectedProject ? selectedProject : allProjects[0]?.id,
    });

    fetchEvents();
    setIsOpen(false);
  };
  ////////////////////////////////////////////////////////////////

  // const handleEventClick = (clickInfo) => {
  //   if (
  //     confirm(
  //       `Are you sure you want to delete the event '${clickInfo.event.title}'`
  //     )
  //   ) {
  //     clickInfo.event.remove();
  //   }
  // };

  // const handleEvents = (events) => {
  //   // setCurrentEvents(events);
  // };

  // const renderEventContent = (eventInfo) => {
  //   return (
  //     <>
  //       <b>{eventInfo.timeText}</b>
  //       <i>{eventInfo.event.title}</i>
  //     </>
  //   );
  // };

  const handleSelectChange = (id: string) => {
    setSelectedProject(id);
  };

  return (
    <div className="">
      <FullCalendar
        key={initialEvents.length}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
        // select={handleDateSelect}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore No overload matches this call.
        select={addEvent}
      />

      {/* DIALOGUE */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {allProjects?.length > 0 ? (
                    <form onSubmit={onSubmit}>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add Event
                      </Dialog.Title>
                      <div className="my-10">
                        <label
                          className="text-sm font-bold"
                          htmlFor="eventName"
                        >
                          Event Name
                        </label>
                        <input
                          required
                          placeholder="Event Name"
                          id="eventName"
                          name="eventName"
                          className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                        />
                      </div>
                      {allProjects?.length > 0 ? (
                        <div className="my-8 flex w-full flex-col justify-between gap-x-8">
                          <label
                            className="text-sm font-bold"
                            htmlFor="eventName"
                          >
                            Projects
                          </label>
                          <Select
                            options={allProjects}
                            onChange={handleSelectChange}
                            label="Projects"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="my-10">
                        <label
                          className="text-sm font-bold"
                          htmlFor="attendees"
                        >
                          Add Attendee
                        </label>
                        <input
                          placeholder="Attendee"
                          id="attendees"
                          name="attendees"
                          required
                          className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                        />
                      </div>
                      <div className="my-6">
                        <label
                          className="text-sm font-bold"
                          htmlFor="eventDescription"
                        >
                          Event Description
                        </label>
                        <textarea
                          id="eventDescription"
                          name="eventDescription"
                          placeholder="Write event description here..."
                          className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        // onClick={closeModal}
                      >
                        Submit
                      </button>
                    </form>
                  ) : (
                    <p className="text-l flex justify-center p-16 text-center">
                      Add a project in order to add events
                    </p>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
