
import { format, parse } from "date-fns";

/**
 * Converts a date string from database format to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDateTimeForDisplay = (dateString: string): string => {
  try {
    // Parse the date from "yyyy-MM-dd HH:mm:ss" format
    const date = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
    // Format it for display
    return format(date, "MMM dd, yyyy hh:mm a");
  } catch (e) {
    // If it fails to parse, return the original string
    console.error("Error parsing date:", e);
    return dateString;
  }
};

/**
 * Parses a slot date time string to a Date object
 * @param dateString - The date string to parse
 * @returns Date object
 */
export const parseSlotDateTime = (dateString: string): Date => {
  try {
    // Parse the date from "yyyy-MM-dd HH:mm:ss" format
    return parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
  } catch (e) {
    // If it fails to parse, return the current date
    console.error("Error parsing date:", e);
    return new Date();
  }
};

/**
 * Get values for time picker
 * @returns Object with hours, minutes, and periods arrays
 */
export const getTimePickerValues = () => {
  // Generate hours from 01-12
  const hours = Array.from({ length: 12 }, (_, i) => 
    String(i + 1).padStart(2, '0')
  );
  
  // Generate minutes from 00-59
  const minutes = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, '0')
  );
  
  // AM/PM
  const periods = ["AM", "PM"];
  
  return { hours, minutes, periods };
};
