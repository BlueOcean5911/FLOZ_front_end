"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpIcon, PlusIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/navigation";

const people = {
  data: [
    { id: "1", name: "Project 1" },
    { id: "2", name: "Project 2" },
    { id: "3", name: "Project 3" },
    { id: "4", name: "Project 4" },
    { id: "5", name: "Project 5" },
    { id: "6", name: "Project 6" },
  ],
};

export default function ProjectNavigator(props: { pId?: string }) {
  const router = useRouter();
  const { pId } = props;
  const initial = pId!
    ? people.data.find((person) => person.id === pId)
    : people.data[0];
  const [selected, setSelected] = useState(initial!);

  return (
    <div className="mt-12 flex justify-between">
      <div className="w-72">
        <Listbox value={selected.id} onChange={setSelected}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate font-bold">{selected.name}</span>
              <span className="pointer-events-none  absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpIcon
                  className="h-5 w-5  text-gray-400 transition-transform [[aria-expanded=false]_&]:rotate-180"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {people.data?.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={person}
                    onClick={() => router.replace(`${person.id}`)}
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
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
  );
}
