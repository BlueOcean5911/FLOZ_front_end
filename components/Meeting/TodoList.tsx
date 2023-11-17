"use client"

import { useEffect, useState } from 'react'
import ToggleButton from "@components/button/ToogleButton";
import Task from "./Task";
import { content } from 'googleapis/build/src/apis/content';
import { clear } from 'console';


// the list of tasks in the meeting summary
const TaskList = ({ todo, remove }) => {
  return (
    <>
      {todo.map((task, index) => (
        <Task key={index} id={index} title={task.title} content={task.content} date={task.date} remove={remove} />
      ))}
    </>
  );
};

//render the todoliat
/*
  @todoValue is the value of the todo list from the meeting summary
*/
const TodoList = ({ todoVal }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("")

  const [todos, setTodos] = useState(
    [
      {
        title: 'Joseph',
        content: '- Work on cost estimation for adding a new window to the bathroomn- Send different window types with prices to Hanian- Make a note to send a follow-up email to Hania',
        date: '2023-11-17T11:41:25.267Z'
      },
      {
        title: 'Hania',
        content: '- Receive cost estimation for new windown- Receive different window types with pricesn- Receive follow-up email from Joseph',
        date: '2023-11-17T11:41:25.267Z'
      }
    ]
  );

  useEffect(() => {
    // for the test
    // setTodos([...todoVal]);
  }, [])

  const removeALL = () => {
    setTodos([]);
  }

  const removeOne = (index: number) => {
    console.log("remove taak", index)
    todos.splice(index, 1);
    setTodos([...todos])
  }

  // clear the data in the form
  const clearData = () => {
    setTitle("")
    setContent("")
  }

  // add todo into the todo state value.
  const addTodo = () => {
    if (title.length > 0 && content.length > 0) {
      setIsOpen(false);
      clearData();
      setTodos([...todos, { title: title, content: content, date: (new Date).toISOString() }])
    }
  }

  return (
    <div className="todoList h-[35%] mx-2 flex flex-col justify-center rounded-xl bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]" style={{ scrollbarWidth: 'none' }}>
      <div className="todolist-header flex justify-between w-full p-4 items-center">
        <h2 className="font-bold text-[21px]">To do list:</h2>
        <div className="flex items-center gap-4">
          <p className="text-[12px]">Matching tasks by AI</p>
          <ToggleButton />
        </div>
      </div>
      <div className="grow todolist-tasks flex flex-col gap-1 px-6 overflow-auto">
        <TaskList todo={todos} remove={removeOne} />
      </div>
      <div className="todolist-footer flex justify-between px-6 my-2">
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => setIsOpen(true)}>Add taks</button>
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => { removeALL() }}>Remove All</button>
      </div>
      {
        isOpen ?
          <div className='fixed h-screen w-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.6)]'>
            <div className='p-20 flex flex-col gap-2 rounded-lg bg-white shadow-md '>
              <div className='text-center text-xl text-gray-600'>Add Todo</div>
              <div className="text-gray-500 text-md">Title:</div>
              <input required className="pl-2 border-2 rounded-md p-1
           border-[#1B96FF]" value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
              <div className="text-gray-500 text-md">Content:</div>
              <input required className="pl-2 rounded-md p-1 border-2 border-[#1B96FF]" value={content} onChange={(e) => { setContent(e.target.value) }}></input>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { addTodo() }}>Add</button>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { setIsOpen(false); clearData() }}>Cancel</button>
            </div>
          </div> : <></>
      }
    </div>
  )
}

export default TodoList;