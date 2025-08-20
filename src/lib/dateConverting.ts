import { habitDoneDatesDateSchema } from '@/zodSchemas/habitSchema';
import { format, isValid } from 'date-fns';

export function stringToDate(dateString: string) {
  const parsedDateString = habitDoneDatesDateSchema.parse(dateString);
  const date = new Date(parsedDateString);

  return date;
}

export function dateToString(date: Date = new Date()) {
  if (!(date instanceof Date) || !isValid(date)) {
    throw new Error('Invalid Date object provided');
  }

  return format(date, 'yyyy-MM-dd');
}

