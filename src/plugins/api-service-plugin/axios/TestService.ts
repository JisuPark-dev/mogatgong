import {ApiServiceBase} from "@/plugins/api-service-plugin/axios/ApiServiceBase";
import type {AxiosInstance} from "axios";
import type {ApiResponse} from "@/types/services/apiResponse";
import type {
    ISchedulesHistoryCreateRequest
} from "@/types/services/schedule";

export class TestService extends ApiServiceBase {
    private _axiosInstance: AxiosInstance

    constructor(axiosInstance: AxiosInstance) {
        super()
        this._axiosInstance = axiosInstance
    }

    save(body: ISchedulesHistoryCreateRequest) {
        return this._axiosInstance
            .post(`/test`, body)
            .then(response => {
                return response.data
            })
    }

    find(seq: number) {
        return this._axiosInstance
            .get<ApiResponse<any>>(`/test`, { params: { seq } })
            .then(response => {
                return response.data
            })
    }

    update(body: { seq: number }) {
        return this._axiosInstance
            .put(`/test`, body)
            .then(response => {
                return response.data
            })
    }
}