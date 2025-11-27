
import { WEEKDAYS_ZH, WEEKDAYS_EN, MONTHS_EN } from "../constants";

export const formatDateComponents = (date: Date) => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    weekdayZh: WEEKDAYS_ZH[date.getDay()],
    weekdayEn: WEEKDAYS_EN[date.getDay()],
    monthEn: MONTHS_EN[date.getMonth()],
  };
};
