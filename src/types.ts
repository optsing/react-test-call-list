export type GradeTypes = 'good' | 'normal' | 'bad' | 'none';
export type SortByTypes = 'date' | 'duration';

export interface ResultRawData {
  id: number
  in_out: number
  date: string
  status: string
  person_avatar: string
  person_name: string
  person_surname: string
  partner_data: {
    name: string
    phone: string
  }
  source: string
  time: number
  record: string
  partnership_id: string
}

export interface RawData {
  total_rows: string
  results: ResultRawData[]
}

export interface ResultRow {
  id: number
  callIcon: string
  callTitle: string
  timeOfDay: string
  personIcon: string
  personName: string
  personSurname: string
  callDetails: string
  callDetailsAdditional: string
  source: string
  grade: GradeTypes
  callDuration: number
  record: string
  partnershipId: string
}

export interface ResultGroup {
  id: number
  title: string
  rows: ResultRow[]
}
