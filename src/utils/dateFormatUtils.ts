
import { format, parse } from "date-fns";

export const parseSlotDateTime = (dateTimeStr: string): Date => {
  try {
    return parse(dateTimeStr, 'yyyy-MM-dd HH:mm:ss', new Date());
  } catch (error) {
    return new Date();
  }
};

export const formatDateTimeForDisplay = (dateTimeStr: string): string => {
  try {
    const date = parse(dateTimeStr, 'yyyy-MM-dd HH:mm:ss', new Date());
    return format(date, 'MMM dd, yyyy hh:mm a');
  } catch (error) {
    return dateTimeStr;
  }
};

export const getTimePickerValues = () => {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];
  return { hours, minutes, periods };
};
