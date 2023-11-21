"use client"

import IconSearch from "../icons/IconSearch";
import { useEffect, useState } from 'react'
import { getPersons } from '@service/person.service'
import { IPerson } from '@models/index'

const PeopleList = () => {

  const [people, setpeople] = useState<IPerson[]>([])

  useEffect(() => {
    initialize();
  }, [])

  const initialize = async () => {
    setpeople(await getPersons())
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

  const ShowingCurrentTime = () => {
    const [curTime, setCurTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
      const timer = setInterval(() => {
        setCurTime(new Date().toLocaleTimeString());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }, []);

    return (
      <>
        {`${new Date().toLocaleTimeString()}`}
      </>
    )
  }

  return (
    <div className="w-full bg-white rounded shadow border border-stone-300 h-fit">
      <div className="flex justify-between items-center flex-col sm:flex-row p-3">
        <div className="flex gap-3 my-5 sm:my-0">
          <h3 className="font-bold">All People</h3>
          <h4>As of today at <ShowingCurrentTime /> </h4>
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
                people?.map((person:IPerson, index:number) => (
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
    </div>
  )
}

export default PeopleList;