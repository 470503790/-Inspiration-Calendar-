import { MONTHS_ZH, WEEKDAYS_ZH } from '../constants'

export const formatDateComponents = (date: Date) => {
  const weekday = WEEKDAYS_ZH[date.getDay()]
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    weekdayZh: `周${weekday}`,
    monthZh: MONTHS_ZH[date.getMonth()]
  }
}
