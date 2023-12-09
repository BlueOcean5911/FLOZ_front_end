/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import React, { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IProject } from "@./models/project.model";
import { updateProject, deleteProject, getProjects } from "@./service/project.service";
import AddProject from "@components/ProjectView/AddProject";
import MessageIcon from "@components/icons/message.icon";
import SetttingIcon from "@components/icons/setting.icon";
import PeopleIcon from "@components/icons/people.icon";
import StarToogleIcon from "@components/icons/startToggle.icon";
import { Dialog, Transition } from "@headlessui/react";
import Pagination from "@components/Pagination/Pagination";

export default function ProjectItems({
  projects,
}: {
  projects: IProject[] | null;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<IProject>({});
  const [allProjects, setAllProjects] = useState<IProject[] | null>(projects);

  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const currentPageProjects = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return allProjects.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, projects, pageSize]);  



  function closeModal() {
    setIsOpen(false);
  }

  const handleChangeStar = async (val: boolean, data: any) => {
    await updateProject(data.projectId, { favourite: val });
    setAllProjects(await getProjects({}));
  }

  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  function closeEditModal() {
    setIsEditOpen(false);
  }

  function openModal(project: IProject) {
    setSelectedProject(project);
    setIsEditOpen(true);
  }

  async function updateProjectName(name: string) {
    const project: IProject = { ...selectedProject };
    const totalProjects = allProjects && [...allProjects];
    const p = totalProjects?.find((pjt) => pjt._id === project._id);
    p.name = name;
    project.name = name;
    setSelectedProject(project);
    await updateProject(project._id, { name: name });
    return totalProjects;
  }

  async function handleDeleteProject(project: IProject) {
    const id = project._id;
    await deleteProject(id);
    const remainingProjects =
      allProjects && [...allProjects].filter((p) => p._id !== id);
    setAllProjects(remainingProjects);
    return remainingProjects;
  }
  

  return (
    <div className="flex flex-col t-box border rounded border-stone-300 bg-white px-3 py-3 grow sm:h-full overflow-auto" >
      <div className='title text-xl font-bold'>Manage Projects</div>
      <div className='projects-create-new flex justify-between items-center p-2 border-2 border-gray-300 rounded-md bg-gray-200'>
        <div className="flex items-center gap-4">

          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="4" fill="#349989" />
            <path d="M28.4425 18.3963C28.4785 17.6404 27.9385 17.4244 27.7225 17.4244H19.8745C19.1905 17.4244 19.0825 18.1444 19.0825 18.2164V26.6404H28.4425V18.3963ZM23.0425 24.4444C23.0425 24.8404 22.7185 25.1644 22.3225 25.1644H21.6025C21.2065 25.1644 20.8825 24.8404 20.8825 24.4444V23.7244C20.8825 23.3284 21.2065 23.0044 21.6025 23.0044H22.3225C22.7185 23.0044 23.0425 23.3284 23.0425 23.7244V24.4444ZM23.0425 20.7724C23.0425 21.1684 22.7185 21.4924 22.3225 21.4924H21.6025C21.2065 21.4924 20.8825 21.1684 20.8825 20.7724V20.0524C20.8825 19.6564 21.2065 19.3324 21.6025 19.3324H22.3225C22.7185 19.3324 23.0425 19.6564 23.0425 20.0524V20.7724ZM26.6425 24.4444C26.6425 24.8404 26.3185 25.1644 25.9225 25.1644H25.2025C24.8065 25.1644 24.4825 24.8404 24.4825 24.4444V23.7244C24.4825 23.3284 24.8065 23.0044 25.2025 23.0044H25.9225C26.3185 23.0044 26.6425 23.3284 26.6425 23.7244V24.4444ZM26.6425 20.7724C26.6425 21.1684 26.3185 21.4924 25.9225 21.4924H25.2025C24.8065 21.4924 24.4825 21.1684 24.4825 20.7724V20.0524C24.4825 19.6564 24.8065 19.3324 25.2025 19.3324H25.9225C26.3185 19.3324 26.6425 19.6564 26.6425 20.0524V20.7724Z" fill="white" />
            <path d="M21.2425 14.5084C21.2425 14.2204 21.2425 10.3324 21.2425 10.3324C21.2785 9.57635 20.7385 9.36035 20.5225 9.36035H8.3545C7.6705 9.36035 7.5625 10.0804 7.5625 10.1524V26.6404H16.9225V16.0924C16.9225 16.0924 16.9225 15.2284 17.7145 15.2284C17.7145 15.2284 20.1625 15.2284 20.5585 15.2284C20.9545 15.2284 21.2425 14.7964 21.2425 14.5084ZM11.5225 24.0844C11.5225 24.4804 11.1985 24.8044 10.8025 24.8044H10.0825C9.6865 24.8044 9.3625 24.4804 9.3625 24.0844V23.3644C9.3625 22.9684 9.6865 22.6444 10.0825 22.6444H10.8025C11.1985 22.6444 11.5225 22.9684 11.5225 23.3644V24.0844ZM11.5225 20.3764C11.5225 20.7724 11.1985 21.0964 10.8025 21.0964H10.0825C9.6865 21.0964 9.3625 20.7724 9.3625 20.3764V19.6564C9.3625 19.2604 9.6865 18.9364 10.0825 18.9364H10.8025C11.1985 18.9364 11.5225 19.2604 11.5225 19.6564V20.3764ZM11.5225 16.7044C11.5225 17.1004 11.1985 17.4244 10.8025 17.4244H10.0825C9.6865 17.4244 9.3625 17.1004 9.3625 16.7044V15.9844C9.3625 15.5884 9.6865 15.2644 10.0825 15.2644H10.8025C11.1985 15.2644 11.5225 15.5884 11.5225 15.9844V16.7044ZM11.5225 13.0324C11.5225 13.4284 11.1985 13.7524 10.8025 13.7524H10.0825C9.6865 13.7524 9.3625 13.4284 9.3625 13.0324V12.3124C9.3625 11.9164 9.6865 11.5924 10.0825 11.5924H10.8025C11.1985 11.5924 11.5225 11.9164 11.5225 12.3124V13.0324ZM15.4825 24.0844C15.4825 24.4804 15.1585 24.8044 14.7625 24.8044H14.0425C13.6465 24.8044 13.3225 24.4804 13.3225 24.0844V23.3644C13.3225 22.9684 13.6465 22.6444 14.0425 22.6444H14.7625C15.1585 22.6444 15.4825 22.9684 15.4825 23.3644V24.0844ZM15.4825 20.3764C15.4825 20.7724 15.1585 21.0964 14.7625 21.0964H14.0425C13.6465 21.0964 13.3225 20.7724 13.3225 20.3764V19.6564C13.3225 19.2604 13.6465 18.9364 14.0425 18.9364H14.7625C15.1585 18.9364 15.4825 19.2604 15.4825 19.6564V20.3764ZM15.4825 16.7044C15.4825 17.1004 15.1585 17.4244 14.7625 17.4244H14.0425C13.6465 17.4244 13.3225 17.1004 13.3225 16.7044V15.9844C13.3225 15.5884 13.6465 15.2644 14.0425 15.2644H14.7625C15.1585 15.2644 15.4825 15.5884 15.4825 15.9844V16.7044ZM15.4825 13.0324C15.4825 13.4284 15.1585 13.7524 14.7625 13.7524H14.0425C13.6465 13.7524 13.3225 13.4284 13.3225 13.0324V12.3124C13.3225 11.9164 13.6465 11.5924 14.0425 11.5924H14.7625C15.1585 11.5924 15.4825 11.9164 15.4825 12.3124V13.0324ZM19.4425 13.0324C19.4425 13.4284 19.1185 13.7524 18.7225 13.7524H18.0025C17.6065 13.7524 17.2825 13.4284 17.2825 13.0324V12.3124C17.2825 11.9164 17.6065 11.5924 18.0025 11.5924H18.7225C19.1185 11.5924 19.4425 11.9164 19.4425 12.3124V13.0324Z" fill="white" />
          </svg>
          <div className="flex flex-col">
            <div className="text-xl font-bold">Projects</div>
            <div className="text-md">Client</div>
          </div>
        </div>
        <button className="rounded-md border-gray-500 text-white p-2 bg-[#349989] hover:cursor-pointer" onClick={() => { setIsOpen(true) }}>Create New</button>
      </div>
      <div className="h-1 my-2 bg-gray-300 rounded-full"></div>
      <div className="filter flex flex-col sm:flex-row justify-end sm:items-center gap-2">
        <div className="title text-md text-gray-800">Sorted by:</div>
        <div className="flex">
          <select className="border-2 border-gray-300 p-2 rounded-md w-32 text-sm">
            <option value={0}>Project Type</option>
          </select>
          <select className="border-2 border-gray-300 p-2 rounded-md w-32 text-sm">
            <option value={0}>Team</option>
          </select>
          <select className="border-2 border-gray-300 p-2 rounded-md w-32 text-sm">
            <option value={2023}>2023</option>
          </select>
        </div>
      </div>
      <div className="overflow-auto">
        {
          currentPageProjects.map((project, index) => (
            <div key={index} className='projects-create-new flex justify-between items-center p-2 m-1 border-2 border-gray-300 rounded-md bg-gray-200'>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="36" height="36" rx="4" fill="#349989" />
                      <path d="M28.4425 18.3963C28.4785 17.6404 27.9385 17.4244 27.7225 17.4244H19.8745C19.1905 17.4244 19.0825 18.1444 19.0825 18.2164V26.6404H28.4425V18.3963ZM23.0425 24.4444C23.0425 24.8404 22.7185 25.1644 22.3225 25.1644H21.6025C21.2065 25.1644 20.8825 24.8404 20.8825 24.4444V23.7244C20.8825 23.3284 21.2065 23.0044 21.6025 23.0044H22.3225C22.7185 23.0044 23.0425 23.3284 23.0425 23.7244V24.4444ZM23.0425 20.7724C23.0425 21.1684 22.7185 21.4924 22.3225 21.4924H21.6025C21.2065 21.4924 20.8825 21.1684 20.8825 20.7724V20.0524C20.8825 19.6564 21.2065 19.3324 21.6025 19.3324H22.3225C22.7185 19.3324 23.0425 19.6564 23.0425 20.0524V20.7724ZM26.6425 24.4444C26.6425 24.8404 26.3185 25.1644 25.9225 25.1644H25.2025C24.8065 25.1644 24.4825 24.8404 24.4825 24.4444V23.7244C24.4825 23.3284 24.8065 23.0044 25.2025 23.0044H25.9225C26.3185 23.0044 26.6425 23.3284 26.6425 23.7244V24.4444ZM26.6425 20.7724C26.6425 21.1684 26.3185 21.4924 25.9225 21.4924H25.2025C24.8065 21.4924 24.4825 21.1684 24.4825 20.7724V20.0524C24.4825 19.6564 24.8065 19.3324 25.2025 19.3324H25.9225C26.3185 19.3324 26.6425 19.6564 26.6425 20.0524V20.7724Z" fill="white" />
                      <path d="M21.2425 14.5084C21.2425 14.2204 21.2425 10.3324 21.2425 10.3324C21.2785 9.57635 20.7385 9.36035 20.5225 9.36035H8.3545C7.6705 9.36035 7.5625 10.0804 7.5625 10.1524V26.6404H16.9225V16.0924C16.9225 16.0924 16.9225 15.2284 17.7145 15.2284C17.7145 15.2284 20.1625 15.2284 20.5585 15.2284C20.9545 15.2284 21.2425 14.7964 21.2425 14.5084ZM11.5225 24.0844C11.5225 24.4804 11.1985 24.8044 10.8025 24.8044H10.0825C9.6865 24.8044 9.3625 24.4804 9.3625 24.0844V23.3644C9.3625 22.9684 9.6865 22.6444 10.0825 22.6444H10.8025C11.1985 22.6444 11.5225 22.9684 11.5225 23.3644V24.0844ZM11.5225 20.3764C11.5225 20.7724 11.1985 21.0964 10.8025 21.0964H10.0825C9.6865 21.0964 9.3625 20.7724 9.3625 20.3764V19.6564C9.3625 19.2604 9.6865 18.9364 10.0825 18.9364H10.8025C11.1985 18.9364 11.5225 19.2604 11.5225 19.6564V20.3764ZM11.5225 16.7044C11.5225 17.1004 11.1985 17.4244 10.8025 17.4244H10.0825C9.6865 17.4244 9.3625 17.1004 9.3625 16.7044V15.9844C9.3625 15.5884 9.6865 15.2644 10.0825 15.2644H10.8025C11.1985 15.2644 11.5225 15.5884 11.5225 15.9844V16.7044ZM11.5225 13.0324C11.5225 13.4284 11.1985 13.7524 10.8025 13.7524H10.0825C9.6865 13.7524 9.3625 13.4284 9.3625 13.0324V12.3124C9.3625 11.9164 9.6865 11.5924 10.0825 11.5924H10.8025C11.1985 11.5924 11.5225 11.9164 11.5225 12.3124V13.0324ZM15.4825 24.0844C15.4825 24.4804 15.1585 24.8044 14.7625 24.8044H14.0425C13.6465 24.8044 13.3225 24.4804 13.3225 24.0844V23.3644C13.3225 22.9684 13.6465 22.6444 14.0425 22.6444H14.7625C15.1585 22.6444 15.4825 22.9684 15.4825 23.3644V24.0844ZM15.4825 20.3764C15.4825 20.7724 15.1585 21.0964 14.7625 21.0964H14.0425C13.6465 21.0964 13.3225 20.7724 13.3225 20.3764V19.6564C13.3225 19.2604 13.6465 18.9364 14.0425 18.9364H14.7625C15.1585 18.9364 15.4825 19.2604 15.4825 19.6564V20.3764ZM15.4825 16.7044C15.4825 17.1004 15.1585 17.4244 14.7625 17.4244H14.0425C13.6465 17.4244 13.3225 17.1004 13.3225 16.7044V15.9844C13.3225 15.5884 13.6465 15.2644 14.0425 15.2644H14.7625C15.1585 15.2644 15.4825 15.5884 15.4825 15.9844V16.7044ZM15.4825 13.0324C15.4825 13.4284 15.1585 13.7524 14.7625 13.7524H14.0425C13.6465 13.7524 13.3225 13.4284 13.3225 13.0324V12.3124C13.3225 11.9164 13.6465 11.5924 14.0425 11.5924H14.7625C15.1585 11.5924 15.4825 11.9164 15.4825 12.3124V13.0324ZM19.4425 13.0324C19.4425 13.4284 19.1185 13.7524 18.7225 13.7524H18.0025C17.6065 13.7524 17.2825 13.4284 17.2825 13.0324V12.3124C17.2825 11.9164 17.6065 11.5924 18.0025 11.5924H18.7225C19.1185 11.5924 19.4425 11.9164 19.4425 12.3124V13.0324Z" fill="white" />
                    </svg>
                    <div className="flex flex-col">
                      <div className="text-md">Client</div>
                      <div className="text-xl font-bold">{project.name}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm">Sub Title</div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <select className="border-2 border-gray-300 p-2 rounded-md w-32 text-sm text-[#349989]">
                  <option value={0}>Unassigned</option>
                </select>
                <div className="flex gap-2 sm:gap-1">
                  <SetttingIcon  onClick={() => openModal(project)} />
                  <PeopleIcon onClick={() => {router.push(`/dashboard/people?projectId=${project._id}`)}}/>
                  <MessageIcon onClick={()=>router.push(`/dashboard/project/${project._id}/meeting`)}/>
                  <StarToogleIcon state={project.favourite} data={{ projectId: project._id }} onChange={handleChangeStar} />
                </div>
              </div>
            </div>
          ))
        }
        <div className="pagination flex justify-end px-12 py-4">
            <select className="border-2 border-gray-200 rounded-md
              focus:outline-none focus:border-gray-400" defaultValue={10} value={pageSize} onChange={(e) => {setPageSize(parseInt(e.target.value))}}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={allProjects.length}
              pageSize={pageSize}
              onPageChange={page => setCurrentPage(page)}
              />
          </div>
      </div>

      <AddProject isOpen={isOpen} closeModal={closeModal} />

      <Transition appear show={isEditOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
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
                    onClick={closeEditModal}
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
