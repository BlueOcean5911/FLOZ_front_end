/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "@models";
import { uploadAudio } from "@./service/project.service";
import Meeting from "@models/meeting.model";
import { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
import UploadComponent from "./UploadComponent";
import moment from 'moment';
import { useRouter } from 'next/navigation'
export default function UploadAudioModal({
  meetings,
  projectId,
  isShow,
  setShow
}) {
  const [file, setFile] = useState<File | undefined>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState('');
  const [uploadedFileData, setUploadedFileData] = useState<any | ArrayBuffer | null>(null);

  const getTime = (date: string) => {
    return moment(date).format('HH:mm:ss');
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function setUploaded(data: any) {
    if (data.file) {
      setIsAdded(data.file == null ? false : true);
      const fileName = data.file?.name.split('.')[0];
      data.file.fileName = fileName;
      setUploadedFileData(data);
    }

  }

  function onUploadAudio(data: any) {
    const formData = new FormData();
    if (!selectedMeetingId) { console.log('Meeting is required'); return };

    formData.append('meetingId', selectedMeetingId);
    formData.append('meetingAudio', data.imgeData);

    uploadAudio({ projectId: projectId, formData }).then((res) => {

      if (res.meetingId) {
        router.push('/dashboard/project/' + projectId + '/meeting/' + res.meetingId);
      }
    })
  }
  return (
    <>
      {
        isShow ?
          <div className="signupfeaturesfixed fixed z-10000 w-screen h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="w-[640px]   flex flex-col bg-transparent">
              <div className="main grow rounded-md bg-white  flex-col justify-between">
                <div className="header-title text-center rounded-t-md border-b-[1px] text-[20px] border-gray-400">
                  <div className="closeButton flex justify-end mr-[10px] mt-[10px]" >
                    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" onClick={() => { setShow(false) }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.4984 12.7004L21.9984 6.15039C22.2984 5.85039 22.2984 5.40039 21.9984 5.10039L20.9984 4.05039C20.6984 3.75039 20.2484 3.75039 19.9484 4.05039L13.3984 10.6004C13.1984 10.8004 12.8984 10.8004 12.6984 10.6004L6.14844 4.00039C5.84844 3.70039 5.39844 3.70039 5.09844 4.00039L4.04844 5.05039C3.74844 5.35039 3.74844 5.80039 4.04844 6.10039L10.5984 12.6504C10.7984 12.8504 10.7984 13.1504 10.5984 13.3504L3.99844 19.9504C3.69844 20.2504 3.69844 20.7004 3.99844 21.0004L5.04844 22.0504C5.34844 22.3504 5.79844 22.3504 6.09844 22.0504L12.6484 15.5004C12.8484 15.3004 13.1484 15.3004 13.3484 15.5004L19.8984 22.0504C20.1984 22.3504 20.6484 22.3504 20.9484 22.0504L21.9984 21.0004C22.2984 20.7004 22.2984 20.2504 21.9984 19.9504L15.4984 13.4004C15.2984 13.2004 15.2984 12.9004 15.4984 12.7004Z" fill="black" />
                    </svg>
                  </div>
                  <div className="mb-4">
                    Transcribe Audio
                  </div>
                </div>
                <div className="p-4">
                  <div>
                    <p className="font-bold pb-1"><span style={{ color: "red" }}>*</span>Add this recording to</p>

                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(event) => { setSelectedMeetingId(event.target.value) }}>
                      <option disabled selected>Meeting</option>
                      {meetings.map((meeting: Meeting) => (
                        <option value={meeting?._id}>{meeting?.summary}</option>
                      ))}
                    </select>

                  </div>
                  {!isAdded ?
                    <UploadComponent isUpload={isAdded} setUpload={(data) => { setUploaded(data) }} />
                    :
                    <div className="h-[227px] w-[100%] text-center">
                      <div className="w-[100%] mt-[20px] mb-[20px] flex ">
                        <div className="w-[100%] grid grid-cols-5 text-left my-2 border-t-[1px] border-b-[1px] border-[#C3C3C3] ">
                          <div className="col-span-2">{uploadedFileData?.file.fileName} #1</div>
                          <div className="col-span-2">{uploadedFileData?.file.size}byts</div>
                          <div className="col-span-1">{getTime(uploadedFileData?.file.lastModifiedDate)}</div>
                          {/* <div className="col-span-1">1000 Harrison St</div> */}

                        </div>
                      </div>
                    </div>}
                </div>
                {isAdded && <div className="footer h-[56px] flex items-center justify-end rounded-bmd border-t-[1px] rounded-b-md border-[#C3C3C3] " >
                  <button className="w-[73px] h-[32px] mr-2 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => setShow(false)}>Back</button>
                  <button className="w-[73px] h-[32px] mr-4 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => onUploadAudio(uploadedFileData)}>Upload</button>
                </div>}
              </div>
            </div>
          </div>
          : <></>
      }
    </>
  );
}
