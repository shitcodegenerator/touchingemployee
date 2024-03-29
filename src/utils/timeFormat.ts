import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

export const timeFormat = ({ time, type = 'dateTime' }: { time: string; type?: string }) => {
  const timezone = 'Asia/Taipei'

  if (type === 'date') return dayjs.utc(time).tz(timezone).format('YYYY-MM-DD')
  return dayjs.utc(time).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
}

export const convertToUtc = (time: string) => {
  const timezone = 'Asia/Taipei'

  return dayjs(time)
    .tz(timezone) // 設置泰國時區
    .utc() // 轉換為UTC時間
    .format()
}
