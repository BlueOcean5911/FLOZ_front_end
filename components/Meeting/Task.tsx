
import CloseButton from '@components/button/CloseButton';

import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';

// Component that display the data into Nov 17 type
const DateConverter: React.FC<{ dateString: string }> = ({ dateString }) => {


  const formattedDate = format((new Date(dateString)), 'MMM d');

  return <div className="text-gray-700">{formattedDate}</div>;
};

// Task component
const Task = ({ id: taskId, title, content, date }) => {
  // state value
  const [id, setId] = useState(taskId);
  // initial state
  useEffect(() => {
    setId(taskId);
  }, [])

  return (
    <div
      key={id}
      className="p-1 text-xs m-1 border-2 rounded-md
                  border-[#C9C9C9] border-solid flex flex-col hover:bg-[#FBF3E0]">
      <div className='flex justify-between font-md'>
        <p className='text-xs text-gray-500'>{title}</p>
        <div className='cursor-pointer' onClick={() => { }}>X</div>
      </div>
      <div className='flex justify-between gap-2'>
        <div className='text-[13px]'>{content}</div>
        <div className='date h-full flex flex-col m-w-[150px] justify-center items-center text-left'>
          <DateConverter dateString={date} />
        </div>
      </div>
    </div>

  )
}

export default Task;