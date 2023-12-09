"use client";

import { IProject } from "@./models/project.model";
import { useEffect, useState } from "react";
import { getAllTodos } from "@service/todo.service";
import Todo from "@/models/todo.model";
import { useRouter } from "next/navigation";

// project list card item component
export default function ProjectCardItem({
  project,
}: {
  project: IProject | null;
}) {
  const [pro, setPro] = useState<IProject | null>(project);
  const [todos, setTodos] = useState<Todo[] | null>();
  useEffect(() => {
    // send get pro's todos request
    (async () => {
      const todos = await getAllTodos(pro._id);
      setTodos(todos);
    })();
  }, []);
  const router = useRouter();

  // navigate to project detail page
  function goProjectDetail(id: string) {
    router.push(`/dashboard/project/${id}`);
  }

  // TODO Show the user’s own todos
  // TODO Add collect function
  // TODO Add todo interaction
  return (
    <div className="mb-4 w-full sm:w-1/3 flex-none px-3">
      <div className="bg-gray rounded-lg border-2 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{pro.name}</div>
          <div
            className="cursor-pointer text-blue-500 underline"
            onClick={() => {
              goProjectDetail(pro._id);
            }}
          >
            {"Go to project->"}
          </div>
        </div>
        <div className="mt-6">
          <div className="title_color mb-1">To do</div>
          <div className="">
            {todos?.length ? (
              todos?.map((todo) => {
                return (
                  <div className="mb-1 border-b-2 font-bold" key={todo._id}>
                    {todo.title}
                  </div>
                );
              })
            ) : (
              <div>None</div>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="title_color mb-2">Task Assigned to me</div>
          <div className="">
            <div className="mb-2">
              <div className="flex justify-between">
                <div className="cursor-pointer font-bold text-blue-500 underline">
                  Task #1
                </div>
                <div className="font-bold">by Tommorrow EOD</div>
              </div>
              <div className="border-b-2 text-sm text-neutral-500">
                From Juile Moore
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between">
                <div className="cursor-pointer font-bold text-blue-500 underline">
                  Task #2
                </div>
                <div className="font-bold">by Tommorrow EOD</div>
              </div>
              <div className="border-b-2 text-sm text-neutral-500">
                From Juile Moore
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between">
                <div className="cursor-pointer font-bold text-blue-500 underline">
                  Task #3
                </div>
                <div className="font-bold">by Tommorrow EOD</div>
              </div>
              <div className="border-b-2 text-sm text-neutral-500">
                From Juile Moore
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
