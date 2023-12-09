import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { createPerson, getPerson, getPersonsByOrganization, updatePerson } from '@service/person.service';
import { Fragment, useEffect, useState } from 'react'

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {
                    // <div className="new-contact fixed z-10000 w-screen h-10/12 md:h-screen flex flex-col top-0 left-0 items-center justify-center bg-[rgba(0,0,0,0.4)] overflow-auto">
                      <div className="w-full h-fit  md:w-[719px] md:h-[718px] flex flex-col overflow-auto">
                        <div className="main grow rounded-md bg-white flex flex-col justify-between overflow-auto">
                          <div className="closeButton flex justify-end stroke-gray-600 m-4" >
                            <XMarkIcon className='w-8 h-8' onClick={() => setShow({ isOpen: false, action: 'create' })}/>
                          </div>
                          <div className="header-title font-bold h-[56px] flex items-center justify-center text-center rounded-t-md border-b-[1px] text-[20px] border-gray-400">
                            <div>
                              {action == 'create' ? 'New' : 'Edit'} People
                            </div>
                          </div>
                          <div className="grow flex flex-col justify-items-center mx-8 gap-4 overflow-auto">
                            <div className="salution text-xs font-bold text-gray-500">Salutation</div>
                            {/* <input className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="None" value={salutation} onChange={(e) => setSalutation(e.target.value)}></input> */}
                            <select className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="None" value={person.salutation} onChange={(e) => setPerson({ ...person, salutation: e.target.value })}>
                              <option selected disabled value="">Select Salutation</option>
                              <option value="Mr.">Mr.</option>
                              <option value="Mrs.">Mrs.</option>
                            </select>
                            <div className="first-name text-xs font-bold text-gray-500">First Name</div>
                            <input type='text' className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="First Name" value={person.firstName} onChange={(e) => setPerson({ ...person, firstName: e.target.value })}></input>
                            <div className="last-name text-xs font-bold text-gray-500">Last Name</div>
                            <input type='text' className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Last Name" value={person.lastName} onChange={(e) => setPerson({ ...person, lastName: e.target.value })}></input>
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
                                <input type='text' className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Phone" value={person.phone} onChange={(e) => setPerson({ ...person, phone: e.target.value })}></input>
                              </div>
                              <div className='grow'>

                                <div className="email text-xs font-bold text-gray-500">Email</div>
                                <input type='text' className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" placeholder="Phone" value={person.email} onChange={(e) => setPerson({ ...person, email: e.target.value })}></input>
                              </div>
                            </div>
                            <div className="note text-xs font-bold text-gray-500">Note</div>
                            <textarea   className="rounded-md p-2 text-[13px] border-[1px] border-gray-500 w-full" value={person.note} onChange={(e) => setPerson({ ...person, note: e.target.value })}></textarea>
                          </div>
                          <div className="footer h-[56px] flex items-center justify-end pr-8 gap-2 rounded-bmd border-t-[1px] rounded-b-md border-gray-400 bg-gray-100" >
                            <button className="w-[73px] h-[32px] border-[1px] border-gray-600 rounded-md text-gray-600 text-[13px] bg-white" onClick={() => { setShow({ isOpen: false, action: 'create' }); clear(); }}>Cancel</button>
                            <button className="w-[73px] h-[32px] rounded-md text-white text-[13px] bg-[#349989]" onClick={() => { setShow({ isOpen: false, action: 'create' }); save(); clear(); }}>Submit</button>
                          </div>
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