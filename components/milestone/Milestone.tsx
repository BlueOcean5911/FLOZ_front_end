'use client'

import { Meeting } from "@models";
import { useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
import moment from "moment";


const Milestone = ({meetings:data} : {
  meetings: Meeting[]
}) => {

  const [meetings, setMeetings] =
    useState<{ meeting: Meeting, percent?: number, type: number }[]>([]);
  const [period, setPeriod] = useState<number>(183);
  const [start, setStart] = useState<Date>(new Date('2023-01-01'));
  const [end, setEnd] = useState<Date>(new Date('2024-01-01'));
  const [from, setFrom] = useState<Date>(new Date('2023-01-01'));
  const [to, setTo] = useState<Date>(new Date('2024-01-01'));
  const [value, setValue] = useState<number[]>([0, 182]);

  useEffect(() => {
    const date1 = new Date(from);
    date1.setDate(date1.getDate() + value[0])
    const date2 = new Date(from);
    date2.setDate(date2.getDate() + value[1]);
    setStart(date1);
    setEnd(date2);
  }, [])

  useEffect(() => {
    const currDate = new Date();
    // const totalValue = new Date(end.toDateString()).getTime() - new Date(start.toDateString()).getTime()
    const totalValue = diffDays(start, end);
    let percent = 0;
    const tempMeetings: { meeting: Meeting, percent?: number, type: number }[] = [];
    for (let i = 0; i < data.length; i++) {
      // percent = (Math.floor((new Date(new Date(data[i].date).toDateString()).getTime() -
      //   new Date(start.toDateString()).getTime()) / totalValue * 100));
      percent = (Math.floor(diffDays(start, new Date(data[i].date)) / totalValue * 100));
      
      if (percent > 0 && percent < 100) {
        if ((new Date(data[i].date)).toDateString() === currDate.toDateString()) {
          tempMeetings.push({ meeting: data[i], percent, type: 1 });
        } else if ((new Date(data[i].date)).toISOString() > currDate.toISOString()) {
          tempMeetings.push({ meeting: data[i], percent, type: 2 });
        } else {
          tempMeetings.push({ meeting: data[i], percent, type: 3 });
        }
      }
    }
    setMeetings([...tempMeetings]);
  }, [setMeetings,start,end])

  useEffect(() => {
    const date1 = new Date(from);
    date1.setDate(date1.getDate() + value[0]);
    setStart(date1);
    const date2 = new Date(from);
    date2.setDate(date2.getDate() + value[1]);
    setStart(date1)
    setEnd(date2);
  }, [value])

  useEffect(() => {
    console.log(meetings, "meetings");
  }, [meetings])


  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  function valuetext(value: number) {
    const date = new Date(from);
    date.setDate(from.getDate() + value + 1);
    return moment(date).format('MMM D, yyyy');
    // return value.toString();
  }

  const diffDays = (from: Date | string, to: Date | null) => {
    const date1 = moment(from);
    const date2 = moment(to);
    const days = date2.diff(date1, 'days');
    console.log(days)
    return days;
  }
  

  return (
    <div className="flex flex-col gap-2">
      <div className="min-h-[60px] flex flex-col items-center justify-center bg-gray-200">
        <div className="h-1 w-full bg-gray-300 rounded-full relative">
          {
            meetings.map((item, index) => {
              if (item.type === 3) {
                return (
                  <div key={index} className={`absolute -top-[9px] h-6`} style={{ left: `${item.percent}%` }}>
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-green-400"></div>
                  </div>
                )
              } else if (item.type === 1) {
                return (
                  <div key={index} className={`absolute -top-[7px] h-6`} style={{ left: `${item.percent}%` }}>
                    <div className="w-[20px] h-[20px] rounded-full border-[4px] border-green bg-white"></div>
                    <svg className="relative -top-9" width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 15L0.839745 0L18.1603 0L9.5 15Z" fill="#349989" />
                    </svg>
                  </div>
                )
              } else if (item.type === 2) {
                return (
                  <div key={index} className={`absolute -top-[7px] h-6`} style={{ left: `${item.percent}%` }}>
                    <div className="w-[20px] h-[20px] rounded-full border-[4px] border-white bg-gray-400"></div>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
      <div className="flex justify-center gap-2 m-auto w-full mt-7">
        <div className="flex items-center hover:cursor-pointer" >
          <svg width="2" height="12" viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="2" height="12" rx="1" fill="#747474" />
          </svg>

          <svg className="relative -left-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.4921 14.6463L4.12284 8.33864C3.93822 8.15403 3.93822 7.84633 4.12284 7.66172L10.4921 1.35403C10.6767 1.16941 10.9844 1.16941 11.169 1.35403L11.8459 2.03095C12.0305 2.21557 12.0305 2.52326 11.8459 2.70787L6.83053 7.66172C6.64591 7.84633 6.64591 8.15403 6.83053 8.33864L11.8151 13.2925C11.9998 13.4771 11.9998 13.7848 11.8151 13.9694L11.1382 14.6463C10.9536 14.8002 10.6767 14.8002 10.4921 14.6463V14.6463Z" fill="#747474" />
          </svg>
        </div>
        <Slider
        sx={{width:'90%'}}
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
          aria-valuetext="111"
          step={1}
          min={0}
          max={365}
          valueLabelFormat={valuetext}
          disableSwap
        />
        <div className="flex items-center hover:cursor-pointer" >
          <svg 
          width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.50793 0.353666L7.87716 6.66136C8.06178 6.84597 8.06178 7.15367 7.87716 7.33828L1.50793 13.646C1.32332 13.8306 1.01563 13.8306 0.83101 13.646L0.154087 12.969C-0.0305289 12.7844 -0.0305289 12.4767 0.154087 12.2921L5.16947 7.33828C5.35409 7.15367 5.35409 6.84597 5.16947 6.66136L0.184856 1.70751C0.00024038 1.5229 0.00024038 1.2152 0.184856 1.03059L0.861779 0.353666C1.04639 0.19982 1.32332 0.19982 1.50793 0.353666V0.353666Z" fill="#747474" />
          </svg>
          <svg 
          width="2" height="12" viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="2" height="12" rx="1" fill="#747474" />
          </svg>
        </div>

      </div>
    </div >
  )
}

export default Milestone;