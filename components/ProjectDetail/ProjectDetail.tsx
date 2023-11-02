"use client";

import { useRouter } from "next/navigation";

export default function ProjectDetail(props: { pId: string }) {
  const router = useRouter();
  const { pId } = props;
  return (
    <div className="mt-12 flex flex-col justify-between">
      <div className="flex w-full gap-4">
        <div className="flex w-full items-center justify-center">
          <label className=" flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600">
            <p className=" text-4xl">Meeting Transcription</p>
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              placeholder="Upload"
              onChange={() => router.push(`/home/${pId}/transcript`)}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex w-full items-center justify-center">
          <label className=" flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600">
            <p className=" text-4xl">Create your bid</p>

            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              onChange={() => router.push(`/home/${pId}}transcript`)}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <p className="text-2xl font-bold">Upcoming Meetings</p>
        <div className="flex gap-4">
          <div className="b-4 flex w-full max-w-xs flex-col border p-2">
            <p>With joseph</p>
            <p>Monday, October 30, 2023</p>
            <p>7:00-8:00PM</p>
            <button>Join the meeting</button>
            <ul>
              <li>Gang Xiao</li>
              <li>Hanyang Liu</li>
              <li>Dashan Xiong</li>
            </ul>
          </div>
          <div className="b-4 flex w-full max-w-xs flex-col border p-2">
            <p>With joseph</p>
            <p>Monday, October 30, 2023</p>
            <p>7:00-8:00PM</p>
            <button>Join the meeting</button>
            <ul>
              <li>Gang Xiao</li>
              <li>Hanyang Liu</li>
              <li>Dashan Xiong</li>
            </ul>
          </div>
          <div className="b-4 flex w-full max-w-xs flex-col border p-2">
            <p>With joseph</p>
            <p>Monday, October 30, 2023</p>
            <p>7:00-8:00PM</p>
            <button>Join the meeting</button>
            <ul>
              <li>Gang Xiao</li>
              <li>Hanyang Liu</li>
              <li>Dashan Xiong</li>
            </ul>
          </div>
          <div className="b-4 flex w-full max-w-xs flex-col border p-2">
            <p>With joseph</p>
            <p>Monday, October 30, 2023</p>
            <p>7:00-8:00PM</p>
            <button>Join the meeting</button>
            <ul>
              <li>Gang Xiao</li>
              <li>Hanyang Liu</li>
              <li>Dashan Xiong</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
