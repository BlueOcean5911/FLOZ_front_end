
import { cookies } from "next/headers";
import supabase from "@/utils/supabase";
import Header from "@components/Header";
import WelcomeCard from "@components/WelcomeCard";
import Footer from "@components/Footer";
import ProjectCard from "@components/ProjectCard";
import MeetingCard from "@components/MeetingCard";

export const revalidate = 0;

export default async function Page() {
  const cookieStore = cookies();
  const user = cookieStore.get("user_id");

  const { data: projects } = await supabase
    .from("project")
    .select("id, name")
    .eq("user_id", user?.value)
    .order("created_at", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col items-center">
      <WelcomeCard></WelcomeCard>
      <div className="my-8 flex w-11/12 gap-5 flex-col xl:flex-row">
        <div className="w-full xl:w-2/3"><ProjectCard></ProjectCard></div>
        <div className="w-full xl:w-1/3"><MeetingCard></MeetingCard></div>
      </div>
      <Footer></Footer>
    </div>
  );
}
