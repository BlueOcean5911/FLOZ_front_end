
import CloseButton from '@components/button/CloseButton';

import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';

// Component that display the data into Nov 17 type
const DateConverter: React.FC<{ dateString: string }> = ({ dateString }) => {


  const formattedDate = format((new Date(dateString)), 'MMM d');

  return <div className="text-gray-700">{formattedDate}</div>;
};

// Task component
const Task = ({ id: taskId, title, content, date, handleRemove, handleClick, ...children }) => {
  // state value
  const [id, setId] = useState(taskId);
  // initial state
  useEffect(() => {
    setId(taskId);
  }, [])

  return (
    <div className='relative'>

      <div
        key={id}
        {...children}
        className="p-1 text-xs m-1 border-2 rounded-md
                    border-[#C9C9C9] border-solid flex flex-col hover:bg-[#FBF3E0]">
        <div className='flex justify-between font-md mb-2'>
          <p className='text-xs text-gray-500'>{title}</p>
        </div>
        <div className='flex justify-between gap-2'>
          <div className='ml-2 text-[13px] flex flex-col gap-1'>{
            content.split('\n').map((item, index) => 
              item ? <div className='bg-gray-100 border-[1px] rounded-md border-gray-500 p-1'>{item}</div>:<></>
            )
          }</div>
          <div className='date h-full flex flex-col m-w-[150px] justify-center items-center text-left'>
            <DateConverter dateString={date} />
          </div>
        </div>
      </div> 
      <button className='absolute top-1 right-4 w-4 hover:bg-gray-200' onClick={() => {handleRemove(id)}} >X</button>
    </div>

  )
}

export default Task;