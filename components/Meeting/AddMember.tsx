
import { useState, useEffect } from 'react'

import { createPerson, getPersons } from "@service/person.service";
import ModalLayout from '@components/ModalLayout';
import { updateMeeting } from '@service/meeting.service';

const AddMemberLayout = ({ show, setShow, selectedlMemberIds, setSelectedMembersIds }) => {

  const [people, setPeople] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState(selectedlMemberIds);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setSelectedPeople(selectedlMemberIds);
    setSelectedMembersIds(selectedlMemberIds);
  }, [selectedlMemberIds])


  const initialize = async () => {
    const tempPeople = await getPersons();
    setPeople(tempPeople);
    setSelectedPeople(selectedlMemberIds);
  }

  const addMember = async () => {
    try {
      const newPerson = await createPerson({
        name: name,
        role: role, // what`s type of role?
        email: email,
        phone: '',
        projectId: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      
    } catch (error) {
      console.log(error);
    }
  }

  const addMemberInMeeting = async () => {
    updateMeeting('655d242b2128b99ad7088381', {
      members: selectedPeople,
    });
    setSelectedMembersIds(selectedPeople);
}

const Person = ({ person }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  return (
    <div className="person p-1 mx-8 border-b-[1px] border-gray-500">
      <div className="person-name flex gap-2">
        <input type='checkbox' id={person._id}
          className='text-sm'
          checked={selectedPeople.includes(person._id)}
          onChange={(e) => {
            selectedPeople.includes(person._id) ?
              setSelectedPeople(selectedPeople.filter(id => id !== person._id))
              : setSelectedPeople([...selectedPeople, person._id])
          }}
        ></input>
        <label className='border-[1px] border-gray-500 rounded-md px-2' htmlFor={person._id}>{`${person.name}`}</label>
        <label className='border-[1px] border-gray-500 rounded-md' htmlFor={person._id}>{`${person.email}`}</label>
        <select defaultValue={person.role} value={role} onChange={(e) => { setRole(e.target.value) }}>
          <option value={'Contrator'}>Contrator</option>
          <option value={'Architect'}>Architect</option>
          <option value={'Owner'}>Owner</option>
          <option value={'Engineer'}>Engineer</option>
        </select>
      </div>
    </div>
  )
}

return (
  <>
    {
      show ?
        <div className="fixed w-screen h-screen flex flex-col justify-center items-center top-0 left-0 bg-[rgba(0,0,0,0.1)]">
          <div className="w-1/3 h-2/3 bg-white shadow-lg flex flex-col">
            <div className='flex justify-end'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-2" onClick={() => setShow(false)}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

            </div>
            <h1 className="text-2xl font-bold text-center p-4">Add Member</h1>
            <div className="w-full h-1 bg-gray-600"></div>
            <div className="peoplel-list grow overflow-auto p-4">
              {
                people?.map((person, index) => {
                  return (
                    <Person key={index} person={person}></Person>
                  )
                })

              }
            </div>
            <div className='w-full h-1 bg-gray-600'></div>
            <div className='flex flex-col p-2 gap-2' >
              <div className='flex  justify-center items-center px-8 gap-2'>
                <label htmlFor='name'>Name:&nbsp;&nbsp;</label>
                <input className='w-full' type='text' id='name' placeholder='Name' onChange={(e) => setName(e.target.value)}></input>
                <label htmlFor='email'>Email:&nbsp;&nbsp;</label>
                <input className='w-full' type='text' id='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor='role'>Role:&nbsp;&nbsp;  </label>
                <select defaultValue={role} value={role} onChange={(e) => { setRole(e.target.value) }}>
                  <option value={'Contrator'}>Contrator</option>
                  <option value={'Architect'}>Architect</option>
                  <option value={'Owner'}>Owner</option>
                  <option value={'Engineer'}>Engineer</option>
                </select>
                <button className='bg-[#349989] border-[1px] border-gray-500 rounded-md px-2 text-white' onClick={() => { addMember(); setShow(false) }}>ADD</button>
              </div>
              <div className='flex justify-end mx-8'>
                <button className='p-1 border-[1px] border-gray-500 rounded-md' onClick={() => { addMemberInMeeting(); setShow(false) }}>Add Member</button>
              </div>
            </div>
          </div>
        </div > : <></>
    }
  </>

)
}

export default AddMemberLayout;