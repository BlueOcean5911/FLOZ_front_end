import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { createPerson, getPerson, getPersonsByOrganization, updatePerson } from '@service/person.service';
import { success, warning } from '@utils/nitification.utils';
import { Fragment, useEffect, useState } from 'react'
import { isEmpty } from '@utils/func.utils';

const NewContact = ({ isShow, setShow, action, organization, setPeople, people, selectedPersonId }) => {
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
      action == 'edit' ? setPerson({
        firstName: dbPerson?.name.split(" ")[0],
        lastName: dbPerson?.name.split(" ")[1] || '',
        email: dbPerson.email,
        role: dbPerson.role,
        phone: dbPerson.phone,
        note: dbPerson.note || '',
        salutation: dbPerson.salutation || '',
        organization: dbPerson.organization,
      }) : clear();
    } catch (error) {
      selectedPersonId = '';
      console.log(error);
    }
  }

  const save = async () => {
    if (!(isEmpty(person.email) || isEmpty(person.firstName) || isEmpty(person.lastName))) {
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
        setShow({ isOpen: false, action: 'create' });
        clear();
        success("Successfully contact is added!");
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
        setShow({ isOpen: false, action: 'create' });
        clear();
        success("Successfully contact is updated!");
      }
    } else {
      warning(" Please make sure to provide all required arguments")
    }
  }
  
  const handelSubmit = () => {
     save(); 
  }

  return (
    <>

      <Transition appear show={isShow} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShow({ isOpen: false, action: 'create' })}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" sm:w-[719px] sm:h-[718px] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  {
                    // <div className="new-contact fixed z-10000 w-screen h-10/12 md:h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)] overflow-auto">
                    <div className="w-full h-fit  flex flex-col overflow-auto">
                      <div className="main grow rounded-md bg-white flex flex-col justify-between overflow-auto">
                        <div className="closeButton flex justify-end  mx-2 my-1" >
                          <XMarkIcon className='w-8 h-8 stroke-gray-400 fill-gray-400' onClick={() => setShow({ isOpen: false, action: 'create' })} />
                        </div>
                        <div className="header-title font-bold h-[56px] flex items-center justify-center text-center rounded-t-md border-b-2 text-[20px] border-gray-300">
                          <div>
                            {action == 'create' ? 'New' : 'Edit'} People
                          </div>
                        </div>
                        <div className="grow flex flex-col justify-items-center m-8 gap-4 overflow-auto">
                          <div className='flex flex-col gap-2'>
                            <label htmlFor="salutation" className="salution text-xs font-bold text-gray-500">Salutation</label>
                            {/* <input className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="None" value={salutation} onChange={(e) => setSalutation(e.target.value)}></input> */}
                            <select id='salutation' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="None" value={person.salutation} onChange={(e) => setPerson({ ...person, salutation: e.target.value })}>
                              <option selected disabled value="">Select Salutation</option>
                              <option value="Mr.">Mr.</option>
                              <option value="Mrs.">Mrs.</option>
                            </select>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <label htmlFor='first-name' className="first-name text-xs font-bold text-gray-500" aria-required>First Name</label>
                            <input
                              id="first-name"
                              type='text'
                              required
                              className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full"
                              placeholder="First Name"
                              value={person.firstName}
                              onChange={(e) => setPerson({ ...person, firstName: e.target.value })} />
                          </div>
                          <div className='flex flex-col gap-2'>
                            <div className="last-name text-xs font-bold text-gray-500">Last Name</div>
                            <input type='text' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="Last Name" value={person.lastName} onChange={(e) => setPerson({ ...person, lastName: e.target.value })}></input>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <label htmlFor='role' className="role text-xs font-bold text-gray-500">Role</label>
                            <select id='role' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="None" defaultValue={'PM'} value={person.role} onChange={(e) => setPerson({ ...person, role: e.target.value })}>
                              <option value="PM">PM</option>
                              <option value="Engineer">Engineer</option>
                              <option value="Client">Client</option>
                              <option value="Owner">Owner</option>
                              <option value="Sub Contractor">Sub Contractor</option>
                              <option value="Architect">Architect</option>
                            </select>
                          </div>
                          <div className='flex justify-between gap-8'>
                            <div className='grow flex flex-col gap-2'>
                              <label htmlFor='phone' className="role text-xs font-bold text-gray-500">Phone</label>
                              <input type='text' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="Phone" value={person.phone} onChange={(e) => setPerson({ ...person, phone: e.target.value })}></input>
                            </div>
                            <div className='grow flex flex-col gap-2'>

                              <label htmlFor='email' className="email text-xs font-bold text-gray-500">Email</label>
                              <input id='email' type='text' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" placeholder="Phone" value={person.email} onChange={(e) => setPerson({ ...person, email: e.target.value })}></input>
                            </div>
                          </div>
                          <div className='flex flex-col gap-2'>
                            <label htmlFor='note' className="note text-xs font-bold text-gray-500">Note</label >
                            <textarea id='note' className="rounded-md p-2 text-[13px] border-2 border-gray-300 hover:border-gray-400 focus:outline-none w-full" value={person.note} onChange={(e) => setPerson({ ...person, note: e.target.value })}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="footer h-[56px] flex items-center justify-end pr-8 gap-2 rounded-bmd border-t-[1px] rounded-b-md border-gray-400 bg-gray-100" >
                        <button className="w-[73px] h-[32px] border-2 border-gray-600 rounded-md text-gray-600 text-[13px] bg-white" onClick={() => { setShow({ isOpen: false, action: 'create' }); clear(); }}>Cancel</button>
                        <button className="w-[73px] h-[32px] rounded-md text-white text-[13px] bg-[#349989]" onClick={() => { handelSubmit() }}>Submit</button>
                      </div>
                    </div>
                    // </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  )
}

export default NewContact;