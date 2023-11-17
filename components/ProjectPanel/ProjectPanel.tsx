/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";
import { IProject } from "@models";
import { createProject } from "@./service/project.service";

export default function ProjectPanel({ data }: { data: IProject[] | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<IProject[] | null>(data);

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
      await createProject({ name: projectName.toString() });
      const newEntry = {
        id: tempId,
        name: projectName.toString(),
      };
      setAllProjects((prevProjects) => {
        if (prevProjects) {
          return [...prevProjects, newEntry];
        }
        return [newEntry];
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex w-full items-center justify-between">
      <div className="flex gap-x-4 overflow-x-auto">
        {allProjects?.length === 0 ? (
          <p>No Projects</p>
        ) : (
          allProjects?.map((project: { id: string; name: string }) => (
            <Link
              href={`/home/${project.id}`}
              className="flex rounded-md border border-neutral-300 px-4"
              key={project.id}
            >
              <h4 className="text-lg font-bold">{project.name}</h4>
            </Link>
          ))
        )}
      </div>
      <div className="z-20 flex gap-x-4">
        {/* <div className="inset-0"> */}
        <button
          type="button"
          onClick={openModal}
          className="absolute right-0 top-0 ms-4 rounded-md border border-neutral-300 bg-gray-700 px-4 text-lg font-bold text-white"
        >
          Add Project
        </button>
        {/* </div> */}

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
      <div className="relative">
        <Link
          href="/home/projects"
          className="absolute right-0 mt-8 flex w-32 shrink-0 items-center justify-center rounded-md bg-gray-700 text-white"
        >
          <h4 className="text-sm">View All Projects</h4>
        </Link>
      </div>
    </div>
  );
}
