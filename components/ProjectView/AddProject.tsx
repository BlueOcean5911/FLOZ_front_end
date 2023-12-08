"use client"

import { Dialog, Transition } from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import { CalculatorIcon, CalendarIcon, CheckBadgeIcon, CheckIcon, ChevronLeftIcon, MinusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import ProjectIcon from "@components/icons/project.icon";
import CalendarMUI from "@components/Calendar/Calendar";
import PeopleAvatar from "@components/icons/peopleAvatar.icon";
import AddIcon from "@components/icons/add.icon";
import {Calendar, DateObject} from "react-multi-date-picker";
import { SketchPicker } from 'react-color';


const peoplesData = [
  "Hanyang Liu", "Paul Wang", "Jospeph", "Gang", "Lee",
]

const phasesData =
  ["25% SD", "50% SD", "75% SD", "100% SD", "25% DD", "50% DD", "75% DD", "100% DD", "25% CD", "50% CD", "75% CD", "100% CD"]


const AddProject = ({ isOpen = false, closeModal }: {
  isOpen: boolean;
  closeModal: () => void;
}) => {

  const [showCalendarVal,setShowCalendarVal] = useState(new Date().toLocaleDateString() + " - " +new Date().toLocaleDateString())
  const [calendarValues,setCalendarValues] = useState([new DateObject()])
  const [selectedPhase,setSelectedPhase] = useState("25% SD")
  const [selectedPeoples,setSelectedPeoples] = useState([])
  const [isPickColorOpen, setIsPickColorOpen] = useState(false)

  const [lastColor,setLastColor] = useState("")
  const [projectColor, setProjectColor] = useState('#349989');
  const [proName,setProName] = useState("")
  const [client,setClient] = useState("")
  const [proType,setProType] = useState("")

  const handleFinish = () => {
    closeModal();
  }
  const handleCalendarValuesChange = (val:  DateObject[])=>{
    setCalendarValues(val)
    //format
    if(val?.length > 1){
      setShowCalendarVal(val[0].format() + " - " + val[1].format())
    }else{
      setShowCalendarVal(val[0].format() + " - " + val[0].format())
    }

  }
  const handleSaveDraft = () => {
    closeModal();
  }

  const openColorPicker = ()=>{
    setLastColor(projectColor)
    setIsPickColorOpen(true)
  }
  const cancelColor = ()=>{
    setProjectColor(lastColor)
    setIsPickColorOpen(false)
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={()=>{}}>
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
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[719px] h-[741px] flex flex-col transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <div className="h-full flex flex-col">
                    <div className="new-prject flex gap-2">
                      <ChevronLeftIcon className="w-6 h-6 mt-1 rounded-md hover:cursor-pointer hover:bg-gray-100"  onClick={closeModal}/>
                      <div className="grow flex flex-col justify-between gap-2">
                        <h1 className="text-xl font-bold">New Project Kick Off:</h1>
                        <div className="flex p-3 gap-1 justify-between items-center  bg-gray-100 border-2 border-gray-200 rounded-md">
                          <div className="flex w-1/2 gap-2">

                            <div className="flex items-center" onClick={openColorPicker}>
                              <button className="p-4" style={{background:`${projectColor}`}}></button>
                            </div>
                            <div className="grow flex flex-col">
                              <label htmlFor="project-name" className="text-gray-500 text-sm">Project Name</label>
                              <input placeholder={"Project Name"} type="text" id="project-name" name="project-name" className="p-1 text-xs pl-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-400" />
                            </div>
                          </div>
                          <div className="flex justify-between items-center w-1/2">
                            <div className="flex gap-2">
                              <div className="flex flex-col w-1/2">
                                <label htmlFor="client" className="text-gray-500 text-sm">Client</label>
                                <input placeholder={"client"} type="text" id="client" name="client" className="p-1 text-xs pl-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-400" />
                              </div>
                              <div className="flex flex-col w-1/2">
                                <label htmlFor="project-type" className="text-gray-500 text-sm" >Project Type</label>
                                <select id="project-type" defaultValue={'type one'} className="p-1 text-xs pl-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-400">
                                  <option value={'type one'} label={'type one'}></option>
                                  <option value={'type two'} label={'type two'}></option>
                                  <option value={'type three'} label={'type three'}></option>
                                </select>
                              </div>
                            </div>
                            <button className="px-2 py-1 rounded-md bg-tone text-white">Save</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="main-layout grow flex gap-2 my-4 mx-12 overflow-auto">
                      <div className="w-7/12 flex flex-col gap-2 overflow-auto">
                        <div className="flex justify-between">
                          <h3 className="text-sm">Calendar</h3>
                          <h3 className="text-sm text-link">{selectedPhase}</h3>
                        </div>
                        <div className="flex justify-between mx-1 p-1 text-sm rounded-md shadow-blue">
                          <h3>{showCalendarVal}</h3>
                          <CalendarIcon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <Calendar
                              value={calendarValues}
                              onChange={handleCalendarValuesChange}
                              range
                              rangeHover
                              className="teal"
                          />
                          <h3 className="text-sm text-link">Today</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-auto">
                          {
                            peoplesData.map(person => (
                              <div className="flex items-center gap-1 border-2 border-gray-500 rounded-md px-1">
                                <PeopleAvatar className="w-5 h-5 " />
                                <h3 className="text-sm text-link">{person}</h3>
                                <XMarkIcon className="w-4 h-4" />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      <div className="grow flex flex-col justify-between">
                        <div className="h-1/2 flex flex-col gap-1">
                          <h3 className="text-sm">Phase</h3>
                          <div className="flex flex-col gap-1 border-2 border-gray-400 rounded-md">
                            <div className="phase-display flex p-1 justify-between">
                              <h3 className="text-sm text-gray-400">{selectedPhase}</h3>
                              <CalendarIcon className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="grow flex flex-col justify-between border-2 border-gray-400 rounded-md overflow-auto">
                            <div className="grow flex flex-col overflow-auto">
                              {
                                phasesData.map(phase => (
                                  <div onClick={()=>{setSelectedPhase(phase)}} className="flex items-center pl-4 gap-2 hover:cursor-pointer  hover:bg-gray-100">
                                    {phase === selectedPhase ? <CheckIcon className="w-5 h-5 text-link" /> : <div className="w-5 h-5 text-link"></div>}
                                    {phase}
                                  </div>
                                ))
                              }
                            </div>
                            <div className="horizontal-bar h-[2px] w-full bg-gray-400" />
                            <div className="flex items-center pl-4 gap-2 hover:cursor-pointer  hover:bg-gray-100">
                              <AddIcon className="w-5 h-5" />
                              Add Phase
                            </div>
                          </div>
                        </div>
                        <div className="h-1/2 flex flex-col">
                          <h3 className="text-sm">People</h3>
                          <div className="grow flex flex-col border rounded-md border-gray-200 overflow-auto">
                            <div className="flex items-center">
                              <h3 className="grow text-sm text-center text-gray-500 py-1">Build your team</h3>
                              <MinusIcon className="w-5 h-5 rounded-md hover:bg-gray-100"/>
                            </div>
                            <div className="horizontal-bar h-[2px] w-full bg-gray-400" />
                            <div className="grow overflow-auto">
                            {
                              peoplesData.map(person => (
                                  <div className="flex items-center pl-4 gap-2 hover:cursor-pointer hover:bg-gray-100">
                                    <AddIcon className="w-5 h-5 text-link" />
                                    {person}
                                  </div>
                                ))
                              }
                            </div>
                            <div className="horizontal-bar h-[2px] w-full bg-gray-400" />
                            <div className="flex items-center pl-4 gap-2 hover:cursor-pointer hover:bg-gray-100">
                              <AddIcon className="w-5 h-5" />
                              Add People
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="footer flex justify-center gap-8">
                      <button className="w-[150px] rounded-md text-sm bg-white border-2 border-tone text-tone" onClick={handleSaveDraft}>Save Draft</button>
                      <button className="w-[150px] rounded-md text-sm text-white bg-tone" onClick={handleFinish}>Finish</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {
            isPickColorOpen ?
                <>
                  <div className="fixed w-screen h-screen left-0 top-0 z-[100] flex flex-col items-center justify-center">
                    <div className="pick-color absolute w-full h-full">

                      <div className="h-full w-full">
                        <div className="flex min-h-full items-center justify-center text-center">

                          <div className="w-full flex flex-col p-4 justify-center items-center max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                            <h1
                                className="text-xl font-medium leading-6 text-gray-900 m-4"
                            >
                              Pick your project color!
                            </h1>
                            <div className="mt-2">
                              <SketchPicker
                                  color={projectColor}
                                  onChange={(color, event) => setProjectColor(color.hex)}
                              />
                            </div>

                            <div className="mt-4 flex gap-2">
                              <button
                                  type="button"
                                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={() => setIsPickColorOpen(false)}
                              >
                                OK
                              </button>
                              <button
                                  type="button"
                                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={cancelColor}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </> : <></>
          }
        </Dialog>
      </Transition>
    </>
  )
}

export default AddProject;