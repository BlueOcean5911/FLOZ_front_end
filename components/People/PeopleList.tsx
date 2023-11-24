"use client"

import IconSearch from "../icons/IconSearch";
import { useEffect, useState } from 'react'
import { getPersons, getPersonsByOrganization } from '@service/person.service'
import { IPerson } from '@models/index'
import NewContact from "./NewContact";
import { useAuthContext } from '@contexts/AuthContext'

import dynamic from 'next/dynamic';

const PeopleList = () => {

  const [people, setpeople] = useState<IPerson[]>([])
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false)
  const user = useAuthContext().user;
  useEffect(() => {
    initialize();
  }, [])

  useEffect(() => {
    initialize();
  }, [isNewContactModalOpen])

  const initialize = async () => {
    setpeople( await getPersonsByOrganization(user.organization));
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  const CurrentTimeDynamic = dynamic(
    () => import('./ShowingCurrentTime'),
    { ssr: false }
  );

  return (<>
    <div className="action-list bg-emerald-300 bg-opacity-20 p-6">
      <div className="flex justify-start items-center gap-3">
        <button className="flex  text-white bg-[#349989] items-center rounded-md justify-center p-2 gap-1">
          <img src="/import-icon.png" alt="Export" className="w-6 h-6" />
          Import
        </button>

        <button className="flex  text-white bg-[#349989] items-center rounded-md justify-center p-2 gap-1" onClick={() => {setIsNewContactModalOpen(true)}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Contact
        </button>
      </div>
    </div>
    <div className="people-list p-6 bg-slate-300 bg-opacity-20 h-full">
      <div className="flex flex-col gap-1">

        <div className="w-full bg-white rounded shadow border border-stone-300 h-fit">
          <div className="flex justify-between items-center flex-col sm:flex-row p-3">
            <div className="flex gap-3 my-5 sm:my-0">
              <h3 className="font-bold">All People</h3>
              <h4>As of today at <CurrentTimeDynamic /> </h4>
              <a href="#" className="text-blue-500 underline">refresh</a>
            </div>
            <div className="gap-3 flex items-center">
              <div className="border rounded py-2 px-5 flex items-center">
                <input type="text" className="focus:outline-none" placeholder="Search this list..."></input>
                <IconSearch></IconSearch>
              </div>
            </div>
          </div>
          <div className="w-full">
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
                  </tr>
                </thead>
                <tbody>
                  {
                    people?.map((person: IPerson, index: number) => (
                      <tr>
                        <td className="px-4 py-2 text-center border border-slate-300"><input type="checkbox"></input></td>
                        <td className="px-4 py-2 border border-slate-300">{person.name}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.role}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.phone}</td>
                        <td className="px-4 py-2 border border-slate-300">{person.email}</td>
                        <td className="px-4 py-2 border border-slate-300">{formatDate(new Date(person.updatedAt).toDateString())}</td>
                        <td className="px-4 py-2 border border-slate-300"></td>
                      </tr>
                    ))
                  }``
                </tbody>
              </table>
            </div>
          </div>
          <>
            {isNewContactModalOpen ?
              <NewContact setShow={setIsNewContactModalOpen} organization={user.organization} /> : <></>}
          </>
        </div>
      </div>
    </div>

  </>

  )
}

export default PeopleList;