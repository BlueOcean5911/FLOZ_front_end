/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Fragment, useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import Todo from "@models/todo.model";

export default function UserCard({
  data
}: {
  data: {
    todos: Todo[] | null,
  };
}) {
  const [currentUser, setCurrentUser] = useState<any>(false);
  const { userSession } = useAuthContext();
  const [toDoList, setToDoList] = useState<Todo[] | null>(data.todos);

  useEffect(() => {
    if (userSession?.user?.user_metadata) {
      setCurrentUser(userSession.user?.user_metadata)
    }
  }, [userSession])


  return (
    <div className="w-full justify-around bg-emerald-300 bg-opacity-20 py-16 px-10 rounded shadow border border-stone-300 mb-5 grid grid-cols-2">
      <div className="flex items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-3xl">Welcome{currentUser?.full_name ? `, ${currentUser?.full_name}` : ''}</h1>
          <p>Check out these suggestions to start your day!</p>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">

        {toDoList.map(todo => (
          <div key={todo._id} className="flex justify-between border rounded border-stone-300 px-3 py-3 bg-white" >
            <div>
              <h3 className="font-bold text-sm">{todo.description}</h3>
              <p className="text-sm" >{typeof todo.meetingId === 'string' ? "" : todo.meetingId?.summary || ""}</p>
            </div>
            <div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.53863 7.81555L13.5386 3.78478C13.7232 3.60017 13.7232 3.32324 13.5386 3.13863L12.9232 2.49247C12.7386 2.30786 12.4617 2.30786 12.2771 2.49247L8.24632 6.52324C8.12324 6.64632 7.93863 6.64632 7.81555 6.52324L3.78478 2.4617C3.60017 2.27709 3.32324 2.27709 3.13863 2.4617L2.49247 3.10786C2.30786 3.29247 2.30786 3.5694 2.49247 3.75401L6.52324 7.78478C6.64632 7.90786 6.64632 8.09247 6.52324 8.21555L2.4617 12.2771C2.27709 12.4617 2.27709 12.7386 2.4617 12.9232L3.10786 13.5694C3.29247 13.754 3.5694 13.754 3.75401 13.5694L7.78478 9.53863C7.90786 9.41555 8.09247 9.41555 8.21555 9.53863L12.2463 13.5694C12.4309 13.754 12.7079 13.754 12.8925 13.5694L13.5386 12.9232C13.7232 12.7386 13.7232 12.4617 13.5386 12.2771L9.53863 8.24632C9.41555 8.12324 9.41555 7.93863 9.53863 7.81555Z" fill="#747474" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}