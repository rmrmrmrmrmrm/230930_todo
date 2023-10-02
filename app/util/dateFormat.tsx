import { format } from "date-fns";

export const dateFormat = (date: Date) => {
  const formattedDate = format(date, "yyyy-MM-dd HH:mm");

  return formattedDate;
};
