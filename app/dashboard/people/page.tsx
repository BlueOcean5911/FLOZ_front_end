
import PeopleList from "@components/People/PeopleList";
import ListActions from "@components/People/ListActions";
import Footer from "@components/Footer";

export const revalidate = 0;

export default async function Page() {

  return (
    <>
      <PeopleList />
    </>
  );
}
