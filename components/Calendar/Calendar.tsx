/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import CloseButton from "@components/button/CloseButton";
import IconSearch from "@components/icons/IconSearch";
import { getUsers } from "@service/user.service"

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar, StaticDatePicker, TimeField, TimePicker } from "@mui/x-date-pickers";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useState, Fragment, useEffect, useRef } from "react";
import supabase from "@/utils/supabase";



import { getCookie } from "cookies-next";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Transition } from "@headlessui/react";
import Event from "./Event";
import User from "@models/user.model";
import { Checkbox, ListItemText, OutlinedInput } from "@mui/material";

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

const eventBackColor = {
  "Call": "#FF5BA0",
  "Meeting": "#7B61FF",
  "Send letter/Quote": "#00D079"
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

export default function Calendar() {

  // Calendar ref used to access the calendar API in the calendar component
  const cal: any = useRef();

  const [personName, setPersonName] = React.useState<string[]>([]);


  // Start and End date that reflect to the calendar 
  const [summary, setSummary] = React.useState('');
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs(''));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  // Selected project from the Form
  const [selectedProject, setSelectedProject] = useState("");
  const [allProjects, setAllProjects] = useState([]);

  const [description, setDescription] = useState("");

  // Selected Date by clicking on the calendar with user
  const [currentDateTime, setCurrentDateTime] = useState<Dayjs | null>(dayjs((new Date()).toISOString()));
  // Determine if the calendar is open or closed
  const [isOpen, setIsOpen] = useState(false);
  // Attributes for the calendar
  const [initialEvents, setInitialEvents] = useState([]);

  const [users, setUsers] = useState([]);
  //////////////////////////////////////////////////////////////////////////
  const calendarRef: any = useRef();
  const providerToken = getCookie("p_token");
  const INITIAL_EVENTS = [];
  const user = getCookie("user_id");
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setCurrentDateTime(dayjs((new Date()).toISOString()));
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [isOpen]);

  const handleSelected = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  // If summary in the is changed, the new value is added to the summary state;
  const handleChange = (event: SelectChangeEvent) => {
    setSummary(event.target.value as string);
  };

  const fetchAllProjects = async () => {
    const { data: projects } = await supabase
      .from("project")
      .select("id, name")
      .eq("user_id", user)
      .order("created_at", { ascending: true });
    setAllProjects(projects);
  };

  async function fetchEvents() {
    console.log("providerToken", providerToken);
    const allEvents: Response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + providerToken, // Access token for google
        },
      }
    );

    const events: Event = await allEvents.json();
    // Loop through the Google Calendar events and convert them
    const googleEvents = events?.items;
    console.log(googleEvents, "googleEvents");
    console.log(events, "events");
    for (const googleEvent of googleEvents) {
      const eventId = googleEvent.id; // Event ID
      const title = googleEvent.summary; // Event summary
      const start = googleEvent.start.dateTime; // Start date
      const end = googleEvent.end.dateTime; // End date
      // const startStr = start?.replace(/T.*$/, "") ?? start;
      // const endStr = end?.replace(/T.*$/, "") ?? end;
      const ievents = INITIAL_EVENTS.filter(
        (evt: { id: string }) => evt.id === eventId
      );
      if (!ievents.length) {
        INITIAL_EVENTS.push({
          id: eventId,
          title: title,
          start: start,
          end: end, 
          backgroundColor:eventBackColor[title],
          borderColor:"transparent",
          // ...googleEvent
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



  const addEvent = async (selectInfo: { start: string; end: string }) => {
    setStartDate(dayjs(selectInfo.start));
    setEndDate(dayjs(selectInfo.end));
    let data = await getUsers();
    setUsers(data.data);
    console.log("users", users);
    setIsOpen(true);
  };

  const getLocalTime = (val) => {
    const date = new Date(val);
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() + offset * 60 * 1000)
    // return localTime.toISOString();
    return date.toISOString();
  }

  const onSave = async () => {

    let attendees = [];

    for (const user of users) {
      if (personName.indexOf(user.name) > -1) {
        attendees.push({
          // name: user.name,
          email: user.email,
          responseStatus: "accepted",
          self: true,
        });
      }
    }

    const timestamp = Date.now().toString();
    const requestId = "conference-" + timestamp;


    const event = {
      summary: summary,
      description: description ?? "",
      start: {
        dateTime: getLocalTime(startDate.toISOString()), // Date.ISOString()
        timeZone: Intl.DateTimeFormat().resolvedOptions, // Pakistan/Lahore
      },
      end: {
        dateTime: getLocalTime(endDate.toISOString()),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Pakistan/Lahore
      },
      ...(attendees?.length && { attendees: [attendees] }),
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

    const eventCreationResponse: { id: string } = await eventCreationRes.json();

    const eventId = eventCreationResponse.id;

    await supabase.from("event").insert({
      id: eventId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      project_id: selectedProject ? selectedProject : allProjects[0]?.id,
    });

    fetchEvents();
    setIsOpen(false);
    clearData();
  };

  const handleChangeEvent = async (info) => {

    handleClickedEvent(info);

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${info.event.id}`
    );
    const updatedEvent = {
      summary: info.event.title,
      description: description ?? "",
      start : {
        dateTime : info.event.start
      },
      end : {
        dateTime : info.event.end,
      },
      attendees:info.event.attedeees,
      conferenceData: info.event.conferenceData,
    };
    const eventCreationRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + providerToken, // Access token for google
      },
      body: JSON.stringify(updatedEvent),
    });
    
  } 

  const clearData = () => {
    setSummary("");
    setDescription("");
    setStartDate(dayjs(''));
    setEndDate(dayjs(''));
    setPersonName([]);
  }

  const onChangeDescription = (e: any) => {
    setDescription(e.target.value);
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

  const onSaveNew = () => {
    //save 
    clearData();
  }

  const onCancel = () => {
    clearData()
    setIsOpen(false);
  }

  const setStartDate_date = (date) => {
    const start_date = dayjs(date);
    setStartDate(dayjs(new Date(start_date.year(), start_date.month(), start_date.day(), startDate.hour(), startDate.minute(), startDate.second()).toISOString()));
  }

  const setStartDate_time = (time) => {

    const start_time = dayjs(time);
    setStartDate(dayjs(new Date(startDate.year(), startDate.month(), startDate.day(), start_time.hour(), start_time.minute(), start_time.second()).toISOString()));
  }

  const setEndDate_date = (date) => {
    const end_date = dayjs(date);
    setEndDate(dayjs(new Date(end_date.year(), end_date.month(), end_date.day(), endDate.hour(), endDate.minute(), endDate.second()).toISOString()));
  }

  const setEndDate_time = (time) => {

    const end_time = dayjs(time);
    setStartDate(dayjs(new Date(endDate.year(), endDate.month(), endDate.day(), end_time.hour(), end_time.minute(), end_time.second()).toISOString()));
  }
  const calendarOptions = {
    initialDate: new Date(),
    events: [
      {
        title: 'Event 1',
        start: new Date(),
        end: new Date(),
      },
      {
        title: 'Event 2',
        start: new Date(),
        end: new Date(),
      },
    ],
  };

  let previousClickedElement = null;

  const handleClickedEvent = ((info) => {
    info.el.style.borderColor = 'red' 
    if(previousClickedElement) {
      previousClickedElement.style.borderColor = "transparent"
    }
    previousClickedElement = info.el;
  })
  const getCalendarTitle = () => {
    return calendarRef.current?.getApi().view.title;
  }

  return (
    <div className="h-full flex flex-row">
      <div className="flex-[85%] h-full flex flex-col">
        <div className="flex items-center my-[14px] m-[30px] text-[13px]">
          <div className="flex w-[94px] h-[32px] text-[13px] text-white bg-[#349989] items-center rounded-md justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <div onClick={() => { setIsOpen(true) }}>Create</div>
          </div>
          <div className="flex justify-center w-[85px] h-[32px] mx-[12px] border-2 border-[#349989] rounded-md text-[#349989]">
            <select className="focus:border-none selected:border-none focus:outline-none" defaultValue={'timeGridWeek'} onChange={(e) => { calendarRef.current.getApi().changeView(e.target.value) }}>
              <option value={'timeGridDay'} >Day</option>
              <option value={'timeGridWeek'}>Week</option>
              <option value={'dayGridMonth'}>Month</option>
            </select>
          </div>
          <button className="w-8 h-8 justify-center border-2 mr-[5px] rounded-md border-[#349989] flex items-center" onClick={() => calendarRef.current.getApi().prev()}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.69141 0.553519L7.69141 11.4458C7.69141 11.7535 7.29141 11.9689 7.01448 11.7227L0.491406 6.39967C0.245252 6.21506 0.245252 5.81506 0.491406 5.63044L7.01448 0.245827C7.29141 0.030442 7.69141 0.215057 7.69141 0.553519Z" fill="#349989" />
            </svg>

          </button>
          <button className="w-8 h-8 justify-center flex items-center border-2 rounded-md border-[#349989]" onClick={() => calendarRef.current.getApi().next()}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.308594 11.4465L0.308593 0.554174C0.308593 0.246483 0.708593 0.0310983 0.985516 0.277252L7.50859 5.60033C7.75475 5.78494 7.75475 6.18494 7.50859 6.36956L0.985517 11.7542C0.708594 11.9696 0.308594 11.7849 0.308594 11.4465Z" fill="#349989" />
            </svg>

          </button>
          <div className="text-base px-[12px]">{getCalendarTitle()}</div>
        </div>
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
              initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
              // select={handleDateSelect}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore No overload matches this call.
              select={addEvent}
              eventResize={(info) => handleChangeEvent(info)}
              eventDrop={(info) => handleChangeEvent(info)}
              eventClick={(info) => {handleClickedEvent(info)}}
            />
          </div>
        </div>

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
                  <Dialog.Panel className="w-[719px] h-[741px] flex flex-col transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                    <div className="close-btn flex justify-end p-2">
                      {/* <CloseButton /> */}
                    </div>
                    <div className="title text-center text-xl p-1">
                      New Event
                    </div>
                    <hr className="border-b-1 border-gray-600" />
                    <div className="body px-[30px] py-[40px] flex flex-col">
                      <div className="subject">
                        <div className="subject-title text-xs font-bold p-1"><span className="text-red-500">*</span> Subject</div>
                        <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                          <FormControl fullWidth variant="standard">
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              sx={{ height: '32px' }}
                              onChange={handleChange}
                              // variant="outlined"
                              IconComponent={() => (<span></span>)}
                            >
                              <MenuItem key={0} value={'Call'}>Call</MenuItem>
                              <MenuItem key={1} value={'Meeting'}>Meeting</MenuItem>
                              <MenuItem key={2} value={'Send letter/Quote'}>Send letter/Quote</MenuItem>
                              <MenuItem key={3} value={'Other'}>Other</MenuItem>
                            </Select>
                          </FormControl>
                          <IconSearch className="absolute right-4 top-2" />
                        </div>
                      </div>
                      <div className="description flex flex-col mt-[30px]">
                        <div className="description-title text-xs">Description</div>
                        <textarea className=" max-h-[659px] h-[80px] border-2 border-gray-300 rounded-md" value={description} onChange={(e) => onChangeDescription(e)}></textarea>
                      </div>
                      <div className="period flex mt-[31px] justify-between">
                        <div className="start-date flex flex-col  w-[303px] h-[82px] justify-between" >
                          <div className="title text-xs font-bold">Start</div>
                          <div className="date flex gap-1">
                            <div className="flex flex-col">
                              <div className="date-title text-xs">Date</div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                  <div className="m-w-[100px]">
                                    <DatePicker
                                      value={startDate}
                                      // renderInput={(props) => <TextField {...props} sx={{ height:'32px'}}/>}
                                      onChange={(newValue) => setStartDate_date(newValue)}
                                    />
                                  </div>
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            <div className="flex flex-col">
                              <div className="date-title text-xs">Time</div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                  <div className="m-w-[100px] ">
                                    <TimePicker
                                      value={startDate}
                                      onChange={(newValue) => setStartDate_time(newValue)}
                                    />
                                  </div>
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                        <div className="end-date flex flex-col w-[303px] h-[82px] justify-between" >
                          <div className="title text-xs font-bold">End</div>
                          <div className="date flex gap-1">
                            <div className="flex flex-col">
                              <div className="date-title text-xs">Date</div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                  <div className="m-w-[100px]">

                                    <DatePicker
                                      value={endDate}
                                      onChange={(newValue) => setEndDate_date(newValue)}
                                    />
                                  </div>
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            <div className="flex flex-col">
                              <div className="date-title text-xs">Time</div>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                  <div className="m-w-[100px]">

                                    <TimePicker
                                      value={endDate}
                                      onChange={(newValue) => setEndDate_time(newValue)}
                                    />
                                  </div>
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="guests flex flex-col mt-[32px] mb-[24px]">
                        <div className="guest-title text-xs font-bold p-1">Guests</div>
                        <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                          <FormControl fullWidth variant="standard">
                            <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              multiple
                              value={personName}
                              onChange={handleSelected}
                              input={<OutlinedInput label="Tag" />}
                              renderValue={(selected) => selected.join(', ')}
                              MenuProps={MenuProps}

                              sx={{ height: '32px', fontSize: '12px' }}
                              IconComponent={() => (<span></span>)}
                            >
                              {users.map((user, index) => (
                                <MenuItem key={index} value={user.name}>
                                  <Checkbox checked={personName.indexOf(user.name) > -1} />
                                  <ListItemText primary={user.name} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <IconSearch className="absolute right-4 top-2" />
                        </div>
                      </div>
                      <div className="w-full border-1 rounded-md bg-gray-200 my-[6px] flex justify-start h-8">
                        <ChevronRightIcon className="pl-2 w-8 h-8" />
                        <div className='content text-base'>TBD</div>
                      </div>
                      <div className="w-full border-1 rounded-md bg-gray-200 my-[6px] flex justify-start h-8">
                        <ChevronRightIcon className="pl-2 w-8 h-8" />
                        <div className='content text-base'>TBD</div>
                      </div>
                    </div>
                    <div className="h-[56px] flex justify-end align-baseline gap-3 mx-[30px]">
                      <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
                      <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onSaveNew}>Save & New</button>
                      <button className="bg-[#0176D3] text-white w-fit m-w-[10px] h-[32px] px-2 border-1 border-gray-300 rounded-md" onClick={onSave}>Save</button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="flex-[15%]">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={[
            'DateCalendar',
          ]}>
            <DateCalendar value={currentDateTime} onChange={(newValue) => { setCurrentDateTime(newValue); calendarRef.current.getApi().gotoDate(newValue.toISOString()) }} />
          </DemoContainer>
        </LocalizationProvider>
        <div className="text-center text-xs cursor-pointer text-[#0B5CAB]" onClick={() => { setCurrentDateTime(dayjs(new Date())); calendarRef.current.getApi().gotoDate(new Date()) }}>Today</div>
      </div>
    </div>
  );
}