'use client'

import Sidebar from "@components/sidebar/Sidebar";
import { useAuthContext } from "@contexts/AuthContext";
import { IProject, IUser, Meeting, Todo } from "@models";
import { getPersons } from "@service/person.service";
import { getProjects } from "@service/project.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddMeeting from "./AddMeeting";
import { deleteMeeting, getAllMeetings, updateMeeting } from "@service/meeting.service";
import moment from "moment";
import next from "next";
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar, StaticDatePicker, TimeField, TimePicker } from "@mui/x-date-pickers";

const MeetingView = ({
  data
}: {
  data: {
    project: IProject | null;
    todolist: Todo[] | null;
    meetings: Meeting[] | null;
    userId?: string;
    providerToken?: string;
  }
}) => {
  const { user } = useAuthContext();
  const [peopleList, setPeopleList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState(data.meetings);
  const [projectIdToColorMap, setProjectIdToColorMap] = useState<Record<string, string>>({});
  const [isUploadAudioModal, setIsUploadAudioModal] = useState({ isOpen: false, uploadType: 'audio' });
  const [previousMeeting, setPreviousMeeting] = useState<Meeting>(null);
  const [nextMeeting, setNextMeeting] = useState<Meeting>(null);
  const [currDateOfSchedule, setCurrDateOfSchedule] = useState<Date>(new Date());

  useEffect(() => {
    let tempMeetings = [...meetings].filter(meeting => (new Date(meeting.date)).toISOString() < (new Date()).toISOString());
    if (tempMeetings.length > 0) {
      setPreviousMeeting(tempMeetings?.at(tempMeetings.length - 1));

    } else {
      setPreviousMeeting(null);
    }
    tempMeetings = [...meetings].filter(meeting => (new Date(meeting.date)).toISOString() > (new Date()).toISOString());
    if (tempMeetings.length > 0) {
      setNextMeeting(tempMeetings?.at(0));
    } else {
      setNextMeeting(null);
    }
  }, [meetings])

  useEffect(() => {
    if (user && user.organization) {
      getIntialData(user);
    }
  }, [user]);


  const getIntialData = async (user: IUser) => {
    try {
      const dbPersons = await getPersons({ organization: user.organization });
      if (dbPersons.length > 0) {
        setPeopleList(dbPersons);
      }

      const dbProjects = await getProjects({ userId: user._id });
      if (dbProjects.length > 0) {
        setProjects(dbProjects);
      }
      const tempProjectIdToColorMap: Record<string, string> = {}
      dbProjects.map(project => {
        tempProjectIdToColorMap[project._id] = project.color;
      })
      setProjectIdToColorMap(tempProjectIdToColorMap);
    } catch (error) {
      console.log("getPersons error", error?.response?.data);
    }
  }


  const refreshMeetings = async () => {
    const updatedMeetings = await getAllMeetings({ projectId: data.project._id });
    setMeetings(updatedMeetings);
  }

  const uploadMeetingAudio = (): void => {
    setIsUploadAudioModal({ isOpen: true, uploadType: 'audio' });
  }

  const truncateSummary = (summary, maxWords) => {
    const words = summary?.split(' ');
    const truncatedSummary = words?.slice(0, maxWords).join(' ');
    return words?.length > maxWords ? truncatedSummary + '...' : truncatedSummary;
  };

  const handleDateOfSchedule = (val) => {
    const date = moment(currDateOfSchedule);
    const newDate = date.add(val, "days");
    setCurrDateOfSchedule(newDate.toDate());
  }

  const removeMeeting = async (id) => {
    try {
      await deleteMeeting(id);
      setMeetings([...meetings].filter((meeting => meeting._id !== id)));
    } catch (error) {
      console.log(error, "schedule remove meeting error")
    }
  }

  const toggleFavourite = async (meeting: Meeting, index: number) => {
    try {
      const resp = await updateMeeting(meeting._id, {
        favourite: !meeting.favourite,
      })
      console.log(resp, !meeting.favourite);
      const tempMeetings = [...meetings];
      tempMeetings[index].favourite = !meeting.favourite;
      setMeetings([...tempMeetings]);
    } catch (error) {
      console.log(error, "schedule toggle favourite error")
    }
  }

  console.log([...meetings].filter(meeting => (new Date(meeting.date)).toISOString() > (new Date()).toISOString()))
  return (
    <div className="h-full items-center justify-between">
      <div className="grid grid-cols-5 gap-4 h-full">
        <div className="col-span-1 border rounded border-stone-300 px-3 py-3 bg-white card_shadow">
          <Sidebar persons={peopleList} projects={projects} />
        </div>
        <div className="col-span-3 overflow-auto">
          <div className="flex flex-col gap-2 h-full overflow-auto">

            <div className="flex flex-col manage-project-box border rounded border-stone-300 px-3 py-3 bg-white h-[65%] " >
              <div className="flex justify-between">
                <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Manage your project</h3>
                <Link href={`/dashboard/project/${data.project._id}/meeting`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </div>
              <div className="flex flex-col">
                <div className="grow flex justify-between">
                  <div className="grow grid grid-cols px-3 m-4">
                    <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                      <div className="flex meeting-card">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M29.0809 23.2L25.2823 20.0307C24.4105 19.3193 23.1651 19.2546 22.2933 19.9661L19.0551 22.4239C18.6815 22.7473 18.1211 22.6826 17.7474 22.2945L12.8902 17.767L8.53122 12.722C8.15759 12.3339 8.15759 11.8164 8.40668 11.3637L10.773 8.00034C11.458 7.09483 11.3957 5.80123 10.7107 4.89572L7.65942 0.950262C6.72534 -0.213971 5.04401 -0.343331 3.98539 0.756223L0.74726 4.11956C0.249087 4.637 0 5.34848 0 6.05995C0.311358 12.6573 3.17586 18.9312 7.41033 23.3294C11.6448 27.7276 17.6852 30.7029 24.0369 31.0263C24.7219 31.091 25.4068 30.7676 25.905 30.2501L29.1432 26.8868C30.3263 25.9166 30.264 24.1056 29.0809 23.2Z" fill="#349989" />
                        </svg>
                      </div>
                      <AddMeeting providerToken={data.providerToken} userId={data.userId} projectId={data.project._id} onNewMeeting={refreshMeetings}>
                        <div className="pl-4 cursor-pointer">
                          <h3 className="card-title-font">Start a meeting now</h3>
                          <p className="card-desc-font" >New meeting /New task</p>
                        </div>
                      </AddMeeting>
                    </div>
                  </div>
                  <div className="horizontal-bar w-1 rounded-full bg-gray-200"></div>
                  <div className="grow grid grid-cols px-3 m-4">
                    <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                      <div className="flex meeting-card">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M29.8459 19.0771H27.9997C27.5074 19.0771 27.0766 19.5079 27.0766 20.0002V26.1542C27.0766 26.6465 26.6459 27.0773 26.1535 27.0773H5.84585C5.35355 27.0773 4.92278 26.6465 4.92278 26.1542V20.0002C4.92278 19.5079 4.49201 19.0771 3.9997 19.0771H2.15355C1.66124 19.0771 1.23047 19.5079 1.23047 20.0002V28.3081C1.23047 29.6619 2.33816 30.7696 3.69201 30.7696H28.3074C29.6612 30.7696 30.7689 29.6619 30.7689 28.3081V20.0002C30.7689 19.5079 30.3382 19.0771 29.8459 19.0771Z" fill="#349989" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.6771 1.50701C16.3079 1.13777 15.754 1.13777 15.3848 1.50701L7.0771 9.81483C6.70787 10.1841 6.70787 10.7379 7.0771 11.1072L8.36941 12.3995C8.73864 12.7687 9.29249 12.7687 9.66172 12.3995L13.1079 8.95328C13.4771 8.58404 14.154 8.8302 14.154 9.38406L14.154 22.4919C14.2156 22.9843 14.7079 23.415 15.1386 23.415L16.9848 23.415C17.4771 23.415 17.9079 22.9843 17.9079 22.4919L17.9079 9.44559C17.9079 8.89174 18.5848 8.64558 18.954 9.01482L22.4002 12.461C22.7694 12.8303 23.3233 12.8303 23.6925 12.461L24.9848 11.1072C25.354 10.7379 25.354 10.1841 24.9848 9.81483L16.6771 1.50701Z" fill="#349989" />
                        </svg>
                      </div>
                      <div className="pl-4 cursor-pointer" onClick={uploadMeetingAudio}>
                        <h3 className="card-title-font" onClick={() => setIsUploadAudioModal({ isOpen: true, uploadType: 'audio' })}>Upload meeting audios</h3>

                        <p className="card-desc-font" >Get summary for your meetings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grow flex flex-col overflow-auto">

                <div className="flex flex-col grow overflow-auto">
                  <div className="flex">
                    <div className="w-1/2">All Meetings</div>
                    <div className="w-1/2 flex">
                      <div className="w-6/12">Topic</div>
                      <div className="w-5/12">Time</div>
                      <div className="w-1/12">Edit</div>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full "></div>
                  <div className="overflow-auto">

                    {
                      meetings.map((meeting, index) => {
                        return (
                          <div key={index} className="flex text-sm">
                            <div className="w-1/2 my-1">
                              {
                                (new Date(meeting.date)).toISOString() > (new Date()).toISOString() ? <p className="mr-8 p-1 border-2 border-dashed border-gray-400 rounded-md">{truncateSummary(meeting.summary, 4)}</p> :
                                  <p className="mr-8 p-1 border-2  border-gray-300 bg-gray-200 rounded-md">{truncateSummary(meeting.summary, 4)}</p>
                              }

                            </div>
                            <div className="w-1/2 flex  items-center">
                              <div className="w-6/12">
                                <p
                                  className="p-1 mx-2 border-2border-transparent rounded-md text-white font-bold"
                                  style={{ backgroundColor: `${projectIdToColorMap[meeting.projectId]}` }}
                                >Topic</p>
                              </div>
                              <div className="w-5/12">{moment(meeting.date).format("MMM D, YYYY h:mm a")}</div>
                              <div className="w-1/12 flex justify-evenly items-center" >
                                <div onClick={() => toggleFavourite(meeting, index)}>
                                  {
                                    meeting.favourite ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M7.81949 0.338873L9.23488 4.95426C9.29641 5.13887 9.48103 5.23118 9.66564 5.23118H14.281C14.7426 5.23118 14.9272 5.84657 14.558 6.12349L10.8041 8.89272C10.6503 9.0158 10.5887 9.23118 10.6503 9.4158L12.4349 14.1543C12.558 14.585 12.0964 14.9543 11.7272 14.6773L7.69641 11.662C7.54257 11.5389 7.32718 11.5389 7.14257 11.662L3.08103 14.6773C2.7118 14.9543 2.21949 14.585 2.37334 14.1543L4.09641 9.4158C4.15795 9.23118 4.09641 9.0158 3.94257 8.89272L0.188722 6.12349C-0.180509 5.84657 0.0348759 5.23118 0.465645 5.23118H5.08103C5.29641 5.23118 5.45026 5.16964 5.5118 4.95426L6.95795 0.308104C7.08103 -0.122665 7.69641 -0.0918959 7.81949 0.338873Z" fill="#747474" />
                                    </svg> :
                                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.81949 1.33887L10.2349 5.95426C10.2964 6.13887 10.481 6.23118 10.6656 6.23118H15.281C15.7426 6.23118 15.9272 6.84657 15.558 7.12349L11.8041 9.89272C11.6503 10.0158 11.5887 10.2312 11.6503 10.4158L13.4349 15.1543C13.558 15.585 13.0964 15.9543 12.7272 15.6773L8.69641 12.662C8.54257 12.5389 8.32718 12.5389 8.14257 12.662L4.08103 15.6773C3.7118 15.9543 3.21949 15.585 3.37334 15.1543L5.09641 10.4158C5.15795 10.2312 5.09641 10.0158 4.94257 9.89272L1.18872 7.12349C0.819491 6.84657 1.03488 6.23118 1.46565 6.23118H6.08103C6.29641 6.23118 6.45026 6.16964 6.5118 5.95426L7.95795 1.3081C8.08103 0.877335 8.69641 0.908104 8.81949 1.33887Z" fill="white" stroke="#747474" strokeWidth="1.5" />
                                      </svg>

                                  }
                                </div>
                                <svg
                                  onClick={() => { }}
                                  width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M7.02025 5.34225C5.79486 5.34225 4.82084 6.31627 4.82084 7.54165C4.82084 8.76703 5.79486 9.74106 7.02025 9.74106C8.24563 9.74106 9.21965 8.76703 9.21965 7.54165C9.21965 6.31627 8.24563 5.34225 7.02025 5.34225ZM13.6179 9.52028L12.4553 8.54626C12.5182 8.20064 12.5496 7.8236 12.5496 7.47798C12.5496 7.13236 12.5182 6.75532 12.4553 6.4097L13.6179 5.43567C13.9949 5.12147 14.1206 4.55591 13.8692 4.11603L13.3665 3.23627C13.178 2.92207 12.8324 2.73355 12.4553 2.73355C12.3296 2.73355 12.204 2.76497 12.1097 2.79639L10.6644 3.33053C10.0988 2.82781 9.47042 2.48219 8.8106 2.26225L8.55923 0.785502C8.46497 0.282781 8.02509 0 7.52237 0H6.51693C6.01421 0 5.57433 0.282781 5.48007 0.785502L5.22871 2.23083C4.53747 2.45077 3.90906 2.82781 3.3435 3.29911L1.89818 2.76497C1.7725 2.73355 1.67824 2.70213 1.55256 2.70213C1.17552 2.70213 0.829897 2.89065 0.641376 3.20485L0.138655 4.08461C-0.112705 4.52449 -0.018445 5.09005 0.390016 5.40425L1.55256 6.37828C1.48972 6.7239 1.4583 7.10094 1.4583 7.44656C1.4583 7.8236 1.48972 8.16922 1.55256 8.51484L0.390016 9.48886C0.012975 9.80307 -0.112705 10.3686 0.138655 10.8085L0.641376 11.6883C0.829897 12.0025 1.17552 12.191 1.55256 12.191C1.67824 12.191 1.80392 12.1596 1.89818 12.1281L3.3435 11.594C3.90906 12.0967 4.53747 12.4424 5.19729 12.6623L5.44865 14.1705C5.54291 14.6732 5.95137 15.0188 6.48551 15.0188H7.49095C7.99367 15.0188 8.43355 14.6418 8.52781 14.139L8.77918 12.6309C9.50184 12.3795 10.1617 12.0025 10.7272 11.4683L12.0783 12.0025C12.204 12.0339 12.3296 12.0653 12.4553 12.0653C12.8324 12.0653 13.178 11.8768 13.3665 11.5626L13.8378 10.7457C14.1206 10.4 13.9949 9.83448 13.6179 9.52028ZM7.01998 10.997C5.10336 10.997 3.56378 9.45744 3.56378 7.54082C3.56378 5.62419 5.10336 4.08461 7.01998 4.08461C8.93661 4.08461 10.4762 5.62419 10.4762 7.54082C10.4762 9.45744 8.93661 10.997 7.01998 10.997Z" fill="#747474" />
                                </svg>

                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="milestone manage-project-box border rounded border-stone-300 bg-white h-[35%]">
              <h3 className="my-auto font-bold text-sm">Milestone:</h3>
              <div className="milestone-main flex gap-2 items-center ml-1">
                <p className="inline-block font-bold text-sm text-gray-500">Previous Meeting:&nbsp;</p>
                {previousMeeting !== null ?
                  <>
                    <p className="inline-block min-w-[30px] border-2 border-gray-300 rounded-md bg-gray-200 text-sm">{previousMeeting.summary}</p>
                    <p className="text-sm">{moment(previousMeeting.date).format("MMM D, YYYY h:mm a")}</p>
                  </>
                  : <></>}
              </div>
              <div className="milestone-main flex items-center ml-1">
                <p className="inline-block font-bold text-sm text-gray-500">Next Meeting:&nbsp;</p>
                {nextMeeting !== null ?
                  <>
                    <p className="inline-block min-w-[30px] border-2 border-gray-300 rounded-md bg-gray-200   text-sm">{nextMeeting.summary}</p>
                    <p className="text-sm">{moment(nextMeeting.date).format("MMM D, YYYY h:mm a")}</p>
                  </>
                  : <></>}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 border rounded border-stone-300 bg-white card_shadow h-full" >
          <div className="flex flex-col justify-between h-full">
            <div className="calendar">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={[
                  'DateCalendar',
                ]}>
                  <DateCalendar value={dayjs(currDateOfSchedule)} onChange={(newValue) => { setCurrDateOfSchedule(newValue.toDate());}} />
                </DemoContainer>
              </LocalizationProvider>
              <div className="text-center text-xs cursor-pointer text-[#0B5CAB]" onClick={() => { setCurrDateOfSchedule(new Date()); }}>Today</div>
            </div>

            <div className="h-[2px] my-1 rounded-full mx-4 bg-gray-300"></div>

            <div className="schedule grow m-1 mt-2 flex flex-col">
              <div className="heading flex justify-between">

                <div className="title text-sm font-bold">Schedule:</div>
                <div className="date flex">
                  <svg
                    onClick={() => { handleDateOfSchedule(-1) }}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <p className="text-sm select-none">{moment(currDateOfSchedule).format('MMM D')}</p>
                  <svg
                    onClick={() => { handleDateOfSchedule(1) }}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>

                </div>
              </div>

              <div className="schedule-meetingList grow mt-2 flex flex-col gap-1 overflow-auto">
                {
                  meetings.filter((meeting) => (new Date(meeting.date)).toDateString() === currDateOfSchedule.toDateString()).map((meeting, index) => (

                    <div key={index} className={`schedule-meeting flex justify-between p-2 bg-[#DDF1EE] border-2 border-gray-200 rounded-md ${(new Date(meeting.date)) > (new Date()) ? '' : 'bg-white border-[#DDF1EE]'} select-none`}>
                      <div className="flex flex-col text-xs">
                        <p className="text-gray-500">{'Topic'}</p>
                        <p>{meeting.summary}</p>
                      </div>
                      <div className="flex flex-col text-xs text-right">
                        <p className="hover:cursor-pointer" onClick={() => removeMeeting(meeting._id)}>X</p>
                        <p>{moment(meeting.date).format('MMM d')}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetingView;