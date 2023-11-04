"use client";

import Link from "next/link";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useAuthContext } from "@contexts/AuthContext";

export default function Header() {
  const { signOut } = useAuthContext();
  return (
    <nav className="bg-white shadow">
      <div className="flex h-16 justify-between">
        <div className="flex">
          <div className="flex flex-shrink-0 items-center">
            <Link href={`/home/`} className="font-extrabold text-indigo-500">
              Floz Cost
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={signOut}
            >
              <ArrowRightOnRectangleIcon
                className="-ml-0.5 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
