import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full shadow-lg">
      <div className="h-[48px] flex justify-between sm:flex-row flex-col items-center">
        <div></div>
        <div className='my-2 flex flex-row items-center justify-center border-2 border-slate-500 rounded px-24 py-2 gap-6'>
          <img src="/search.svg" alt="image"></img>
          <input
            type="text"
            className="text-sx sm:text-sm text-center
            bg-transparent placeholder-green-300 focus:outline-none"
            placeholder="Search Floz" />
        </div>
        <div className="flex gap-3 justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-4">
          <img src="/favorite.svg" alt="image"></img>
          <img src="/plus.svg" alt="image"></img>
          <img src="/question.svg" alt="image"></img>
          <img src="/setting.svg" alt="image"></img>
          <img src="/alarm.svg" alt="image"></img>
          <img src="/avatar.svg" alt="image"></img>
        </div>
      </div>
      <div className="flex h-[40px] w-full border-b-4 border-emerald-500">
        <div className="ml-4 py-2 flex items-center gap-6">
          <h3 className="text-lg font-bold hidden sm:flex">FLOZ</h3>
          <Link href='/dashboard/home' className="text-sm font-semibold" >Home</Link>
          <Link href='/dashboard/projects' className="text-sm font-semibold flex gap-4" >Projects<img src="/dropdown1.svg" alt="image"/></Link>
          <Link href='/dashboard/calendar' className="text-sm font-semibold flex gap-4" >Calendar<img src="/dropdown1.svg" alt="image"/></Link>
          <Link href='/' className="text-sm font-semibold flex gap-4" >More<img src="/dropdown.svg" alt="image"/></Link>
        </div>
      </div>
    </div>
  )
}

export default Header;