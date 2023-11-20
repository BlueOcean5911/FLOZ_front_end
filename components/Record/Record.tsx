import PlayButton from "@components/button/PlayButton";


const Record = () => {
  return (
    <div className="flex items-center border-2 border-gray-500 rounded-md">
      <PlayButton />
      <div className="grow-1 h-3 w-full relative rounded-full bg-gray-300 border-1 border-gray-500">
        <div className="top-0 left-0 h-3 rounded-full bg-gray-700 border-1 border-gray-500 w-[70px]">
        </div>
      </div>
      <div className="px-4">2:00</div>
    </div>
  ) 
}

export default Record;