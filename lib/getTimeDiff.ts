export const getTimeDiff = (created_at: string) => {
  const {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears,
    getDaysInMonth,
  } = require("date-fns");

  const currentDate = new Date();
  const daysInMonth = getDaysInMonth(currentDate);

  const minutes = differenceInMinutes(currentDate, new Date(created_at));
  const hours = differenceInHours(currentDate, new Date(created_at));
  const days = differenceInDays(currentDate, new Date(created_at));
  const weeks = differenceInWeeks(currentDate, new Date(created_at));
  const months = differenceInMonths(currentDate, new Date(created_at));
  const years = differenceInYears(currentDate, new Date(created_at));

  const since =
    minutes > 59
      ? hours > 23
        ? days > 6
          ? weeks > daysInMonth
            ? months > 12
              ? years + "y"
              : months + "m"
            : weeks + "w"
          : days + "d"
        : hours + "h"
      : minutes + "m";

  return since;
};
