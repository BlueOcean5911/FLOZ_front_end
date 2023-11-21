
import PeopleList from "@components/People/PeopleList";
import ListActions from "@components/People/ListActions";
import Footer from "@components/Footer";

export const revalidate = 0;

export default async function Page() {

  return (
    <>
      <div className="bg-emerald-300 bg-opacity-20 p-6">
        <ListActions />
      </div>
      <div className="p-6 bg-slate-300 bg-opacity-20 h-full">
        <div className="flex flex-col gap-1">
          <PeopleList />
          <Footer />
        </div>
      </div>
    </>
  );
}
