import Calendar from "@components/Calendar/Calendar";
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";

import { cookies } from "next/headers";
import supabase from "@/utils/supabase";
import Footer from "@components/Footer";

export const revalidate = 0;

export default function Page() {
  return (
    <div className="h-full flex flex-col gap-1">
      {/* <ProjectPanel data={projects} /> */}
      {/* <div className="mb-24" /> */}
      <Calendar />
      <Footer />
    </div>
  );
}
