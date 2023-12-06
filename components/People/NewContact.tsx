import { createPerson, getPerson, getPersonsByOrganization, updatePerson } from '@service/person.service';
import { useEffect, useState } from 'react'

const NewContact = ({ setShow,action, organization, setPeople, people, selectedPersonId }) => {
  const [person, setPerson] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phone: '',
    note: '',
    salutation: '',
    organization: organization,
  });
  
  const clear = () => {
    setPerson({ firstName: '', lastName: '', email: '', role: 'PM', phone: '', note: '', salutation: '', organization: organization });
  }

  useEffect(() => {
    initialize();
  }, [])

  const initialize = async () => {
    try {
      const dbPerson = await getPerson(selectedPersonId);
     action=='edit'? setPerson({
        firstName: dbPerson?.name.split(" ")[0],
        lastName: dbPerson?.name.split(" ")[1] || '',
        email: dbPerson.email,
        role: dbPerson.role,
        phone: dbPerson.phone,
        note: dbPerson.note || '',
        salutation: dbPerson.salutation || '',
        organization: dbPerson.organization,
      }): clear();
    } catch (error) {
      selectedPersonId = '';
      console.log(error);
    }
  }

  const save = async () => {
    if (person.email !== null && person.firstName !== null && person.lastName !== null) {
      if (selectedPersonId === '') {
        const result = await createPerson({
          name: `${person.firstName} ${person.lastName}`,
          role: person.role, // what`s type of role?
          email: person.email,
          phone: person.phone,
          note: person.note,
          salutation: person.salutation,
          organization: person.organization,
          updatedAt: new Date(),
          createdAt: new Date(),
        });
        setPeople([...people, result])
      } else {
        updatePerson(selectedPersonId, {
          name: `${person.firstName} ${person.lastName}`,
          role: person.role, // what`s type of role?
          email: person.email,
          phone: person.phone,
          note: person.note,
          salutation: person.salutation,
          organization: person.organization,
          updatedAt: new Date(),
        })
      }
    }
  }

  return (
    <>
      {
        <div className="new-contact fixed z-10000 w-screen h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="w-[719px] h-[718px] flex flex-col">
            <div className="main grow rounded-md bg-white flex flex-col justify-between">
              <div className="closeButton flex justify-end stroke-gray-600 m-4" >
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className='fill-gray-600 cursor-pointer' onClick={() => setShow({ isOpen: false, action: 'create' })}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.4984 12.7004L21.9984 6.15039C22.2984 5.85039 22.2984 5.40039 21.9984 5.10039L20.9984 4.05039C20.6984 3.75039 20.2484 3.75039 19.9484 4.05039L13.3984 10.6004C13.1984 10.8004 12.8984 10.8004 12.6984 10.6004L6.14844 4.00039C5.84844 3.70039 5.39844 3.70039 5.09844 4.00039L4.04844 5.05039C3.74844 5.35039 3.74844 5.80039 4.04844 6.10039L10.5984 12.6504C10.7984 12.8504 10.7984 13.1504 10.5984 13.3504L3.99844 19.9504C3.69844 20.2504 3.69844 20.7004 3.99844 21.0004L5.04844 22.0504C5.34844 22.3504 5.79844 22.3504 6.09844 22.0504L12.6484 15.5004C12.8484 15.3004 13.1484 15.3004 13.3484 15.5004L19.8984 22.0504C20.1984 22.3504 20.6484 22.3504 20.9484 22.0504L21.9984 21.0004C22.2984 20.7004 22.2984 20.2504 21.9984 19.9504L15.4984 13.4004C15.2984 13.2004 15.2984 12.9004 15.4984 12.7004Z" fill="white" />
                </svg>
              </div>
              <div className="header-title font-bold h-[56px] flex items-center justify-center text-center rounded-t-md border-b-[1px] text-[20px] border-gray-400">
                <div>
                  {action == 'create' ? 'New' : 'Edit'} People
                </div>
              </div>
              <div className="flex flex-col justify-items-center mx-8 gap-4">
                <div className="salution text-xs font-bold text-gray-500">Salutation</div>
                {/* <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="None" value={salutation} onChange={(e) => setSalutation(e.target.value)}></input> */}
                <select className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="None" value={person.salutation} onChange={(e) => setPerson({ ...person, salutation: e.target.value })}>
                  <option selected disabled value="">Select Salutation</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
                <div className="first-name text-xs font-bold text-gray-500">First Name</div>
                <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="First Name" value={person.firstName} onChange={(e) => setPerson({ ...person, firstName: e.target.value })}></input>
                <div className="last-name text-xs font-bold text-gray-500">Last Name</div>
                <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Last Name" value={person.lastName} onChange={(e) => setPerson({ ...person, lastName: e.target.value })}></input>
                <div className="role text-xs font-bold text-gray-500">Role</div>
                <select className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="None" defaultValue={'PM'} value={person.role} onChange={(e) => setPerson({ ...person, role: e.target.value })}>
                  <option value="PM">PM</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Client">Client</option>
                  <option value="Owner">Owner</option>
                  <option value="Sub Contractor">Sub Contractor</option>
                  <option value="Architect">Architect</option>
                </select>
                <div className='flex justify-between gap-8'>
                  <div className='grow'>

                    <div className="role text-xs font-bold text-gray-500">Phone</div>
                    <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Phone" value={person.phone} onChange={(e) => setPerson({ ...person, phone: e.target.value })}></input>
                  </div>
                  <div className='grow'>

                    <div className="email text-xs font-bold text-gray-500">Email</div>
                    <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Phone" value={person.email} onChange={(e) => setPerson({ ...person, email: e.target.value })}></input>
                  </div>
                </div>
                <div className="note text-xs font-bold text-gray-500">Note</div>
                <textarea className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" value={person.note} onChange={(e) => setPerson({ ...person, note: e.target.value })}></textarea>
              </div>
              <div className="footer h-[56px] flex items-center justify-end pr-8 gap-2 rounded-bmd border-t-[1px] rounded-b-md border-gray-400 bg-gray-100" >
                <button className="w-[73px] h-[32px] border-[1px] border-gray-600 rounded-md text-gray-600 text-[13px] bg-white" onClick={() => { setShow({ isOpen: false, action: 'create' }); clear(); }}>Cancel</button>
                <button className="w-[73px] h-[32px] rounded-md text-white text-[13px] bg-[#349989]" onClick={() => { setShow({ isOpen: false, action: 'create' }); save(); clear(); }}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default NewContact;