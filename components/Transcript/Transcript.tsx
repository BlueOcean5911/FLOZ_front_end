"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

export default function Transcript() {
  const testData = [
    {
      name: "Speaker 1",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 2",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
    {
      name: "Speaker 3",
      content:
        "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. ",
    },
  ];

  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <Sidebar />

      {/* CONTENT */}
      <div className="px-20 py-4 sm:ml-64">
        <div>
          <div className="flex h-40 items-center justify-center rounded-sm border border-neutral-200">
            <p>Overview in meeting</p>
          </div>

          <div className="flex flex-col space-y-12 rounded-sm border border-neutral-200 py-10 ps-10 pe-40">
            {testData.map((item) => (
              <div key={item.name}>
                <h3 className="font-bold text-xl">{item.name}</h3>
                <p>{item.content}</p>
              </div> 
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
