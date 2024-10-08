import type { ISchedulesHistory, ISchedulesHistoryResponse, ScheduleStatus } from '@/types/services/schedule'
import { ScheduleType } from '@/types/services/schedule'

export interface IPatientSimpleResponse {
  seq: number
  hospitalSeq: number;
  name: string;
  contact: string;
  contactNote: string;
  identification: string;
  caregiverContact: string;
  caregiverNote: string;
  familyContact: string;
  familyNote: string;
  jibunAddress: string;
  roadAddress: string;
  addressDetail: string;
  note: string;
  lat: number;
  lng: number;
  district: string;
  doctorName: string;
  nurseName: string;
  referralAgency: string;
  chronicDisease: string;
  ingScheduleSeq: number;
  status: string;
  type: string;
  filteringType?:string;
  medicalFeeType: string;
  startDtm: string;
  endDtm: string;
  scheduleHistoryCount: number;
  schedulesHistoryList: Array<ISchedulesHistoryResponse>;
}

export interface IPatientDetailResponse {
  seq: number
  hospitalSeq: number;
  name: string;
  identification: string;
  priorityContact: string;
  contact: string;
  contactNote: string;
  caregiverContact: string;
  caregiverNote: string;
  familyContact: string;
  familyNote: string;
  jibunAddress: string;
  roadAddress: string;
  addressDetail: string;
  lat: number;
  lng: number;
  post: string;
  district: string;
  doctorName: string;
  nurseName: string;
  referralAgency: string;
  chronicDisease: string;
  note: string;
  schedules: Array<ISchedules>;
  medicalNote: string
}

export interface IPatient extends IBaseEntity {
  seq: number;
  hospitalSeq: number;
  name: string;
  identification: string;
  contact: string;
  caregiverContact: string;
  caregiverNote: string;
  familyContact: string;
  familyNote: string;
  jibunAddress: string;
  roadAddress: string;
  addressDetail: string;
  lat: number;
  lng: number;
  post: string;
  district: string;
  doctorName: string;
  nurseName: string;
  referralAgency: string;
  chronicDisease: string;
  note: string;
  registerId: string;
  updateId: string;
  schedules: Array<ISchedules>;
  schedulesHistory: Array<ISchedulesHistory>;
}

export interface IBaseEntity {
  register_dtm: string;
  update_dtm: string;
}


export interface ISchedules extends IBaseEntity {
  seq: number;
  // type: ScheduleType;
  type: string;
  detailType: string;
  // insurance: InsuranceType;
  insurance: string;
  // status: ScheduleStatus;
  status: string;
  statusMemo: string;
  // @JsonFormat(pattern = "yyyy-MM-dd")
  startDate: string;
  // @JsonFormat(pattern = "yyyy-MM-dd")
  endDate: string;
  registerId: string;
  updateId: string;
  patient: IPatient;
}

export interface IPatientCreateRequest {
  name: string
  identification: string
  priorityContact: string
  contact: string // 본인 연락처
  contactNote: string // 본인 연락처 관련 메모
  caregiverContact: string // 요양 보호사, 활동 지원사 연락처
  caregiverNote: string //요양 보호사 메모
  familyContact: string // 주보호자 연락처
  familyNote: string // 주보호자 메모
  jibunAddress: string
  roadAddress: string
  addressDetail: string;
  lat: number
  lng: number
  post: string
  district: string // 구역
  doctorName: string
  nurseName: string
  referralAgency: string
  chronicDisease: string
  note: string
  medicalNote: string
  registerId: string
  schedules: Partial<ISchedules>
}

export interface IPatientSearchCondition {
  pageNo?: number
  lat?: number
  lng?: number
  // scheduleType?: Array<ScheduleType>
  scheduleType?: Array<string>
  // scheduleStatus?: ScheduleStatus
  scheduleStatus?: string
  district?: Array<string>
  durationAfterVisit?: number
  patientName?: string
  newPatientInclusion?: boolean
  year?: number
  selectedDate?: any;
  isNotVisitedThisMonth: boolean;
  isUrgentVisit:boolean;
}

export interface IPatientUpdateRequest {
  patientSeq: number
  name: string
  identification: string
  priorityContact: string
  contact: string // 본인 연락처
  contactNote: string // 본인 연락처 메모
  caregiverContact: string // 요양 보호사, 활동 지원사 연락처
  caregiverNote: string //요양 보호사 메모
  familyContact: string // 주보호자 연락처
  familyNote: string // 주보호자 메모
  jibunAddress: string
  roadAddress: string
  addressDetail: string
  lat: number
  lng: number
  post: string
  district: string // 구역
  doctorName: string
  nurseName: string
  referralAgency: string
  chronicDisease: string
  medicalNote: string
  note: string
  schedules: Partial<ISchedules>
}


