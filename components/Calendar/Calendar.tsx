import { Calendar, DateObject } from "react-multi-date-picker"
import { Meeting } from "@models/meeting.model"


const CalendarMUI = ({meetings, handleChangeDate, currDate}:{
  meetings:Meeting[]
  handleChangeDate:(Date)=>void
  currDate:Date
}) => {
  return (
    <Calendar
      className="drop-shadow-none"
      headerOrder={[ "LEFT_BUTTON", "MONTH_YEAR", "RIGHT_BUTTON"]} 

      mapDays={({ date }) => {
        let color:string = 'green';
        let props: {
          style : React.CSSProperties,
        } = {
          style: {}
        }
        props.style = meetings.filter((meeting) => new Date(meeting.date).toDateString() === date.toDate().toDateString())?.length > 0
           ? {
            border:`1px solid ${color}`,
            borderRadius:'9999px'
           } : null;
        return props;
      }}
      value={currDate}
      onChange={(newValue:DateObject) => handleChangeDate(newValue.toDate())}
      onMonthChange={(newValue:DateObject) => handleChangeDate(newValue.toDate())}
    />
  )
}

export default CalendarMUI;