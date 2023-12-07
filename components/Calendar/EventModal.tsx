import CopyClipboard from "@components/CopyClipboard/CopyClipboard";
import { Dialog, Transition } from "@headlessui/react";
import { Meeting } from "@models";
import { getMeeting } from "@service/meeting.service";
import moment from "moment";
import { useState, useEffect, Fragment } from "react";


const EventModal =  ({isOpen:isEditCompShow, color: projectColor, selectedEvent, meetingId, goTOMeetingPage, editSelectedEvent, removeEvent, closeModal }) => {

  const  [members, setMembers] = useState([]);
  useEffect(() => {
    (async() => {
      if (meetingId) {
        const meeting:Meeting = await getMeeting(meetingId);
        setMembers(meeting.members);
      }
    })();
  }, [meetingId])

  return (
    <Transition appear show={isEditCompShow} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
          <div className="relative min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs   transform overflow-hidden absolute rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                style={{ left: `${selectedEvent?.jsEvent.x}px`, top: `${selectedEvent?.jsEvent.y}px` }}>
                <div className="flex justify-end gap-1 &>svg:hover:bg-gray-500" onClick={closeModal}>
                  <svg
                    onClick={() => goTOMeetingPage()}
                    className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>

                  <svg
                    onClick={() => editSelectedEvent()}
                    className="w-8 h-8 rounded-md p-1 hover:bg-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                    onClick={() => { removeEvent() }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor"
                    className="w-8 h-8 rounded-md p-1 hover:bg-gray-300"
                    onClick={closeModal}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>

                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-4 h-4 rounded-md mt-2" style={{ backgroundColor: `${projectColor}` }} />
                    <div className="flex flex-col">
                      <h3
                        className="text-xl font-medium leading-6 text-gray-900"
                      >
                        {selectedEvent?.event?.title}
                      </h3>
                      <p className="text-sm">{moment(selectedEvent?.event.start).format(`dddd, MMMM d ⋅ HH:mm `)} - {moment(selectedEvent?.event.end).format("HH:mm")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4" >
                    <img src="/google_meet.svg" width='20' height='20' className="mt-2" />
                    <div className="flex flex-col items-start gap-1">
                      <button
                        onClick={() => { window.open(selectedEvent.event.url, '_blank') }}
                        className="p-2 rounded-md bg-[rgb(26,115,232)] border-none outline-none text-white hover:cursor-pointer">
                        Join with Google Meet
                      </button>
                      <p className="text-xs  pl-2">{selectedEvent?.event.url}</p>
                    </div>
                    <CopyClipboard text={selectedEvent?.event.url} />
                  </div>
                  <div className="flex gap-4">
                    <span className="meh4fc KU3dEf" aria-hidden="true"><svg focusable="false" width="20" height="20" viewBox="0 0 24 24" className=" NMm5M"><path d="M15 8c0-1.42-.5-2.73-1.33-3.76.42-.14.86-.24 1.33-.24 2.21 0 4 1.79 4 4s-1.79 4-4 4c-.43 0-.84-.09-1.23-.21-.03-.01-.06-.02-.1-.03A5.98 5.98 0 0 0 15 8zm1.66 5.13C18.03 14.06 19 15.32 19 17v3h4v-3c0-2.18-3.58-3.47-6.34-3.87zM9 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 9c-2.7 0-5.8 1.29-6 2.01V18h12v-1c-.2-.71-3.3-2-6-2M9 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 9c2.67 0 8 1.34 8 4v3H1v-3c0-2.66 5.33-4 8-4z"></path></svg></span>
                    <div className="flex flex-col gap-1">
                      {
                        (members)?.map((person, index) => {
                          if (person?.email) {
                            return (
                              <div key={index} className="flex items-center gap-1">
                                <div className="inline-block w-6 h-6 uppercase text-center rounded-full bg-gray-500 text-white">{(person.email as string).substring(0, 1)}</div>
                                <div className="flex flex-col">
                                <p className="text-sm" key={person.email}>{person.name}</p>
                                <p className="text-xs" key={person.email}>{person.email}</p>
                                  </div>
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <svg focusable="false" width="20" height="20" viewBox="0 0 24 24" className=" NMm5M"><path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path></svg>
                    <p className="text-sm ">30 minutes before</p>
                  </div>
                  <div className="flex gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      {selectedEvent?.event?.extendedProps?.description}
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EventModal;