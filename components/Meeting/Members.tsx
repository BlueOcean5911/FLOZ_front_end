import React, { useEffect, useState } from 'react';

import UserIcon from "@components/icons/iconUser";
import ToggleButton from "@components/button/ToogleButton"

import { createUser } from '@service/user.service'
import api from '@api/api'
import { getCookie } from 'cookies-next';
// rendering the members list


const Members = ({ users, meetingsummary, setEmailPrompt, selMem }) => {

  const [persons, setPersons] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [personname, setPersonName] = useState("");
  const [email, setEmail] = useState("")
  const [summary, setSummary] = useState("")

  useEffect(() => {
    setPersons(users)
  }, [])
  // add the user into the database
  const addMember = async () => {
    if (personname.length > 0 && email.length > 0) {
      setIsOpen(false);
      clearData();
      // const providerToken = getCookie('p_token')
      // const newUser = await createUser({ name: personname, email: email, oAuthToken: providerToken});
      // console.log(newUser);

      persons.push({ name: [personname], email: [email] });
      setPersons([...persons])
    }
  }
  // clear the data in the input form
  const clearData = () => {
    setPersonName("")
    setEmail("")
  }
  // remove all users in the database
  const removeAllUsers = () => {
    setPersons([])
  }

  const generateEmail = async (name, email) => {
    const resp = await api.post('/generateEmail', { params: { name: name, email: email, summary: summary } })
    setEmailPrompt(resp.data.emailPrompt);
  }

  return (
    <div className="projects-members TodoList rounded-md mx-2 px-2 flex flex-col h-[25%] bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]">
      <div className="todolist-header flex justify-between w-full p-4 items-center">
        <h2 className="font-bold text-[21px]">Members:</h2>
        <div className="flex items-center gap-4">
          <p className="text-[12px]">Matching by AI</p>
          <ToggleButton />
        </div>
      </div>
      <div className="grow flex flex-col overflow-auto">
        <div>
          {persons && persons.map((member, index) => (
            <div key={index} className="p-1" onClick={()=>{}}>
              <div className="member px-1 flex justify-between gap-1 overflow-hidden">
                <div className="flex w-1/2 gap-1 overflow-hidden">
                  <div className="flex items-center">
                    <UserIcon />
                  </div>
                  <div className="flex flex-col justify-center text-gray-500">
                    <h3 className="text-[13px]">{member.name}</h3>
                    <h3 className="text-[10px]">{member.email}</h3>
                  </div>
                </div>
                <div className="flex w-1/2 max-h-[60px] gap-1 justify-between">
                  <select data-te-select-init defaultValue={1} className="border-2 border-solid min-h-[40px] text-gray-500 w-1/2 border-[#C9C9C9] rounded-xl text-[13px] font-bold" >
                    <option value="0" className="font-bold text-gray-500">Role</option>
                    <option value="1" className="font-bold text-gray-500" >Project Manager</option>
                    <option value="2" className="font-bold text-gray-500" >Software Engineer</option>
                    <option value="3" className="font-bold  text-gray-500">Web Developer</option>
                  </select>
                  <button className="bg-[#06A59A] rounded-md text-[10px] w-1/2 text-white " onClick={() => {generateEmail(member.name, member.email)}}>Generate<br />Email</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="members-footer flex justify-between px-6 mb-4">
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => setIsOpen(true)}>Add members</button>
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => removeAllUsers()}>Remove All</button>
      </div>
      {
        isOpen ?
          <div className='fixed h-screen w-screen top-0 left-0 flex justify-center items-center  bg-[rgba(0,0,0,0.6)]'>
            <div className='p-20 flex flex-col gap-2 rounded-lg bg-white shadow-md '>
              <div className='text-center text-xl text-gray-600'>Add Todo</div>
              <div className="text-gray-500 text-md">Name:</div>
              <input required className="pl-2 rounded-md border-2 border-[#1B96FF]" value={personname} onChange={(e) => { setPersonName(e.target.value) }}></input>
              <div className="text-gray-500 text-md">Email:</div>
              <input required className="pl-2 rounded-md border-2 border-[#1B96FF]" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { addMember() }}>Add</button>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { setIsOpen(false); clearData() }}>Cancel</button>
            </div>
          </div>
          : <></>
      }
    </div>
  )
}

export default Members;