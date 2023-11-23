// import Calendar from "@components/Calendar/Calendar";
"use client"
import ProjectPanel from "@components/ProjectPanel/ProjectPanel";
import UserCard from "@components/UserCard/UserCard";
import { getProjects } from "@service/project.service";
import { getMeetings } from "@service/meeting.service";
import { getTodos } from "@service/todo.service";
import React from 'react'
import { getCookie } from "cookies-next";

export const revalidate = 0;

export default async function Page() {
  
  const userId = getCookie("user_id");
  const [projects, setProjects] = React.useState([]);
  const [meetings, setMeetings] = React.useState([]);
  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    initialize();
  }, [])

  const initialize = async () => {
    try {

      // Get projects from backend api
      const projects = await getProjects({});

      // Get meetings from backend api
      const meetings = await getMeetings();

      // Get todos from backend api
      const todos = await getTodos();

      setTodos(todos);
      setMeetings(meetings);
      setProjects(projects);
    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <div className="flex flex-col">
      <UserCard data={{ todos }} />
      <ProjectPanel data={{ projects, meetings }} />
    </div>
  );
}
