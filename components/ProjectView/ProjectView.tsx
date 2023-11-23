/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import moment from 'moment';
import { IProject } from "@models/project.model";
import Todo from "@models/todo.model";
import Meeting from "@models/meeting.model";
import SignupFeatures from "@components/Signup/SignupFeatures";
import UploadAudioModal from "@components/UploadAudioModal/UploadAudioModal";
import Sidebar from "@components/sidebar/Sidebar";

export default function ProjectView({
  data
}: {
  data: {
    project: IProject | null;
    todolist: Todo[] | null;
    meetings: Meeting[] | null;
  }
}) {
  const [todoList, setTodoList] = useState(data.todolist);
  const [meetings, setMeetings] = useState(data.meetings);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isUploadAudioModal, setIsUploadAudioModal] = useState(false);
  const truncateSummary = (summary, maxWords) => {
    const words = summary.split(' ');
    const truncatedSummary = words.slice(0, maxWords).join(' ');

    return words.length > maxWords ? truncatedSummary + '...' : truncatedSummary;
  };

  //get time from date using moment js
  const getTime = (date: string) => {
    return moment(date).format('HH:mm:ss');
  }
  // get month name with date using moment js
  const getMonth = (date: string) => {
    return moment(date).format('MMM Do');
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Access the form element by name
    const projectName = form.get("name"); // Assuming your form input has a name attribute

    if (projectName) {

    }
  };

  //DELETE TASK
  function closeTask(value) {
    todoList.splice(todoList.findIndex(item => item._id == value._id), 1);
    setTodoList([...todoList]);
  }

  const uploadMeetingAudio = (): void => {
    //TODO: Add login to uplaod files to backend
    console.log('uploading audio...');
    setIsUploadAudioModal(true);
  }

  const startMeetingNow = () => {
    //TODO: Add login to start meeting
    console.log('starting meeting...');
  }

  return (
    <div className="w-full items-center justify-between">
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-1 border rounded border-stone-300 px-3 py-3 bg-white card_shadow">
          <Sidebar />
        </div>


        <div className="col-span-3">
          <div className=" manage-project-box border rounded border-stone-300 px-3 py-3 bg-white" >
            <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Manage your project</h3>
            <div className="grid grid-cols-2">
              <div>
                <div className="grid grid-cols px-3">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M29.0809 23.2L25.2823 20.0307C24.4105 19.3193 23.1651 19.2546 22.2933 19.9661L19.0551 22.4239C18.6815 22.7473 18.1211 22.6826 17.7474 22.2945L12.8902 17.767L8.53122 12.722C8.15759 12.3339 8.15759 11.8164 8.40668 11.3637L10.773 8.00034C11.458 7.09483 11.3957 5.80123 10.7107 4.89572L7.65942 0.950262C6.72534 -0.213971 5.04401 -0.343331 3.98539 0.756223L0.74726 4.11956C0.249087 4.637 0 5.34848 0 6.05995C0.311358 12.6573 3.17586 18.9312 7.41033 23.3294C11.6448 27.7276 17.6852 30.7029 24.0369 31.0263C24.7219 31.091 25.4068 30.7676 25.905 30.2501L29.1432 26.8868C30.3263 25.9166 30.264 24.1056 29.0809 23.2Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4 cursor-pointer" onClick={startMeetingNow}>
                      <h3 className="card-title-font">Start a meeting now</h3>
                      <p className="card-desc-font" >New meeting /New task</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols px-3 pt-3">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M29.8459 19.0771H27.9997C27.5074 19.0771 27.0766 19.5079 27.0766 20.0002V26.1542C27.0766 26.6465 26.6459 27.0773 26.1535 27.0773H5.84585C5.35355 27.0773 4.92278 26.6465 4.92278 26.1542V20.0002C4.92278 19.5079 4.49201 19.0771 3.9997 19.0771H2.15355C1.66124 19.0771 1.23047 19.5079 1.23047 20.0002V28.3081C1.23047 29.6619 2.33816 30.7696 3.69201 30.7696H28.3074C29.6612 30.7696 30.7689 29.6619 30.7689 28.3081V20.0002C30.7689 19.5079 30.3382 19.0771 29.8459 19.0771Z" fill="#349989" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.6771 1.50701C16.3079 1.13777 15.754 1.13777 15.3848 1.50701L7.0771 9.81483C6.70787 10.1841 6.70787 10.7379 7.0771 11.1072L8.36941 12.3995C8.73864 12.7687 9.29249 12.7687 9.66172 12.3995L13.1079 8.95328C13.4771 8.58404 14.154 8.8302 14.154 9.38406L14.154 22.4919C14.2156 22.9843 14.7079 23.415 15.1386 23.415L16.9848 23.415C17.4771 23.415 17.9079 22.9843 17.9079 22.4919L17.9079 9.44559C17.9079 8.89174 18.5848 8.64558 18.954 9.01482L22.4002 12.461C22.7694 12.8303 23.3233 12.8303 23.6925 12.461L24.9848 11.1072C25.354 10.7379 25.354 10.1841 24.9848 9.81483L16.6771 1.50701Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4 cursor-pointer" onClick={uploadMeetingAudio}>
                      <h3 className="card-title-font" onClick={() => setIsUploadAudioModal(true)}>Upload meeting audios</h3>
                      
                      <p className="card-desc-font" >Get summary for your meetings</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex pl-4 " style={{ borderLeft: "2px solid gainsboro" }}>
                  <div>
                    <h3 className="my-auto pr-2 pb-1 font-bold text-sm">Previous Meetings</h3>
                    {
                      meetings.map((meeting) => {
                        return (
                          <Link href={`/dashboard/project/${data.project._id}/meeting/${meeting._id}`}>
                            <div className="prev-meetings-items"><p>{truncateSummary(meeting.summary, 5)}</p></div>
                          </Link>
                        )
                      })
                    }
                  </div>
                  <div className="pl-2">
                    <h3 className="my-auto pr-2 pb-1 font-bold text-sm">Time</h3>
                    {
                      meetings.map((meeting) => {
                        return (
                          <p className="my-auto py-1 text-sm">{moment(meeting.date).format('MMM DD, YYYY HH:mm:ss')}</p>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" manage-project-box border rounded border-stone-300 p-3 mt-4 bg-white" >
            <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Project Cost</h3>
            <div className="grid grid-cols-2 ">
              <div className="px-3">
                <div className="flex justify-between">
                  <h3 className="font-bold text-sm">Biding for:</h3>
                  <div className=" pb-3">
                    <select className="select-project-dropdown">
                      <option value={''}>SD 50% Architecture</option>
                      <option value={''} >SD 50% Interior</option>
                      <option value={''}>SD 75% Architecture</option>
                      <option value={''} >SD 75% Interior</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols pb-3">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M29.0809 23.2L25.2823 20.0307C24.4105 19.3193 23.1651 19.2546 22.2933 19.9661L19.0551 22.4239C18.6815 22.7473 18.1211 22.6826 17.7474 22.2945L12.8902 17.767L8.53122 12.722C8.15759 12.3339 8.15759 11.8164 8.40668 11.3637L10.773 8.00034C11.458 7.09483 11.3957 5.80123 10.7107 4.89572L7.65942 0.950262C6.72534 -0.213971 5.04401 -0.343331 3.98539 0.756223L0.74726 4.11956C0.249087 4.637 0 5.34848 0 6.05995C0.311358 12.6573 3.17586 18.9312 7.41033 23.3294C11.6448 27.7276 17.6852 30.7029 24.0369 31.0263C24.7219 31.091 25.4068 30.7676 25.905 30.2501L29.1432 26.8868C30.3263 25.9166 30.264 24.1056 29.0809 23.2Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4">
                      <h3 className="card-title-font">Start a meeting now</h3>
                      <p className="card-desc-font" >New meeting /New task</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M29.8459 19.0771H27.9997C27.5074 19.0771 27.0766 19.5079 27.0766 20.0002V26.1542C27.0766 26.6465 26.6459 27.0773 26.1535 27.0773H5.84585C5.35355 27.0773 4.92278 26.6465 4.92278 26.1542V20.0002C4.92278 19.5079 4.49201 19.0771 3.9997 19.0771H2.15355C1.66124 19.0771 1.23047 19.5079 1.23047 20.0002V28.3081C1.23047 29.6619 2.33816 30.7696 3.69201 30.7696H28.3074C29.6612 30.7696 30.7689 29.6619 30.7689 28.3081V20.0002C30.7689 19.5079 30.3382 19.0771 29.8459 19.0771Z" fill="#349989" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.6771 1.50701C16.3079 1.13777 15.754 1.13777 15.3848 1.50701L7.0771 9.81483C6.70787 10.1841 6.70787 10.7379 7.0771 11.1072L8.36941 12.3995C8.73864 12.7687 9.29249 12.7687 9.66172 12.3995L13.1079 8.95328C13.4771 8.58404 14.154 8.8302 14.154 9.38406L14.154 22.4919C14.2156 22.9843 14.7079 23.415 15.1386 23.415L16.9848 23.415C17.4771 23.415 17.9079 22.9843 17.9079 22.4919L17.9079 9.44559C17.9079 8.89174 18.5848 8.64558 18.954 9.01482L22.4002 12.461C22.7694 12.8303 23.3233 12.8303 23.6925 12.461L24.9848 11.1072C25.354 10.7379 25.354 10.1841 24.9848 9.81483L16.6771 1.50701Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4">
                      <h3 className="card-title-font">Upload meeting audios</h3>
                      <p className="card-desc-font" >Get summary for your meetings</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ borderLeft: "2px solid gainsboro" }} >
                <div className="flex pl-4 ">
                  <div>
                    <section className="accordion">
                      <div className="tab bg-white-100 py-2 px-4 text-black-400 text-md">
                        <div>
                          <label htmlFor="cb1" className="tab__label" style={{ background: "white" }} >
                            <div >
                              <p className="font-bold">$9800</p>
                              <div className="flex justify-between">
                                <p className="text-sm">Lighting</p>
                                <div className="switch">
                                  <input id="checkbox1" className="look" type="checkbox" />
                                  <label htmlFor="checkbox1"></label>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                        <input type="checkbox" name="accordion-1" id="cb1" />
                        <div className="tab__content">
                          <div>
                            <h3 className="my-auto pr-2 pb-1 font-bold text-sm">Previous Meetings</h3>
                            <div className="prev-meetings-items"><p>Meeting with Client Reps</p></div>
                            <div className="prev-meetings-items"><p>Call with Lighting Reps</p></div>
                            <div className="prev-meetings-items"><p>Internal Meeting</p></div>
                            <div className="prev-meetings-items"><p>Meeting with Concrete Contr...</p></div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className=" manage-project-box border rounded border-stone-300 p-3 my-4 bg-white" >
            <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Documentation</h3>
            <div className="grid grid-cols-2">
              <div className="col-span-1 mt-2">
                <div className="grid grid-cols px-3">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.4807 20.1934H12.9807C13.4422 20.1934 13.8461 19.7895 13.8461 19.328V5.76988C13.8461 4.78908 12.8076 4.03906 11.9999 4.03906H5.4807C5.01916 4.03906 4.61532 4.44292 4.61532 4.90447V19.328C4.61532 19.7895 5.01916 20.1934 5.4807 20.1934ZM28.3846 6.6923C28.0385 6.57691 27.6923 6.86538 27.6923 7.26924V21.635C27.6923 22.0966 27.2885 22.5004 26.8269 22.5004H3.17308C2.71154 22.5004 2.30769 22.0966 2.30769 21.635V7.32693C2.30769 6.92307 1.84615 6.6346 1.5 6.80769C0.634615 7.21154 0 8.13465 0 9.23083V22.5004C0 23.7697 1.03846 24.8082 2.30769 24.8082H11.8269C12.2885 24.8082 12.6923 25.2121 12.6923 25.6736C12.6923 26.1352 13.0962 26.539 13.5577 26.539H16.4423C16.9038 26.539 17.3077 26.1352 17.3077 25.6736C17.3077 25.2121 17.7115 24.8082 18.1731 24.8082H27.6923C28.9615 24.8082 30 23.7697 30 22.5004V9.23083C30 8.01926 29.5962 6.98077 28.3846 6.6923ZM17.0196 20.1934H24.5195C24.9811 20.1934 25.3849 19.7895 25.3849 19.328V4.90447C25.3849 4.44292 24.9811 4.03906 24.5195 4.03906H18.0003C17.1349 4.03906 16.1542 4.78908 16.1542 5.76988V19.328C16.1542 19.7895 16.558 20.1934 17.0196 20.1934Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4 cursor-pointer" onClick={startMeetingNow}>
                      <h3 className="card-title-font">Create a submittal</h3>
                      <p className="card-desc-font" >Prepare for your issuance</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols px-3 pt-3">
                  <div className="flex border rounded border-stone-300 px-3 py-4 bg-white card_shadow" >
                    <div className="flex meeting-card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M29.8459 19.0771H27.9997C27.5074 19.0771 27.0766 19.5079 27.0766 20.0002V26.1542C27.0766 26.6465 26.6459 27.0773 26.1535 27.0773H5.84585C5.35355 27.0773 4.92278 26.6465 4.92278 26.1542V20.0002C4.92278 19.5079 4.49201 19.0771 3.9997 19.0771H2.15355C1.66124 19.0771 1.23047 19.5079 1.23047 20.0002V28.3081C1.23047 29.6619 2.33816 30.7696 3.69201 30.7696H28.3074C29.6612 30.7696 30.7689 29.6619 30.7689 28.3081V20.0002C30.7689 19.5079 30.3382 19.0771 29.8459 19.0771Z" fill="#349989" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.6771 1.50701C16.3079 1.13777 15.754 1.13777 15.3848 1.50701L7.0771 9.81483C6.70787 10.1841 6.70787 10.7379 7.0771 11.1072L8.36941 12.3995C8.73864 12.7687 9.29249 12.7687 9.66172 12.3995L13.1079 8.95328C13.4771 8.58404 14.154 8.8302 14.154 9.38406L14.154 22.4919C14.2156 22.9843 14.7079 23.415 15.1386 23.415L16.9848 23.415C17.4771 23.415 17.9079 22.9843 17.9079 22.4919L17.9079 9.44559C17.9079 8.89174 18.5848 8.64558 18.954 9.01482L22.4002 12.461C22.7694 12.8303 23.3233 12.8303 23.6925 12.461L24.9848 11.1072C25.354 10.7379 25.354 10.1841 24.9848 9.81483L16.6771 1.50701Z" fill="#349989" />
                      </svg>
                    </div>
                    <div className="pl-4 cursor-pointer" onClick={uploadMeetingAudio}>
                      <h3 className="card-title-font">Upload files</h3>
                      <p className="card-desc-font" >Files from different teams</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col pl-4 " style={{ borderLeft: "2px solid gainsboro" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="my-auto pr-2 pb-1 font-bold text-sm">Recent Files</h3>
                    <h3 className="my-auto pr-2 pb-1 font-bold text-sm">Time</h3>
                  </div>
                    {
                      meetings.map((meeting) => {
                        return (
                          <div className="flex items-center justify-between">
                            <div className="mb-2 px-2 py-1 flex items-center justify-center border rounded border-stone-300" style={{ background: "#E5E5E5" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 18 20" fill="none">
                                <g clip-path="url(#clip0_728_11882)">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M1.84734 -0.0078125C0.971406 -0.0078125 0.261719 0.702187 0.261719 1.57781V18.4031C0.261719 19.2791 0.971406 19.9888 1.84734 19.9888H16.1514C17.0267 19.9888 17.737 19.2791 17.737 18.4031V6.33906L11.8305 -0.0078125H1.84734Z" fill="#747474" />
                                  <path fillRule="evenodd" clipRule="evenodd" d="M17.7424 6.36059V6.67309H13.7427C13.7427 6.67309 11.7702 6.27934 11.8274 4.57715C11.8274 4.57715 11.8924 6.36059 13.7036 6.36059H17.7424Z" fill="#5C5C5C" />
                                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8359 0V4.55031C11.8359 5.06781 12.1809 6.36 13.7434 6.36H17.7431L11.8359 0Z" fill="#C9C9C9" />
                                  <path d="M8.56234 12.9586C8.91672 12.6042 8.91672 12.0254 8.56234 11.6711C8.20797 11.3167 7.62922 11.3167 7.27484 11.6711L4.41016 14.5357C4.05578 14.8901 4.05578 15.4689 4.41016 15.8232C4.76453 16.1776 5.34328 16.1776 5.69766 15.8232L7.45547 14.0726C7.55672 13.9714 7.55672 13.8051 7.45547 13.7036C7.35422 13.602 7.18797 13.6023 7.08641 13.7036L5.97953 14.8032C5.82766 14.9623 5.58172 14.9623 5.42984 14.8032C5.27078 14.6514 5.27078 14.4054 5.42984 14.2536L6.52953 13.1467C6.94172 12.7417 7.60016 12.7417 8.00516 13.1467C8.41016 13.5589 8.41016 14.2173 8.00516 14.6223L6.24734 16.3801C5.58922 17.0382 4.51859 17.0382 3.85297 16.3801C3.19484 15.7148 3.19484 14.6442 3.85297 13.9857L6.71734 11.1211C7.38297 10.4557 8.45359 10.4557 9.11172 11.1211C9.77703 11.7792 9.77703 12.8498 9.11172 13.5154L8.82953 13.7973C8.81516 13.5079 8.71391 13.2257 8.54016 12.9798L8.56234 12.9586Z" fill="white" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_728_11882">
                                    <rect width="17.5" height="20" fill="white" transform="translate(0.25)" />
                                  </clipPath>
                                </defs>
                              </svg>
                              <p className="ml-2 font-small"> attachment.jpg</p>
                            </div>

                            <div>
                              <p className="my-auto py-1 text-sm">{moment(meeting.date).format('MMM DD, YYYY HH:mm:ss')}</p>
                            </div>
                          </div>
                        )
                      })
                    }
                </div>
              </div>
            </div>
          </div>
        </div>




        <div className="col-span-1 border rounded border-stone-300 p-3 bg-white card_shadow" >
          <h3 className="my-auto pr-2 pb-3 font-bold text-sm">To Do:</h3>
          <div className="grid grid-cols-1 ">

            {todoList.map((item, index) => (
              <div key={item._id} className=" flex justify-between border rounded border-stone-300 px-3 py-3 my-1 bg-white" style={{ background: `${item.status == 'success' ? 'white' : '#FBF3E0'}` }} >
                <div>
                  <h3 className="todo-card-content-title">{item.description}</h3>
                  <div className="flex justify-between">
                    <p className="todo-card-content-desc" >{typeof item.meetingId === 'string' ? "" : item.meetingId?.summary || ""}</p>
                  </div>
                </div>
                <div className="align-right relative">
                  <svg className="absolute top-0 right-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => closeTask(item)}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.53863 7.81555L13.5386 3.78478C13.7232 3.60017 13.7232 3.32324 13.5386 3.13863L12.9232 2.49247C12.7386 2.30786 12.4617 2.30786 12.2771 2.49247L8.24632 6.52324C8.12324 6.64632 7.93863 6.64632 7.81555 6.52324L3.78478 2.4617C3.60017 2.27709 3.32324 2.27709 3.13863 2.4617L2.49247 3.10786C2.30786 3.29247 2.30786 3.5694 2.49247 3.75401L6.52324 7.78478C6.64632 7.90786 6.64632 8.09247 6.52324 8.21555L2.4617 12.2771C2.27709 12.4617 2.27709 12.7386 2.4617 12.9232L3.10786 13.5694C3.29247 13.754 3.5694 13.754 3.75401 13.5694L7.78478 9.53863C7.90786 9.41555 8.09247 9.41555 8.21555 9.53863L12.2463 13.5694C12.4309 13.754 12.7079 13.754 12.8925 13.5694L13.5386 12.9232C13.7232 12.7386 13.7232 12.4617 13.5386 12.2771L9.53863 8.24632C9.41555 8.12324 9.41555 7.93863 9.53863 7.81555Z" fill="#747474" />
                  </svg>
                  <p className="todo-card-content-desc mt-6" >{moment(item.dueDate).format('MMM Do')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="title_color flex justify-between px-2 mb-4">
            <p>Edit</p>
            <p>Add Task</p>
          </div>
          <h3 className="my-auto pt-4 pr-2 pb-3 font-bold text-sm">Task done:</h3>
          <div className="grid grid-cols-1 ">

            {todoList.map((item, index) => (
              <div key={item._id} className=" flex justify-between border rounded border-stone-300 px-3 py-3 my-1 bg-white" style={{ background: `${item.status == 'success' ? '#DDF1EE' : '#DDF1EE'}` }} >
                <div>
                  <h3 className="todo-card-content-title">{item.description}</h3>
                  <div className="flex justify-between">
                    <p className="todo-card-content-desc" >{typeof item.meetingId === 'string' ? "" : item.meetingId?.summary || ""}</p>
                  </div>
                </div>
                <div className="align-right relative">
                  <svg className="absolute top-0 right-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.53863 7.81555L13.5386 3.78478C13.7232 3.60017 13.7232 3.32324 13.5386 3.13863L12.9232 2.49247C12.7386 2.30786 12.4617 2.30786 12.2771 2.49247L8.24632 6.52324C8.12324 6.64632 7.93863 6.64632 7.81555 6.52324L3.78478 2.4617C3.60017 2.27709 3.32324 2.27709 3.13863 2.4617L2.49247 3.10786C2.30786 3.29247 2.30786 3.5694 2.49247 3.75401L6.52324 7.78478C6.64632 7.90786 6.64632 8.09247 6.52324 8.21555L2.4617 12.2771C2.27709 12.4617 2.27709 12.7386 2.4617 12.9232L3.10786 13.5694C3.29247 13.754 3.5694 13.754 3.75401 13.5694L7.78478 9.53863C7.90786 9.41555 8.09247 9.41555 8.21555 9.53863L12.2463 13.5694C12.4309 13.754 12.7079 13.754 12.8925 13.5694L13.5386 12.9232C13.7232 12.7386 13.7232 12.4617 13.5386 12.2771L9.53863 8.24632C9.41555 8.12324 9.41555 7.93863 9.53863 7.81555Z" fill="#747474" />
                  </svg>
                  <p className="todo-card-content-desc mt-6" >Oct 16 {item.status == 'warning' ? 'EOD' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isUploadAudioModal ? <UploadAudioModal projectId={data.project._id} meetings={meetings} isShow={isUploadAudioModal} setShow={setIsUploadAudioModal}/> : <></>}

      {isOpenModal ? <SignupFeatures setShow={setIsOpenModal}/> : <></>}
    </div>
  );
}
