import type { IBaseEntity, IPatient, ISchedules } from '@/types/services/patient'

export enum InsuranceType {
  NHI = '국민건강보험',
  MA1 = '의료급여1종',
  MA2 = '의료급여2종',
  LI1 = '차상위계층1',
  LI2 = '차상위계층2',
}

export enum ScheduleStatus {
  ING = '진행중',
  END = '종료'
}

export enum ScheduleType {
  DIS = '장주',
  DIL = '장주경',
  HOM = '재택',
  COM = '일차'
}

enum ScheduleHistoryType {
  DN = '의사&간호사',
  NO = '간호사'
}

enum ScheduleHistoryShift{
  AM='오전',
  PM='오후',
  NIGHT='야간'
}

export interface ISchedulesHistoryResponse {
  seq: number,
  // @JsonFormat(pattern = "yyyy-MM-dd")
  date: string;
  visitYn: string;
  // type: ScheduleHistoryType;
  type: string;
  priority: number;
  doctorSeq: number;
  nurseSeq: number;
}

export interface ISchedulesHistory extends IBaseEntity {
  seq: number
  date: string;
  visitYn: string;
  // type: ScheduleHistoryType;
  type: string;
  priority: number;
  registerId: string;
  updateId: string;
  schedules: ISchedules;
  patient: IPatient;
}

export interface IScheduleHistorySimpleResponseByDate {
  seq: number
  doctorSeq: number
  nurseSeq: number
// @JsonFormat(pattern = "yyyy-MM-dd")
  date: string
  // schedulesType: ScheduleType
  schedulesType: string
  medicalFeeType: string
  // scheduleHistoryType: ScheduleHistoryType
  scheduleHistoryType: string
  shift: string
  priority: number
  visitYn: string
  patientSeq: number
  patientName: string
  priorityContact: string
  contact: string
  jibunAddress: string
  roadAddress: string
  addressDetail: string
  caregiverContact: string
  caregiverNote: string
  familyContact: string
  familyNote: string
  isChecked: boolean
  showCheckBox:boolean
}

export interface ISchedulesHistoryChangeTypeRequest {
  scheduleHistorySeq: number
  type: string
}

export interface ISchedulesHistoryChangeMedicalFeeTypeRequest {
  scheduleHistorySeq: number
  medicalFeeType: string
}

export interface ISchedulesHistoryChangeShiftRequest {
  scheduleHistorySeq: number
  shift: ScheduleHistoryShift
}

export interface ISchedulesHistoryUpdateAllRequest {
  scheduleHistorySeqList?: number[]
  doctorSeq?: number
  nurseSeq?: number
  shift?: string
}

export interface ISchedulesHistoryChangeDoctorSeqRequest {
  scheduleHistorySeq: number
  doctorSeq: number
}

export interface ISchedulesHistoryChangeNurseSeqRequest {
  scheduleHistorySeq: number
  nurseSeq: number
}

export interface ISchedulesHistoryCreateRequest {
  scheduleSeq: number
  patientSeq: number
// @JsonFormat(pattern = "yyyy-MM-dd")
  date?: string
  visitYn?: string
  // type?: ScheduleHistoryType
  type?: string
  priority?: number
  medicalFeeType?: string
}

export interface ISchedulesHistoryDeleteRequest {
  scheduleHistorySeq: number
}