"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/navigation";

interface HeaderProps {
  pId?: string;
}

export default function Header(props: HeaderProps) {
  const { pId } = props;
  const router = useRouter();

  const tabs = {
    data: [
      {
        id: "1",
        value: "Project 1",
      },
      {
        id: "2",
        value: "Project 2",
      },
      {
        id: "3",
        value: "Project 3",
      },
    ],
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className=" max-w-7xl ">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <a href="" className="font-extrabold text-indigo-500">
                    Floz Cost
                  </a>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {tabs.data.map(({ id, value }) => (
                    <button
                      key={id}
                      onClick={() => router.replace(`${id}`)}
                      className={`inline-flex items-center border-b-2 ${
                        id === pId ? "border-indigo-500" : "border-transparent"
                      } px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    New Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {tabs.data.map(({ id, value }) => (
                <Disclosure.Button
                  key={id}
                  as="button"
                  onClick={() => router.replace(`${id}`)}
                  className={`block  py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6 ${
                    id === pId
                      ? "  border-l-4 border-indigo-500 "
                      : "border-l-4 border-transparent"
                  }`}
                >
                  {value}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
