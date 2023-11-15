/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Fragment, useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export default function UserCard() {
  const [currentUser, setCurrentUser] = useState(false);
  const { userSession } = useAuthContext();
  
  useEffect(() => {
    if (userSession?.user?.user_metadata) {
        setCurrentUser(userSession.user?.user_metadata)
    }
  }, [userSession])

  return (
    <div className="w-full bg-emerald-300 bg-opacity-20 py-16 px-8 rounded shadow border border-stone-300 my-10 ">
        <h1 className="font-bold text-3xl">Welcome{currentUser?.full_name ? `, ${currentUser?.full_name}` : ''}</h1>
        <p>Check out these suggestions to start your day!</p>
    </div>
  );
}
