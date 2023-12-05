import { XMarkIcon } from '@heroicons/react/20/solid';

const DialogHeader = ({ text = 'New', closeModal }: {
  text: string,
  closeModal: () => void
}) => {
  return (
    <div className="w-full border-b-2 border-gray-100">
      <div className="close-btn flex justify-end pr-4">
        <XMarkIcon className='w-6 h-6  hover:cursor-pointer hover:bg-gray-200 rounded-md' onClick={closeModal}/>
      </div>
      <div className="title text-center text-xl p-1">
        {text}
      </div>
    </div>
  )
}

export default DialogHeader;