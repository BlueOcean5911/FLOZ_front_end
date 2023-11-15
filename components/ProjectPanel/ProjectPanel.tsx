/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";

import supabase from "@/utils/supabase";

export default function ProjectPanel({
  data,
}: {
  data: { id: any; name: any }[] | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<{ id: any; name: any }[] | null>(data);
  const [meetings, setMeetings] = useState([
    { id: 1, time: '10:00 AM', title: 'Phone call with GC' },
    { id: 2, time: '10:00 AM', title: 'Phone call with HVAC' },
    { id: 3, time: '10:00 AM', title: 'Phone call with GC' },
    { id: 4, time: '10:00 AM', title: 'Phone call with client' }
  ] as any);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
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
        id: tempId,
        name: projectName.toString(),
      };
      setAllProjects((prevProjects) => {

        if (prevProjects) {
          return [...prevProjects, newEntry];
        }
        console.log(newEntry);
        return [newEntry];
      });
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
            <div className="min-h-screen">

              <div>
                <div className="mt-1">
                  <div className="bg-white rounded-md">
                    <div>
                      <h2 className="mb-4 text-sm font-bold title_color">This month</h2>
                      <div>
                        {allProjects?.length === 0 ? (
                          <p>No Projects</p>
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

                                {allProjects?.map((project: { id: string; name: string }) => (
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
                                      <span>28/12/2021</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span className="title_color"> <Link href={`/home/${project.id}`} key={project.id}><h4 className="text-sm f-small">Go to project</h4>
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
                        {allProjects?.length === 0 ? (
                          <p>No Projects</p>
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

                                {allProjects?.map((project: { id: string; name: string }) => (
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
                                      <span>28/12/2021</span>
                                    </div>
                                    <div className="m0-important f-small">
                                      <span className="title_color"> <Link href={`/home/${project.id}`} key={project.id}><h4 className="text-sm f-small">Go to project</h4>
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
                <span className="title_color"> <Link href={`/home/`} ><h4 className="view-all f-small text-sm">View All</h4>
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
            <div className="min-h-screen">
              <div>
                <div className="mt-4">
                  <div className="bg-white rounded-md">
                    <div>

                      {/* <div x-data="{ open: false }" className="min-h-screen bg-gray-50 py-6 flex flex-col items-center justify-center relative overflow-hidden sm:py-12">
                        <div className="p-4 bg-blue-100 w-1/2 rounded flex justify-between items-center">
                          <div className="flex items-center gap-2">

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                            <h4 className="font-medium text-sm text-blue-500">Today</h4>
                          </div>
                        </div>
                        <div className="w-1/2 bg-white p-4 ">
                          <h4 className="text-sm text-slate-400">Now you can earn bitcoin in your wallet just by referring coinx to one of your friend.</h4>
                          <button className="bg-blue-500 p-2 text-sm text-white font-bold rounded mt-4">Refer now</button>
                        </div>
                      </div> */}

                      <div>
                        {meetings?.length === 0 ? (
                          <p>No Projects</p>
                        ) :
                          (
                            <div>
                              {/* <div className="grid grid-cols-3 bg-white-100 py-2 px-4 text-black-400 font-bold text-md">
                                <div className="flex">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-2 mt-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>Today
                                </div>
                              </div> */}
                              <div>
                                <section className="accordion">

                                  <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                                    <label for="cb2" className="tab__label font-bold">Today</label>
                                    <input type="checkbox" name="accordion-1" id="cb2" />
                                    <div className="tab__content">
                                    {meetings?.map((meetings: { id: string; title: string, time: string }) => (
                                  <div className="grid grid-cols-3 border-t text-sm px-4 font-small mt-4 space-x-4">
                                    <div className="m0-important f-small">
                                      <span>{meetings.time}</span>
                                    </div>
                                    <div className="m0-important text-sm">
                                      <span className="m0-important font-bold f-small">{meetings.title}</span>
                                    </div>
                                    <div className="m0-important text-right">
                                      <span className="title_color"> <Link href={`/home/${meetings.id}`} key={meetings.id}><h4 className="f-small text-sm">Details</h4>
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
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* <div className="z-20 flex gap-x-4">
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
      </div> */}
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
