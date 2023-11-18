import Calendar from "@components/Calendar/Calendar";

export const revalidate = 0;

export default function Page() {
  return (
    <div className=" flex flex-col">
      {/* <ProjectPanel data={projects} /> */}
      <div className="mb-24" />
      <Calendar />
    </div>
  );
}
