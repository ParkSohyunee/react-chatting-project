import { format, isToday, isYesterday } from "date-fns";

const convertFormatDatetime = (datetime: string) => {
  const date = new Date(datetime);
  const halfDayHours = 12;

  // 오늘일 경우 시간만 표시 (0시 00분)
  if (isToday(date)) {
    const hours = date.getHours();
    if (hours === 0) {
      return format(date, "오전 12시 mm분");
    } else if (hours < halfDayHours) {
      return format(date, "오전 H시 mm분");
    } else {
      const convertHours = hours - halfDayHours;
      return format(date, `오후 ${convertHours}시 mm분`);
    }
  }

  if (isYesterday(date)) {
    return "어제";
  }

  return format(date, "M월 d일");
};

export default convertFormatDatetime;
