import * as moment from 'moment';

export function dateRound(
  date: moment.Moment,
  duration: moment.Duration,
): moment.Moment {
  return moment(Math.round(+date / +duration) * +duration);
}

export function dateFloor(
  date: moment.Moment,
  duration: moment.Duration,
): moment.Moment {
  return moment(Math.floor(+date / +duration) * +duration);
}

export function dateCeil(
  date: moment.Moment,
  duration: moment.Duration,
): moment.Moment {
  return moment(Math.ceil(+date / +duration) * +duration);
}

export function convertTimeToDecimal(timeString:string) {
  const timeParts = timeString.split(':') ;
  const hours = parseFloat(timeParts[0]);
  let minutes = 0;

  if (timeParts.length > 1) {
    minutes = parseFloat(timeParts[1]);
  }

  const timeInDecimal = hours + minutes / 60;
  return timeInDecimal;
}