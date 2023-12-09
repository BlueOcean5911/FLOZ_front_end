import { Calendar, DateObject } from "react-multi-date-picker"
import { Meeting } from "@models/meeting.model"
import "react-multi-date-picker/styles/layouts/mobile.css"


const CalendarMUI = ({ meetings=[], handleChangeDate, currDate }: {
  meetings?: Meeting[]
  handleChangeDate?: (Date) => void
  currDate?: Date
}) => {

const handleMonthChange = (newValue: DateObject) =>  {
  if(handleChangeDate) {
    handleChangeDate(newValue.toDate())
  }
}

  return (
    <Calendar

      className="drop-shadow-none rmdp-mobile"
      headerOrder={["LEFT_BUTTON", "MONTH_YEAR", "RIGHT_BUTTON"]}

      mapDays={({ date }) => {
        let props: {
          style: React.CSSProperties,
        } = {
          style: {}
        }
        if(meetings?.length > 0) {
          const tempMeetings = meetings.filter((meeting) => new Date(meeting.date).toDateString() === date.toDate().toDateString());
          if (tempMeetings.length > 0) {
            if (new Date(tempMeetings[0].date).toISOString() > new Date().toISOString()) {
              props.style = {
                border: `1px solid gray`,
                borderRadius: '9999px'
              }
            } else {
              props.style = {
                backgroundColor: '#349989',
                border: `1px solid transparent`,
                borderRadius: '9999px',
              }
            }
          }
        }
        return props;
      }}
      value={currDate}
      onChange={handleChangeDate}
      onMonthChange={handleMonthChange}
    />
  )
}

export default CalendarMUI;