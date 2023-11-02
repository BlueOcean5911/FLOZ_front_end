import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import Transcript from "@components/Transcript/Transcript";

export default function Page() {
  return (
    <div 
      className="bg-neutral-100"
      // className="flex flex-col m-20"
    >
      {/* <ProjectPanel />
      <Calendar /> */}
      <Transcript />
    </div>
  );
}
