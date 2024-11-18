import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertToThaiDate = (dateObj: Date): string => {
    return new Intl.DateTimeFormat("th-TH", { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Bangkok" }).format(dateObj);
}