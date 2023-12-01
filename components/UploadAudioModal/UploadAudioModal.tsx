/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { ThreeDots } from 'react-loader-spinner'
import { useState } from "react";
import { uploadAudio, uploadFile } from "@./service/project.service";
import { Meeting } from "@models/meeting.model";
import { IProject } from "@models/project.model";
// import { useDropzone } from 'react-dropzone';
import UploadComponent from "./UploadComponent";
import moment from 'moment';
import { toast } from "react-toastify";
export default function UploadAudioModal({
  modalType,
  meetings,
  meetingId,
  project,
  isShow,
  setShow,
  onUploadComplete
}: {
  modalType?: string;
  meetings?: Meeting[] | null;
  meetingId?: string;
  project: any;
  isShow: boolean;
  setShow: (boolean) => void;
  onUploadComplete: (string) => void;
}) {
  const [isAdded, setIsAdded] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetingId || '');
  const [selectedProjectId, setSelectedProjectId] = useState(project._id || '');
  const [uploadedFileData, setUploadedFileData] = useState<any | ArrayBuffer | null>(null);
  console.log('meetings', modalType);

  const getTime = (date: string) => {
    return moment(date).format('HH:mm:ss');
  }

  function back() {
    setIsAdded(false);
    setSelectedMeetingId('');
    setUploadedFileData(null)
  }
  function setUploaded(data: any) {
    if (data) {
      // Convert FilesType to an array
      const dataArray = Array.from(data);
      // Update each element in the array
      const updatedArray = dataArray.map((file: any) => {
        const fileName = file?.name.split('.')[0];
        return { ...file, fileName }; // Create a new object with the added fileName property
      });

      setIsAdded(updatedArray.length > 0); // Check if the updated array has elements
      setUploadedFileData({ files: updatedArray, binaryFile: data });
    }
  }

  function onUploadAudio(data: any) {
    if (selectedMeetingId == '' && modalType == 'audio') {
      toast.error('Please select meeting');
      return;
    }
    const formData = new FormData();
    if (modalType == 'audio') {
      formData.append('meetingId', selectedMeetingId);
      formData.append('meetingAudio', data[0]);
      uploadAudio({ projectId: project._id, formData }).then((res) => {
        setLoader(false);
        onUploadComplete(res?.meetingId);
        setShow(false);
      }).catch((err) => {
        setLoader(false);
        toast.error(err.message);
      });
      setLoader(true);
    } else {
      formData.append('projectId', project._id);
      formData.append('documentFile', data);
      uploadFile({ projectId: project._id, formData }).then((res) => {
        setLoader(false);
        onUploadComplete(res?.projectId);
        setShow(false);
      }).catch((err) => {
        setLoader(false);
        toast.error(err.message);
      });
    }


  }
  return (
    <>
      {
        isShow ?
          <div className="signupfeaturesfixed fixed z-10000 w-screen h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)]">
            {loader &&
              <div className='loader-shadow'>
                <div className='mx-auto loader'>
                  <ThreeDots height="80" width="80" radius="9" color='green' ariaLabel='three-dots-loading' />
                </div>
              </div>}
            <div className="w-[640px]   flex flex-col bg-transparent">
              <div className="main grow rounded-md bg-white  flex-col justify-between">
                <div className="header-title text-center rounded-t-md border-b-[1px] text-[20px] border-gray-400">
                  <div className="closeButton flex justify-end mr-[10px] mt-[10px]" >
                    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" onClick={() => { setShow(false) }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.4984 12.7004L21.9984 6.15039C22.2984 5.85039 22.2984 5.40039 21.9984 5.10039L20.9984 4.05039C20.6984 3.75039 20.2484 3.75039 19.9484 4.05039L13.3984 10.6004C13.1984 10.8004 12.8984 10.8004 12.6984 10.6004L6.14844 4.00039C5.84844 3.70039 5.39844 3.70039 5.09844 4.00039L4.04844 5.05039C3.74844 5.35039 3.74844 5.80039 4.04844 6.10039L10.5984 12.6504C10.7984 12.8504 10.7984 13.1504 10.5984 13.3504L3.99844 19.9504C3.69844 20.2504 3.69844 20.7004 3.99844 21.0004L5.04844 22.0504C5.34844 22.3504 5.79844 22.3504 6.09844 22.0504L12.6484 15.5004C12.8484 15.3004 13.1484 15.3004 13.3484 15.5004L19.8984 22.0504C20.1984 22.3504 20.6484 22.3504 20.9484 22.0504L21.9984 21.0004C22.2984 20.7004 22.2984 20.2504 21.9984 19.9504L15.4984 13.4004C15.2984 13.2004 15.2984 12.9004 15.4984 12.7004Z" fill="black" />
                    </svg>
                  </div>
                  <div className="mb-4">
                    {modalType == 'Transcribe audio' ? 'Audio' : 'Upload Document'}
                  </div>
                </div>
                <div className="p-4">
                  {
                    (meetings && modalType == 'audio' && meetings.length > 0) ?
                      (
                        <div>
                          <p className="font-bold pb-1"><span style={{ color: "red" }}>*</span>Add this recording to</p>
                          <select id="countries" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${selectedMeetingId == '' && uploadedFileData != null ? 'dark:border-red-600 border-red-500' : 'dark:border-gray-600 border-gray-300'}`}
                            defaultValue={'Select Meeting'} onChange={(event) => { setSelectedMeetingId(event.target.value) }} value={selectedMeetingId}>
                            <option selected>Select Meeting</option>
                            {meetings.map((meeting: Meeting) => (
                              <option value={meeting?._id}>{meeting?.summary}</option>
                            ))}
                          </select>

                        </div>
                      )
                      : null
                  }
                  {
                    (project && modalType == 'document' && [project].length > 0) ?
                      (
                        <div>
                          <p className="font-bold pb-1"><span style={{ color: "red" }}>*</span>Add this file to</p>
                          <select id="countries" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${selectedProjectId == '' && uploadedFileData != null ? 'dark:border-red-600 border-red-500' : 'dark:border-gray-600 border-gray-300'}`}
                            defaultValue={'Select Project'} onChange={(event) => { setSelectedMeetingId(event.target.value) }} value={modalType == 'document' ? selectedProjectId : selectedMeetingId}>
                            {/* <option selected>Select Project</option> */}
                            {[project].map((projectItem: IProject) => (
                              <option selected value={projectItem?._id}>{projectItem?.name}</option>
                            ))}
                          </select>

                        </div>
                      )
                      : null
                  }
                  {!isAdded ?
                    <UploadComponent isUpload={isAdded} setUpload={(data) => { setUploaded(data) }} />
                    :
                    <div className="h-[227px] w-[100%] text-center">
                      {
                        uploadedFileData != null && uploadedFileData.files?.map((file: any, index: number) => {
                          return (
                            <div className="w-[100%] mt-[10px] mb-[10px] flex " key={index}>
                              <div className="w-[100%] grid grid-cols-5 text-left my-2 border-t-[1px] border-b-[1px] border-[#C3C3C3] " key={index}>
                                <div className="col-span-2">{file?.fileName} #1</div>
                                <div className="col-span-2">{file?.size}byts</div>
                                <div className="col-span-1">{getTime(file?.lastModifiedDate)}</div>
                              </div>
                            </div>
                          )
                        })
                      }

                    </div>}
                </div>
                {isAdded && <div className="footer h-[56px] flex items-center justify-end rounded-bmd border-t-[1px] rounded-b-md border-[#C3C3C3] " >
                  <button className="w-[73px] h-[32px] mr-2 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => back()}>Back</button>
                  <button className="w-[73px] h-[32px] mr-4 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => onUploadAudio(uploadedFileData.binaryFile)}>Upload</button>
                </div>}
              </div>
            </div>
          </div>
          : <></>
      }
    </>
  );
}
