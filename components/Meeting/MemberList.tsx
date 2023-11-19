import React, { useEffect, useState } from 'react';

import ToggleButton from "@components/button/ToogleButton";
import Member from "./Member"

// rendering the members list
const testData = [
  {
    name: 'Niklaus Anton',
    email: 'niklausanton23@gmail.com',
    role: 'admin',
  },
  {
    name: 'Jason Baker',
    email: 'jason.baker.infor@gmail.com',
    role: 'admin',
  },
]

const testSummary = "test summary"

// members component
const MemberList = () => {

  // state value
  const [persons, setPersons] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [selectedPersonId, setSelectedPersonId] = useState(-1)

  // initial state
  useEffect(() => {
    setPersons(testData);
  }, [])

  // add the user into the database
  const addMember = async () => {
    if (name.length > 0 && email.length > 0) {
      setIsOpen(false);
      clearInputData();
      // const providerToken = getCookie('p_token')
      // const newUser = await createUser({ name: name, email: email, oAuthToken: providerToken});
      // console.log(newUser);
      persons.push({ name: name, email: email, role: 'admin' });
      setPersons([...persons])
    }
  }
  // clear the Input data in the input form
  const clearInputData = () => {
    setName("")
    setEmail("")
  }

  // remove all users in the database
  const removeAllUsers = () => {
    setPersons([])
  }

  // TODO generate a email using summary
  const generateEmail = async (name, email) => {

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
            <Member key={index} index={index} name={member.name} email={member.email} role={member.role} setSelectedPersonId={setSelectedPersonId} />
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
              <input required className="pl-2 rounded-md border-2 border-[#1B96FF]" value={name} onChange={(e) => { setName(e.target.value) }}></input>
              <div className="text-gray-500 text-md">Email:</div>
              <input required className="pl-2 rounded-md border-2 border-[#1B96FF]" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { addMember() }}>Add</button>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { setIsOpen(false); clearInputData() }}>Cancel</button>
            </div>
          </div>
          : <></>
      }
    </div>
  )
}

export default MemberList;