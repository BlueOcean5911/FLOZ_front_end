import UserIcon from "@components/icons/iconUser"
import { useState } from "react";

const roleData = ['Architect', 'PM', 'General Contrator', 'Client', 'Sub Contrator', 'Engineer', 'Owner'];

const Member = ({ index: id, name, email, role, setSelectedPersonId: setId, generate }) => {

  return (
    <div key={id} className="p-1" onClick={() => { setId(id) }}>
      <div className="member px-1 flex justify-between gap-1 overflow-hidden">
        <div className="flex w-1/2 gap-1 overflow-hidden">
          <div className="flex items-center">
            <UserIcon className="w-7 h-7" />
          </div>
          <div className="flex flex-col justify-center text-gray-500">
            <h3 className="text-[13px]">{name}</h3>
            <h3 className="text-[10px]">{email}</h3>
          </div>
        </div>
        <div className="flex w-1/2 max-h-[60px] gap-1 justify-between">
          <select
            id="role"
            name="role"
            className="m-[2px] border-2 border-solid flex flex-col p-1
            justify-center items-center text-gray-500 w-1/2
            focus:outline-none
            border-[#C9C9C9] rounded-xl text-[13px] font-bold"
            defaultValue={role}
          >
            {
              roleData.map((role, index) => {
                return (
                  <option className="m-auto" key={index} value={role}>{role}</option>
                )
              })
            }
          </select>
          <button className="m-[2px] rounded-md text-[10px] w-1/2 text-link underline font-bold text-xs" onClick={() => { generate(id) }}>Send<br />Summaries</button>
        </div>
      </div>
    </div>
  )
}

export default Member;