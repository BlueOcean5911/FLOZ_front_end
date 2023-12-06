import moment from "moment";

export function getPeriod(start:string, end:string) {
  const startDate = moment(start);
  const endDate = moment(end);

  const diffInMinutes = endDate.diff(start, 'minutes');
  return diffInMinutes;
}

export function getDateAddedByMinutes(date:string | Date, period:number) {
  return moment(date).add(period, 'minutes');
}
