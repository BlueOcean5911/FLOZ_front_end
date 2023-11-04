/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React, { Fragment, useState } from "react";
import supabase from "@/utils/supabase";

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";

export default function ProjectItems({
  projects,
}: {
  projects: { id: any; name: any }[] | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<
    Record<string, string>
  >({});
  const [allProjects, setAllProjects] = useState<
    { id: any; name: any }[] | null
  >(projects);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(project: Record<string, string>) {
    setSelectedProject(project);
    setIsOpen(true);
  }

  async function updateProjectName(name: string) {
    const project = { ...selectedProject };
    const totalProjects = allProjects && [...allProjects];
    const p = totalProjects?.find((pjt) => pjt.id === project.id);
    p.name = name;
    project.name = name;
    setSelectedProject(project);
    await supabase.from("project").update({ name: name }).eq("id", project.id);
    return totalProjects;
  }

  async function deleteProject(project: { id: string; name: string }) {
    await supabase.from("project").delete().eq("id", project.id);
    const remainingProjects =
      allProjects && [...allProjects].filter((p) => p.id !== project.id);
    setAllProjects(remainingProjects);
    return remainingProjects;
  }

  return (
    <div>
      <div className="flex flex-col space-y-6">
        {allProjects?.map((project: { id: string; name: string }) => (
          <div key={project.id}>
            <div className="flex items-center justify-between rounded-md border border-neutral-300 p-6 shadow-sm">
              <h4 className="text-4xl">{project.name}</h4>
              <div className="flex items-center gap-x-4">
                <TrashIcon
                  onClick={() => deleteProject(project)}
                  className="h-5 w-5 cursor-pointer"
                />
                <PencilSquareIcon
                  onClick={() => openModal(project)}
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!allProjects?.length && (
        <p className="mt-72 flex items-center justify-center text-2xl text-neutral-500">
          There are no projects available
        </p>
      )}

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
                    Edit Project
                  </Dialog.Title>
                  <div className="my-10">
                    <label className="text-sm font-bold">Project Name</label>
                    <input
                      type="text"
                      placeholder="Project X"
                      value={selectedProject?.name ?? ""}
                      onChange={(e) => updateProjectName(e.target.value)}
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
  );
}
