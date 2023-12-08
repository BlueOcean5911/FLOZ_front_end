
import PeopleList from "@components/People/PeopleList";

export const revalidate = 0;

export default async function Page() {
  return (
    <div className="people-page flex flex-col h-full">
      <PeopleList />
    </div>
  );
}
