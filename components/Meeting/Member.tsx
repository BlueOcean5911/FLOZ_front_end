import UserIcon from "@components/icons/iconUser"
import { useState } from "react";

const Member = ({ index:id, name, email, role, setSelectedPersonId:setId  }) => {

  return (
    <div key={id} className="p-1" onClick={() => { }}>
      <div className="member px-1 flex justify-between gap-1 overflow-hidden">
        <div className="flex w-1/2 gap-1 overflow-hidden">
          <div className="flex items-center">
            <UserIcon />
          </div>
          <div className="flex flex-col justify-center text-gray-500">
            <h3 className="text-[13px]">{name}</h3>
            <h3 className="text-[10px]">{email}</h3>
          </div>
        </div>
        <div className="flex w-1/2 max-h-[60px] gap-1 justify-between">
          <select data-te-select-init defaultValue={role || 1} className="border-2 border-solid min-h-[40px] text-gray-500 w-1/2 border-[#C9C9C9] rounded-xl text-[13px] font-bold" >
            <option value="0" className="font-bold text-gray-500">Role</option>
            <option value="1" className="font-bold text-gray-500" >Project Manager</option>
            <option value="2" className="font-bold text-gray-500" >Software Engineer</option>
            <option value="3" className="font-bold  text-gray-500">Web Developer</option>
          </select>
          <button className="bg-[#06A59A] rounded-md text-[10px] w-1/2 text-white " onClick={() => { setId(id) }}>Generate<br />Email</button>
        </div>
      </div>
    </div>
  )
}

export default Member;