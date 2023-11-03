"use client";

import React, { useState, Fragment, useEffect } from "react";
import { useSupabaseContext } from "@contexts/SupabaseContext";
import supabase from "@/utils/supabase";

import Select from "@components/Select/Select";
import { getCookie } from "cookies-next";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { Dialog, Transition } from "@headlessui/react";

export default function Calendar({
  projects,
}: {
  projects: { id: any; name: any }[] | null;
}) {
  const [selectedProject, setSelectedProject] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const [initialEvents, setInitialEvents] = useState([]);

  const { supabaseClient } = useSupabaseContext();
  const providerToken = getCookie("p_token");

  const INITIAL_EVENTS = [];

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const allEvents = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        },
      }
    );
    const events = await allEvents.json();

    const googleCalendarEvents = events.items;

    // Loop through the Google Calendar events and convert them
    for (const googleEvent of googleCalendarEvents) {
      const eventId = googleEvent.id; // Event ID
      const title = googleEvent.summary; // Event summary
      const start = googleEvent.start.dateTime; // Start date

      // Format the start date as a string
      const startStr = start?.replace(/T.*$/, "") ?? start;

      // Add the converted event to the INITIAL_EVENTS array
      const ievents = INITIAL_EVENTS.filter((evt) => evt.id === eventId);

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

  async function checkSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDateSelect = (selectInfo) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  ////////////////////////////////////////////////////////////////
  const addEvent = async (selectInfo) => {
    setCurrentDateTime(selectInfo);
    setIsOpen(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
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
      attendees: [{'email': attendees}],
      conferenceData: {
        createRequest: {
          requestId: requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
    const params = { conferenceDataVersion: 1 };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const eventCreationRes = await fetch(
      url,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        },
        body: JSON.stringify(event),
      }
    );

    const eventCreationResponse = await eventCreationRes.json();
    const eventId = eventCreationResponse.id;

    await supabase
      .from("event")
      .insert({ id: eventId, project_id: selectedProject });

    fetchEvents();
  };
  ////////////////////////////////////////////////////////////////

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  const handleEvents = (events) => {
    // setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

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
        select={addEvent}
        // eventContent={renderEventContent} // custom render function
        // eventClick={handleEventClick}
        // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        // eventAdd={handleAddEvent}
        // eventRemove={handleRemoveEvent}
        // eventChange={handleUpdateEvent}

        /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
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
                  <form onSubmit={onSubmit}>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add Event
                    </Dialog.Title>
                    {/* event name */}
                    <div className="my-10">
                      <label className="text-sm font-bold" for="eventName">
                        Event Name
                      </label>
                      <input
                        placeholder="Event Name"
                        id="eventName"
                        name="eventName"
                        className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                      />
                    </div>
                    <div className="my-8 flex flex-col w-full justify-between gap-x-8">
                      <label className="text-sm font-bold" for="eventName">
                        Projects
                      </label>
                      <Select
                        options={projects}
                        onChange={handleSelectChange}
                        label="Projects"
                      />
                    </div>
                    <div className="my-10">
                      <label className="text-sm font-bold" for="attendees">
                        Add Attendees
                      </label>
                      <input
                        placeholder="Attendees"
                        id="attendees"
                        name="attendees"
                        className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                      />
                    </div>
                    {/* event description */}
                    <div className="my-6">
                      <label
                        className="text-sm font-bold"
                        for="eventDescription"
                      >
                        Event Description
                      </label>
                      <textarea
                        id="eventDescription"
                        name="eventDescription"
                        placeholder="Write event description here..."
                        className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                        // value={eventDescription}
                        // onChange={(e) => setEventDescription(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Submit
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
