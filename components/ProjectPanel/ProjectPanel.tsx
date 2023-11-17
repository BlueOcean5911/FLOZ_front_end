/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import moment from 'moment';
import { get, post } from "../../httpService/http-service";
import supabase from "@/utils/supabase";
export default function ProjectPanel({
  data,
}: {
  data: { _id: any; name: any, userId: String, createdAt: any }[] | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<{ _id: any; name: any, userId: String, createdAt: any }[] | null>(data);
  const [thisMonthProjects, setThisMonthProjects] = useState<{ _id: any; name: any, createdAt: any }[] | null>();
  const [nextMonthProjects, setNextMonthProjects] = useState<{ _id: any; name: any, createdAt: any }[] | null>();
  const [meetings, setMeetings] = useState<{ _id: any; date: any, summary: string, createdAt: any }[] | null>([]);
  const [todayMeetings, setTodayMeetings] = useState([] as any);
  const [tomorrowMeetings, setTomorrowMeetings] = useState([] as any);
  const [meetingsTuesday, setMeetingsTuesday] = useState([] as any);
  const [meetingsThursday, setMeetingsThursday] = useState([] as any);
  const [meetingsFriday, setMeetingsFriday] = useState([] as any);

  useEffect(() => {

    // filter this month and next month project
    let thisMonth = allProjects.filter((project: { createdAt: string }) => {
      const date = new Date(project.createdAt);
      return date.getMonth() === (new Date()).getMonth();
    });
    let nextMonth = allProjects.filter((project: { createdAt: string }) => {
      const date = new Date(project.createdAt);
      return date.getMonth() === (new Date()).getMonth() + 1;
    });
    setThisMonthProjects(thisMonth);
    setNextMonthProjects(nextMonth);
    console.log(thisMonth, 'thisMonth', nextMonth, 'nextMonth');


    //Request to get All meetings
  }, [data, allProjects]);


  function setMeetingsDay(meetingsList) {
    // filter meetings for week days today, tomorrow, this week
    let tomorrow = new Date(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    let meetingsToday = (meetingsList).filter((meeting: { date: string }) => {
      const date = new Date(meeting.date);
      return date.getDate() === (new Date()).getDate();
    });
    let meetingsTomorrow = (meetingsList).filter((meeting: { date: string }) => {
      const date = new Date(meeting.date);
      return date.getDate() === tomorrow.getDate();
    });
    

    
    let meetingsTuesday = (meetingsList).filter((meeting: { date: string }) => {
      const date = new Date(meeting.date);
      return date.getDay() === 2;
    });
    
    let meetingsThursday = (meetingsList).filter((meeting: { date: string }) => {
      const date = new Date(meeting.date);
      return date.getDay() === 4;
    });

    // filter meetings for friday and tuesday in current week
    let meetingsFriday = (meetingsList).filter((meeting: { date: string }) => {
      const date = new Date(meeting.date);
      return date.getDay() === 5;
    }); 
    setTodayMeetings(meetingsToday);
    setTomorrowMeetings(meetingsTomorrow);
    setMeetingsTuesday(meetingsTuesday);
    setMeetingsThursday(meetingsThursday);
    setMeetingsFriday(meetingsFriday);
    setMeetings(meetingsToday);
  }
  useEffect(() => {

    const getMeetings = () => {
      get('meetings').then((res) => {
        console.log(res.data, 'res.data');
        if (res.data) {
          if (res.data.length > 0) {
            setMeetings(res.data);
            setMeetingsDay(res.data);
          }
        }
      });
    }; getMeetings();

  }
    , []);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //get time from date using moment js
  const getTime = (date: string) => {
    return moment(date).format('HH:mm:ss');
  }
  // get month name with date using moment js
  const getMonth = (date: string) => {
    return moment(date).format('MMM Do');
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Access the form element by name
    const projectName = form.get("name"); // Assuming your form input has a name attribute

    if (projectName) {
      const tempId = Math.floor(Math.random() * (999 - 8)) + 8;
      await supabase.from("project").insert({ name: projectName.toString() });
      const newEntry = {
        id: '1',
        name: projectName.toString(),
        userId: '6555b669fdaccb0218c8695e',
      };
      const savedProject = await post('projects', newEntry);
      if (savedProject) {
        const getProject = await get('projects');
        if (getProject.data) setAllProjects(getProject.data);
      }

      setIsOpen(false);
    }
  };

  return (
    <div className="w-full items-center justify-between">
      <div className="flex">
        <div className="w-[910px] border rounded border-stone-300 px-3 py-3 bg-white mr-4" >

          <div className="flex justify-between">
            <div className="flex">
              <h3 className="my-auto pr-2 font-bold text-sm">Project</h3>
              <p className="my-auto text-sm" >As of today at 10:54 AM</p>
            </div>
            <div className="flex">
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Search for the project"
                className={`w-full rounded-md border p-2 px-4 outline-none `}
              />
              <button style={{ color: "#349989", borderRadius: "4px", border: "1px solid var(--Tone, #349989)", background: "var(--foundation-gray-neutral-100, #FFF)" }} type="button" onClick={openModal} className="right-0 top-0 ms-4 rounded-md border border-neutral-300 bg-gray-700 px-4 text-lg font-bold text-white" >
                New
              </button>
            </div>
          </div>


          <div>
            <div className="">

              <div>
                <div className="mt-1 min-h-screen">
                  <div className="bg-white rounded-md">
                    <div>
                      <h2 className="mb-4 text-sm font-bold title_color">This month</h2>
                      <div>
                        {thisMonthProjects?.length === 0 ? (
                          <p className="my-4" style={{ textAlign: "center" }}>No Projects</p>
                        ) :
                          (
                            <div>
                              <div className="grid grid-cols-6 bg-gray-100 py-2 px-4 text-black-400 font-bold text-md">
                                <div>
                                  <input type="checkbox" className="" id="checkbox" />
                                </div>
                                <div><span>Name</span></div>
                                <div><span className="m0-important" >Phase</span></div>
                                <div><span>Due Date</span></div>
                                <div><span></span></div>
                                <div><span></span></div>
                              </div>
                              <div>

                                {thisMonthProjects?.map((project: { _id: string; name: string, createdAt: string }) => (
                                  <div className="grid grid-cols-6 border-t text-sm px-4 font-normal mt-4 space-x-4">
                                    <div>
                                      <input type="checkbox" className="" id="checkbox" />
                                    </div>

                                    <div className="m0-important">
                                      <span className="m0-important f-small">{project.name}</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span>phase</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span>{getMonth(project.createdAt)}</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span className="title_color"> <Link href={`/project/${project._id}`} key={project._id}><h4 className="text-sm f-small">Go to project</h4>
                                      </Link></span>
                                    </div>
                                    <div className="mx-0">
                                      <select style={{ float: 'right' }}>
                                        <option value={''}></option>
                                        <option value={''} >Admin</option>
                                        <option value={''}>User</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}

                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white rounded-md">
                    <div>
                      <h2 className="mb-4 text-sm font-bold title_color">Next month</h2>
                      <div>
                        {nextMonthProjects?.length === 0 ? (
                          <p className="my-4" style={{ textAlign: "center" }}>No Projects</p>

                        ) :
                          (
                            <div>
                              <div className="grid grid-cols-6 bg-gray-100 py-2 px-4 text-black-400 font-bold text-md">
                                <div>
                                  <input type="checkbox" className="" id="checkbox" />
                                </div>
                                <div><span>Name</span></div>
                                <div><span className="m0-important" >Phase</span></div>
                                <div><span>Due Date</span></div>
                                <div><span></span></div>
                                <div><span></span></div>
                              </div>
                              <div>

                                {nextMonthProjects?.map((project: { _id: string; name: string, date: string, createdAt: string }) => (
                                  <div className="grid grid-cols-6 border-t text-sm px-4 font-normal mt-4 space-x-4">
                                    <div>
                                      <input type="checkbox" className="" id="checkbox" />
                                    </div>

                                    <div className="m0-important f-small">
                                      <span className="m0-important">{project.name}</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span>phase</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span>{getMonth(project.createdAt)}</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span className="title_color"> <Link href={`/project/${project._id}`} key={project._id}><h4 className="text-sm f-small">Go to project</h4>
                                      </Link></span>
                                    </div>
                                    <div >
                                      <select style={{ float: 'right' }}>
                                        <option value={''}></option>
                                        <option value={''} >Admin</option>
                                        <option value={''}>User</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}

                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="title_color text-center"> <Link href="/home/projects" ><h4 className="view-all text-center f-small text-sm">View All</h4>
                  </Link></span>
                </div>
              </div>
            </div>
          </div>
        </div>









        <div className="w-[428px] border rounded border-stone-300 px-3 py-3 bg-white" >
          <div className="flex justify-between">
            <div className="flex">
              <h3 className="my-auto pr-2 font-bold text-sm">Meetings</h3>
            </div>
            <div className="flex">
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Search for the project"
                className={`w-full rounded-md border p-2 px-4 outline-none `}
              />
              <button style={{ color: "#349989", borderRadius: "4px", border: "1px solid var(--Tone, #349989)", background: "var(--foundation-gray-neutral-100, #FFF)" }} type="button" onClick={openModal} className="right-0 top-0 ms-4 rounded-md border border-neutral-300 bg-gray-700 px-4 text-lg font-bold text-white" >
                New
              </button>
            </div>
          </div>


          <div>
            <div className="">
              <div>
                <div className="mt-4 min-h-screen">
                  <div className="bg-white rounded-md">
                    <div>
                      <div>
                        {todayMeetings?.length === 0 ? (
                          <p>{''}</p>
                        ) :
                          (
                            <div>
                              <div>
                                <section className="accordion">
                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label htmlFor="cb1" className="tab__label font-bold">Today</label>
                                    <input type="checkbox" name="accordion-1" id="cb1" />
                                    <div className="tab__content">
                                      {todayMeetings?.map((meetings: { _id: string; summary: string, date: string, createdAt: string }) => (
                                        <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                          <div className="m0-important f-small">
                                            <span>{getTime(meetings.date)}</span>
                                          </div>
                                          <div className="m0-important text-sm">
                                            <span className="m0-important font-bold f-small">{meetings.summary}</span>
                                          </div>
                                          <div className="m0-important text-right">
                                            <span className="title_color"> <Link href={`/home/${meetings._id}`} key={meetings._id}><h4 className="f-small text-sm">Details</h4>
                                            </Link></span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md">
                    <div>
                      <div>
                        {tomorrowMeetings?.length === 0 ? (
                          <p>{''}</p>
                        ) :
                          (
                            <div>
                              <div>
                                <section className="accordion">
                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label htmlFor="cb2" className="tab__label font-bold">Tomorrow</label>
                                    <input type="checkbox" name="accordion-1" id="cb2" />
                                    <div className="tab__content">
                                      {tomorrowMeetings?.map((meetings: { _id: string; summary: string, date: string, createdAt: string }) => (
                                        <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                          <div className="m0-important f-small">
                                            <span>{getTime(meetings.date)}</span>
                                          </div>
                                          <div className="m0-important text-sm">
                                            <span className="m0-important font-bold f-small">{meetings.summary}</span>
                                          </div>
                                          <div className="m0-important text-right">
                                            <span className="title_color"> <Link href={`/home/${meetings._id}`} key={meetings._id}><h4 className="f-small text-sm">Details</h4>
                                            </Link></span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md">
                    <div>
                      <div>
                        {meetingsTuesday?.length === 0 ? (
                          <p>{''}</p>
                        ) :
                          (
                            <div>
                              <div>
                                <section className="accordion">
                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label htmlFor="cb2" className="tab__label font-bold">Tuesday</label>
                                    <input type="checkbox" name="accordion-1" id="cb2" />
                                    <div className="tab__content">
                                      {meetingsTuesday?.map((meetings: { _id: string; summary: string, date: string, createdAt: string }) => (
                                        <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                          <div className="m0-important f-small">
                                            <span>{getTime(meetings.date)}</span>
                                          </div>
                                          <div className="m0-important text-sm">
                                            <span className="m0-important font-bold f-small">{meetings.summary}</span>
                                          </div>
                                          <div className="m0-important text-right">
                                            <span className="title_color"> <Link href={`/home/${meetings._id}`} key={meetings._id}><h4 className="f-small text-sm">Details</h4>
                                            </Link></span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md">
                    <div>
                      <div>
                        {meetingsThursday?.length === 0 ? (
                          <p>{''}</p>
                        ) :
                          (
                            <div>
                              <div>
                                <section className="accordion">
                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label htmlFor="cb2" className="tab__label font-bold">Thursday</label>
                                    <input type="checkbox" name="accordion-1" id="cb2" />
                                    <div className="tab__content">
                                      {meetingsThursday?.map((meetings: { _id: string; summary: string, date: string, createdAt: string }) => (
                                        <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                          <div className="m0-important f-small">
                                            <span>{getTime(meetings.date)}</span>
                                          </div>
                                          <div className="m0-important text-sm">
                                            <span className="m0-important font-bold f-small">{meetings.summary}</span>
                                          </div>
                                          <div className="m0-important text-right">
                                            <span className="title_color"> <Link href={`/home/${meetings._id}`} key={meetings._id}><h4 className="f-small text-sm">Details</h4>
                                            </Link></span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-md">
                    <div>
                      <div>
                        {meetingsFriday?.length === 0 ? (
                          <p>{''}</p>
                        ) :
                          (
                            <div>
                              <div>
                                <section className="accordion">
                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label htmlFor="cb2" className="tab__label font-bold">Friday</label>
                                    <input type="checkbox" name="accordion-1" id="cb2" />
                                    <div className="tab__content">
                                      {meetingsFriday?.map((meetings: { _id: string; summary: string, date: string, createdAt: string }) => (
                                        <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                          <div className="m0-important f-small">
                                            <span>{getTime(meetings.date)}</span>
                                          </div>
                                          <div className="m0-important text-sm">
                                            <span className="m0-important font-bold f-small">{meetings.summary}</span>
                                          </div>
                                          <div className="m0-important text-right">
                                            <span className="title_color"> <Link href={`/home/${meetings._id}`} key={meetings._id}><h4 className="f-small text-sm">Details</h4>
                                            </Link></span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                {meetings?.length === 0 ? (
                  <p>{''}</p>
                ) : (

                  <div>
                    <span className="title_color text-center"> <Link href="/home/projects" ><h4 className="view-all text-center f-small text-sm">View All</h4>
                    </Link></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="z-20 flex gap-x-4">
        <button
          type="button"
          onClick={openModal}
          className="absolute right-0 top-0 ms-4 rounded-md border border-neutral-300 bg-gray-700 px-4 text-lg font-bold text-white"
        >
          Add Project
        </button>

        <div className="z-20 flex gap-x-4">
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Create a new Project
                      </Dialog.Title>
                      <div className="my-10">
                        <form onSubmit={handleSubmit}>
                          <label className="text-sm font-bold">
                            Project Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Project X"
                            className={`w-full rounded-md border p-2 px-4 outline-none `}
                          />
                          <button
                            type="submit"
                            className="mt-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            Submit
                          </button>
                        </form>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
      {/* <div className="relative">
        <Link
          href="/home/projects"
          className="absolute right-0 mt-8 flex w-32 shrink-0 items-center justify-center rounded-md bg-gray-700 text-white"
        >
          <h4 className="text-sm">View All Projects</h4>
        </Link>
      </div> */}
    </div>
  );
}
