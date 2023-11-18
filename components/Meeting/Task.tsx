
import CloseButton from '@components/button/CloseButton';

import { parseISO, format } from 'date-fns';
import { useState, useEffect } from 'react';
// Component that display the data into Nov 17 type
const DateConverter: React.FC<{ dateString: string }> = ({ dateString }) => {
  console.log(dateString);
  const date = (new Date(dateString));
  const formattedDate = format(date, 'MMM d');

  return <div className="text-gray-700">{formattedDate}</div>;
};

// Task component
const Task = ({ id, content, date, remove }) => {

  const [isOpen, setIsOpen] = useState(true);
  const [id_key, setId_key] = useState(id);

  useEffect(() => {
    setId_key(id);
  }, [])

  return (
    <>
      {
        isOpen ?
          <div 
          key={id_key}
            className="p-1 text-xs m-1 border-2 rounded-md
                  border-[#C9C9C9] border-solid flex flex-col hover:bg-[#FBF3E0]">
            <div className='flex justify-between font-md'>
              <p className='text-xs text-gray-500'>{content.split('&').length > 1 ? (content.split('&'))[0] : ""}</p>
              <div className='cursor-pointer' onClick={(e) => {console.log(id);remove(id_key)}}>X</div>
            </div>
            <div className='flex justify-between gap-2'>
              <div className='text-[13px]'>{content.split('&').length > 1 ? (content.split('&'))[1] : ""}</div>
              <div className='date h-full flex flex-col m-w-[150px] justify-center items-center text-left'>
                  <DateConverter dateString={date} />
              </div>
            </div>
          </div>
        : <></>
      }
    </>

  )
}

export default Task;