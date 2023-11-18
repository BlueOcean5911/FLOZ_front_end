'use client'

import { useState, useEffect } from 'react'
import supabase from "@/utils/supabase";
import Sidebar from "@components/sidebar/Sidebar";
import Transcript from "@components/Meeting/Transcript";
import TodoList from "@components/Meeting/TodoList";
import Members from "@components/Meeting/Members";
import MeetingSummary from "@components/Meeting/MeetingSummary";
import Record from "@components/Record/Record";
import axios from 'axios';
import { getUser, getUsers } from "@service/user.service";
import { toast } from 'react-toastify';

import api from 'api/api'

export default function Page() {

  const [people, setPeople] = useState([]);
  const [dataByFloz, setDataByFloz] = useState({
    transcript: "",
    costs: [],
    deadlines: [],
    todos: [],
    meetingSummary: "",
    emailPrompt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemeber, setSelectedMember] = useState(-1);
  const [meetingId, setMeetingId] = useState("655874ca8324c16a160df393");
  const [email, setEmail] = useState("")

  useEffect(() => {
    getUsersFromDatabase();
    // getSummaryData();
    // getConnectWithOpenAI();
  }, [])

  // get userdata from supabase
  const getUsersFromDatabase = async () => {
    // const data = await getUsers();
    const data:any = await getUsers();
    console.log(data, "users")
    setPeople(data.data);
  }

  // get data which includes transcript, meetingsummary, todolist, cost, deadline from database
  const getSummaryData = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/getMeetingData');
      setDataByFloz({ ...data });
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.log("error")
      console.error(error);
    }
  }

  const getConnectWithOpenAI = async () => {
    const response = await api.get('/auth');
    if (response.data.success === true) {
      toast.success('Successfully connected with OpenAI');
    } else {

      toast.error('Unfortunately disconnected with OpenAI');
    }
  }


  return (
    <div className="projects-layout bg-gray-100 flex flex-row h-full p-[26px]">
      {
        isLoading ? <div className='text-[40px] text-bold text-gray-500'>Loading</div> : <>
          <div className="sidebar shadow-md w-[21%] rounded-md mx-[26px] flex flex-col  bg-white">
            <div className="grow ">
              <Sidebar />
            </div>
          </div>
          <div className="main-layout shadow-md rounded-md w-[52%]  flex flex-col  bg-white">
            <div className="flex w-full h-full flex-col pt-[46px] gap-4 p-4 mb-[26px] shadow-md px-[43px] 2xl:px-[80px]">
              <div className="text-2xl font-bold">Meeting summary by Floz:</div>
              <Record />
              <Transcript transcript={dataByFloz?.meetingSummary} />
            </div>
          </div>
          <div className="beside-layout flex flex-col h-full mr-[20px] ml-[27px] w-[28%] overflow-auto">
            <div className="grow flex flex-col overflow-auto justify-between">
              <TodoList todoVal={dataByFloz?.todos} id={meetingId} />
              <Members users={people} meetingsummary={dataByFloz?.meetingSummary} selMem={selectedMemeber} setEmailPrompt={setEmail} />
              <MeetingSummary meetingsummary={email} people={people} selMemId={selectedMemeber} />
            </div>
          </div>
        </>
      }
    </div>
  );
}
