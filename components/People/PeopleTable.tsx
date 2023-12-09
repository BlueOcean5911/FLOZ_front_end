import React, { useState, useMemo } from 'react';
import Pagination from '@components/Pagination/Pagination';

let PageSize = 10;

export default function PeopleTable({people}) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return people.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  return (
    <>
      {/* <div className="w-full grow overflow-auto">
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
                    people?.filter((person) => searchPeople !== '' ? person.name.search(new RegExp(`(${searchPeople})`, "i")) !== -1 : true).map((person: IPerson, index: number) => (
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
          </div> */}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={people.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}