import { Fragment, useEffect, useState } from 'react'

import ChevronUpSVG from './assets/chevron-up.svg?react'
import ChevronDownSVG from './assets/chevron-down.svg?react'
import ChevronLeftSVG from './assets/chevron-left.svg?react'
import ChevronRightSVG from './assets/chevron-right.svg?react'
import CalendarSVG from './assets/calendar.svg?react'
import ClearSVG from './assets/clear.svg?react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ru } from 'date-fns/locale/ru'

import Grade from './components/Grade'
import Person from './components/Person'
import AudioPlayer from './components/AudioPlayer'

import { dateRangeToDates, callTypeToTitle, convertData, dateRangeToTitle, dateToTitle, durationTimeSecondsToMinutes } from './helpers'
import { fetchEntries } from './api'

import type { ResultGroup, ResultRow, SortByTypes } from './types'


const LIMIT = 50


function App() {
  const [entries, setEntries] = useState<ResultGroup[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [isCallTypePopupOpened, setIsCallTypePopupOpened] = useState(false)
  const [currentCallTypeFilter, setCurrentCallTypeFilter] = useState(-1)

  const [isDatePickerPopupOpened, setIsDatePickerPopupOpened] = useState(false)
  const [currentDatePickerRange, setCurrentDatePickerRange] = useState(0)

  const [isDatePickerCalendarOpened, setIsDatePickerCalendarOpened] = useState(false)

  const [currentSortBy, setSortBy] = useState<SortByTypes>('date')
  const [currentOrderDesc, setSortOrderDesc] = useState(true)

  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null)
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null)

  const [calendarStartDate, setCalendarStartDate] = useState<Date | null>(null)
  const [calendarEndDate, setCalendarEndDate] = useState<Date | null>(null)

  const [currentRecordPlayer, setCurrentRecordPlayer] = useState(-1)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    const [dateStart, dateEnd] = dateRangeToDates(currentDatePickerRange, new Date(), currentStartDate, currentEndDate)
    fetchEntries(
      dateStart,
      dateEnd,
      currentCallTypeFilter,
      currentSortBy,
      currentOrderDesc,
      currentPage,
      LIMIT,
      signal,
    )
      .then(rawData => {
        const data = convertData(rawData)
        setTotalRows(Number(rawData.total_rows))
        setEntries(data)
      })
      .catch(err => {
        setTotalRows(0)
        setEntries([])
        console.error(err)
      })
    return () => {
      controller.abort()
    }
  }, [currentCallTypeFilter, currentDatePickerRange, currentPage, currentStartDate, currentEndDate, currentSortBy, currentOrderDesc])

  function handleCallTypeClick(callType: number) {
    setCurrentCallTypeFilter(callType)
    setIsCallTypePopupOpened(false)
    setCurrentPage(0)
    setCurrentRecordPlayer(-1)
  }

  function handleDateRangeClick(dateRange: number) {
    setIsDatePickerPopupOpened(false)
    if (dateRange !== -1) {
      setCurrentDatePickerRange(dateRange)
      setCurrentStartDate(null)
      setCurrentEndDate(null)
      setCalendarStartDate(null)
      setCalendarEndDate(null)
      setCurrentPage(0)
      setCurrentRecordPlayer(-1)
    } else {
      setIsDatePickerCalendarOpened(true)
    }
  }

  function handleDateRangeChange(date: [Date | null, Date | null]) {
    const [start, end] = date
    setCalendarStartDate(start)
    setCalendarEndDate(end)
    if (start !== null && end !== null) {
      setCurrentDatePickerRange(-1)
      setCurrentStartDate(start)
      setCurrentEndDate(end)
      setIsDatePickerCalendarOpened(false)
      setIsDatePickerPopupOpened(false)
      setCurrentPage(0)
      setCurrentRecordPlayer(-1)
    }
  }

  function handleSortClick(newSortBy: SortByTypes) {
    if (currentSortBy === newSortBy) {
      setSortOrderDesc(!currentOrderDesc)
    } else {
      setSortBy(newSortBy)
      setSortOrderDesc(true)
    }
    setCurrentPage(0)
    setCurrentRecordPlayer(-1)
  }

  function handlePreviousPageClick() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  function handleNextPageClick() {
    if ((currentPage + 1) * LIMIT < totalRows) {
      setCurrentPage(currentPage + 1)
    }
  }

  function handleRowClick(row: ResultRow) {
    if (row.callDuration > 0) {
      setCurrentRecordPlayer(row.id)
    }
  }

  return (
    <div className='mx-auto'>
      <div className='flex my-4'>
        <div className='relative'>
          <button type='button' onClick={() => setIsCallTypePopupOpened(!isCallTypePopupOpened)} className='text-[#5E7793] cursor-pointer hover:text-[#002CFB] flex items-center'>
            <span className={currentCallTypeFilter != -1 ? 'text-[#1F46FB]' : ''}>{callTypeToTitle(currentCallTypeFilter)}</span>
            <ChevronDownSVG className='ml-3 mr-1' />
          </button>
          {isCallTypePopupOpened && <div className='fixed inset-0' onClick={() => setIsCallTypePopupOpened(false)} />}
          {isCallTypePopupOpened && <div className='absolute left-0 bg-[#ffffff] rounded-lg w-[133px] my-1 py-1 text-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]'>
            <button type='button' onClick={() => handleCallTypeClick(-1)} className={`px-3 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] ${currentCallTypeFilter === -1 ? 'text-[#002CFB]' : 'text-[#2B2D33]'}`}>
              Все типы
            </button>
            <button type='button' onClick={() => handleCallTypeClick(1)} className={`px-3 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] ${currentCallTypeFilter === 1 ? 'text-[#002CFB]' : 'text-[#2B2D33]'}`}>
              Входящие
            </button>
            <button type='button' onClick={() => handleCallTypeClick(0)} className={`px-3 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] ${currentCallTypeFilter === 0 ? 'text-[#002CFB]' : 'text-[#2B2D33]'}`}>
              Исходящие
            </button>
          </div>}
        </div>
        {currentCallTypeFilter != -1 && <button type='button' onClick={() => setCurrentCallTypeFilter(-1)} className='text-[#5E7793] cursor-pointer hover:text-[#002CFB] ml-4 flex items-center'>
          <span>Сбросить фильтры</span>
          <ClearSVG className='ml-3 mr-1' />
        </button>}
        <div className='relative ml-auto'>
          <span className='inline-flex justify-center text-[#5E7793]'>
            <button type='button' onClick={handlePreviousPageClick} className='cursor-pointer hover:text-[#002CFB]'>
              <ChevronLeftSVG className='mx-1' />
            </button>
            <button type='button' onClick={() => setIsDatePickerPopupOpened(true)} className='cursor-pointer mx-3 hover:text-[#002CFB] flex items-center'>
              <CalendarSVG className='mx-1' />
              <span className='text-[#002CFB]'>{dateRangeToTitle(currentDatePickerRange, currentStartDate, currentEndDate)}</span>
            </button>
            <button type='button' onClick={handleNextPageClick} className='cursor-pointer hover:text-[#002CFB]'>
              <ChevronRightSVG className='mx-1' />
            </button>
          </span>
          {isDatePickerPopupOpened && <div className='fixed inset-0' onClick={() => setIsDatePickerPopupOpened(false)} />}
          {isDatePickerPopupOpened && <div className='absolute right-0 bg-[#ffffff] rounded-sm w-[204px] my-1 py-1 border border-[#EAF0FA] shadow-[0_0_26px_rgba(233,237,243,0.8)]'>
            <button type='button' onClick={() => handleDateRangeClick(0)} className={`px-5 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] hover:text-[#122945] ${currentDatePickerRange === 0 ? 'text-[#002CFB]' : 'text-[#899CB1]'}`}>
              3 дня
            </button>
            <button type='button' onClick={() => handleDateRangeClick(1)} className={`px-5 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] hover:text-[#122945] ${currentDatePickerRange === 1 ? 'text-[#002CFB]' : 'text-[#899CB1]'}`}>
              Неделя
            </button>
            <button type='button' onClick={() => handleDateRangeClick(2)} className={`px-5 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] hover:text-[#122945] ${currentDatePickerRange === 2 ? 'text-[#002CFB]' : 'text-[#899CB1]'}`}>
              Месяц
            </button>
            <button type='button' onClick={() => handleDateRangeClick(3)} className={`px-5 py-1.5 w-full text-left cursor-pointer hover:bg-[#DEE4FF] hover:text-[#122945] ${currentDatePickerRange === 3 ? 'text-[#002CFB]' : 'text-[#899CB1]'}`}>
              Год
            </button>
            <span className='px-5 py-1.5 w-full text-left text-[#122945]'>Указать даты</span>
            <button type='button' onClick={() => handleDateRangeClick(-1)} className={`px-5 py-1.5 w-full cursor-pointer hover:bg-[#DEE4FF] hover:text-[#122945] flex ${currentDatePickerRange === -1 ? 'text-[#002CFB]' : 'text-[#ADBFDF]'}`}>
              <span>{dateToTitle(currentStartDate)}-{dateToTitle(currentEndDate)}</span>
              <CalendarSVG className='ml-auto' />
            </button>
          </div>}
        </div>
      </div>
      <table className='w-[1440px] rounded-lg border-collapse shadow-[0_4px_5px_#E9EDF3] bg-[#FFFFFF]'>
        <thead>
          <tr>
            <th className='w-10' />
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>Тип</th>
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>
              <button type='button' onClick={() => handleSortClick('date')} className='cursor-pointer flex items-center'>
                <span>Время</span>
                {currentSortBy === 'date' && (currentOrderDesc
                  ? <ChevronUpSVG className='ml-3 mr-1' />
                  : <ChevronDownSVG className='ml-3 mr-1' />
                )}
              </button>
            </th>
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>Сотрудник</th>
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>Звонок</th>
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>Источник</th>
            <th className='font-normal text-[#5E7793] text-left px-2 py-5'>Оценка</th>
            <th className='font-normal text-[#5E7793] text-right px-2 py-5 pr-5 w-[376px]'>
              <button type='button' onClick={() => handleSortClick('duration')} className='cursor-pointer ml-auto flex items-center'>
                <span>Длительность</span>
                {currentSortBy === 'duration' && (currentOrderDesc
                  ? <ChevronUpSVG className='ml-3 mr-1' />
                  : <ChevronDownSVG className='ml-3 mr-1' />
                )}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(group => (
            <Fragment key={group.id}>
              {group.title && <tr>
                <td />
                <td colSpan={7} className='px-2 py-2.5 pt-6 text-[15px]'>
                  <span>{group.title}</span>
                  <span className='text-[#899CB1] text-xs pl-0.5 align-top'>{group.rows.length}</span>
                </td>
              </tr>}
              {group.rows.map(row => (
                <tr key={row.id} onClick={() => handleRowClick(row)} className='hover:bg-[#D4DFF32B] cursor-pointer group'>
                  <td />
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>
                    <img src={row.callIcon} title={row.callTitle} />
                  </td>
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>{row.timeOfDay}</td>
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>
                    <Person personIcon={row.personIcon} personName={row.personName} personSurname={row.personSurname} />
                  </td>
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>
                    <div>{row.callDetails}</div>
                    <div className='text-[#5E7793]'>{row.callDetailsAdditional}</div>
                  </td>
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>
                    <div className='text-[#5E7793]'>{row.source}</div>
                  </td>
                  <td className='px-2 py-2.5 text-left text-[15px] border-t border-[#EAF0FA]'>
                    <Grade type={row.grade} />
                  </td>
                  <td className='px-2 py-2.5 pr-10 text-right text-[15px] border-t border-[#EAF0FA] max-w-full'>
                    {row.callDuration > 0 && (
                      currentRecordPlayer === row.id
                        ? <AudioPlayer
                          record={row.record}
                          partnershipId={row.partnershipId}
                          duration={row.callDuration}
                          onClose={() => setCurrentRecordPlayer(-1)}
                        />
                        : <div className='ml-auto flex items-center justify-end h-12'>{durationTimeSecondsToMinutes(row.callDuration)}</div>
                    )}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
      {isDatePickerCalendarOpened && <div className='fixed inset-0 flex'>
        <div className='fixed inset-0 bg-black/25' onClick={() => setIsDatePickerCalendarOpened(false)} />
        <div className='m-auto'>
          <DatePicker
            selected={calendarStartDate}
            startDate={calendarStartDate}
            endDate={calendarEndDate}
            onChange={handleDateRangeChange}
            locale={ru}
            maxDate={new Date()}
            swapRange
            selectsRange
            inline
          />
        </div>
      </div>}
    </div>
  )
}

export default App
