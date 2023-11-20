"use client"

import { useEffect, useState, useMemo } from 'react'
import ToggleButton from "@components/button/ToogleButton";
import Task from "./Task";
import Todo from '@models/todo.model'
import { createTodo, getTodosByMeetingId, deleteTodo, deleteTodosByMeetingId, updateTodo } from 'service/todo.service'
import { id } from 'date-fns/locale';
import { log } from 'console';

// for the test data
const testData = [
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

// the list of tasks in the meeting summary
const TaskList = ({ data: todoList, handleClick, handleRemove }) => {
  return (
    <>
      {todoList ? todoList?.map((task, index) => (
        <Task
          key={index}
          id={index}
          title={task.title}
          content={task.content}
          date={task.date}
          handleRemove={handleRemove}
          handleClick={() => { handleClick(index) }} />
      )) : <></>}
    </>
  );
};

const TodoList = ({ todoListString, meetingid }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [selectedId, setSelectedPersonId] = useState(-1);

  console.log("here is TodoList");

  useEffect(() => {
    processTodoListString();
    console.log("todoListStringCalledHere");
  }, [todoListString]);

  const processTodoListString = async () => {
    console.log("processTodoListString");
    const tempTodoListString = todoListString || 'Todolist for Speaker A:\n1. Follow up with Joseph via email to provide all necessary information for the cost estimation of adding a new window to the bathroom.\n2. Research and compare different window types and prices, specifically Sierra Pacific and Marvin, for the residential project in Berkeley Downtown.\n\nTodolist for Speaker B:\n1. Gather cost estimates from subcontractors for adding a new window in the bathroom.\n2. Prepare a quote for Speaker A regarding the cost of adding a new window, which should be ready in about a week.\n3. Send Speaker A multiple window options with different prices and types, including Sierra Pacific and Marvin windows.\n4. Make a note to send Speaker A the requested window options tonight.';
    const todoListArr = [];
    tempTodoListString.split('\n\n').forEach((todoForEach) => {
      const items = todoForEach.split(':');
      if (items.length > 1) {
        todoListArr.push({
          id: '',
          title: items[0],
          content: items[1],
          date: new Date().toISOString(),
        })
      }
    })
    try {
      console.log("todoListArr>>>>", todoListArr);
      await addTodoListToDatabase(todoListArr);
    } catch (error) {
      console.error(error);
    }
    setTodoList([...todoListArr]);
    console.log("todoListArr", todoListArr);
  }

  const addTodoListToDatabase = async (todoListArr) => {
    console.log("adddatabase", todoListArr);
    for (const [index, todo] of todoListArr.entries()) {
      const newTodo = await createTodo({
        description: todo.content,
        dueDate: new Date(),
        status: 'pending',
        meetingId: meetingid,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      todoListArr[index].id = newTodo._id;
      console.log("newTodo", newTodo);
    }
  }
  // useMemo(() => {
  //   processTodoListString();
  // }, [])


  const clearInputData = () => {
    setTitle('');
    setContent('');
  }

  const handleAddAndModifyTodo = async () => {
    if (title && content) {
      if (selectedId === -1) {
        const newTodo = await createTodo({
          description: content,
          dueDate: new Date(),
          status: 'pending',
          meetingId: meetingid,
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        todoList.push({
          id: newTodo._id,
          title: title,
          content: content,
          date: new Date().toISOString(),
        })
      } else {
        todoList[selectedId].title = title;
        todoList[selectedId].content = content;
        await updateTodo(todoList[selectedId].id, {
          description: content,
          dueDate: new Date(),
          status: 'pending',
          meetingId: meetingid,
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        setSelectedPersonId(-1);
      }
    }
    setIsOpen(false);
    clearInputData();
  }

  const handleRemove = async (id) => {
    try {
      console.log("remove id ", id, todoList[id].id);
      await deleteTodo(todoList[id].id);
    } catch (error) {
      console.error(error);
    }
    setTodoList([...todoList.splice(id, 1)]);
  }

  const handleClickedTodo = (id) => {
    console.log(id);
    setSelectedPersonId(id);
    setTitle(todoList[id].title);
    setContent(todoList[id].content);
    setIsOpen(true);
  }

  const clearTodoList = () => {
    setTodoList([]);
  }




  return (
    <div className="todoList h-[35%] mx-2 flex flex-col 
    justify-center rounded-xl bg-white shadow-[0px_4px_4px_rgba(1,1,1,0.5)]"
      style={{ scrollbarWidth: 'none' }}>
      <div className="todolist-header flex justify-between w-full p-4 items-center">
        <h2 className="font-bold text-[21px]">To do list:</h2>
        <div className="flex items-center gap-4">
          <p className="text-[12px]">Matching tasks by AI</p>
          <ToggleButton />
        </div>
      </div>
      <div className="grow todolist-tasks flex flex-col gap-1 px-6 overflow-auto">
        <TaskList data={todoList} handleClick={handleClickedTodo} handleRemove={handleRemove} />
      </div>
      <div className="todolist-footer flex justify-between px-6 my-2">
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => setIsOpen(true)}>Add taks</button>
        <button className="text-[13px] text-[#06A59A]  hover:text-[#A8EFEA]" onClick={() => { clearTodoList() }}>Remove All</button>
      </div>
      {
        isOpen ?
          <div className='fixed h-screen w-screen top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.6)]'>
            <div className='p-20 flex flex-col gap-2 rounded-lg bg-white shadow-md '>
              <div className='text-center text-xl text-gray-600'>{selectedId === -1 ? 'Add Todo' : 'Edit Todo'}</div>
              <div className="text-gray-500 text-md">Title:</div>
              <input required className="pl-2 border-2 rounded-md p-1
           border-[#1B96FF]" value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
              <div className="text-gray-500 text-md">Content:</div>
              <input required className="pl-2 rounded-md p-1 border-2 border-[#1B96FF]" value={content} onChange={(e) => { setContent(e.target.value) }}></input>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { handleAddAndModifyTodo() }}>{selectedId === -1 ? 'Add' : 'Edit'}</button>
              <button className="bg-[#06A59A] text-white p-1 rounded-md" onClick={() => { setIsOpen(false); clearInputData() }}>Cancel</button>
            </div>
          </div> : <></>
      }
    </div>
  )
}

export default TodoList;