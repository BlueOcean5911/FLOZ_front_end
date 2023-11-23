'use client'

import { useState, useEffect } from 'react'
import Sidebar from "@components/sidebar/Sidebar";
import Transcript from "@components/Meeting/Transcript";
import TodoList from "@components/Meeting/TodoList";
import MemberList from "@components/Meeting/MemberList";
import MeetingSummary from "@components/Meeting/MeetingSummary";
import Record from "@components/Record/Record";
import { getMeetingData } from '@service/meeting.service';

interface pageProps {
  meetingId: string;
}
const Page = ({ params }: { params: pageProps }) => {
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isTodosLoading, setIsTodosLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [todoList, setTodoList] = useState({});
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  let pollingInterval;
  
  const getTrascriptData = async () => {
    try{
      setIsLoading(true);
      const meetingData = await getMeetingData(params.meetingId);
      if (meetingData.transcriptSummary || meetingData.todos) {
        if (meetingData.transcriptSummary) {
          setTranscript(meetingData.transcriptSummary);
          setAudioUrl(meetingData.audioFileUrl)
          setIsSummaryLoading(false);
        }

        if (meetingData.todos) {
          setTodoList(meetingData.todos);
          setIsTodosLoading(false);
        }

        if (meetingData.transcriptSummary && meetingData.todos) {
          clearInterval(pollingInterval);
        }
        return;
      }
    } catch (error) {
      console.log("getMeetingData error", error);
    }
  }

  useEffect(() => {
    getTrascriptData()
    // Polling mechanism with a 10-second interval (adjust as needed)
    pollingInterval = setInterval(() => {
      getTrascriptData();
    }, 5000); // 10 seconds interval

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollingInterval);
    };
  }, [])

  return (
    <div className="projects-layout bg-gray-100 flex flex-row h-full">
      <div className="sidebar shadow-md w-[21%] rounded-md mx-[26px] flex flex-col  bg-white">
        <div className="grow ">
          <Sidebar />
        </div>
      </div>
      <div className="main-layout shadow-md rounded-md w-[52%]  flex flex-col  bg-white">
        <div className="flex w-full h-full flex-col pt-[46px] gap-4 p-4 mb-[26px] shadow-md px-[43px] 2xl:px-[80px]">
          {
            isSummaryLoading ? (
              <div className="flex flex-col justify-center items-center">
                <div className='text-[20px] text-bold text-gray-500 text-center'>Processing your audio for transcription...</div>
              </div>
            )
            :
            (
              <>
                <div className="text-2xl font-bold">Meeting summary by Floz:</div>
                <Record audioUrl={audioUrl} />
                <Transcript transcript={transcript}/>
              </>
            )
          }
        </div>
      </div>
      <div className="beside-layout flex flex-col h-full mr-[20px] ml-[27px] w-[28%] overflow-auto">
        <div className="grow flex flex-col overflow-auto justify-between">
          {
            isTodosLoading ? (
              <div className="flex flex-col justify-center items-center">
                <div className='text-[20px] text-bold text-gray-500 text-center'>Loading tasks from meeting...</div>
              </div>
            )
            :
            (
              <>
                <TodoList  todoListData={todoList} meetingid={params.meetingId}/>
                <MemberList  setGenerateEmail={setGeneratedEmail} todolistStr={JSON.stringify(todoList)} meetingId={params.meetingId} />
                <MeetingSummary email={generatedEmail}/>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Page;