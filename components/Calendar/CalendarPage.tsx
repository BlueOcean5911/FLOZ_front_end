"use client";

import React, { useState, Fragment, useEffect, useRef } from "react";
import IconSearch from "@components/icons/IconSearch";
import { getUserByEmail, getUsers } from "@service/user.service"

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Calendar from './Calendar'
import { DateCalendar, StaticDatePicker, TimeField, TimePicker } from "@mui/x-date-pickers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { getCookie } from "cookies-next";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Transition } from "@headlessui/react";
import { getProjects, updateProject } from "../../service/project.service";
import { createEvent, updateEvent } from "@./service/event.service";
import { Checkbox, ListItemText, OutlinedInput, Typography } from "@mui/material";
import { getPersons, getPersonsByOrganization } from "@service/person.service";
import { useAuthContext } from "@contexts/AuthContext";
import { signOut } from "next-auth/react";
import { createMeeting, deleteMeeting, getMeetings, updateMeeting } from "@service/meeting.service";
import { SketchPicker } from 'react-color';
import axios, { AxiosRequestConfig } from "axios";
import { IPerson, Meeting } from "@models";
import moment from "moment";
import CopyClipboard from "@components/CopyClipboard/CopyClipboard";
import EventModal from "./EventModal";
import { Item, Event } from "types/Calendar.type"

import refreshAccessToken from "@utils/refreshGoogleOAuthToken"
import AddMeeting from "@components/Meeting/AddMeeting";
import { fetchGoogleEvents, updateGoogleCalendarMeeting } from "@utils/googlecalendar.utils";
import { success } from "@utils/nitification.utils";
import { getPeriod } from "@utils/dateFunc.utils";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



export default function CalendarPage() {
  // state value Project List
  const [allProjects, setAllProjects] = useState([]);
  // Selected Date by clicking on the calendar with user
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(new Date());
  // Attributes for the calendar
  const [startAndEndDate, setStartAndEndDate] = useState<{ start: string, end: string }>({
    start: new Date().toISOString(),
    end: moment(new Date()).add(30, 'minutes').toISOString()
  });
  const [initialEvents, setInitialEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventMeetingId, setSelectedEventMeetingId] = useState('');
  const [selectedEventProjectId, setSelectedEventProjectId] = useState('');
  //////////////////////////////////////////////////////////////////////////
  const [projectColorMap, setProjectColorMap] = useState<Record<string, number>[]>([]);
  //////////////////////////////////////////////////////////////////////////
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  ///////////////////////////////////////////////////////////////////////////
  // Determine if the calendar is open or closed
  const [isOpen, setIsOpen] = useState(false);
  const [isEditCompShow, setIsEditCompShow] = useState(false);
  ///////////////////////////////////////////////////////////////////////////
  const { signOut } = useAuthContext();
  
  const calendarRef: any = useRef();
  const [titleDate, setTitleDate] = useState(calendarRef.current?.getApi().view.title);
  // Google OAuth Token
  const providerToken = getCookie("p_token");
  const refreshToken = getCookie("r_token");
  const INITIAL_EVENTS = [];

  const userId = getCookie("user_id");

  useEffect(() => {
    (async () => {
      setCurrentDateTime(new Date());
      await fetchAllProjects();
      await setMeetingList(await getMeetings());
    })();
  }, []);

  useEffect(() => {
    updateProjectColorMap();
    getCalendarTitle();
    fetchEvents();
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      await fetchEvents();
      await setMeetingList(await getMeetings())
    })()
  }, [projectColorMap, allProjects]);

  const fetchAllProjects = async () => {
    const tempProjects = await getProjects({ userId: userId });
    const tempProjectColorMap = [];
    for (let i = 0; i < tempProjects.length; i++) {
      tempProjectColorMap[tempProjects[i]._id] = tempProjects[i].color;
    }

    setAllProjects(tempProjects);
    setProjectColorMap(tempProjectColorMap);

    return;
  };

  async function fetchEvents() {
    try {
      const allEvents = await fetchGoogleEvents(providerToken, refreshToken);
      const events: Event = allEvents as Event;
      // Loop through the Google Calendar events and convert them
      const googleEvents = events?.items;

      for (const googleEvent of googleEvents) {
        const eventId = googleEvent.id; // Event ID
        const title = googleEvent?.summary; // Event summary
        const description = googleEvent?.description;// Event description
        const start = googleEvent?.start?.dateTime; // Start date
        const end = googleEvent?.end?.dateTime; // End date
        const attendees = googleEvent?.attendees;
        const projectId = googleEvent?.extendedProperties?.private.projectId;
        const meeetingId = googleEvent?.extendedProperties?.private.meetingId;
        const meetingUrl = googleEvent?.hangoutLink;
        // const startStr = start?.replace(/T.*$/, "") ?? start;
        // const endStr = end?.replace(/T.*$/, "") ?? end;
        const ievents = INITIAL_EVENTS.filter(
          (evt: { id: string }) => evt.id === eventId
        );

        if (!ievents.length) {
          INITIAL_EVENTS.push({
            id: eventId,
            title: title,
            description: description,
            start: start,
            end: end,
            extendedProps: {
              attendees: attendees,
              projectId: projectId,
              meetingId: meeetingId,
            },
            url: meetingUrl,
            backgroundColor: projectColorMap[projectId],
            borderColor: "transparent",
            // ...googleEvent
          });
        }
      }
      setInitialEvents(INITIAL_EVENTS);
    } catch (error) {
      if ((error?.response?.status & 400) === 400) {
        signOut();
        return;
      } else {
        throw error;
      }
    }
  }

  const addEvent = async (selectInfo: { start: string; end: string }) => {
    setSelectedEventMeetingId('');
    setSelectedEventProjectId('');
    setStartAndEndDate({
      start: selectInfo.start,
      end: selectInfo.end,
    })
    setIsOpen(true);
  };

  const editSelectedEvent = async () => {
    setIsOpen(true);
  }

  const updateProjectColorMap = () => {
    fetchAllProjects();
  }

  const handleResizeEvent = async (info) => {
    const updatedMeeting = await updateMeeting(info?.event?.extendedProps?.meetingId, {
      date: new Date(info?.event.start),
      period: getPeriod(info?.event?.start.toISOString(), info?.event?.end.toISOString()),
      updatedAt: new Date(),
    })
    updateGoogleCalendarMeeting(updatedMeeting, providerToken, refreshToken);
  }

  const removeEvent = () => {
    deleteMeeting(selectedEvent?.event?.extendedProps?.meetingId);
    selectedEvent?.event?.remove();
    deleteEventFromCalendar();
    setIsEditCompShow(false)
    success('Successfully the event is deleted!');
  }

  const deleteEventFromCalendar = async () => {
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.event.id}`
    );

    try {
      await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        }
      });
      selectedEvent.remove();
    } catch (error) {
      console.log("Delete Event Error", error);
    }
  }

  const getCalendarTitle = () => {
    const title = calendarRef.current?.getApi().view.title;
    setTitleDate(title);
    return title;
  }

  const goTOMeetingPage = () => {
    window.open(`\\dashboard\\project\\${selectedEvent?.event?.extendedProps.projectId}\\meeting\\${selectedEvent?.event?.extendedProps?.meetingId}`, '_self');
  }

  const handleChangeDateOfCalendar = (newValue: Date) => {
    setCurrentDateTime(newValue);
    calendarRef.current.getApi().gotoDate(newValue.toISOString())
  }

  const handleFullCalendarClicked = (info) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info);
    setSelectedEventMeetingId(info?.event.extendedProps.meetingId);
    setSelectedEventProjectId(info?.event.extendedProps.projectId);
    setIsEditCompShow(true);
  }

  const refreshFullCalendar = () => {

  }

  const closeEventModal = () => {
    setIsEditCompShow(false);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center p-4 bg-[#DDF1EE] text-[13px]">
        <div className="flex w-[94px] h-[32px] text-[13px] text-white bg-[#349989] items-center rounded-md justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <div onClick={() => { setIsOpen(true); console.log("Create clicked!!1") }}>Create</div>
        </div>
        <div className="flex justify-center w-[85px] h-[32px] mx-[12px] bg-white border-2 border-[#349989] rounded-md text-[#349989]">
          <select className="focus:border-none selected:border-none focus:outline-none" defaultValue={'timeGridWeek'} onChange={(e) => { calendarRef.current.getApi().changeView(e.target.value) }}>
            <option value={'timeGridDay'} >Day</option>
            <option value={'timeGridWeek'}>Week</option>
            <option value={'dayGridMonth'}>Month</option>
          </select>
        </div>
        <button className="w-8 h-8 justify-center border-2 mr-[5px] rounded-md bg-white border-[#349989] flex items-center" onClick={() => {calendarRef.current.getApi().prev();getCalendarTitle()}}>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.69141 0.553519L7.69141 11.4458C7.69141 11.7535 7.29141 11.9689 7.01448 11.7227L0.491406 6.39967C0.245252 6.21506 0.245252 5.81506 0.491406 5.63044L7.01448 0.245827C7.29141 0.030442 7.69141 0.215057 7.69141 0.553519Z" fill="#349989" />
          </svg>
        </button>
        <button className="w-8 h-8 justify-center flex items-center bg-white border-2 rounded-md border-[#349989]" onClick={() => {calendarRef.current.getApi().next();getCalendarTitle()}}>
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.308594 11.4465L0.308593 0.554174C0.308593 0.246483 0.708593 0.0310983 0.985516 0.277252L7.50859 5.60033C7.75475 5.78494 7.75475 6.18494 7.50859 6.36956L0.985517 11.7542C0.708594 11.9696 0.308594 11.7849 0.308594 11.4465Z" fill="#349989" />
          </svg>

        </button>
        <div className="text-base px-[12px]">{titleDate}</div>
      </div>
      <div className="grow flex gap-4">

        <div className="flex-[85%] h-full flex flex-col">

          <div className="grow">
            <div className="h-full text-[10px]">
              <FullCalendar
                ref={calendarRef}
                key={initialEvents.length}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "",
                  center: "",
                  right: "",
                }}
                initialView="timeGridWeek"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventResizableFromStart={true}
                events={initialEvents} // alternatively, use the `events` setting to fetch from a feed
                // select={handleDateSelect}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore No overload matches this call.
                select={addEvent}
                eventResize={handleResizeEvent}
                eventDrop={handleResizeEvent}
                eventClick={handleFullCalendarClicked}
              />
            </div>
          </div>

          <AddMeeting
            isOpen={isOpen} setIsOpen={setIsOpen}
            providerToken={providerToken}
            userId={userId}
            onNewMeeting={() => { refreshFullCalendar }}
            meetingId={selectedEventMeetingId}
            projectId={selectedEventProjectId}
            updateProjectColorMap={setProjectColorMap}
            startAndEndDate={startAndEndDate}
          />
        </div>
        <div className="flex-[15%] mt-4">
          <Calendar handleChangeDate={handleChangeDateOfCalendar} currDate={currentDateTime} meetings={meetingList} />
          <div
            className="text-center text-xs cursor-pointer text-[#0B5CAB]"
            onClick={() => { setCurrentDateTime(new Date()); calendarRef.current.getApi().gotoDate(new Date()) }}>Today</div>
        </div>
      </div>
      <EventModal
        isOpen={isEditCompShow}
        color={projectColorMap[selectedEvent?.event.extendedProps.projectId]}
        selectedEvent={selectedEvent}
        removeEvent={removeEvent}
        closeModal={closeEventModal}
        editSelectedEvent={editSelectedEvent}
        goTOMeetingPage={goTOMeetingPage} />
    </div>
  );
}