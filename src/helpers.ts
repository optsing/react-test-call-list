import { format, isSameDay, differenceInCalendarDays, subDays, subWeeks, subMonths, subYears } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

import type { RawData, ResultGroup, GradeTypes } from './types'

import callIncomingSrc from './assets/call-incoming.svg'
import callOutgoingSrc from './assets/call-outgoing.svg'
import callMissingSrc from './assets/call-missing.svg'
import callNoAnswerSrc from './assets/call-noanswer.svg'


export function durationTimeSecondsToMinutes(duration: number): string {
  const m = Math.floor(duration / 60), s = duration - m * 60
  return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
}

export function callStatusToIcon(in_out: number, status: string): string {
  if (in_out === 0) {  // Исходящий звонок
    if (status === 'Дозвонился') {
      return callOutgoingSrc;
    } else {
      return callNoAnswerSrc;
    }
  } else { // Входящий звонок
    if (status === 'Дозвонился') {
      return callIncomingSrc;
    } else {
      return callMissingSrc;
    }
  }
}

export function callStatusToTitle(in_out: number, status: string): string {
  if (in_out === 0) {  // Исходящий звонок
    if (status === 'Дозвонился') {
      return 'Исходящий';
    } else {
      return 'Недозвон';
    }
  } else { // Входящий звонок
    if (status === 'Дозвонился') {
      return 'Входящий';
    } else {
      return 'Пропущенный';
    }
  }
}

export function callTypeToTitle(callType: number): string {
  if (callType === 0) {
    return 'Исходящие'
  } else if (callType === 1) {
    return 'Входящие'
  }
  return 'Все типы'
}

export function dateRangeToTitle(dateRange: number, startDate: Date | null, endDate: Date | null): string {
  if (dateRange === 0) {
    return '3 дня'
  } else if (dateRange === 1) {
    return 'Неделя'
  } else if (dateRange === 2) {
    return 'Месяц'
  } else if (dateRange === 3) {
    return 'Год'
  } else if (dateRange === -1) {
    return `${dateToTitle(startDate)}-${dateToTitle(endDate)}`;
  }
  return 'Неизвестно'
}

export function dateRangeToDates(dateRange: number, now: Date, startDate: Date | null, endDate: Date | null): [Date | null, Date | null] {
  if (dateRange === 0) {
    return [subDays(now, 3), now]
  } else if (dateRange === 1) {
    return [subWeeks(now, 1), now]
  } else if (dateRange === 2) {
    return [subMonths(now, 1), now]
  } else if (dateRange === 3) {
    return [subYears(now, 1), now]
  } else if (dateRange === -1) {
    return [startDate, endDate]
  }
  return [null, null]
}

export function dateToTitle(date: Date | null): string {
  if (date === null) {
    return '__.__.__'
  }
  return format(date, 'dd.MM.yy')
}

export function getDayDifferenceTitle(date1: Date, date2: Date) {
  const diff = differenceInCalendarDays(date1, date2);
  if (diff === 0) {
    return 'Сегодня'
  } else if (diff === -1) {
    return 'Вчера'
  } else if (diff === -2) {
    return 'Позавчера'
  }
  return format(date1, 'PPP', { locale: ru })
}

export function convertData(rawData: RawData): ResultGroup[] {
  const gradeTypes: GradeTypes[] = ['good', 'normal', 'bad', 'none']
  const today = new Date()
  let curGroupDate: Date | null = null, curGroup: ResultGroup | null = null, curGroupId = 0
  const result: ResultGroup[] = []
  for (const row of rawData.results) {
    const rowDate = new Date(row.date);
    if (curGroupDate === null || !isSameDay(rowDate, curGroupDate)) {
      if (curGroup !== null) {
        result.push(curGroup)
      }
      curGroupDate = rowDate
      curGroup = {
        id: curGroupId,
        title: result.length > 0 || !isSameDay(today, rowDate) ? getDayDifferenceTitle(rowDate, today) : '',
        rows: [],
      }
      curGroupId++;
    }
    curGroup!.rows.push({
      id: row.id,
      callIcon: callStatusToIcon(row.in_out, row.status),
      callTitle: callStatusToTitle(row.in_out, row.status),
      timeOfDay: format(rowDate, 'HH:mm'),
      personIcon: row.person_avatar,
      personName: row.person_name,
      personSurname: row.person_surname,
      callDetails: row.partner_data.name,
      callDetailsAdditional: row.partner_data.phone,
      source: row.source,
      grade: gradeTypes[Math.floor(Math.random() * gradeTypes.length)],
      callDuration: row.time,
      record: row.record,
      partnershipId: row.partnership_id,
    })
  }
  if (curGroup !== null) {
    result.push(curGroup)
  }
  return result
}
