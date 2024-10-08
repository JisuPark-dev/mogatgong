import { createAxiosInstance } from './axios-instance'
import { PatientService } from '@/plugins/api-service-plugin/axios/PatientService'
import { HospitalService } from '@/plugins/api-service-plugin/axios/HospitalService'
import { ScheduleService } from '@/plugins/api-service-plugin/axios/ScheduleService'
import { EmployeeService } from "@/plugins/api-service-plugin/axios/EmployeeService";

export interface IApiServices {
  hospitalService: HospitalService
  patientService: PatientService
  scheduleService: ScheduleService
  employeeService: EmployeeService
}

export function makeApiService(host: string) {
  const axiosInstance = createAxiosInstance(host)
  const apiService: IApiServices = {
    hospitalService: new HospitalService(axiosInstance),
    patientService: new PatientService(axiosInstance),
    scheduleService: new ScheduleService(axiosInstance),
    employeeService: new EmployeeService(axiosInstance),
  }

  return apiService
}
