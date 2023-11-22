/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "@models";
import moment from "moment";
import { createProject, getProjects } from "@./service/project.service";
import Meeting from "@models/meeting.model";
import { useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
import UploadComponent from "./UploadComponent";

export default function UploadAudioModal({
  meetings,
  isShow,
  setShow
}) {
  console.log("isShow", isShow, meetings);
  const [file, setFile] = useState<File | undefined>();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(true);


  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = new FileReader;

    file.onload = function () {
      setPreview(file.result);
    }

    file.readAsDataURL(acceptedFiles[0])
  }, [])
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });




  function closeModal() {
    console.log("closeModal");

    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }



  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }

    setFile(target.files[0]);
    if (typeof file === 'undefined') return;

    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', '<Your Unsigned Upload Preset>');
    // formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
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
                    <svg width="24" height="24" viewBox="0 0 26 26" fill="none"  onClick={() => { setShow(false) }}>
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

                    <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option disabled selected>Meeting</option>
                     {meetings.map((meeting: Meeting) => (
                        <option value={meeting?._id}>{meeting?.summary}</option>
                      ))}
                    </select>

                  </div>
                  {isAdded ? <div className="h-[227px] w-[100%] mt-[20px] mb-[20px] flex audio-upload-boder">
                    <div className="flex w-[100%] items-center justify-center rounded-bmd rounded-b-md border-gray-400 " >
                      <div>
                        {/* <button className="px-[16px] py-[6px] flex items-center rounded-md text-white text-[13px] bg-[#349989]" onClick={() => { }}>
                          <svg className="mr-[8px]" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4249 10.0377H14.5018C14.2556 10.0377 14.0403 10.2839 14.0403 10.4993V13.5764C14.0403 13.8226 13.8249 14.038 13.5787 14.038H3.42488C3.17873 14.038 2.96334 13.8226 2.96334 13.5764V10.4993C2.96334 10.2839 2.74796 10.0377 2.5018 10.0377H1.57873C1.33257 10.0377 1.11719 10.2839 1.11719 10.4993V14.6534C1.11719 15.3303 1.67103 15.8842 2.34796 15.8842H14.6556C15.3326 15.8842 15.8864 15.3303 15.8864 14.6534V10.4993C15.8864 10.2839 15.671 10.0377 15.4249 10.0377ZM8.80954 1.23808C8.62493 1.05345 8.348 1.05345 8.16339 1.23808L4.00954 5.3922C3.82492 5.57682 3.82492 5.85376 4.00954 6.03839L4.65569 6.68459C4.84031 6.86922 5.11723 6.86922 5.30185 6.68459L7.02493 4.9614C7.20954 4.77677 7.57877 4.89986 7.57877 5.1768V11.7003C7.57877 11.9465 7.76339 12.1619 8.00954 12.1619H8.93262C9.17877 12.1619 9.42493 11.9157 9.42493 11.7003V5.20757C9.42493 4.93063 9.73262 4.80754 9.948 4.99217L11.6711 6.71536C11.8557 6.89999 12.1326 6.89999 12.3172 6.71536L12.9634 6.06916C13.148 5.88454 13.148 5.60759 12.9634 5.42297L8.80954 1.23808Z" fill="white" />
                          </svg>
                          Upload Files</button> */}
                        {/* <input

                          id="image"
                          type="file"
                          name="image"
                          className="px-[16px] py-[6px] flex items-center rounded-md text-white text-[13px] bg-[#349989]" onChange={handleOnChange}
                        /> */}

                        {/* <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          {
                            isDragActive ?
                              <p>Drop the files here ...</p> :
                              <p>Drag 'n' drop some files here, or click to select files</p>
                          }
                        </div> */}
                        <UploadComponent />
                        {/* <p className="text-center pt-[12px]" >or Drop Files</p> */}
                      </div>
                    </div>
                  </div> :
                    <div className="h-[227px] w-[100%] text-center">
                      <div className="w-[100%] mt-[20px] mb-[20px] flex ">
                        <div className="grid grid-cols-5 my-2 border-t-[1px] border-b-[1px] border-[#C3C3C3] ">
                          <div className="col-span-1">Audio file #1</div>
                          <div className="col-span-1">8.69MB</div>
                          <div className="col-span-1">01:15:49</div>
                          <div className="col-span-1">01:15:49</div>1000 Harrison St
                        </div>
                      </div>
                    </div>}
                </div>
                {!isAdded && <div className="footer h-[56px] flex items-center justify-end rounded-bmd border-t-[1px] rounded-b-md border-[#C3C3C3] " >
                  <button className="w-[73px] h-[32px] mr-2 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => setShow(false)}>Back</button>
                  <button className="w-[73px] h-[32px] mr-4 rounded-md text-white text-[13px] bg-[#349989]" onClick={() => setShow(false)}>Upload</button>
                </div>}
              </div>
            </div>
          </div>
          : <></>
      }
    </>
  );
}
