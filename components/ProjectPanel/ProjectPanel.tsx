"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Link from "next/link";

export default function ProjectPanel() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const projects = [
    { id: "1", name: "Project 1" },
    { id: "2", name: "Project 2" },
    { id: "3", name: "Project 3" },
    { id: "4", name: "Project 4" },
    { id: "5", name: "Project 5" },
    { id: "6", name: "Project 6" },
  ];

  return (
    <div className=" flex items-center">
      <div className="flex  gap-x-4 overflow-x-auto">
        {projects.map((project) => (
          <Link
            href={`/home/${project.id}`}
            className="flex rounded-md border border-neutral-300 px-20"
            key={project.id}
          >
            <h4 className=" text-lg font-bold">{project.name}</h4>
          </Link>
        ))}
      </div>
      <div className="z-20 flex gap-x-4">
        <div className="inset-0">
          <button
            type="button"
            onClick={openModal}
            className="ms-4 rounded-md border border-neutral-300 px-10 text-lg font-bold"
          >
            Create Project
          </button>
        </div>

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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create a new Project
                    </Dialog.Title>
                    <div className="my-10">
                      <label className="text-sm font-bold">Project Name</label>
                      <input
                        type="text"
                        placeholder="Project X"
                        className="w-full rounded-md border border-neutral-200 p-2 px-4 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Submit
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}
