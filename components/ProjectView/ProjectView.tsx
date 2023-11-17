/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import moment from 'moment';
import { get, post } from "../../httpService/http-service";
import supabase from "@/utils/supabase";
export default function ProjectView({
  data,
}: {
  data: { _id: any; name: any, userId: any, createdAt: any }[] | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //get time from date using moment js
  const getTime = (date: string) => {
    return moment(date).format('HH:mm:ss');
  }
  // get month name with date using moment js
  const getMonth = (date: string) => {
    return moment(date).format('MMM Do');
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // Access the form element by name
    const projectName = form.get("name"); // Assuming your form input has a name attribute

    if (projectName) {

    }
  };

  return (
    <div className="w-full items-center justify-between">
      <div className="flex">
        <div className="w-[263px] border rounded border-stone-300 px-3 py-3 bg-white mr-4" >
          <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Main workplace</h3>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Search for the project"
            className={`w-full rounded-md border p-2 px-4 outline-none `}
          />
          <h3 className="my-auto pr-2 pl-2 font-bold text-sm">Project Terms</h3>
          <div className="project-terms-items">

            <ul className="list-disc menu list-inside list-none pl-4">
              <li>Dashboard</li>
              <li>News</li>
              <li className="item" id='profile'>
                <a href="#profile" className="btn">
                  <i className="far fa-user"></i>Architects
                </a>
                <div className="smenu">
                  <a href="#">Posts</a>
                </div>
              </li>
              <li>Expenses</li>
            </ul>
          </div>
        </div>





        <div className="w-[726px] border rounded border-stone-300 px-3 py-3 bg-white mr-4" >
          <h3 className="my-auto pr-2 pb-3 font-bold text-sm">Manage your project</h3>

          <div>
            <div className="grid grid-cols-2 gap-4 pb-3">
              <div className="w-[315px] flex justify-between border rounded border-stone-300 px-3 py-3 bg-white" >
                <div className="flex meeting-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M29.0809 23.2L25.2823 20.0307C24.4105 19.3193 23.1651 19.2546 22.2933 19.9661L19.0551 22.4239C18.6815 22.7473 18.1211 22.6826 17.7474 22.2945L12.8902 17.767L8.53122 12.722C8.15759 12.3339 8.15759 11.8164 8.40668 11.3637L10.773 8.00034C11.458 7.09483 11.3957 5.80123 10.7107 4.89572L7.65942 0.950262C6.72534 -0.213971 5.04401 -0.343331 3.98539 0.756223L0.74726 4.11956C0.249087 4.637 0 5.34848 0 6.05995C0.311358 12.6573 3.17586 18.9312 7.41033 23.3294C11.6448 27.7276 17.6852 30.7029 24.0369 31.0263C24.7219 31.091 25.4068 30.7676 25.905 30.2501L29.1432 26.8868C30.3263 25.9166 30.264 24.1056 29.0809 23.2Z" fill="#349989" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Start a meeting now</h3>
                  <p className="text-sm" >New meeting /New task</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 ">
              <div className="w-[315px] flex justify-between border rounded border-stone-300 px-3 py-3 bg-white" >
                <div className="flex meeting-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M29.8459 19.0771H27.9997C27.5074 19.0771 27.0766 19.5079 27.0766 20.0002V26.1542C27.0766 26.6465 26.6459 27.0773 26.1535 27.0773H5.84585C5.35355 27.0773 4.92278 26.6465 4.92278 26.1542V20.0002C4.92278 19.5079 4.49201 19.0771 3.9997 19.0771H2.15355C1.66124 19.0771 1.23047 19.5079 1.23047 20.0002V28.3081C1.23047 29.6619 2.33816 30.7696 3.69201 30.7696H28.3074C29.6612 30.7696 30.7689 29.6619 30.7689 28.3081V20.0002C30.7689 19.5079 30.3382 19.0771 29.8459 19.0771Z" fill="#349989" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6771 1.50701C16.3079 1.13777 15.754 1.13777 15.3848 1.50701L7.0771 9.81483C6.70787 10.1841 6.70787 10.7379 7.0771 11.1072L8.36941 12.3995C8.73864 12.7687 9.29249 12.7687 9.66172 12.3995L13.1079 8.95328C13.4771 8.58404 14.154 8.8302 14.154 9.38406L14.154 22.4919C14.2156 22.9843 14.7079 23.415 15.1386 23.415L16.9848 23.415C17.4771 23.415 17.9079 22.9843 17.9079 22.4919L17.9079 9.44559C17.9079 8.89174 18.5848 8.64558 18.954 9.01482L22.4002 12.461C22.7694 12.8303 23.3233 12.8303 23.6925 12.461L24.9848 11.1072C25.354 10.7379 25.354 10.1841 24.9848 9.81483L16.6771 1.50701Z" fill="#349989" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Upload meeting audios</h3>
                  <p className="text-sm" >Get summary for your meetings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
