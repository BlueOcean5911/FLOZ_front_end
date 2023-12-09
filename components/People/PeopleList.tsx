"use client"

import IconSearch from "../icons/IconSearch";
import { deletePerson, getPersonByProject, getPersons, getPersonsByOrganization } from '@service/person.service'
import { IPerson } from '@models/index'
import NewContact from "./NewContact";
import { useAuthContext } from '@contexts/AuthContext'

import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";

import React, { useState, useEffect, useMemo } from 'react';
import Pagination from '@components/Pagination/Pagination';


const PeopleList = () => {

  const [people, setpeople] = useState<IPerson[]>([])
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState({ isOpen: false, action: 'create' })
  const [searchPeople, setSearchPeople] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [pageSize, setPageSize] = useState(20);
  const userOrganization = getCookie('user_organization');
  const projectId = useSearchParams().get("projectId");

  const [currentPage, setCurrentPage] = useState(1);

  const currentPagePeople = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return people.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, people, pageSize]);  


  useEffect(() => {
    fetchPeople();
  }, [])

  useEffect(() => {
    fetchPeople();
  }, [isNewContactModalOpen])

  const fetchPeople = async () => {
    const tempPeople = await getPersonsByOrganization(userOrganization)
    if (projectId) {
      const personIds: string[] = await getPersonByProject(projectId)
      const uniquePersonIds: string[] = [];
      for (let i = 0; i < personIds.length; i++) {
        if (!uniquePersonIds.includes(personIds[i])) {
          uniquePersonIds.push(personIds[i])
        }
      }
      console.log(uniquePersonIds);
      setpeople(tempPeople.filter(person => uniquePersonIds.includes(person._id)));
    } else {
      setpeople(tempPeople);
    }
  }

  const formatDate = (dateString) => {

    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const CurrentTimeDynamic = dynamic(() => import('./ShowingCurrentTime'), { ssr: false });

  const deleteSelectedPerson = async (id) => {
    await deletePerson(id);
    setpeople(people.filter((person) => person._id !== id));
  }

  return (<>
    <div className="action-list flex flex-col bg-emerald-300 bg-opacity-20 p-4 px-8">
      <div className="flex justify-start items-center gap-3">
        <button className="flex h-8 text-white text-sm bg-[#349989] items-center rounded-md justify-center p-2 gap-1">
          <img src="/import-icon.png" alt="Export" className="w-5 h-5" />
          Import
        </button>
        <button className="flex h-8 text-white text-sm bg-[#349989] items-center rounded-md justify-center p-2 gap-1" onClick={() => { setSelectedPersonId(''); setIsNewContactModalOpen({ isOpen: true, action: 'create' }) }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Contact
        </button>
      </div>
    </div>
    <div className="people-list grow p-6 bg-slate-300 bg-opacity-20 overflow-auto">
      <div className="flex flex-col gap-1 overflow-auto h-full">

        <div className="w-full flex flex-col bg-white rounded shadow border border-stone-300 h-full overflow-auto">
          <div className="flex justify-between items-center flex-col sm:flex-row p-3">
            <div className="flex gap-3 my-5 sm:my-0">
              <h3 className="font-bold">All People</h3>
              <h4>As of today at <CurrentTimeDynamic /> </h4>
              <button className="text-blue-500 underline" onClick={fetchPeople}>refresh</button>
            </div>
            <div className="gap-3 flex items-center">
              <div className="border-2 border-gray-300 rounded-md py-1 px-5 flex items-center">
                <input
                  value={searchPeople}
                  onChange={(e) => setSearchPeople(e.target.value)}
                  type="text" className="focus:outline-none text-sm " placeholder="Search this list..."></input>
                <IconSearch></IconSearch>
              </div>
            </div>
          </div>
          <div className="w-full grow overflow-auto">
            <div>
              <table className="border-collapse border w-full my-5">
                <thead>
                  <tr className="bg-emerald-300 bg-opacity-20">
                    <th className="w-1/12 px-4 py-2 border border-slate-300"><input type="checkbox"></input></th>
                    <th className="px-4 py-2 border border-slate-300">
                      <div className="flex gap-2 w-4/12">
                        Name<img src="/arrow.svg" alt="image"></img>
                      </div>
                    </th>
                    <th className="px-4 py-2 border border-slate-300">
                      <div className="flex gap-2 w-4/12">
                        Role<img src="/arrow.svg" alt="image"></img>
                      </div>
                    </th>
                    <th className="px-4 py-2 border border-slate-300">
                      <div className="flex gap-2 w-4/12">
                        Phone<img src="/arrow.svg" alt="image"></img>
                      </div>
                    </th>
                    <th className="px-4 py-2 border border-slate-300">
                      <div className="flex gap-2 w-4/12">
                        Email<img src="/arrow.svg" alt="image"></img>
                      </div>
                    </th>
                    <th className="px-4 py-2 border border-slate-300">
                      <div className="flex gap-2 w-2/3">
                        Last Activity Date<img src="/arrow.svg" alt="image"></img>
                      </div>
                    </th>
                    <th className="px-4 py-2 border border-slate-300">Other</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    currentPagePeople?.filter((person) => searchPeople !== '' ? person.name.search(new RegExp(`(${searchPeople})`, "i")) !== -1 : true).map((person: IPerson, index: number) => (
                      <tr className="hover:bg-gray-200" id={`${person._id}`} >
                        <td className="px-4 py-2 text-center border border-slate-300"><input type="checkbox"></input></td>
                        <td className="px-4 py-2 border border-slate-300">{person.name}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.role}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.phone}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.email}</td>
                        <td className="px-4 py-2 border border-slate-300">{formatDate(new Date(person.updatedAt).toDateString())}</td>
                        <td className="px-4 py-2 border border-slate-300"></td>
                        <td className="flex justify-center gap-1 items-center py-2" >
                          <svg
                            onClick={(e) => { setSelectedPersonId(person._id); setIsNewContactModalOpen({ isOpen: true, action: 'edit' }); }}
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>

                          <svg
                            onClick={() => { deleteSelectedPerson(person._id) }}
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
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
              totalCount={people.length}
              pageSize={pageSize}
              onPageChange={page => setCurrentPage(page)}
              />
          </div>
          <>
            {isNewContactModalOpen.isOpen ?
              <NewContact setShow={setIsNewContactModalOpen} action={isNewContactModalOpen.action} setPeople={setpeople} people={people} selectedPersonId={selectedPersonId} organization={userOrganization} /> : <></>}
          </>
        </div>
      </div>
    </div>

  </>

  )
}

export default PeopleList;