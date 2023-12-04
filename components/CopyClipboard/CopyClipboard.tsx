'use client'

import { useState } from 'react';

const CopyClipboard = ({ text }) => {
  const [clicked, setClicked] = useState(false);

  const handleClicked = () => {
    setClicked(true);
    navigator.clipboard.writeText(text);
  }

  return (
    <svg
      className={`w-6 h-6 m-2 flex flex-col justify-center items-center hover:cursor-pointer ${clicked ? "bg-gray-300 rounded-md shadow-md" : ''}`}
      onClick={handleClicked}
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
    </svg>
  )
}

export default CopyClipboard;