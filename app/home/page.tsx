import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

export default function Page() {
  return (
    <div className="m-20 flex flex-col">
      <ProjectPanel />
      <div className="mb-24" />
      <Calendar />
    </div>
  );
}
