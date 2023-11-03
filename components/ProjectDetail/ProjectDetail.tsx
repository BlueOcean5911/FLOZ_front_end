"use client";

import { useRouter } from "next/navigation";
const { format, parseISO } = require("date-fns");

interface ProjectDetailsProps {
  label: string;
  onClick: () => void;
}

function FileUpload(props: ProjectDetailsProps) {
  const { label, onClick } = props;
  return (
    <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600">
      <p className="text-4xl">{label}</p>
      <div className="flex flex-col items-center justify-center pb-6 pt-5">
        <svg
          className="mb-4 h-8 w-8"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        placeholder="Upload"
        onChange={onClick}
        className="hidden"
      />
    </label>
  );
}

function MeetingCard({ event }: { event: any }) {
  console.log("meeting: ", event);
  return (
    <div className="b-4 flex w-full max-w-xs flex-col border p-2">
      <p>{event?.summary}</p>
      {/* {event?.attendees.length !== 0 && <p>With joseph</p>} */}
      <p>{format(parseISO(event?.created), "EEEE, MMMM d, yyyy")}</p>
      <p>
        {format(parseISO(event?.start?.dateTime), "h:mm a")} -
        {format(parseISO(event?.end?.dateTime), "h:mm a")}
      </p>
      <button className="b-4 my-3 border">Join the meeting</button>
      <ul>
        {event?.attendees?.map((attendee: any) => (
          <li key={attendee.email}>{attendee.email}</li>
        ))}
      </ul>
    </div>
  );
}
function PastMeetingsCard({ event }: { event: any }) {
  console.log("meeting: ", event);
  return (
    <div className="b-4 mx-3  flex w-full max-w-xs flex-col gap-4 border  p-2">
      <div className="flex justify-between">
        <p>{event?.summary}</p>
        <p> completed</p>
      </div>
      <a href=""> Summary </a>
    </div>
  );
}

export default function ProjectDetail(props: { pId: string; events: any }) {
  const router = useRouter();
  const { pId, events } = props;

  console.log("events::: ", events);

  const handleOnClick = () => {
    router.push(`/home/${pId}/transcript`);
  };

  return (
    <div className="mt-12 flex flex-col justify-between">
      <div className="flex w-full gap-4">
        <div className="flex w-full items-center justify-center">
          <FileUpload label="Meeting Transcription" onClick={handleOnClick} />
        </div>
        <div className="flex w-full items-center justify-center">
          <FileUpload label="Create your bid" onClick={handleOnClick} />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {events?.length === 0 ? (
          <p className="text-bold text-3xl">No upcoming meetings</p>
        ) : (
          <>
            <p className="text-2xl font-bold">Upcoming Meetings</p>
            <div className="flex gap-4">
              {events.map((event: any) => (
                <MeetingCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-8 flex flex-col gap-2">
        {events?.length === 0 ? (
          <p className="text-bold text-3xl">No past meetings</p>
        ) : (
          <>
            <p className="text-2xl font-bold">Past Meetings</p>
            <div className="flex gap-4">
              {events.map((event: any) => (
                <PastMeetingsCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
