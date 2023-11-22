"use client"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import { opendaiApi } from 'api/api'
import api from 'api/api'
import { getCookie } from 'cookies-next';
import { getProviderToken } from '@providerVar';
import { useAuthContext } from '@contexts/AuthContext';

import { getUser, getUserByEmail, updateUser } from '@service/user.service'
import { getPersons } from '@service/person.service';

const MeetingSummary = ({ email }) => {

  const [emailPrompt, setEmailPrompt] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);
  const [isPeopleListOpen, setIsPeopleListOpen] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [selectedPeopleList, setSelectedPeopleList] = useState([]);

  useEffect(() => {
    initialize();
    setEmailPrompt(email || "Hania is working on a project in Berkeley Downtown. She needs to get a cost estimation for adding a new window to the bathroom. Joseph is helping her out and will be sending her different window types with different prices tonight. The estimated cost for adding a new window with the current design is approximately $300.   Some options include Sierra Pacific, which is a more affordable choice ranging from $100 to $200 depending on the size, and Marvin, a higher quality option priced between $300 to $350. The Marvin window is recommended due to the high salt content in the air near the project location.");
  }, [email]);

  useEffect(() => {
    console.log("peopleList", peopleList);
  }, [peopleList])

  useEffect(() => {
    console.log('selPeopleList', selectedPeopleList);
  }, [selectedPeopleList])

  const initialize = async () => {
    const persons = await getPersons();
    setPeopleList(persons);
    const temp = [];
    for (let i = 0; i < persons.length; i++) {
      temp.push(false);
    }
    setSelectedPeopleList(temp);
  }

  // polish the email
  const polish = async () => {
    try {
      setIsPolishing(true);
      const { data } = await opendaiApi.get('/polish', {
        params: {
          emailPrompt: emailPrompt
        }
      });
      setEmailPrompt(data.result);
    } catch (error) {
      console.error(error);
    }
    setIsPolishing(false)
  }

  // send emial to selected person
  const sendEmail = async () => {
    const id = getCookie('user_id');
    let user = (await getUser(id));
    console.log("user", user);
    let oAuthTokenForEmail = user["oAuthTokenForEmail"]
    try {
      if (oAuthTokenForEmail === null) {
        const resp = await opendaiApi.get('/auth');
        updateUser(id, { OAuthTokenForEmail: resp["token"] });
        for(let i = 0; i < selectedPeopleList.length; i++) {
          if(selectedPeopleList[i]) {
            const { data } = await opendaiApi.get('/sendEmail', { params: { email: peopleList[i].email, content: emailPrompt, oAuthToken: oAuthTokenForEmail } });
          }
        }
      } else {
        oAuthTokenForEmail = JSON.parse(oAuthTokenForEmail);
        // console.log(35345)
        // if (new Date().getSeconds() > parseInt(oAuthTokenForEmail["expires_in"] + oAuthTokenForEmail["expires_at"])) {
        //   console.log(1244555555)
        //   const resp = await opendaiApi.get('/auth');
        //   updateUser(id, { OAuthTokenForEmail: resp.data });
        //   const { data } = await opendaiApi.get('/sendEmail', { params: { email: "russell.johnson.navy@gmail.com", content: emailPrompt, oAuthToken:oAuthTokenForEmail } });
        //   setEmailPrompt(data.result);
        // } else {
        // console.log(122222)
        const { data } = await opendaiApi.get('/sendEmail', { params: { email: "russell.johnson.navy@gmail.com", content: emailPrompt, oAuthToken: oAuthTokenForEmail } });
        // setEmailPrompt(data.result);
        // console.log(data.result);
        // }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSelectPeople = (e) => {
    let id =  parseInt(e.target.id);
    const tempSelectedPeopleList = [...selectedPeopleList];
    tempSelectedPeopleList[id] = !tempSelectedPeopleList[id];
    setSelectedPeopleList([...tempSelectedPeopleList]);
  }

  return (
    <div className="meeting-summary relative  h-[34%] m-2 px-1 flex flex-col justify-between gap-1 rounded-md bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]">

      <div className="grow summary-content p-2 flex flex-col overflow-auto" >
        <div className='flex justify-between'>
          <h2 className="font-bold">Meeting summary:</h2>
          <div className="flex">
            <h2 className='text-gray-400'>To</h2>
            <div className='rounded-full border-[1px] borrder-gray-600 px-2 mx-2 select-none cursor-pointer' onClick={() => { setIsPeopleListOpen(!isPeopleListOpen) }}>
              Memeber
            </div>

          </div>
        </div>
        {isPolishing ? <div className="flex flex-col justify-center items-center"><div className='text-xl text-gray-600'>Polishing...</div></div> :
          <div className='grow flex flex-col overflow-auto' onClick={() => setIsPeopleListOpen(false)}>
            <p className="font-sm leading-5">{emailPrompt}
            </p>
          </div>}
      </div>
      <div className="summary-search flex justify-center">
        <input type="text" placeholder="Search for enhancements in email" className="w-11/12 p-1 shadow-md rounded-md border-2 border-solid border-[#1B96FF]" />
      </div>
      <div className="summary-footer flex  gap-4 text-[13px] px-5 pb-2 pt-1">
        <button className="text-[#06A59A] w-4/12 border-2 border-gray-300 p-1  rounded-md" onClick={() => polish()}>Polish text</button>
        <button className="rounded-md bg-[#06A59A] w-8/12 text-white p-1" onClick={() => sendEmail()}>Send email</button>
      </div>
      <>
        {
          isPeopleListOpen ?
            <div
              className='absolute top-8 right-8 w-[113px] 
                max-h-[180px] bg-white p-1 border-[1px] border-gray-100 rounded-md 
                flex flex-col text-sm overflow-x-hidden overflow-y-auto'>
              <div className='people-list-layout w-full grow flex flex-col justify-start items-start gap-2'>
                {
                  peopleList ? peopleList.map((person, index) => (
                    <div className='flex'>
                      <input id={`${index}`} type='checkbox' onClick={(e) => handleSelectPeople(e)} checked={selectedPeopleList[index]}></input>
                      <label htmlFor={`${index}`} className='whitespace-nowrap'>{person.name}</label>
                    </div>
                  )) : <></>
                }
              </div>
            </div>
            : <></>
        }
      </>
    </div>
  )
}

export default MeetingSummary;

