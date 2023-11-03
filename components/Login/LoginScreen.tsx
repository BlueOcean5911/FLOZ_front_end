'use client'


import React from 'react'
import OauthButton from "@/components/button/OauthButton";

function LoginScreen({onClick}) {
  return (

      <>
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-4xl text-center text-indigo-500 font-bold">Floz Cost</h1>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] bg-neutral-200">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              
              <OauthButton onClick={onClick} />
  
            </div>
  
          </div>
        </div>
      </>
    )

}

export default LoginScreen