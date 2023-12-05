
import Calendar from "@components/Calendar/CalendarPage";

export const revalidate = 0;

export default async function Page() {

  return (
    <div className="flex flex-col p-10  gap-1 h-full">
      <Calendar />
    </div>
  );
}
