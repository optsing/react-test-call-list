import { format } from 'date-fns'
import type { SortByTypes, RawData } from "./types";

const API_GET_LIST_URL = 'https://api.skilla.ru/mango/getList'
const API_GET_RECORD_URL = 'https://api.skilla.ru/mango/getRecord'
const BEARER_TOKEN = 'testtoken'

export async function fetchEntries(
  dateStart: Date | null,
  dateEnd: Date | null,
  callTypeFilter: number,
  sortBy: SortByTypes,
  orderDesc: boolean,
  page: number,
  limit: number,
  signal: AbortSignal,
): Promise<RawData> {
  if (dateStart === null || dateEnd === null) {
    throw new Error('Не указаны даты начала и окончания');
  }
  const params = new URLSearchParams()
  params.append('date_start', format(dateStart, 'yyyy-MM-dd'))
  params.append('date_end', format(dateEnd, 'yyyy-MM-dd'))
  params.append('sort_by', sortBy)
  params.append('order', orderDesc ? 'DESC' : 'ASC')
  params.append('offset', (page * limit).toString())
  params.append('limit', limit.toString())
  if (callTypeFilter === 0 || callTypeFilter === 1) {
    params.append('in_out', callTypeFilter.toString())
  }
  const response = await fetch(`${API_GET_LIST_URL}?${params}`, {
    method: 'post',
    headers: new Headers({
      'Authorization': `Bearer ${BEARER_TOKEN}`,
    }),
    signal,
  })
  return await response.json()
}

export async function getRecordBlob(record: string, partnershipId: string, signal: AbortSignal) {
    const params = new URLSearchParams()
    params.append('record', record)
    params.append('partnership_id', partnershipId)
    const response = await fetch(`${API_GET_RECORD_URL}?${params}`, {
        method: 'post',
        headers: new Headers({
            'Authorization': `Bearer ${BEARER_TOKEN}`,
        }),
        signal,
    })
    return await response.blob()
}
