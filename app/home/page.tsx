import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

export default function Page() {
  return (
    <div className="flex flex-col m-20">
      <ProjectPanel />
      <Calendar />
    </div>
  );
}
