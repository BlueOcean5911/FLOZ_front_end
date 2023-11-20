"use client"

import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import api from 'api/api'
import { getCookie } from 'cookies-next';


const MeetingSummary = ({ meetingsummary, people, selMemId }) => {

  const [emailPrompt, setEmailPrompt] = useState("Hania is working on a project in Berkeley Downtown. She needs to get a cost estimation for adding a new window to the bathroom. Joseph is helping her out and will be sending her different window types with different prices tonight. The estimated cost for adding a new window with the current design is approximately $300.   Some options include Sierra Pacific, which is a more affordable choice ranging from $100 to $200 depending on the size, and Marvin, a higher quality option priced between $300 to $350. The Marvin window is recommended due to the high salt content in the air near the project location.");

  useEffect(() => {
    // for the test
    // setEmailPrompt(meetingsummary)
  }, [])

  useEffect(() => {
    setEmailPrompt(meetingsummary);
  }, [meetingsummary])
  // send email to server for sending email to receptionist

  // polish the email
  const polish = async () => {
    const { data } = await api.get('/polish', {
      params: {
        emailPrompt: emailPrompt
      }
    });
    setEmailPrompt(data.emailPrompt);
  }

  const providerToken = getCookie('p_token');

  const sendEmail = async () => {
    const resq = await api.get('/sendEmail', { params: { man:people[selMemId], email:"jason.baker.infor@gmail.com", emailPrompt: emailPrompt } });
  }

  return (
    <div className="meeting-summary h-[34%] m-2 px-1 flex flex-col justify-between gap-1 rounded-md bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]">
      <div className="grow summary-content p-2 flex flex-col overflow-auto">
        <h2 className="font-bold">Meeting summary:</h2>
        <div className='grow flex flex-col overflow-auto'>
          <p className="font-sm leading-5">{emailPrompt}
          </p>
        </div>
      </div>
      <div className="summary-search flex justify-center">
        <input type="text" placeholder="Search for enhancements in email" className="w-11/12 p-1 shadow-md rounded-md border-2 border-solid border-[#1B96FF]" />
      </div>
      <div className="summary-footer flex  gap-4 text-[13px] px-5 pb-2 pt-1">
        <button className="text-[#06A59A] w-4/12 border-2 border-gray-300 p-1  rounded-md" onClick={() => polish()}>Polish text</button>
        <button className="rounded-md bg-[#06A59A] w-8/12 text-white p-1" onClick={() => sendEmail()}>Send email</button>
      </div>
    </div >
  )
}

export default MeetingSummary;